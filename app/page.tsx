import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import LensScene from "@/components/LensScene";
import { About, Collection, Final, Gallery, Promo, Services, Visit } from "@/components/Sections";
import CatalogModal from "@/components/CatalogModal";
import Effects from "@/components/Effects";
import { WhatsApp } from "@/components/Icons";
import { waLink } from "@/lib/site";

export default function Home() {
  return (
    <>
      <div className="progress" />
      <div className="cursor" />
      <div className="dot" />
      <a className="wa-float" href={waLink()} target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
        <WhatsApp />
      </a>
      <Nav />
      <Hero />
      <Marquee words={["Óculos de grau", "Óculos de sol", "Lentes Zeiss", "Atendimento personalizado", "Estilo e conforto"]} />
      <LensScene />
      <About />
      <Marquee alt words={["Grau", "Sol", "Estilo", "Conforto", "Visão perfeita"]} />
      <Promo />
      <Collection />
      <Gallery />
      <Services />
      <Visit />
      <Final />
      <CatalogModal />
      <Effects />
    </>
  );
}
