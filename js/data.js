// Número do WhatsApp para pedidos (DDI + DDD + número, só dígitos)
const WHATSAPP = "5500000000000";

// Catálogo de peças. Edite nomes e preços à vontade.
const PRODUCTS = [
  { id: "c1", type: "caixa", name: "Field GR Automático", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.08.jpeg" },
  { id: "c2", type: "caixa", name: "Caixa Modelo 2", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.09.jpeg" },
  { id: "c4", type: "caixa", name: "Caixa 40mm Titanium Gray", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.11.jpeg" },
  { id: "c5", type: "caixa", name: "Caixa Modelo 5", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.11 (1).jpeg" },
  { id: "c6", type: "caixa", name: "Caixa Modelo 6", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.11 (2).jpeg" },
  { id: "c7", type: "caixa", name: "Caixa Modelo 7", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.12.jpeg" },
  { id: "c8", type: "caixa", name: "Caixa Modelo 8", price: 0, img: "caixas-relogio/WhatsApp Image 2026-10-24 at 22.45.12 (1).jpeg" },

  { id: "p1", type: "pulseira", name: "Aço Beads of Rice", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.13.jpeg" },
  { id: "p2", type: "pulseira", name: "Pulseira Modelo 2", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.13 (1).jpeg" },
  { id: "p3", type: "pulseira", name: "Pulseira Modelo 3", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.14.jpeg" },
  { id: "p4", type: "pulseira", name: "Pulseira Modelo 4", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.14 (1).jpeg" },
  { id: "p5", type: "pulseira", name: "Pulseira Modelo 5", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.15.jpeg" },
  { id: "p6", type: "pulseira", name: "Pulseira Modelo 6", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.15 (1).jpeg" },
  { id: "p7", type: "pulseira", name: "Nylon Preta Black-Steel", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.16.jpeg" },
  { id: "p8", type: "pulseira", name: "Pulseira Modelo 8", price: 0, img: "pulseiras/WhatsApp Image 2026-10-24 at 22.45.16 (1).jpeg" },
];

// Etapas do "Monte o seu relógio".
//
// As peças com imagem são CAMADAS empilhadas na visualização (layer: 1 fica atrás, 4 fica na frente).
// Todas as imagens devem ter o MESMO tamanho de canvas, fundo transparente e o centro do
// relógio no mesmo ponto. Os placeholders em img/montagem/ usam 400x600 com centro em (200, 300).
// Para usar peças reais, exporte PNGs transparentes nesse mesmo enquadramento e troque o "img".
//
// kind: image (peça visual) ou chip (opção só de texto, ex.: tamanho)
// required: obrigatória para liberar o pedido
// prefix: texto antes do nome no resumo (ex.: "Dial verde")
// Preços abaixo são exemplos.
const M = "img/montagem";

const BUILDER_STEPS = [
  {
    id: "caixa",
    title: "Caixa",
    desc: "Escolha o modelo, o acabamento e o tamanho da caixa.",
    groups: [
      {
        id: "modelo", label: "Modelo e acabamento", kind: "image", layer: 2, required: true, wide: true,
        options: [
          { id: "classica-aco", name: "Clássica aço", price: 690, img: `${M}/caixas/classica-aco.svg` },
          { id: "diver-aco", name: "Diver aço", price: 790, img: `${M}/caixas/diver-aco.svg` },
          { id: "militar-titanio", name: "Militar titânio", price: 890, img: `${M}/caixas/militar-titanio.svg` },
          { id: "preta-pvd", name: "Preta PVD", price: 820, img: `${M}/caixas/preta-pvd.svg` },
          { id: "dourada", name: "Dourada", price: 950, img: `${M}/caixas/dourada.svg` },
        ],
      },
      {
        id: "tamanho", label: "Tamanho", kind: "chip",
        options: [
          { id: "36", name: "36 mm", price: 0 },
          { id: "38", name: "38 mm", price: 0 },
          { id: "40", name: "40 mm", price: 0 },
          { id: "42", name: "42 mm", price: 40 },
        ],
      },
    ],
  },
  {
    id: "dial",
    title: "Dial",
    desc: "Escolha o mostrador do seu relógio.",
    groups: [
      {
        id: "cor", label: "Mostrador", kind: "image", layer: 3, prefix: "Dial", required: true, wide: true,
        options: [
          { id: "alpinist-azul", name: "Alpinist azul", price: 240, img: `${M}/dials/DIAL ALPNIST AZUL.png`, scale: 0.6 },
          { id: "alpinist-branco", name: "Alpinist branco", price: 240, img: `${M}/dials/DIAL ALPNIST BRANCO.png`, scale: 0.6 },
          { id: "alpinist-preto", name: "Alpinist preto", price: 240, img: `${M}/dials/DIAL ALPNIST PRETO.png`, scale: 0.6 },
          { id: "alpinist-verde", name: "Alpinist verde", price: 240, img: `${M}/dials/DIAL ALPNIST VERDE.png`, scale: 0.6 },
          { id: "boder-black", name: "Boder black", price: 240, img: `${M}/dials/DIAL BODER BLACK.png`, scale: 0.63 },
          { id: "boder-branco", name: "Boder branco", price: 240, img: `${M}/dials/DIAL BODER BRANCO.png`, scale: 0.63 },
          { id: "boder-green", name: "Boder verde", price: 240, img: `${M}/dials/DIAL BODER GREEN.png`, scale: 0.63 },
          { id: "boder-old-black", name: "Boder vintage preto", price: 240, img: `${M}/dials/DIAL BODER  OLD BLACK.png`, scale: 0.63 },
          { id: "kaki-black-white", name: "Khaki black & white", price: 240, img: `${M}/dials/DIAL KAKI BLACK WHITE.png`, scale: 0.59 },
          { id: "kaki-branco", name: "Khaki branco", price: 240, img: `${M}/dials/DIAL KAKI BRANCO.png`, scale: 0.59 },
          { id: "kaki-green", name: "Khaki verde", price: 240, img: `${M}/dials/DIAL KAKI GREEN.png`, scale: 0.59 },
          { id: "kaki-old-azul", name: "Khaki vintage azul", price: 240, img: `${M}/dials/DIAL KAKI OLD AZUL.png`, scale: 0.59 },
          { id: "kaki-old-black", name: "Khaki vintage preto", price: 240, img: `${M}/dials/DIAL KAKI OLD BLACK.png`, scale: 0.59 },
        ],
      },
    ],
  },
  {
    id: "ponteiros",
    title: "Ponteiros",
    desc: "Selecione o estilo e a cor dos ponteiros.",
    groups: [
      {
        id: "cor", label: "Ponteiros", kind: "image", layer: 4, prefix: "Ponteiros", required: true, wide: true, zoom: true,
        options: [
          { id: "prata", name: "Prata", price: 90, img: `${M}/ponteiros/prata.svg` },
          { id: "dourado", name: "Dourado", price: 110, img: `${M}/ponteiros/dourado.svg` },
          { id: "preto", name: "Preto", price: 90, img: `${M}/ponteiros/preto.svg` },
          { id: "azul", name: "Azul", price: 100, img: `${M}/ponteiros/azul.svg` },
          { id: "lume", name: "Luminova", price: 130, img: `${M}/ponteiros/lume.svg` },
        ],
      },
    ],
  },
  {
    id: "pulseira",
    title: "Pulseira",
    desc: "Escolha o material da sua pulseira.",
    groups: [
      {
        id: "modelo", label: "Pulseira", kind: "image", layer: 1, prefix: "Pulseira", required: true, wide: true,
        options: [
          { id: "couro-marrom", name: "Couro marrom", price: 150, img: `${M}/pulseiras/couro-marrom.svg` },
          { id: "couro-caramelo", name: "Couro caramelo", price: 150, img: `${M}/pulseiras/couro-caramelo.svg` },
          { id: "aco", name: "Aço inoxidável", price: 260, img: `${M}/pulseiras/aco.svg` },
          { id: "nato-preta", name: "NATO preta", price: 90, img: `${M}/pulseiras/nato-preta.svg` },
          { id: "borracha-azul", name: "Borracha azul", price: 120, img: `${M}/pulseiras/borracha-azul.svg` },
          { id: "borracha-verde", name: "Borracha verde", price: 120, img: `${M}/pulseiras/borracha-verde.svg` },
        ],
      },
    ],
  },
];
