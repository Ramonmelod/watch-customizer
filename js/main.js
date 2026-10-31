const $ = (sel) => document.querySelector(sel);
const src = (p) => encodeURI(p.img);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const label = { caixa: "Caixa", pulseira: "Pulseira" };

// ---------- Catálogo ----------
function renderGrid(filter = "todos") {
  const items = PRODUCTS.filter((p) => filter === "todos" || p.type === filter);
  $("#grid").innerHTML = items
    .map(
      (p) => `
      <article class="card" data-id="${p.id}">
        <div class="card__img"><img src="${src(p)}" alt="${p.name}" loading="lazy" /></div>
        <div class="card__body">
          <span class="tag">${label[p.type]}</span>
          <h3>${p.name}</h3>
          <p class="price">${p.price ? brl(p.price) : "Sob consulta"}</p>
        </div>
      </article>`
    )
    .join("");
}

document.querySelectorAll(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid(btn.dataset.filter);
  })
);

// ---------- Lightbox ----------
$("#grid").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = PRODUCTS.find((x) => x.id === card.dataset.id);
  $("#lightbox-img").src = src(p);
  $("#lightbox-caption").textContent = p.name;
  $("#lightbox").hidden = false;
});
$("#lightbox").addEventListener("click", (e) => {
  if (e.target.id !== "lightbox-img") $("#lightbox").hidden = true;
});
document.addEventListener("keydown", (e) => e.key === "Escape" && ($("#lightbox").hidden = true));

// ---------- Monte o seu relógio ----------
const GROUPS = BUILDER_STEPS.flatMap((step, si) => step.groups.map((g) => ({ ...g, step, si, key: `${step.id}.${g.id}` })));
const LAYERS = GROUPS.filter((g) => g.layer).sort((a, b) => a.layer - b.layer);
const groupOf = (key) => GROUPS.find((g) => g.key === key);
const state = {};
let activeStep = 0;

const CHEVRON = `<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>`;

function optionHTML(g, o) {
  const visual = g.kind === "image" ? `<span class="opt__img"><img src="${src(o)}" alt="" loading="lazy" /></span>` : "";
  const price = o.price ? `<span class="opt__price">+ ${brl(o.price)}</span>` : "";
  return `<button class="opt opt--${g.kind}" data-key="${g.key}" data-id="${o.id}" title="${o.name}">
      ${visual}<span class="opt__label">${o.name}</span>${g.kind === "image" ? price : ""}
    </button>`;
}

function groupHTML(g) {
  const opts = `<div class="opts opts--${g.kind} ${g.zoom ? "opts--zoom" : ""}">${g.options.map((o) => optionHTML(g, o)).join("")}</div>`;
  return `<div class="group ${g.wide ? "group--wide" : ""}">
      <h4>${g.label}</h4>
      ${g.kind === "image" ? `<div class="carousel">${opts}<button class="carousel__next" aria-label="Mais opções">${CHEVRON}</button></div>` : opts}
    </div>`;
}

// Empilha as camadas selecionadas (pulseira, caixa, dial, ponteiros)
// O dial é encaixado na janela (borda interna do bezel) da caixa escolhida e os ponteiros no centro do dial.
// Retorna [x, y, escala] com x/y em fração da largura do canvas (2:3).
const FRAME = GROUPS.find((g) => g.frame);
function fit(g, o) {
  const frame = state[FRAME.key];
  const s = frame?.scale ?? 1;
  if (g === FRAME) return [0, 0, s];
  const [wx, wy, wd] = frame?.window ?? [0, 0, 0.55];
  if (o.disc) {
    const [dx, dy, dd] = o.disc;
    const k = (s * wd) / dd;
    return [s * wx - k * dx, s * wy - k * dy, k];
  }
  if (g.reach) return [s * wx, s * wy, ((s * wd) / 2) * 0.85 / g.reach];
  return [0, 0, o.scale ?? 1];
}

const watchHTML = () =>
  LAYERS.filter((g) => state[g.key])
    .map((g) => {
      const o = state[g.key];
      const [x, y, k] = fit(g, o);
      const t = `transform:translate(${(x * 100).toFixed(3)}%,${((y * 200) / 3).toFixed(3)}%) scale(${k.toFixed(4)})`;
      return `<img src="${src(o)}" alt="${o.name}" style="z-index:${g.layer};${t}" />`;
    })
    .join("");

function renderBuilder() {
  $("#stepper").innerHTML = BUILDER_STEPS.map(
    (s, i) => `<li><button class="stepper__item" data-step="${i}"><span class="stepper__num">${i + 1}</span>${s.title}</button></li>`
  ).join(`<li class="stepper__sep" aria-hidden="true">${CHEVRON}</li>`);

  $("#steps").innerHTML = BUILDER_STEPS.map(
    (s, i) => `
    <article class="step open" id="step-${s.id}" data-step="${i}">
      <header class="step__head">
        <div><h3 class="serif">${i + 1}. ${s.title}</h3><p class="muted">${s.desc}</p></div>
        <span class="step__chev">${CHEVRON}</span>
      </header>
      <div class="step__body"><div class="groups">${GROUPS.filter((g) => g.si === i).map(groupHTML).join("")}</div></div>
    </article>`
  ).join("");
}

function goToStep(i) {
  activeStep = i;
  const el = document.querySelectorAll(".step")[i];
  el.classList.add("open");
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  update();
}

function update() {
  document.querySelectorAll(".opt").forEach((b) => b.classList.toggle("selected", state[b.dataset.key]?.id === b.dataset.id));

  document.querySelectorAll(".stepper__item").forEach((b, i) => {
    b.classList.toggle("active", i === activeStep);
    b.classList.toggle("done", GROUPS.filter((g) => g.si === i).every((g) => state[g.key]));
  });
  document.querySelectorAll(".step").forEach((el, i) => el.classList.toggle("active", i === activeStep));

  // Visualização em camadas
  const layers = LAYERS.filter((g) => state[g.key]);
  $("#viewer-watch").innerHTML = $("#bar-watch").innerHTML = watchHTML();
  $("#viewer-empty").hidden = layers.length > 0;
  $("#viewer-thumbs").innerHTML = [...layers]
    .sort((a, b) => a.si - b.si)
    .map(
      (g) => `<button class="thumb ${g.zoom ? "thumb--zoom" : ""}" data-step="${g.si}" title="${g.step.title}: ${state[g.key].name}">
        <img src="${src(state[g.key])}" alt="" /></button>`
    )
    .join("");

  // Barra de resumo
  const chosen = GROUPS.filter((g) => state[g.key]);
  const text = (g) => (g.prefix ? `${g.prefix} ${state[g.key].name.toLowerCase()}` : state[g.key].name);
  $("#bar-list").innerHTML = chosen.length ? chosen.map((g) => `<li>${text(g)}</li>`).join("") : `<li>Nenhuma peça selecionada</li>`;

  const total = chosen.reduce((sum, g) => sum + (state[g.key].price || 0), 0);
  $("#bar-total").textContent = total ? brl(total) : "Sob consulta";

  const next = $("#bar-next");
  const last = activeStep === BUILDER_STEPS.length - 1;
  const ready = GROUPS.filter((g) => g.required).every((g) => state[g.key]);
  next.textContent = last ? "Pedir pelo WhatsApp" : "Próximo passo →";
  next.classList.toggle("disabled", last && !ready);
  if (last && ready) {
    const lines = chosen.map((g) => `- ${g.step.title} / ${g.label}: ${state[g.key].name}`).join("\n");
    const msg = `Olá! Quero montar um relógio:\n${lines}\nTotal: ${$("#bar-total").textContent}`;
    next.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  } else next.removeAttribute("href");
}

// Modelo inicial: primeira opção de cada peça (o tamanho usa 40 mm se existir)
function setDefaults() {
  GROUPS.forEach((g) => (state[g.key] = g.options.find((o) => o.id === "40") || g.options[0]));
  activeStep = 0;
  update();
}

function clearBuilder() {
  Object.keys(state).forEach((k) => delete state[k]);
  activeStep = 0;
  update();
}

$("#steps").addEventListener("click", (e) => {
  const opt = e.target.closest(".opt");
  if (opt) {
    const g = groupOf(opt.dataset.key);
    state[g.key] = g.options.find((o) => o.id === opt.dataset.id);
    activeStep = g.si;
    return update();
  }
  const arrow = e.target.closest(".carousel__next");
  if (arrow) {
    const track = arrow.previousElementSibling;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    return track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + track.clientWidth, behavior: "smooth" });
  }
  const head = e.target.closest(".step__head");
  if (head) head.parentElement.classList.toggle("open");
});

$("#stepper").addEventListener("click", (e) => {
  const item = e.target.closest(".stepper__item");
  if (item) goToStep(+item.dataset.step);
});

$("#viewer-thumbs").addEventListener("click", (e) => {
  const t = e.target.closest(".thumb");
  if (t) goToStep(+t.dataset.step);
});

const toggleZoom = () => $(".viewer").classList.toggle("viewer--zoom");
$("#viewer-stage").addEventListener("click", toggleZoom);
$("#tool-zoom").addEventListener("click", toggleZoom);
$("#tool-reset").addEventListener("click", setDefaults);
$("#bar-clear").addEventListener("click", clearBuilder);
$("#bar-next").addEventListener("click", () => {
  if (activeStep < BUILDER_STEPS.length - 1) goToStep(activeStep + 1);
});

// ---------- Tema claro/escuro ----------
const root = document.documentElement;
const themeBtn = $("#theme-toggle");
const paintToggle = () => (themeBtn.textContent = root.dataset.theme === "dark" ? "☀" : "☾");
themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  paintToggle();
});
paintToggle();

$("#year").textContent = new Date().getFullYear();
renderGrid();
renderBuilder();
setDefaults();
