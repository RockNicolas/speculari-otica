export const PHONE = "5585996409091";
export const PHONE_LABEL = "(85) 99640-9091";

export const waLink = (msg = "Olá! Vim pelo site da Speculari Ótica e gostaria de atendimento.") =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

export const INSTAGRAM = "https://www.instagram.com/speculariotica";

export const ADDRESS = "Av. Pontes Vieira, 2250, Loja 10, Fortaleza - CE";
const q = encodeURIComponent("Speculari Ótica, Av. Pontes Vieira, 2250, Loja 10, Fortaleza, CE, Brasil");
/** Mapa incorporado do Google Maps (não precisa de chave de API). */
export const MAPS_EMBED = `https://www.google.com/maps?q=${q}&z=17&output=embed`;
/** Abre a rota até a loja no Google Maps / app do celular. */
export const MAPS_DIR = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
