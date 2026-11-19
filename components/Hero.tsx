import Split from "./Split";
import { Arrow } from "./Icons";
import { waLink } from "@/lib/site";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="glow" />
      <canvas className="bokeh" />
      <svg className="bgglass par" data-speed="-.08" viewBox="0 0 1500 520" aria-hidden="true">
        <circle cx="430" cy="270" r="205" />
        <circle cx="1070" cy="270" r="205" />
        <path d="M635 250 C 700 190, 800 190, 865 250" />
        <path d="M225 240 L 40 175" />
        <path d="M1275 240 L 1460 175" />
        <ellipse cx="430" cy="270" rx="150" ry="150" />
        <ellipse cx="1070" cy="270" rx="150" ry="150" />
      </svg>
      <div className="txt" style={{ position: "relative", zIndex: 2 }}>
        <div className="eyebrow">Óculos de grau e sol</div>
        <Split as="h1" hero parts={["Estilo, conforto e ", { em: "visão perfeita." }]} />
        <p className="lead">
          Armações escolhidas a dedo, lentes de qualidade e um atendimento rápido e personalizado — do exame à
          retirada dos seus óculos.
        </p>
        <div className="cta">
          <a className="btn magnetic" href={waLink()} target="_blank" rel="noopener">
            <span>Falar com a Speculari</span>
            <Arrow />
          </a>
          <a className="btn ghost magnetic" href="#colecao">
            <span>Ver a coleção</span>
          </a>
        </div>
      </div>
      <div className="collage" style={{ zIndex: 2 }}>
        <div className="cw cw1 par" data-speed=".05">
          <figure style={{ ["--rot" as string]: "-6deg", ["--fd" as string]: ".15s" }}>
            <img src="/img/armacoes.jpg" alt="Armações em acetato colorido" fetchPriority="high" />
          </figure>
        </div>
        <div className="cw cw2 par" data-speed="-.04">
          <figure style={{ ["--rot" as string]: "5deg", ["--fd" as string]: ".3s" }}>
            <img src="/img/loja.jpg" alt="Vitrine da loja" fetchPriority="high" />
          </figure>
        </div>
        <div className="cw cw3 par" data-speed=".09">
          <figure style={{ ["--rot" as string]: "-3deg", ["--fd" as string]: ".45s" }}>
            <img src="/img/mao.jpg" alt="Óculos de armação leve" />
          </figure>
        </div>
        <div className="sealw par" data-speed="-.02">
          <div className="seal">
            <svg viewBox="0 0 170 170">
              <defs>
                <path id="ring" d="M85,85 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
              </defs>
              <text>
                <textPath href="#ring">Speculari Ótica ✦ Grau &amp; Sol ✦ Speculari Ótica ✦ Grau &amp; Sol ✦</textPath>
              </text>
            </svg>
            <img src="/img/logo.jpg" alt="" />
          </div>
        </div>
      </div>
      <div className="scroll">
        <i />
        Role para explorar
      </div>
    </header>
  );
}
