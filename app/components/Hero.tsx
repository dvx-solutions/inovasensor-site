import { useEffect, useRef } from "react";
import SceneMount from "~/components/scene/SceneMount";
import { AMBIENT, type SceneState } from "~/components/scene/state";
import { canAnimate, ensureGsap } from "~/lib/motion";
import type { Copy } from "~/lib/copy";

export default function Hero({ t }: { t: Copy }) {
  const section = useRef<HTMLElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState>({ ...AMBIENT });

  useEffect(() => {
    if (!canAnimate()) return;
    const { gsap } = ensureGsap();

    const ctx = gsap.context(() => {
      // Entrada: a promessa aparece linha a linha, uma vez só.
      gsap.from(".hero-line", {
        yPercent: 108,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.075,
        delay: 0.15,
      });
      gsap.from(".hero-fade", {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.62,
      });

      // A mancha respira devagar — o reservatório nunca fica parado.
      gsap.to(state.current, {
        bloom: 0.78,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Ao sair da hero, a cena recua em vez de cortar.
      gsap.to(canvasWrap.current, {
        opacity: 0.18,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-content", {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative flex min-h-[100svh] items-center overflow-hidden pt-[68px]">
      <div ref={canvasWrap} className="absolute inset-0" style={{ transformOrigin: "58% 50%" }}>
        <SceneMount stateRef={state} />
      </div>

      {/* Piso de legibilidade: o texto nunca depende do que o shader estiver desenhando. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(5,22,27,0.94) 0%, rgba(5,22,27,0.80) 38%, rgba(5,22,27,0.28) 68%, rgba(5,22,27,0.55) 100%)",
        }}
      />

      <div className="hero-content shell relative z-10 w-full py-24">
        <div className="max-w-[54rem]">
          <div className="hero-fade flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-flare beacon" />
            <span className="label label-cyan">{t.hero.eyebrow}</span>
          </div>

          <h1 className="display-xl mt-7">
            {[t.hero.h1a, t.hero.h1b, t.hero.h1c].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <span className="hero-line block" style={i === 1 ? { color: "var(--color-cyan)" } : undefined}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-fade prose-lede mt-8">{t.hero.lede}</p>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-3">
            <a href="#avaliacao" className="btn btn-primary">
              {t.hero.ctaPrimary}
            </a>
            <a href="#sensoriamento" className="btn btn-ghost">
              {t.hero.ctaSecondary}
            </a>
          </div>

          <ul className="hero-fade mt-12 flex flex-wrap gap-x-7 gap-y-2.5">
            {t.hero.proof.map((p) => (
              <li key={p} className="label flex items-center gap-2.5">
                <span className="h-px w-4 bg-cyan-d" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="label">
          {t.hero.scroll}
        </span>
        <span className="h-9 w-px" style={{ background: "linear-gradient(var(--color-cyan), transparent)" }} />
      </div>
    </section>
  );
}
