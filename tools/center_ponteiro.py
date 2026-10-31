#!/usr/bin/env python3
"""Centraliza o eixo (pino) de um PNG de ponteiros num canvas quadrado.

Uso:
  python3 tools/center_ponteiro.py "img/montagem/ponteiros/PONTEIROS X.png" [--update-data]

O que faz:
  1. Detecta o pino como o centro do maior disco opaco da imagem
     (transformada de distância sobre o canal alpha).
  2. Re-enquadra a imagem num canvas quadrado com o pino exatamente no centro.
     O arquivo é sobrescrito (um backup .orig.png é criado na 1a execução).
  3. Imprime o `pivot` para colar em js/data.js: [0, 0, alcance]
     onde alcance = distância do pino à ponta mais longa / largura do canvas.
  4. Gera <arquivo>-preview.png com retículo para conferência visual.

Com --update-data, reescreve o `pivot` da opção correspondente em js/data.js.
"""

import os
import re
import sys
import shutil

import numpy as np
from PIL import Image, ImageDraw

INF = 1 << 20
SQ2 = 1.4142


def chamfer_dt(mask):
    """Distância (chamfer 3-4) ao pixel de fundo mais próximo, dentro da máscara."""
    h, w = mask.shape
    d = np.where(mask, INF, 0).astype(np.float32)
    for y in range(h):
        row = d[y]
        if y > 0:
            up = d[y - 1]
            row = np.minimum(row, np.minimum(up + SQ2, np.roll(up, 1) + SQ2) + 0)
            row = np.minimum(row, np.minimum(up, up) + 1)
            row = np.minimum(row, np.roll(up, -1) + SQ2)
            d[y] = row
        d[y, 1:] = np.minimum(d[y, 1:], d[y, :-1] + 1)
    for y in range(h - 1, -1, -1):
        if y < h - 1:
            dn = d[y + 1]
            d[y] = np.minimum(d[y], np.minimum(np.roll(dn, 1) + SQ2, np.roll(dn, -1) + SQ2))
            d[y] = np.minimum(d[y], dn + 1)
        d[y, :-1] = np.minimum(d[y, :-1], d[y, 1:] + 1)
    return d


def find_pivot(alpha):
    """Centro do maior disco opaco; desempata pelo mais próximo do centro."""
    mask = alpha > 127
    d = chamfer_dt(mask)
    d[~mask] = 0
    h, w = mask.shape
    # máximos locais com raio >= 60% do global
    rmax = d.max()
    cands = []
    for y in range(1, h - 1):
        row = d[y]
        loc = (row[1:-1] >= row[:-2]) & (row[1:-1] >= row[2:]) & \
              (row[1:-1] >= d[y - 1, 1:-1]) & (row[1:-1] >= d[y + 1, 1:-1]) & \
              (row[1:-1] >= rmax * 0.6)
        for x in np.where(loc)[0] + 1:
            cands.append((d[y, x], x, y))
    if not cands:
        cands.append((d.max(), *np.unravel_index(d.argmax(), d.shape)[::-1]))
    cc, ww = h / 2, w / 2
    # o pino fica perto do centro da composição: ignora discos longe do centro
    cands = [c for c in cands if (c[1] - ww) ** 2 + (c[2] - cc) ** 2 < (min(w, h) * 0.3) ** 2]
    best = max(cands or [(d.max(), *np.unravel_index(d.argmax(), d.shape)[::-1])],
               key=lambda c: c[0])
    r, px, py = best
    # refina para subpixel na vizinhança do máximo
    sel = (np.abs(np.indices(d.shape)[1] - px) < r) & \
          (np.abs(np.indices(d.shape)[0] - py) < r) & (d > r * 0.97)
    ys, xs = np.where(sel)
    return xs.mean(), ys.mean(), r


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    path = sys.argv[1]
    update = "--update-data" in sys.argv

    im = Image.open(path).convert("RGBA")
    a = np.array(im)
    if a[..., 3].min() > 200:
        sys.exit(f"{path}: imagem sem transparência — processe o fundo antes.")
    h, w = a.shape[:2]
    px, py, r = find_pivot(a[..., 3])
    print(f"pino detectado: ({px:.1f}, {py:.1f})  raio do cubo ~{r:.0f}px  (imagem {w}x{h})")

    # alcance = distância à ponta mais longa
    ys, xs = np.where(a[..., 3] > 127)
    dist = np.hypot(xs - px, ys - py).max()
    side = int(np.ceil(dist * 2 * 1.03))          # quadrado + 3% de margem
    canvas = np.zeros((side, side, 4), np.uint8)
    cx, cy = side / 2.0, side / 2.0
    x0, y0 = int(round(cx - px)), int(round(cy - py))
    tx0, ty0 = max(0, x0), max(0, y0)
    tx1, ty1 = min(side, x0 + w), min(side, y0 + h)
    canvas[ty0:ty1, tx0:tx1] = a[ty0 - y0:ty1 - y0, tx0 - x0:tx1 - x0]

    base, _ = os.path.splitext(path)
    orig = base + ".orig.png"
    if not os.path.exists(orig):
        shutil.copy(path, orig)
    Image.fromarray(canvas).save(path)

    # preview com retículo
    prev = Image.fromarray(canvas).convert("RGB")
    dr = ImageDraw.Draw(prev)
    c, cc_ = int(round(cx)), int(round(cy))
    dr.line([(c - 40, cc_), (c + 40, cc_)], fill=(255, 0, 0), width=2)
    dr.line([(c, cc_ - 40), (c, cc_ + 40)], fill=(255, 0, 0), width=2)
    dr.ellipse([c - 6, cc_ - 6, c + 6, cc_ + 6], outline=(255, 0, 0), width=2)
    dr.ellipse([c - dist, cc_ - dist, c + dist, cc_ + dist], outline=(0, 128, 255), width=1)
    prev.save(base + "-preview.png")

    reach = dist / side
    print(f"canvas {side}x{side}  |  pivot: [0, 0, {reach:.4f}]")
    print(f"preview: {base}-preview.png   backup: {orig}")

    if update:
        data = "js/data.js"
        s = open(data).read()
        name = os.path.basename(path).replace("\\", "/")
        pat = re.compile(r"(img:\s*`\$\{M\}/ponteiros/" + re.escape(name) + r"`(?:, pivot:\s*\[[^\]]*\])?)")
        m2 = pat.search(s)
        if not m2:
            sys.exit(f"{data}: opção com img {name} não encontrada.")
        s = s[:m2.start(1)] + m2.group(1).split(", pivot")[0] + \
            f", pivot: [0, 0, {reach:.4f}]" + s[m2.end(1):]
        open(data, "w").write(s)
        print(f"{data} atualizado.")


if __name__ == "__main__":
    main()
