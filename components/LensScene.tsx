const LENSES = (
  <>
    <rect x="-345" y="-115" width="300" height="225" rx="100" />
    <rect x="45" y="-115" width="300" height="225" rx="100" />
  </>
);

const CAPS = [
  ["01 — A armação", "Tudo começa no desenho certo.", "Formatos pensados para o seu rosto, do clássico ao ousado."],
  ["02 — O acabamento", "Acetato, cor e personalidade.", "Materiais leves e resistentes, com acabamento de quem cuida dos detalhes."],
  ["03 — As lentes", "Lentes de qualidade.", "Tecnologia que deixa a visão confortável o dia inteiro."],
  ["04 — Visão perfeita", "Agora é só enxergar bem.", "Olhe através das lentes: o que estava embaçado fica nítido."],
];

/** Cena fixa na tela: a armação se desenha, ganha cor, lentes e passa pelo texto desfocado. */
export default function LensScene() {
  return (
    <section className="lens-scene" id="lente" aria-label="Animação da armação">
      <div className="stk">
        <div className="hint2">Continue rolando</div>
        <svg className="stage" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id="lblur" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur id="lblurV" stdDeviation="9" />
            </filter>
            <linearGradient id="acet" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2a1a12" />
              <stop offset=".35" stopColor="#6b3b1f" />
              <stop offset=".55" stopColor="#1a110c" />
              <stop offset=".8" stopColor="#7a4524" />
              <stop offset="1" stopColor="#20140e" />
            </linearGradient>
            <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9fd3e6" stopOpacity=".16" />
              <stop offset="1" stopColor="#2f7088" stopOpacity=".1" />
            </linearGradient>
            <linearGradient id="shine" gradientUnits="userSpaceOnUse" x1="-600" y1="0" x2="-300" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="lclip">
              <rect className="lc" x="-345" y="-115" width="300" height="225" rx="100" />
              <rect className="lc" x="45" y="-115" width="300" height="225" rx="100" />
            </clipPath>
            <clipPath id="lclipLocal">{LENSES}</clipPath>
          </defs>
          <g id="ltext" opacity="0">
            <g filter="url(#lblur)" fill="rgba(243,238,230,.45)">
              <text className="bigtxt" x="800" y="420">O mundo fica mais bonito</text>
              <text className="bigtxt" x="800" y="570" fontStyle="italic">quando você enxerga bem.</text>
            </g>
            <g clipPath="url(#lclip)" fill="#f3eee6">
              <text className="bigtxt" x="800" y="420">O mundo fica mais bonito</text>
              <text className="bigtxt" x="800" y="570" fontStyle="italic" fill="#d2b277">quando você enxerga bem.</text>
            </g>
          </g>
          <g id="lglasses" transform="translate(800 510) rotate(-14) scale(.14 .55)">
            <g id="lfill" opacity="0">
              <g fill="url(#glass)">{LENSES}</g>
              <rect id="lshine" x="-900" y="-160" width="800" height="320" fill="url(#shine)" clipPath="url(#lclipLocal)" />
            </g>
            <g id="lthick" opacity="0" fill="none" stroke="url(#acet)" strokeWidth="22" strokeLinecap="round">
              {LENSES}
              <path d="M-45 -40 Q0 -78 45 -40" />
              <path d="M-345 -70 L-440 -92" />
              <path d="M345 -70 L440 -92" />
            </g>
            <g id="lline" fill="none" stroke="#d2b277" strokeWidth="3" strokeLinecap="round">
              <rect pathLength={1000} strokeDasharray="1000" strokeDashoffset="1000" x="-345" y="-115" width="300" height="225" rx="100" />
              <rect pathLength={1000} strokeDasharray="1000" strokeDashoffset="1000" x="45" y="-115" width="300" height="225" rx="100" />
              <path pathLength={1000} strokeDasharray="1000" strokeDashoffset="1000" d="M-45 -40 Q0 -78 45 -40" />
              <path pathLength={1000} strokeDasharray="1000" strokeDashoffset="1000" d="M-345 -70 L-440 -92" />
              <path pathLength={1000} strokeDasharray="1000" strokeDashoffset="1000" d="M345 -70 L440 -92" />
            </g>
            <g id="lscrew" fill="#d2b277" opacity="0">
              <circle cx="-330" cy="-70" r="5" />
              <circle cx="330" cy="-70" r="5" />
            </g>
          </g>
        </svg>
        <div className="caps">
          {CAPS.map(([s, b, p], i) => (
            <div className="cap" data-c={i} key={i}>
              <small>{s}</small>
              <b>{b}</b>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <div className="rail">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="pct">0%</div>
      </div>
    </section>
  );
}
