import { useEffect, useRef, useState } from "react";
import SceneMount from "~/components/scene/SceneMount";
import { BEATS, type SceneState } from "~/components/scene/state";
import { canAnimate, ensureGsap, isCompact } from "~/lib/motion";
import type { Copy } from "~/lib/copy";

/**
 * Bloco 03 — o centro do site.
 *
 * A seção fica pinada por 200vh e o scroll percorre quatro paradas sobre
 * a MESMA cena da hero. O que muda a cada parada são os uniforms do
 * shader: o pixel encolhe de 300 m para 10 m, a nuvem entra, o Gap
 * Filling reconstrói, o anel de alerta acende. A explicação e o visual
 * são a mesma coisa — é isso que faz a seção convencer.
 */
export default function Sensoriamento({ t }: { t: Copy }) {
  const section = useRef<HTMLElement>(null);
  const state = useRef<SceneState>({ ...BEATS[0] });
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!canAnimate() || isCompact()) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    setPinned(true);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        // 3 transições entre 4 paradas: uma viewport de scroll por transição.
        end: `+=${(BEATS.length - 1) * 100}%`,
        pin: ".sensing-pin",
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const raw = self.progress * (BEATS.length - 1);
          const i = Math.min(BEATS.length - 2, Math.floor(raw));
          const f = raw - i;
          const a = BEATS[i];
          const b = BEATS[i + 1];

          state.current.pixel = a.pixel + (b.pixel - a.pixel) * f;
          state.current.bloom = a.bloom + (b.bloom - a.bloom) * f;
          state.current.cloud = a.cloud + (b.cloud - a.cloud) * f;
          state.current.gap = a.gap + (b.gap - a.gap) * f;
          state.current.predict = a.predict + (b.predict - a.predict) * f;

          setActive(Math.round(raw));
        },
      });
      return () => st.kill();
    }, section);

    return () => {
      ctx.revert();
      setPinned(false);
    };
  }, []);

  const beat = t.sensoriamento.beats[active] ?? t.sensoriamento.beats[0];

  return (
    <section ref={section} id="sensoriamento" className="rule-top relative bg-abyss">
      <div className="sensing-pin relative overflow-hidden">
        <div className="relative min-h-[100svh]">
          {/* A cena só entra aqui quando a seção está pinada — em telas
              estreitas o conteúdo vira lista e não gasta WebGL. */}
          {pinned ? (
            <div className="absolute inset-0">
              <SceneMount stateRef={state} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(5,22,27,0.95) 0%, rgba(5,22,27,0.86) 40%, rgba(5,22,27,0.18) 78%, rgba(5,22,27,0.5) 100%)",
                }}
              />
            </div>
          ) : null}

          <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-center py-24">
            <div className="reveal flex items-center gap-3">
              <span className="label label-cyan readout">{t.sensoriamento.index}</span>
              <span className="h-px w-8 bg-edge" />
              <span className="label">{t.sensoriamento.eyebrow}</span>
            </div>
            <h2 className="reveal display-l mt-5">{t.sensoriamento.h2}</h2>
            <p className="reveal prose-lede mt-4">{t.sensoriamento.lede}</p>

            {pinned ? (
              /* ── modo pinado: uma parada por vez ── */
              <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="max-w-[46rem]">
                  <div className="flex items-center gap-3">
                    <span className="readout text-cyan" style={{ fontSize: "13px", letterSpacing: "0.1em" }}>
                      {beat.n}
                    </span>
                    <span className="chip chip-cyan">{beat.tag}</span>
                  </div>
                  <h3 className="display-m mt-5 min-h-[2.2em]">{beat.title}</h3>
                  <p className="prose-body mt-4 min-h-[7.5em] text-[1.0625rem]">{beat.body}</p>

                  {/* progresso das paradas */}
                  <div className="mt-8 flex gap-1.5" role="presentation">
                    {t.sensoriamento.beats.map((b, i) => (
                      <span
                        key={b.n}
                        className="h-0.5 flex-1 transition-colors duration-300"
                        style={{ background: i <= active ? "var(--color-cyan)" : "var(--color-shelf)" }}
                      />
                    ))}
                  </div>
                </div>

                <dl className="panel h-fit divide-y divide-edge">
                  {beat.readout.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                      <dt className="label">
                        {k}
                      </dt>
                      <dd className="readout text-[12.5px] text-fg">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              /* ── modo lista: tudo legível sem scroll orquestrado ── */
              <div className="mt-12 grid gap-px bg-edge md:grid-cols-2">
                {t.sensoriamento.beats.map((b) => (
                  <article key={b.n} className="reveal bg-abyss p-7">
                    <div className="flex items-center gap-3">
                      <span className="readout text-cyan" style={{ fontSize: "12px" }}>
                        {b.n}
                      </span>
                      <span className="chip chip-cyan">{b.tag}</span>
                    </div>
                    <h3 className="display-m mt-4">{b.title}</h3>
                    <p className="prose-body mt-3 text-[1rem]">{b.body}</p>
                    <dl className="mt-5 divide-y divide-edge border-y border-edge">
                      {b.readout.map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                          <dt className="label">
                            {k}
                          </dt>
                          <dd className="readout text-[12px] text-fg">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
