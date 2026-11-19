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

  /* celular/toque: a galeria vira um carrossel com deslize horizontal nativo (leve e sem travar) */
  const touchMQ = matchMedia("(pointer:coarse),(max-width:700px)");
  const sizeGal = () => {
    if (touchMQ.matches) {
      gal.style.height = "";
      track.style.transform = "";
      return;
    }
    gal.style.height = innerHeight + Math.max(0, track.scrollWidth - innerWidth) * 1.1 + "px";
  };
  sizeGal();
  on(track, "scroll", () => {
    if (!touchMQ.matches) return;
    const m = track.scrollWidth - track.clientWidth;
    hbar.style.transform = `scaleX(${m > 0 ? track.scrollLeft / m : 0})`;
  }, { passive: true });
  on(window, "resize", sizeGal);
  on(window, "load", sizeGal);

  /* ---------- cena da armação ---------- */
  const lens = (() => {
    const sc = $("#lente");
    if (!sc) return () => {};
    const stk = $(".stk", sc)!,
      stage = $<SVGSVGElement>("#lstage")!,
      soft = $<SVGSVGElement>("#lsoft")!,
      gl = $<SVGSVGElement>("#lgl")!,
      lines = $$("#lline > *") as unknown as SVGGeometryElement[],
      thick = $("#lthick")!,
      fill = $("#lfill")!,
      shine = $("#lshine")!,
      screw = $("#lscrew")!,
      txt = $("#ltext")!,
      tl = $("#ltl")!,
      full = $("#lfull")!,
      caps = $$(".lens-scene .cap"),
      dots = $$(".lens-scene .rail i"),
      pct = $(".lens-scene .pct"),
      hint = $(".lens-scene .hint2")!;
    const NS = "http://www.w3.org/2000/svg";
    const put = (el: Element & { _v?: string }, k: string, v: string) => {
      if (el._v !== k + v) {
        el._v = k + v;
        el.setAttribute(k, v);
      }
    };
    let last = -1,
      ci = -2,
      pc = -1,
      sig = "",
      tall = false,
      K = 1,
      VW = 1600,
      x0 = 0,
      ppu = 1,
      GW = 0,
      GH = 0;
    /* tamanho/viewBox/texto conforme o formato da tela: nada fica cortado no celular */
    const layout = () => {
      const w = stk.clientWidth || innerWidth,
        h = stk.clientHeight || innerHeight;
      VW = (900 * w) / h;
      ppu = h / 900;
      x0 = 800 - VW / 2;
      tall = VW < 1100;
      K = Math.min(1, VW / (tall ? 1150 : 1000));
      const fs = tall ? 64 : Math.round(132 * Math.min(1, VW / 1450));
      /* a armação é desenhada no tamanho máximo e só encolhe (fica sempre nítida) */
      const u = ppu * K * 1.12;
      GW = 920 * u;
      GH = 270 * u;
      gl.style.width = GW + "px";
      gl.style.height = GH + "px";
      const s2 = `${Math.round(VW)}|${Math.round(h)}|${fs}|${tall}`;
      if (s2 === sig) {
        last = -1;
        return;
      }
      sig = s2;
      const vb = `${x0} 0 ${VW} 900`;
      stage.setAttribute("viewBox", vb);
      soft.setAttribute("viewBox", vb);
      const L: Array<[string, number]> = tall
        ? [["O mundo fica", 330], ["mais bonito", 410], ["quando você", 510], ["enxerga bem.", 590]]
        : [["O mundo fica mais bonito", 420], ["quando você enxerga bem.", 570]];
      $$<SVGGElement>(".tx", sc).forEach((g) => {
        g.textContent = "";
        const blurred = soft.contains(g);
        L.forEach(([t, y], i) => {
          const e = document.createElementNS(NS, "text");
          e.setAttribute("x", "800");
          e.setAttribute("y", String(y));
          e.setAttribute("font-size", String(fs));
          if (tall ? i > 1 : i === 1) {
            e.setAttribute("font-style", "italic");
            if (!blurred) e.setAttribute("fill", "#d2b277");
          }
          e.textContent = t;
          g.appendChild(e);
        });
      });
      last = -1;
    };
    layout();
    on(window, "resize", layout);
    on(window, "load", layout);
    return () => {
      const r = sc.getBoundingClientRect(),
        tot = sc.offsetHeight - stk.clientHeight;
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const p = clamp(-r.top / tot, 0, 1);
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      const turn = ease(range(p, 0, 0.3));
      if (p < 0.45) {
        lines.forEach((l, i) => {
          const k = ease(range(p, 0.02 + i * 0.03, 0.24 + i * 0.03));
          l.style.strokeDashoffset = String(1000 * (1 - k));
        });
      }
      const th = ease(range(p, 0.28, 0.42));
      put(thick, "opacity", th.toFixed(3));
      put(screw, "opacity", th.toFixed(3));
      if (p < 0.45) lines.forEach((l) => (l.style.opacity = String(1 - th * 0.75)));
      put(fill, "opacity", ease(range(p, 0.4, 0.5)).toFixed(3));
      if (p > 0.4 && p < 0.65) shine.setAttribute("x", String(-900 + range(p, 0.44, 0.6) * 1300));
      const tx = ease(range(p, 0.56, 0.66)),
        end = ease(range(p, 0.94, 1));
      put(txt, "opacity", tx.toFixed(3));
      soft.style.opacity = (tx * (1 - end)).toFixed(3);
      put(full, "opacity", end.toFixed(3));
      const mv = range(p, 0.62, 0.94),
        sw = Math.sin(mv * Math.PI * 2);
      let x = 800,
        y = 450,
        rot = (1 - turn) * -14,
        s = (0.55 + 0.45 * ease(range(p, 0, 0.36))) * K;
      const sx = 0.25 + 0.75 * turn;
      if (tall) {
        x += -sw * Math.max(0, (VW - 880 * K * 1.12) / 2 - 6);
        y += sw * -125 + (1 - turn) * 60 * K;
      } else {
        x += -sw * 300 * K;
        y += Math.sin(mv * Math.PI * 4) * -40 * K + (1 - turn) * 60 * K;
      }
      rot += sw * -5;
      s *= 1 + end * 0.12;
      /* a armação só se move por transform (composição na GPU, sem redesenhar) */
      const sX = (sx * s) / (K * 1.12),
        sY = s / (K * 1.12);
      gl.style.transform = `translate3d(${((x - x0) * ppu - GW / 2).toFixed(2)}px,${(y * ppu - GH / 2).toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${sX.toFixed(4)},${sY.toFixed(4)})`;
      /* texto nítido dentro das lentes: transformação inversa da armação */
      if (tx > 0) tl.setAttribute("transform", `scale(${(1 / (sx * s)).toFixed(4)} ${(1 / s).toFixed(4)}) rotate(${(-rot).toFixed(3)}) translate(${-x.toFixed(2)} ${-y.toFixed(2)})`);
      const c = p < 0.3 ? 0 : p < 0.48 ? 1 : p < 0.62 ? 2 : 3,
        cc = p > 0.01 ? c : -1;
      if (cc !== ci) {
        ci = cc;
        caps.forEach((e, i) => e.classList.toggle("on", i === cc));
        dots.forEach((d, i) => d.classList.toggle("on", i === c));
      }
      const pr = Math.round(p * 100);
      if (pr !== pc) {
        pc = pr;
        if (pct) pct.textContent = pr + "%";
      }
      hint.style.opacity = String(1 - range(p, 0.02, 0.1));
    };
  })();

  /* ---------- tudo que depende da posição do scroll ---------- */
  const secEls = secIds.map((id) => document.getElementById(id));
  let solid = false;
  const onScroll = () => {
    lens();
    const y = scrollY,
      vh = innerHeight,
      vw = innerWidth;
    /* 1) leituras (um único cálculo de layout) */
    const max = document.documentElement.scrollHeight - vh;
    const parR = pars.map((el) => el.parentElement!.getBoundingClientRect());
    const touchG = touchMQ.matches;
    const gr = touchG ? null : gal.getBoundingClientRect();
    const trackMax = touchG ? 0 : Math.max(0, track.scrollWidth - vw);
    const sobreTop = sobre.getBoundingClientRect().top;
    const scrubTop = scrubP ? scrubP.getBoundingClientRect().top : 0;
    const finTop = fin.getBoundingClientRect().top;
    const cardR = touchG ? [] : cards.map((c) => c.getBoundingClientRect());
    let cs = "";
    secEls.forEach((e, i) => {
      if (e && e.getBoundingClientRect().top <= vh * 0.4) cs = secIds[i];
    });
    /* 2) escritas */
    bar.style.transform = `scaleX(${max ? y / max : 0})`;
    const sd = y > 60;
    if (sd !== solid) {
      solid = sd;
      nav.classList.toggle("solid", sd);
    }
    pars.forEach((el, i) => {
      const r = parR[i];
      if (r.bottom < -300 || r.top > vh + 300) return;
      const sp = Number(el.dataset.speed) || 0;
      el.style.transform = `translate3d(0,${(r.top + r.height / 2 - vh / 2) * sp * -1}px,0)`;
    });
    if (gr) {
      const gp = clamp(-gr.top / (gal.offsetHeight - vh), 0, 1);
      track.style.transform = `translate3d(${-gp * trackMax}px,0,0)`;
      hbar.style.transform = `scaleX(${gp})`;
    }
    const hp = clamp(y / vh, 0, 1);
    if (hp < 1 || heroTxt.style.opacity !== "0") {
      heroTxt.style.transform = `translate3d(0,${hp * 80}px,0)`;
      heroTxt.style.opacity = String(Math.max(0, 1 - hp * 1.15));
    }
    if (sobreTop < vh * 1.5 && sobreTop > -vh * 2) bgword.style.transform = `translate3d(${-sobreTop * 0.45 - 120}px,0,0)`;
    if (scrubP && sw.length) {
      const n = Math.round(clamp((vh * 0.85 - scrubTop) / (vh * 0.45), 0, 1) * sw.length);
      sw.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    if (finTop < vh * 1.2) {
      const fp = clamp((vh - finTop) / (vh * 0.9), 0, 1);
      fglass.forEach((e) => (e.style.strokeDashoffset = String(1000 * (1 - fp))));
    }
    cards.forEach((c, i) => {
      const r = cardR[i];
      if (!r || r.right < -200 || r.left > vw + 200) return;
      const p = (r.left + r.width / 2 - vw / 2) / vw;
      c.style.transform = `translateY(${Math.abs(p) * 26}px) rotate(${p * 3}deg)`;
      const im = c.querySelector("img");
      if (im) im.style.transform = `translate3d(${p * -60}px,0,0) scale(1.25)`;
    });
    navLinks.forEach((a) => a.classList.toggle("act", a.getAttribute("href") === "#" + cs));
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
  const mqs = $$(".marquee .row").map((r) => ({ r, host: r.parentElement as HTMLElement, x: 0, d: Number(r.parentElement!.dataset.dir) || -1, half: 0, init: false, vis: true }));
  const measure = () => mqs.forEach((o) => (o.half = o.r.scrollWidth / 2));
  measure();
  on(window, "load", measure);
  on(window, "resize", measure);
  const mio = new IntersectionObserver((es) => es.forEach((e) => (mqs.find((o) => o.host === e.target)!.vis = e.isIntersecting)), { rootMargin: "100px" });
  mqs.forEach((o) => mio.observe(o.host));
  cleanups.push(() => mio.disconnect());
  let lastY = scrollY,
    vel = 0;
  loop(() => {
    const dy = scrollY - lastY;
    lastY = scrollY;
    vel += (dy - vel) * 0.08;
    mqs.forEach((o) => {
      if (!o.vis) return;
      if (!o.half) o.half = o.r.scrollWidth / 2;
      const half = o.half;
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
  });

  /* ---------- bolhas de luz do topo ---------- */
  const cv = $<HTMLCanvasElement>(".bokeh");
  if (cv && !reduced) {
    const g = cv.getContext("2d")!;
    const touch = matchMedia("(pointer:coarse)").matches;
    let W = 0,
      H = 0,
      mx = 0.5;
    type Dot = { x: number; y: number; r: number; vx: number; vy: number; s: number; a: number; p: number };
    let dots: Dot[] = [];
    /* um sprite por cor: desenhar uma imagem é bem mais barato que criar um degradê por bolha a cada frame */
    const sprite = (c: string) => {
      const o = document.createElement("canvas");
      o.width = o.height = 128;
      const x = o.getContext("2d")!;
      const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, `rgba(${c},1)`);
      gr.addColorStop(0.7, `rgba(${c},.5)`);
      gr.addColorStop(1, `rgba(${c},0)`);
      x.fillStyle = gr;
      x.fillRect(0, 0, 128, 128);
      return o;
    };
    const sprites = [sprite("210,178,119"), sprite("90,160,190")];
    const draw = (t: number) => {
      g.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        g.globalAlpha = d.a * (0.7 + 0.3 * Math.sin(t / 1200 + d.p));
        g.drawImage(sprites[d.s], d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
      });
      g.globalAlpha = 1;
    };
    const rs = () => {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      dots = Array.from({ length: touch ? 10 : 30 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 18 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.12 - Math.random() * 0.35,
        s: Math.random() < 0.55 ? 0 : 1,
        a: 0.05 + Math.random() * 0.09,
        p: Math.random() * 6.28,
      }));
      draw(0);
    };
    rs();
    let rw = innerWidth;
    on(window, "resize", () => {
      if (innerWidth !== rw) {
        rw = innerWidth;
        rs();
      }
    });
    if (!touch) {
      on(window, "mousemove", (e) => (mx = (e as MouseEvent).clientX / innerWidth));
      loop((t) => {
        if (scrollY > innerHeight * 1.2) return;
        dots.forEach((d) => {
          d.x += d.vx + (mx - 0.5) * 0.4;
          d.y += d.vy;
          if (d.y < -d.r) {
            d.y = H + d.r;
            d.x = Math.random() * W;
          }
          if (d.x < -d.r) d.x = W + d.r;
          if (d.x > W + d.r) d.x = -d.r;
        });
        draw(t);
      });
    }
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
