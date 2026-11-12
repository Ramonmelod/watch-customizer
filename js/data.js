// Número do WhatsApp para pedidos (DDI + DDD + número, só dígitos)
const WHATSAPP = "5500000000000";

// Catálogo de relógios prontos. Edite nomes e preços à vontade.
const R = "img/Ready Watches";

const PRODUCTS = [
  { id: "m1", type: "militar", name: "Militar Alpine", price: 0, img: `${R}/Militar Alpine.png` },
  { id: "m2", type: "militar", name: "Militar Alpine Flyer", price: 0, img: `${R}/Militar Alpine Flyer.png` },
  { id: "m3", type: "militar", name: "Militar Kaky", price: 0, img: `${R}/Militar kaky.png` },
  { id: "m4", type: "militar", name: "Militar Kaky Sea", price: 0, img: `${R}/Militar Kaky sea.png` },
  { id: "m5", type: "militar", name: "Militar Terra Steel", price: 0, img: `${R}/Militar terra Steel.png` },
  { id: "m6", type: "militar", name: "Militar Terra Titan", price: 0, img: `${R}/Militar Terra titan.png` },

  { id: "cl1", type: "classic", name: "Classic Amphibious Green", price: 0, img: `${R}/Classic amphibious green_.png` },
  { id: "cl2", type: "classic", name: "Classic Black Pearl", price: 0, img: `${R}/Classic black pearl.png` },
  { id: "cl3", type: "classic", name: "Classic Pilot Aircraft", price: 0, img: `${R}/Classic pilot aircraft.png` },
  { id: "cl4", type: "classic", name: "Classic Pilot Meeting", price: 0, img: `${R}/Classic pilot meeting.png` },

  { id: "d1", type: "diver", name: "Diver 50's Bronzer", price: 0, img: `${R}/Diver 50_s bronzer.png` },
  { id: "d2", type: "diver", name: "Diver Ocean-Master", price: 0, img: `${R}/Diver Ocean-master.png` },
  { id: "d3", type: "diver", name: "Diver BB Charcoal", price: 0, img: `${R}/Diver bb charcoal.png` },
  { id: "d4", type: "diver", name: "Diver Emerald SKX", price: 0, img: `${R}/Diver emerald skx.png` },
  { id: "d5", type: "diver", name: "Diver Marine Charcoal", price: 0, img: `${R}/Diver marine charcoal.png` },
];

// Etapas do "Monte o seu relógio".
//
// As peças com imagem são CAMADAS empilhadas na visualização (layer: 1 fica atrás, 4 fica na frente).
// Os placeholders SVG usam canvas 400x600 com centro em (200, 300).
//
// Encaixe das fotos reais (medidas como fração da LARGURA da própria imagem, a partir do centro dela):
// - caixa  scale: largura da caixa em relação ao canvas
//          window: [x, y, d] centro e diâmetro da borda interna do bezel (onde o dial encosta)
// - dial   disc:   [x, y, d] centro e diâmetro do disco do mostrador no PNG
// - ponteiros: pivot: [x, y, alcance] centro de rotação (pino) e distância à ponta mais longa
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
        id: "modelo", label: "Modelo e acabamento", kind: "image", layer: 2, required: true, wide: true, frame: true,
        options: [
          { id: "explorer-jateado", name: "Explorer inox jateado", price: 690, img: `${M}/caixas/CAIXA MILITAR  EXPLORER- INOX JATEADO.png`, scale: 0.79, window: [-0.0023, -0.0235, 0.6128] },
          { id: "explorer-escovado", name: "Explorer inox escovado", price: 790, img: `${M}/caixas/CAIXA MILITAR  EXPLORER- INOX ESCOVADO.png`, scale: 0.79, window: [-0.0027, -0.0196, 0.634] },
          { id: "pilot-inox", name: "Pilot inox", price: 750, img: `${M}/caixas/CAIXA MILITAR PILOT - INOX.png`, scale: 0.79, window: [-0.0046, -0.0111, 0.6098] },
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
          { id: "alpinist-azul", name: "Alpinist azul", price: 240, img: `${M}/dials/DIAL ALPNIST AZUL.png`, disc: [-0.0229, -0.0072, 0.955] },
          { id: "alpinist-branco", name: "Alpinist branco", price: 240, img: `${M}/dials/DIAL ALPNIST BRANCO.png`, disc: [0.0282, -0.0156, 0.9119] },
          { id: "alpinist-preto", name: "Alpinist preto", price: 240, img: `${M}/dials/DIAL ALPNIST PRETO.png`, disc: [0.029, 0.0147, 0.9269] },
          { id: "alpinist-verde", name: "Alpinist verde", price: 240, img: `${M}/dials/DIAL ALPNIST VERDE.png`, disc: [0.0034, 0.0134, 0.9375] },
          { id: "boder-black", name: "Boder black", price: 240, img: `${M}/dials/DIAL BODER BLACK.png`, disc: [-0.0026, -0.0026, 0.918] },
          { id: "boder-branco", name: "Boder branco", price: 240, img: `${M}/dials/DIAL BODER BRANCO.png`, disc: [-0.0002, -0.0026, 0.9131] },
          { id: "boder-green", name: "Boder verde", price: 240, img: `${M}/dials/DIAL BODER GREEN.png`, disc: [-0.0014, -0.0014, 0.9253] },
          { id: "boder-old-black", name: "Boder vintage preto", price: 240, img: `${M}/dials/DIAL BODER  OLD BLACK.png`, disc: [-0.0002, -0.0026, 0.9204] },
          { id: "kaki-black-white", name: "Khaki black & white", price: 240, img: `${M}/dials/DIAL KAKI BLACK WHITE.png`, disc: [0, 0, 0.9883] },
          { id: "kaki-branco", name: "Khaki branco", price: 240, img: `${M}/dials/DIAL KAKI BRANCO.png`, disc: [0, 0, 0.9884] },
          { id: "kaki-green", name: "Khaki verde", price: 240, img: `${M}/dials/DIAL KAKI GREEN.png`, disc: [0, 0, 0.9883] },
          { id: "kaki-old-azul", name: "Khaki vintage azul", price: 240, img: `${M}/dials/DIAL KAKI OLD AZUL.png`, disc: [0, 0, 0.9883] },
          { id: "kaki-old-black", name: "Khaki vintage preto", price: 240, img: `${M}/dials/DIAL KAKI OLD BLACK.png`, disc: [0, 0, 0.9884] },
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
        id: "cor", label: "Ponteiros", kind: "image", layer: 4, prefix: "Ponteiros", required: true, wide: true,
        options: [
          { id: "av", name: "AV", price: 90, img: `${M}/ponteiros/PONTEIROS AV.png`, pivot: [0, 0, 0.4852] },
          { id: "dot", name: "Dot", price: 90, img: `${M}/ponteiros/PONTEIROS DOT.png`, pivot: [0, 0, 0.4853] },
          { id: "sword", name: "Sword", price: 110, img: `${M}/ponteiros/PONTEIROS SWORD.png`, pivot: [0, 0, 0.4852] },
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
          { id: "couro-azul", name: "Couro azul-marinho", price: 150, img: `${M}/pulseiras/Dark Blue Leather Watch Strap Set-montada.png` },
          { id: "couro-marrom", name: "Couro marrom", price: 150, img: `${M}/pulseiras/Vertical Brown Leather Watch Strap Set-montada.png` },
          { id: "couro-desgastado", name: "Couro marrom desgastado", price: 150, img: `${M}/pulseiras/Brown Distressed Leather Watch Strap Set-montada.png` },
          { id: "couro-vintage", name: "Couro marrom vintage", price: 150, img: `${M}/pulseiras/Vintage Brown Leather Watch Strap Set-montada.png` },
          { id: "couro-caramelo", name: "Couro caramelo", price: 150, img: `${M}/pulseiras/Tan Leather Watch Strap Set-montada.png` },
          { id: "couro-cinza", name: "Couro cinza", price: 150, img: `${M}/pulseiras/Gray Leather Watch Strap Set-montada.png` },
          { id: "couro-verde", name: "Couro verde", price: 150, img: `${M}/pulseiras/Vertically Arranged Green Leather Watch Strap-montada.png` },
        ],
      },
    ],
  },
];
