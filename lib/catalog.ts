export type Category = { k: string; t: string; s: string; d: string };
export type Item = { id: string; cat: string; name: string; desc: string; img: string };

export const CATEGORIES: Category[] = [
  { k: "grau", t: "Armações de grau", s: "Para usar todo dia", d: "Do clássico ao ousado: armações leves e confortáveis, ajustadas ao seu rosto com lentes de qualidade." },
  { k: "sol", t: "Óculos de sol", s: "Proteção com estilo", d: "Solares para o dia a dia, a praia e as viagens — proteção para os olhos sem abrir mão do visual." },
  { k: "promocoes", t: "Promoções", s: "Ofertas da casa", d: "Condições especiais da Speculari. Consulte a validade e as regras com a nossa equipe." },
  { k: "loja", t: "A loja", s: "Conheça o espaço", d: "Um espaço pensado para você experimentar com calma e sair enxergando bem." },
];

/** Troque/adicione modelos aqui. As fotos ficam em /public/img. */
export const ITEMS: Item[] = [
  { id: "d1", cat: "grau", name: "Acetato colorido", desc: "Armações em tons de vinho, azul e rosé, para quem gosta de cor.", img: "/img/armacoes.jpg" },
  { id: "d2", cat: "grau", name: "Preta clássica", desc: "Formato marcante que combina com tudo.", img: "/img/close.jpg" },
  { id: "d3", cat: "grau", name: "Leve e discreta", desc: "Para quem quer conforto o dia inteiro.", img: "/img/mao.jpg" },
  { id: "d4", cat: "sol", name: "Solares da vitrine", desc: "Modelos de sol para o dia a dia e para viagens.", img: "/img/loja.jpg" },
  { id: "d5", cat: "promocoes", name: "Compre 1, leve 2", desc: "Óculos de grau ou sol. Consulte as condições na loja.", img: "/img/promo.jpg" },
  { id: "d6", cat: "loja", name: "Nossa vitrine", desc: "Venha experimentar sem pressa.", img: "/img/loja.jpg" },
  { id: "d7", cat: "loja", name: "Atendimento de perto", desc: "Ajuda para escolher a armação certa para o seu rosto.", img: "/img/dono.jpg" },
];

export const itemsOf = (k: string) => ITEMS.filter((i) => i.cat === k);
export const catTitle = (k: string) => CATEGORIES.find((c) => c.k === k)?.t ?? "";

/** Abre a janela da coleção a partir de qualquer lugar da página. */
export const openCatalog = (k: string, x?: number, y?: number) =>
  window.dispatchEvent(new CustomEvent("open-cat", { detail: { k, x, y } }));
