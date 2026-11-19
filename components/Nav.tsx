import { waLink } from "@/lib/site";

const LINKS = [
  ["#sobre", "Sobre"],
  ["#oferta", "Oferta"],
  ["#colecao", "Coleção"],
  ["#galeria", "Galeria"],
  ["#servicos", "Serviços"],
  ["#visita", "Visite"],
];

export default function Nav() {
  return (
    <nav>
      <a className="brand" href="#top">
        <img src="/img/logo.jpg" alt="" width={44} height={44} />
        Speculari
      </a>
      <ul>
        {LINKS.map(([h, t]) => (
          <li key={h}>
            <a href={h}>{t}</a>
          </li>
        ))}
      </ul>
      <a className="btn magnetic" href={waLink()} target="_blank" rel="noopener">
        <span>Atendimento</span>
      </a>
    </nav>
  );
}
