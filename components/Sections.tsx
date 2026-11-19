import Split from "./Split";
import { Arrow } from "./Icons";
import { CATEGORIES, itemsOf } from "@/lib/catalog";
import { waLink, PHONE_LABEL, INSTAGRAM, ADDRESS, MAPS_EMBED, MAPS_DIR } from "@/lib/site";

const ABOUT =
  "Aqui, escolher óculos é uma experiência leve: você experimenta, compara e sai com uma armação que combina com o seu rosto e com o seu dia a dia. Atendimento próximo, sem pressa e com a qualidade de quem entende de visão.";

export function About() {
  return (
    <section className="pad" id="sobre">
      <div className="bgword" aria-hidden="true">Speculari ótica</div>
      <div className="about">
        <div>
          <div className="kicker reveal">A Speculari</div>
          <Split parts={["Enxergar bem também é ", { em: "questão de estilo." }]} />
        </div>
        <p className="reveal scrub" style={{ ["--rd" as string]: "200ms" }}>
          {ABOUT.split(" ").map((w, i) => (
            <span key={i} className="sw">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
      <div className="pillars">
        {[
          ["01", "Estilo", "Armações de grau e solares para todos os gostos, de clássicas a ousadas."],
          ["02", "Conforto", "Ajuste feito com cuidado para você esquecer que está usando."],
          ["03", "Visão perfeita", "Lentes de qualidade e atendimento rápido e personalizado."],
        ].map(([n, h, p], i) => (
          <div className="pillar reveal" key={n} style={{ ["--rd" as string]: `${i * 150}ms` }}>
            <div className="n">{n}</div>
            <h3>{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Promo() {
  return (
    <section className="pad promo" id="oferta">
      <div className="grid">
        <div className="frame reveal">
          <img className="par wipe" data-speed=".03" src="/img/promo.jpg" alt="Compre 1, leve 2" loading="lazy" />
        </div>
        <div>
          <div className="kicker reveal">Oferta da casa</div>
          <div className="big2 reveal">Compre 1, leve 2.</div>
          <p className="reveal" style={{ marginTop: 26, color: "rgba(243,238,230,.74)", fontSize: 18, lineHeight: 1.7, maxWidth: 460 }}>
            Óculos de grau ou sol, com qualidade e estilo. Aproveite para renovar o visual — ou presentear alguém.
          </p>
          <div className="stats">
            <div className="stat reveal">
              <b>
                <span data-count="10">0</span>
                <i>x</i>
              </b>
              <small>R$ 49,90 · completo</small>
            </div>
            <div className="stat reveal" style={{ ["--rd" as string]: "150ms" }}>
              <b>
                <span data-count="50">0</span>
                <i>%</i>
              </b>
              <small>Lentes Zeiss</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Collection() {
  return (
    <section className="pad" id="colecao">
      <div className="kicker reveal">Coleção</div>
      <Split parts={["Escolha por ", { em: "estilo." }]} />
      <p className="reveal clead">Clique numa categoria para ver as opções.</p>
      <div className="ctiles">
        {CATEGORIES.map((c, i) => {
          const list = itemsOf(c.k);
          return (
            <button key={c.k} className="ctile reveal" data-cat={c.k} style={{ ["--rd" as string]: `${i * 120}ms` }}>
              {list[0] && <img src={list[0].img} alt="" loading="lazy" />}
              <div className="ct">
                <small>
                  {list.length} {list.length === 1 ? "opção" : "opções"}
                </small>
                <h3>{c.t}</h3>
                <p>{c.s}</p>
                <span className="go">Ver opções →</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const GALLERY = [
  ["/img/promo.jpg", "Compre 1, leve 2", "promocoes", false],
  ["/img/loja.jpg", "Acho chique enxergar bem.", "loja", true],
  ["/img/armacoes.jpg", "Armações para cada estilo", "grau", false],
  ["/img/close.jpg", "Acabamento em detalhes", "grau", true],
  ["/img/mao.jpg", "Leveza no rosto", "grau", true],
  ["/img/dono.jpg", "Atendimento de perto", "loja", true],
] as const;

export function Gallery() {
  return (
    <section className="gallery" id="galeria">
      <div className="stick">
        <div className="head">
          <div>
            <div className="kicker">Por dentro da loja</div>
            <h2>
              Detalhes que <em>fazem diferença.</em>
            </h2>
          </div>
          <div className="kicker" style={{ margin: 0 }}>
            Role →
          </div>
        </div>
        <div className="h-track">
          {GALLERY.map(([src, cap, cat, wide], i) => (
            <figure key={i} className={wide ? "card wide" : "card"} data-cat={cat}>
              <span className="num">0{i + 1}</span>
              <img src={src} alt="" loading="lazy" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
        <div className="h-bar">
          <i />
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  ["i.", "Óculos de grau", "Armações com lentes sob medida, com orientação para escolher o que combina com você."],
  ["ii.", "Óculos de sol", "Proteção e presença: modelos para o dia a dia, para viagem e para qualquer ocasião."],
  ["iii.", "Lentes de qualidade", "Opções com tecnologia Zeiss para quem quer a melhor experiência visual."],
  ["iv.", "Convênios", "Trabalhamos com convênios. Fale com a gente e confira as condições."],
];

export function Services() {
  return (
    <section className="pad services" id="servicos">
      <div className="kicker reveal">O que fazemos</div>
      <Split parts={["Tudo para o seu ", { em: "olhar." }]} />
      <div className="list">
        {SERVICES.map(([n, h, p]) => (
          <a key={n} className="srv reveal" href={waLink(`Olá! Gostaria de saber mais sobre ${h.toLowerCase()} na Speculari Ótica.`)} target="_blank" rel="noopener">
            <div className="i">{n}</div>
            <h3>{h}</h3>
            <p>{p}</p>
            <div className="go">
              <Arrow size={18} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Visit() {
  return (
    <section className="pad visit" id="visita">
      <div className="kicker reveal">Visite a Speculari</div>
      <Split parts={["Venha experimentar ", { em: "sem pressa." }]} />
      <div className="vgrid">
        <div className="hours reveal">
          <div className="status" id="status">
            <i />
            <span>Horário de funcionamento</span>
          </div>
          <dl>
            <div>
              <dt>Segunda a sexta</dt>
              <dd>9h – 17h</dd>
            </div>
            <div>
              <dt>Sábado</dt>
              <dd>9h – 12h</dd>
            </div>
            <div>
              <dt>Domingo</dt>
              <dd>Fechado</dd>
            </div>
          </dl>
        </div>
        <div className="map reveal" style={{ ["--rd" as string]: "150ms" }}>
          <iframe
            className="gmap"
            src={MAPS_EMBED}
            title="Mapa — Speculari Ótica"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="tag">
            <div>
              <b>Speculari Ótica</b>
              <small>{ADDRESS}</small>
              <small>WhatsApp {PHONE_LABEL}</small>
            </div>
            <a className="btn magnetic" href={MAPS_DIR} target="_blank" rel="noopener">
              <span>Como chegar</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Final() {
  return (
    <>
      <section className="pad final">
        <svg className="fglass" viewBox="0 0 1200 400" aria-hidden="true">
          <circle cx="330" cy="210" r="150" />
          <circle cx="870" cy="210" r="150" />
          <path d="M480 190 C 540 140, 660 140, 720 190" />
          <path d="M180 190 L40 130" />
          <path d="M1020 190 L1160 130" />
        </svg>
        <img className="lg reveal" src="/img/logo.jpg" alt="Speculari Ótica" loading="lazy" />
        <Split parts={["Seu próximo óculos começa ", { em: "aqui." }]} />
        <a className="btn magnetic reveal" href={waLink()} target="_blank" rel="noopener">
          <span>Iniciar atendimento</span>
          <Arrow />
        </a>
      </section>
      <footer>
        <span>© Speculari Ótica · {ADDRESS}</span>
        <a href={INSTAGRAM} target="_blank" rel="noopener">
          @speculariotica
        </a>
        <a href={waLink()} target="_blank" rel="noopener">
          WhatsApp {PHONE_LABEL}
        </a>
      </footer>
    </>
  );
}
