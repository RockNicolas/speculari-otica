"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent as RMouseEvent } from "react";
import { CATEGORIES, catTitle, itemsOf } from "@/lib/catalog";
import { waLink } from "@/lib/site";
import { Arrow, WhatsApp } from "./Icons";

type OpenDetail = { k: string; x?: number; y?: number };

/** Inclinação 3D + brilho seguindo o mouse nos cards. */
const tilt = (e: RMouseEvent<HTMLElement>) => {
  const el = e.currentTarget,
    r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width,
    y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
};
const untilt = (e: RMouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

export default function CatalogModal() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(CATEGORIES[0].k);
  const [idx, setIdx] = useState(-1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const boxRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const items = itemsOf(cat);
  const item = idx >= 0 ? items[idx] : undefined;
  const info = CATEGORIES.find((c) => c.k === cat)!;

  const setHash = (k: string) => {
    try {
      history.replaceState(null, "", `#colecao-${k}`);
    } catch {}
  };

  const openCat = useCallback(({ k, x, y }: OpenDetail) => {
    const key = CATEGORIES.some((c) => c.k === k) ? k : CATEGORIES[0].k;
    const r = boxRef.current?.getBoundingClientRect();
    setOrigin({ x: (x ?? innerWidth / 2) - (r?.left ?? 0), y: (y ?? innerHeight / 2) - (r?.top ?? 0) });
    setCat(key);
    setIdx(-1);
    setOpen(true);
    setHash(key);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setIdx(-1);
    try {
      if (location.hash.startsWith("#colecao-")) history.replaceState(null, "", location.pathname + location.search);
    } catch {}
  }, []);

  const pick = (k: string) => {
    setCat(k);
    setIdx(-1);
    setHash(k);
  };

  useEffect(() => {
    const onOpen = (e: Event) => openCat((e as CustomEvent<OpenDetail>).detail);
    const fromHash = () => {
      const m = location.hash.match(/^#colecao-([a-z0-9-]+)$/);
      if (m) openCat({ k: m[1] });
    };
    window.addEventListener("open-cat", onOpen);
    window.addEventListener("hashchange", fromHash);
    fromHash();
    return () => {
      window.removeEventListener("open-cat", onOpen);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [openCat]);

  useEffect(() => {
    document.body.classList.toggle("mopen", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // posição do destaque da aba ativa
  useLayoutEffect(() => {
    const measure = () => {
      const b = tabsRef.current?.querySelector<HTMLButtonElement>("button.on");
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [cat, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") idx >= 0 ? setIdx(-1) : close();
      else if (idx >= 0 && e.key === "ArrowRight") setIdx((i) => (i + 1) % items.length);
      else if (idx >= 0 && e.key === "ArrowLeft") setIdx((i) => (i - 1 + items.length) % items.length);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, idx, items.length, close]);

  const step = (d: number) => setIdx((i) => (i + d + items.length) % items.length);

  return (
    <div
      className={`cmodal${open ? " open" : ""}${item ? " detail" : ""}`}
      style={{ ["--ox" as string]: `${origin.x}px`, ["--oy" as string]: `${origin.y}px` }}
      aria-hidden={!open}
    >
      <div className="cm-bg" onClick={close} />
      <div className="cm-box" ref={boxRef} role="dialog" aria-modal="true" aria-label="Coleção">
        <div className="cm-aura" aria-hidden="true" />
        <div className="cm-head">
          <div>
            <small>Coleção Speculari</small>
            <h3 className="cm-title" key={cat}>
              {info.t}
            </h3>
          </div>
          <button className="cm-x" aria-label="Fechar" onClick={close}>
            ×
          </button>
        </div>
        <div className="cm-tabs" ref={tabsRef}>
          <span className="cm-pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} />
          {CATEGORIES.map((c) => (
            <button key={c.k} className={c.k === cat ? "on" : ""} onClick={() => pick(c.k)}>
              {c.t} <em>{itemsOf(c.k).length}</em>
            </button>
          ))}
        </div>
        <div className="cm-body">
          <div className="cm-ghost" key={`g-${cat}`} aria-hidden="true">
            {info.t}
          </div>
          <aside className="cm-side" key={`s-${cat}`}>
            <span className="cm-count">
              {String(items.length).padStart(2, "0")}
              <small>{items.length === 1 ? "modelo" : "modelos"}</small>
            </span>
            <p>{info.d}</p>
            <a className="btn ghost" href={waLink(`Olá! Quero ver mais opções de ${info.t.toLowerCase()} na Speculari Ótica.`)} target="_blank" rel="noopener">
              <span>Ver mais pelo WhatsApp</span>
              <Arrow />
            </a>
          </aside>
          <div className="cm-grid" key={`${cat}-${open}`}>
            {items.map((it, i) => (
              <button
                key={it.id}
                className="cm-item"
                style={{ ["--i" as string]: i }}
                onClick={() => setIdx(i)}
                onMouseMove={tilt}
                onMouseLeave={untilt}
              >
                <div className="cm-iw">
                  <img src={it.img} alt="" loading="lazy" />
                  <span className="cm-shine" />
                  <span className="cm-num">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="cm-cap">
                  <b>{it.name}</b>
                  <span>Ver detalhes +</span>
                </div>
              </button>
            ))}
            <a
              className="cm-item cm-more"
              style={{ ["--i" as string]: items.length }}
              href={waLink(`Olá! Quero ver mais opções de ${info.t.toLowerCase()} na Speculari Ótica.`)}
              target="_blank"
              rel="noopener"
              onMouseMove={tilt}
              onMouseLeave={untilt}
            >
              <span className="cm-more-ic">
                <WhatsApp />
              </span>
              <b>Quer ver mais modelos?</b>
              <span>Temos muito mais na loja. Chame a gente no WhatsApp que mandamos fotos.</span>
              <i>Chamar no WhatsApp →</i>
            </a>
          </div>
        </div>
        <div className="cm-detail">
          <div className="cm-dimg">{item && <img key={item.id} src={item.img} alt={item.name} />}</div>
          <div className="cm-dtxt" key={item?.id ?? "none"}>
            <button className="cm-back" onClick={() => setIdx(-1)}>
              ← Voltar às opções
            </button>
            <small className="cm-dcat">{catTitle(cat)}</small>
            <h3 className="cm-dname">{item?.name}</h3>
            <p className="cm-ddesc">{item?.desc}</p>
            <a
              className="btn cm-cta"
              href={waLink(item ? `Olá! Vi no site da Speculari Ótica o modelo "${item.name}" (${catTitle(cat)}) e gostaria de saber mais.` : undefined)}
              target="_blank"
              rel="noopener"
            >
              <span>Tenho interesse</span>
              <Arrow />
            </a>
            <div className="cm-nav">
              <button aria-label="Anterior" onClick={() => step(-1)}>
                ‹
              </button>
              <span className="cm-pos">{item ? `${idx + 1} / ${items.length}` : ""}</span>
              <button aria-label="Próximo" onClick={() => step(1)}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
