const CAPS = [
  ["01 — A armação", "Tudo começa no desenho certo.", "Formatos pensados para o seu rosto, do clássico ao ousado."],
  ["02 — O acabamento", "Acetato, cor e personalidade.", "Materiais leves e resistentes, com acabamento de quem cuida dos detalhes."],
  ["03 — As lentes", "Lentes de qualidade.", "Tecnologia que deixa a visão confortável o dia inteiro."],
  ["04 — Visão perfeita", "Agora é só enxergar bem.", "Olhe através das lentes: o que estava embaçado fica nítido."],
];

const LENSES = (
  <>
    <rect x="-345" y="-115" width="300" height="225" rx="100" />
    <rect x="45" y="-115" width="300" height="225" rx="100" />
  </>
);

/**
 * Cena fixa na tela: a armação se desenha, ganha cor, lentes e passa pelo texto desfocado.
 *
 * Três camadas, para o celular não precisar redesenhar a tela inteira a cada frame:
 *  1. texto desfocado (parado, só muda a opacidade)
 *  2. texto nítido final (parado, só muda a opacidade)
 *  3. a armação, num SVG pequeno que se move só com transform (GPU). O texto nítido
 *     que aparece "através" das lentes fica dentro dele, com a transformação inversa.
 * Os textos e o tamanho são montados em Effects.tsx conforme o formato da tela.
 */
export default function LensScene() {
  return (
    <section className="lens-scene" id="lente" aria-label="Animação da armação">
      <div className="stk">
        <div className="hint2">Continue rolando</div>
        <svg className="stage soft" id="lsoft" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="tx" fill="rgba(243,238,230,.55)" />
        </svg>
        <svg className="stage" id="lstage" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g id="lfull" opacity="0" fill="#f3eee6" className="tx" />
        </svg>
        <svg className="gl" id="lgl" viewBox="-460 -135 920 270" aria-hidden="true">
          <defs>
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
            <clipPath id="lclipLocal">{LENSES}</clipPath>
          </defs>
          <g clipPath="url(#lclipLocal)">
            <g id="ltext" opacity="0">
              <g id="ltl" fill="#f3eee6" className="tx" />
            </g>
          </g>
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
