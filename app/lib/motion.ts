/**
 * Camada de movimento do site.
 *
 * Lenis conduz o scroll; o GSAP/ScrollTrigger conduz tudo que reage a ele.
 * Um único ticker (o do GSAP) roda os dois — dois rAF concorrentes causam
 * o jitter clássico de smooth-scroll com scrub.
 *
 * Regra: nada aqui pode rodar no servidor. O TanStack Start faz SSR e
 * qualquer toque em `window` no topo do módulo quebra o build.
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsReady = false;

export function ensureGsap() {
  if (!pluginsReady && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    pluginsReady = true;
  }
  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Telas estreitas não recebem WebGL nem seções pinadas. */
export function isCompact() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 860px)").matches;
}

export function canAnimate() {
  return !prefersReducedMotion();
}

/**
 * Liga Lenis + ScrollTrigger e prepara as revelações.
 *
 * A classe `motion-ok` no <html> é o que autoriza o CSS a esconder os
 * elementos `.reveal`. Sem JS — ou com reduced-motion — a página fica
 * inteira visível em repouso, que é como ela precisa aparecer numa
 * miniatura ou num leitor que só passa o olho.
 */
export function useSiteMotion() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const root = document.documentElement;
    const reduced = prefersReducedMotion();

    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let tickerFn: ((t: number) => void) | null = null;
    let cancelled = false;

    let observer: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      if (reduced) return;

      root.classList.add("motion-ok");

      /**
       * As revelações usam IntersectionObserver, não ScrollTrigger.batch.
       *
       * O motivo é concreto: o pinning move os elementos para dentro dos
       * `.pin-spacer` que o ScrollTrigger cria, e um batch montado antes
       * disso fica com as posições de gatilho cacheadas erradas — os
       * elementos nunca entram e a página inteira fica invisível. O
       * observer lê posição visual real, então convive com pin sem
       * depender de ordem de refresh. O GSAP continua fazendo o tween.
       */
      const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
      if (!els.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
          if (!entering.length) return;
          entering.forEach((el) => observer?.unobserve(el));
          gsap.to(entering, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.07,
            ease: "power3.out",
            overwrite: true,
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
      );

      els.forEach((el) => observer?.observe(el));
    });

    /**
     * Um único ponto de refresh, e tarde.
     *
     * Cada seção pinada cria um `.pin-spacer` que empurra tudo que vem
     * depois. Se cada componente chamar refresh durante o próprio mount,
     * os triggers seguintes calculam start contra um layout que ainda vai
     * mudar — e o sintoma é brutal: três seções pinadas ficando `fixed`
     * ao mesmo tempo, uma cobrindo a outra. Web font trocando a altura
     * dos blocos causa exatamente o mesmo estrago, daí o refresh também
     * depois de `fonts.ready` e do load.
     */
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    if (!reduced) {
      // Import dinâmico: mantém o Lenis fora do bundle do servidor.
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const instance = new Lenis({
          duration: 1.05,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
        });
        lenis = instance;

        instance.on("scroll", ScrollTrigger.update);
        tickerFn = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      observer?.disconnect();
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
      ctx.revert();
      root.classList.remove("motion-ok");
    };
  }, []);
}

/** Interpolação estável por tempo — independente de framerate. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
