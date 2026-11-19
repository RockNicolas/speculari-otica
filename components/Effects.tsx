"use client";

import { useEffect } from "react";
import { openCatalog } from "@/lib/catalog";

/**
 * Todas as animações ligadas ao scroll e ao mouse.
 * Roda uma vez no navegador e desfaz tudo ao desmontar.
 */
export default function Effects() {
  useEffect(() => setup(), []);
  return null;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function setup(): () => void {
  const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector(s) as T | null;
  const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll(s)) as T[];
  const cleanups: Array<() => void> = [];
  const on = (t: EventTarget, ev: string, fn: EventListenerOrEventListenerObject, opt?: AddEventListenerOptions | boolean) => {
    t.addEventListener(ev, fn, opt);
    cleanups.push(() => t.removeEventListener(ev, fn, opt));
  };
  let alive = true;
  const loop = (fn: (t: number) => void) => {
    const f = (t: number) => {
      if (!alive) return;
      fn(t);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- entradas ao aparecer na tela ---------- */
  const count = (root: Element) => {
    if (root.classList.contains("counted")) return;
    root.classList.add("counted");
    $$("[data-count]", root).forEach((el) => {
      const to = Number(el.dataset.count),
        t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1 && alive) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        $$(".wipe", e.target).forEach((w) => w.classList.add("in"));
        io.unobserve(e.target);
      }),
    { threshold: 0.18 }
  );
  $$(".reveal,.wipe,[data-split]").forEach((el) => io.observe(el));
  const statIo = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && count(e.target)),
    { threshold: 0.6 }
  );
  $$(".stat").forEach((s) => statIo.observe(s));
  cleanups.push(() => {
    io.disconnect();
    statIo.disconnect();
  });

  /* ---------- elementos ---------- */
  const nav = $("nav")!,
    bar = $(".progress")!,
    hbar = $(".h-bar i")!,
    gal = $("#galeria")!,
    track = $(".h-track")!,
    heroTxt = $(".hero .txt")!,
    bgword = $(".bgword")!,
    sobre = $("#sobre")!,
    fin = $(".final")!,
    scrubP = $(".scrub");
  const sw = scrubP ? $$(".sw", scrubP) : [];
  const pars = $$(".par");
  const cards = $$(".card");
  const fglass = $$(".fglass *") as unknown as SVGElement[];
  const navLinks = $$<HTMLAnchorElement>("nav ul a");
  const secIds = ["sobre", "oferta", "colecao", "galeria", "servicos", "visita"];

  const sizeGal = () => {
    gal.style.height = innerHeight + Math.max(0, track.scrollWidth - innerWidth) * 1.1 + "px";
  };
  sizeGal();
  on(window, "resize", sizeGal);
  on(window, "load", sizeGal);

  /* ---------- cena da armação ---------- */
  const lens = (() => {
    const sc = $("#lente");
    if (!sc) return () => {};
    const G = $("#lglasses")!,
      lines = $$("#lline > *") as unknown as SVGGeometryElement[],
      thick = $("#lthick")!,
      fill = $("#lfill")!,
      shine = $("#lshine")!,
      screw = $("#lscrew")!,
      txt = $("#ltext")!,
      blurV = $("#lblurV")!,
      lc = $$("#lclip .lc"),
      caps = $$(".lens-scene .cap"),
      dots = $$(".lens-scene .rail i"),
      pct = $(".lens-scene .pct")!,
      hint = $(".lens-scene .hint2")!;
    let last = -1;
    // em tela em pé (celular) a cena inteira cabe na largura em vez de ser cortada
    const stage = $("#lente svg.stage");
    const fit = () => {
      stage?.setAttribute("preserveAspectRatio", innerWidth / innerHeight < 1.3 ? "xMidYMid meet" : "xMidYMid slice");
      last = -1;
    };
    fit();
    on(window, "resize", fit);
    return () => {
      const r = sc.getBoundingClientRect(),
        tot = sc.offsetHeight - innerHeight;
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const p = clamp(-r.top / tot, 0, 1);
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      lines.forEach((l, i) => {
        const k = ease(range(p, 0.02 + i * 0.03, 0.24 + i * 0.03));
        l.style.strokeDashoffset = String(1000 * (1 - k));
      });
      const turn = ease(range(p, 0, 0.3));
      const th = ease(range(p, 0.28, 0.42));
      thick.setAttribute("opacity", String(th));
      screw.setAttribute("opacity", String(th));
      lines.forEach((l) => (l.style.opacity = String(1 - th * 0.75)));
      fill.setAttribute("opacity", String(ease(range(p, 0.4, 0.5))));
      shine.setAttribute("x", String(-900 + range(p, 0.44, 0.6) * 1300));
      txt.setAttribute("opacity", String(ease(range(p, 0.56, 0.66))));
      const mv = range(p, 0.62, 0.94);
      let x = 800,
        y = 450,
        rot = (1 - turn) * -14,
        s = 0.55 + 0.45 * ease(range(p, 0, 0.36));
      const sx = 0.25 + 0.75 * turn;
      x += -Math.sin(mv * Math.PI * 2) * 300;
      y += Math.sin(mv * Math.PI * 4) * -40 + (1 - turn) * 60;
      rot += Math.sin(mv * Math.PI * 2) * -5;
      const end = ease(range(p, 0.94, 1));
      s *= 1 + end * 0.12;
      const T = `translate(${x} ${y}) rotate(${rot}) scale(${s * sx} ${s})`;
      G.setAttribute("transform", T);
      lc.forEach((e) => e.setAttribute("transform", T));
      blurV.setAttribute("stdDeviation", String(9 * (1 - end)));
      const ci = p < 0.3 ? 0 : p < 0.48 ? 1 : p < 0.62 ? 2 : 3;
      caps.forEach((c, i) => c.classList.toggle("on", i === ci && p > 0.01));
      dots.forEach((d, i) => d.classList.toggle("on", i === ci));
      pct.textContent = Math.round(p * 100) + "%";
      hint.style.opacity = String(1 - range(p, 0.02, 0.1));
    };
  })();

  /* ---------- tudo que depende da posição do scroll ---------- */
  const onScroll = () => {
    const y = scrollY,
      max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max ? y / max : 0})`;
    nav.classList.toggle("solid", y > 60);
    pars.forEach((el) => {
      const sp = Number(el.dataset.speed) || 0;
      const r = el.parentElement!.getBoundingClientRect();
      el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * sp * -1}px,0)`;
    });
    const gr = gal.getBoundingClientRect(),
      tot = gal.offsetHeight - innerHeight;
    const gp = clamp(-gr.top / tot, 0, 1);
    track.style.transform = `translate3d(${-gp * Math.max(0, track.scrollWidth - innerWidth)}px,0,0)`;
    hbar.style.transform = `scaleX(${gp})`;
    const hp = clamp(y / innerHeight, 0, 1);
    heroTxt.style.transform = `translate3d(0,${hp * 80}px,0)`;
    heroTxt.style.opacity = String(1 - hp * 1.15);
    bgword.style.transform = `translate3d(${-sobre.getBoundingClientRect().top * 0.45 - 120}px,0,0)`;
    if (scrubP && sw.length) {
      const r = scrubP.getBoundingClientRect();
      const n = Math.round(clamp((innerHeight * 0.85 - r.top) / (innerHeight * 0.45), 0, 1) * sw.length);
      sw.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    const fp = clamp((innerHeight - fin.getBoundingClientRect().top) / (innerHeight * 0.9), 0, 1);
    fglass.forEach((e) => (e.style.strokeDashoffset = String(1000 * (1 - fp))));
    cards.forEach((c) => {
      const r = c.getBoundingClientRect();
      if (r.right < -200 || r.left > innerWidth + 200) return;
      const p = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
      c.style.transform = `translateY(${Math.abs(p) * 26}px) rotate(${p * 3}deg)`;
      const im = c.querySelector("img");
      if (im) im.style.transform = `translate3d(${p * -60}px,0,0) scale(1.25)`;
    });
    let cs = "";
    secIds.forEach((id) => {
      const e = document.getElementById(id);
      if (e && e.getBoundingClientRect().top <= innerHeight * 0.4) cs = id;
    });
    navLinks.forEach((a) => a.classList.toggle("act", a.getAttribute("href") === "#" + cs));
    lens();
  };
  let ticking = false;
  on(window, "scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      onScroll();
    });
  }, { passive: true });
  on(window, "resize", onScroll);
  onScroll();

  /* ---------- faixas de texto que aceleram com o scroll ---------- */
  const mqs = $$(".marquee .row").map((r) => ({ r, x: 0, d: Number(r.parentElement!.dataset.dir) || -1, init: false }));
  let lastY = scrollY,
    vel = 0;
  loop(() => {
    const dy = scrollY - lastY;
    lastY = scrollY;
    vel += (dy - vel) * 0.08;
    mqs.forEach((o) => {
      const half = o.r.scrollWidth / 2;
      if (!half) return;
      if (!o.init) {
        o.x = o.d > 0 ? -half / 2 : 0;
        o.init = true;
      }
      o.x += o.d * (0.7 + Math.min(14, Math.abs(vel)) * 0.55);
      if (o.x <= -half) o.x += half;
      if (o.x > 0) o.x -= half;
      o.r.style.transform = `translate3d(${o.x}px,0,0)`;
    });
    document.documentElement.style.setProperty("--sk", clamp(vel * 0.045, -2.2, 2.2).toFixed(2) + "deg");
  });

  /* ---------- bolhas de luz do topo ---------- */
  const cv = $<HTMLCanvasElement>(".bokeh");
  if (cv && !reduced) {
    const g = cv.getContext("2d")!;
    let W = 0,
      H = 0,
      mx = 0.5;
    type Dot = { x: number; y: number; r: number; vx: number; vy: number; c: string; a: number; p: number };
    let dots: Dot[] = [];
    const rs = () => {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      dots = Array.from({ length: 30 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 18 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.12 - Math.random() * 0.35,
        c: Math.random() < 0.55 ? "210,178,119" : "90,160,190",
        a: 0.05 + Math.random() * 0.09,
        p: Math.random() * 6.28,
      }));
    };
    rs();
    on(window, "resize", rs);
    on(window, "mousemove", (e) => (mx = (e as MouseEvent).clientX / innerWidth));
    loop((t) => {
      if (scrollY > innerHeight * 1.2) return;
      g.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.x += d.vx + (mx - 0.5) * 0.4;
        d.y += d.vy;
        if (d.y < -d.r) {
          d.y = H + d.r;
          d.x = Math.random() * W;
        }
        if (d.x < -d.r) d.x = W + d.r;
        if (d.x > W + d.r) d.x = -d.r;
        const a = d.a * (0.7 + 0.3 * Math.sin(t / 1200 + d.p));
        const gr = g.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        gr.addColorStop(0, `rgba(${d.c},${a})`);
        gr.addColorStop(0.7, `rgba(${d.c},${a * 0.5})`);
        gr.addColorStop(1, `rgba(${d.c},0)`);
        g.fillStyle = gr;
        g.beginPath();
        g.arc(d.x, d.y, d.r, 0, 6.283);
        g.fill();
      });
    });
  }

  /* ---------- rolagem suave (desktop com mouse) ---------- */
  if (matchMedia("(pointer:fine)").matches && !reduced) {
    let tgt = scrollY,
      cur = scrollY,
      raf = 0;
    const maxY = () => document.documentElement.scrollHeight - innerHeight;
    const tick = () => {
      cur += (tgt - cur) * 0.085;
      if (Math.abs(tgt - cur) < 0.4) cur = tgt;
      window.scrollTo(0, cur);
      raf = cur !== tgt && alive ? requestAnimationFrame(tick) : 0;
    };
    const go = (y: number) => {
      tgt = clamp(y, 0, maxY());
      if (!raf) raf = requestAnimationFrame(tick);
    };
    on(window, "wheel", (ev) => {
      const e = ev as WheelEvent;
      if (e.ctrlKey || document.body.classList.contains("mopen") || (e.target as Element).closest?.(".cmodal")) return;
      e.preventDefault();
      go(tgt + e.deltaY * (e.deltaMode === 1 ? 32 : 1));
    }, { passive: false });
    on(window, "scroll", () => {
      if (!raf && Math.abs(scrollY - cur) > 1) tgt = cur = scrollY;
    }, { passive: true });
    on(document, "click", (ev) => {
      const a = (ev.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id === "#" || id.startsWith("#colecao-")) return;
      const t = document.querySelector(id) as HTMLElement | null;
      if (!t) return;
      ev.preventDefault();
      go(t.offsetTop);
    });
  }

  /* ---------- cliques que abrem a coleção ---------- */
  on(document, "click", (ev) => {
    const el = (ev.target as Element).closest?.(".ctile[data-cat], .card[data-cat]") as HTMLElement | null;
    if (!el) return;
    const e = ev as MouseEvent;
    openCatalog(el.dataset.cat!, e.clientX, e.clientY);
  });

  /* ---------- cursor personalizado e botões magnéticos ---------- */
  const cur = $(".cursor"),
    dot = $(".dot"),
    glow = $(".glow"),
    hero = $(".hero");
  if (cur && dot && matchMedia("(pointer:fine)").matches) {
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      cx = mx,
      cy = my;
    on(window, "mousemove", (ev) => {
      const e = ev as MouseEvent;
      mx = e.clientX;
      my = e.clientY;
      cur.classList.add("on");
      dot.classList.add("on");
      dot.style.transform = `translate(${mx}px,${my}px)`;
      if (glow && hero) glow.style.transform = `translate(${mx - 280}px,${my - hero.getBoundingClientRect().top - 280}px)`;
      const hot = (e.target as Element).closest?.("a,button,.card,.pillar,.ctile");
      cur.classList.toggle("big", !!hot);
    });
    loop(() => {
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
    });
  }
  $$(".magnetic").forEach((el) => {
    on(el, "mousemove", (ev) => {
      const e = ev as MouseEvent,
        r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    on(el, "mouseleave", () => (el.style.transform = ""));
  });

  /* ---------- aberto agora (horário de Fortaleza) ---------- */
  const st = $("#status");
  if (st) {
    const f = new Intl.DateTimeFormat("en-US", { timeZone: "America/Fortaleza", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const g = (t: string) => f.find((p) => p.type === t)?.value ?? "0";
    const h = (Number(g("hour")) % 24) + Number(g("minute")) / 60;
    const sched: Record<string, [number, number]> = { Mon: [9, 17], Tue: [9, 17], Wed: [9, 17], Thu: [9, 17], Fri: [9, 17], Sat: [9, 12] };
    const s = sched[g("weekday")];
    const open = !!s && h >= s[0] && h < s[1];
    st.classList.toggle("open", open);
    const sp = st.querySelector("span");
    if (sp) sp.textContent = open ? "Aberto agora" : "Fechado agora";
  }

  return () => {
    alive = false;
    cleanups.forEach((f) => f());
  };
}
