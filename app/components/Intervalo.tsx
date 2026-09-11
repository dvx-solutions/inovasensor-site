import { useEffect, useRef } from "react";
import { SectionHead } from "~/components/ui/Section";
import { canAnimate, ensureGsap } from "~/lib/motion";
import type { Copy } from "~/lib/copy";

/* Curva de biomassa: logística, estoura por volta do dia 19. */
const X0 = 64;
const X1 = 872;
const Y0 = 34;
const Y1 = 206;
const DAYS = 30;

const biomass = (day: number) => 3 + 97 / (1 + Math.exp(-(day - 19) / 2.5));
const px = (day: number) => X0 + (day / DAYS) * (X1 - X0);
const py = (value: number) => Y1 - (value / 100) * (Y1 - Y0);

const curvePath = (() => {
  const pts: string[] = [];
  for (let d = 0; d <= DAYS; d += 0.5) pts.push(`${px(d).toFixed(1)},${py(biomass(d)).toFixed(1)}`);
  return `M${pts.join(" L")}`;
})();

const CRITICAL_DAY = 22;

export default function Intervalo({ t }: { t: Copy }) {
  const section = useRef<HTMLElement>(null);
  const dayOut = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!canAnimate()) return;
    const { gsap } = ensureGsap();

    /**
     * Toca uma vez, na entrada — sem pin e sem scrub.
     *
     * A versão pinada espremia cabeçalho, gráfico, três números e o
     * fecho numa viewport só, e o gráfico saía cortado. Em fluxo normal
     * a seção tem a altura que o conteúdo pede, e a leitura de 30 dias
     * acontece sozinha quando o bloco aparece.
     */
    const RUN = 2.1;

    const ctx = gsap.context(() => {
      const counter = { day: 0 };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".timeline-figure", start: "top 78%", once: true },
        defaults: { ease: "none" },
      });

      tl.fromTo(".curve-line", { strokeDashoffset: 2400 }, { strokeDashoffset: 0, duration: RUN }, 0)
        .fromTo(".playhead", { x: px(0) }, { x: px(DAYS), duration: RUN }, 0)
        .to(counter, {
          day: DAYS,
          duration: RUN,
          onUpdate: () => {
            if (dayOut.current) dayOut.current.textContent = String(Math.round(counter.day)).padStart(2, "0");
          },
        }, 0)
        .fromTo(".gap-band", { scaleX: 0 }, { scaleX: 1, duration: RUN, transformOrigin: "left center" }, 0)
        .fromTo(
          ".bloom-marker",
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
          RUN * (CRITICAL_DAY / DAYS),
        )
        .fromTo(".sample-late", { opacity: 0.25 }, { opacity: 1, duration: 0.35 }, RUN - 0.2);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="intervalo" className="rule-top relative">
      <div>
        <div className="shell py-24 md:py-28">
          <SectionHead index={t.intervalo.index} eyebrow={t.intervalo.eyebrow} title={t.intervalo.h2} lede={t.intervalo.lede} />

          <div className="timeline-figure reveal panel mt-14">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-5 py-3">
              <span className="label">{t.intervalo.timeline.caption}</span>
              <span className="label readout">
                {t.intervalo.timeline.dayLabel} <span ref={dayOut} className="text-cyan">30</span> / {DAYS}
              </span>
            </div>

            <div className="overflow-x-auto px-2 py-4">
              <svg viewBox="0 0 936 244" width="936" height="244" className="mx-auto block max-w-none" role="img" aria-label={t.intervalo.timeline.caption}>
                {/* faixa sem leitura */}
                <rect
                  className="gap-band"
                  x={px(0)}
                  y={Y0 - 8}
                  width={px(DAYS) - px(0)}
                  height={Y1 - Y0 + 16}
                  fill="rgba(255,107,61,0.055)"
                />

                {/* grade */}
                {[0, 25, 50, 75, 100].map((v) => (
                  <line key={v} x1={X0} y1={py(v)} x2={X1} y2={py(v)} stroke="var(--color-shelf)" strokeWidth="1" />
                ))}
                {Array.from({ length: DAYS + 1 }, (_, d) => d).filter((d) => d % 5 === 0).map((d) => (
                  <g key={d}>
                    <line x1={px(d)} y1={Y1} x2={px(d)} y2={Y1 + 7} stroke="var(--color-edge)" strokeWidth="1" />
                    <text x={px(d)} y={Y1 + 22} textAnchor="middle" fill="var(--color-fg-dim)" fontSize="11" fontFamily="var(--font-mono)">
                      {d}
                    </text>
                  </g>
                ))}

                {/* limiar operacional */}
                <line x1={X0} y1={py(62)} x2={X1} y2={py(62)} stroke="var(--color-flare)" strokeWidth="1" strokeDasharray="3 5" opacity="0.55" />

                {/* curva de biomassa */}
                <path
                  className="curve-line"
                  d={curvePath}
                  fill="none"
                  stroke="var(--color-flare)"
                  strokeWidth="2"
                  strokeDasharray="2400"
                  strokeLinecap="round"
                />

                {/* marcador de floração instalada */}
                <g className="bloom-marker" style={{ transformOrigin: `${px(CRITICAL_DAY)}px ${py(biomass(CRITICAL_DAY))}px` }}>
                  <circle cx={px(CRITICAL_DAY)} cy={py(biomass(CRITICAL_DAY))} r="5" fill="var(--color-flare)" />
                  <circle cx={px(CRITICAL_DAY)} cy={py(biomass(CRITICAL_DAY))} r="11" fill="none" stroke="var(--color-flare)" strokeWidth="1" opacity="0.5" />
                  <text x={px(CRITICAL_DAY) + 18} y={py(biomass(CRITICAL_DAY)) - 6} fill="var(--color-flare)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.06em">
                    {t.intervalo.timeline.bloomLabel.toUpperCase()}
                  </text>
                </g>

                {/* as duas únicas coletas do ciclo */}
                {[0, DAYS].map((d, i) => (
                  <g key={d} className={i === 1 ? "sample-late" : undefined}>
                    <line x1={px(d)} y1={Y0 - 8} x2={px(d)} y2={Y1} stroke="var(--color-cyan)" strokeWidth="1" opacity="0.45" />
                    <rect x={px(d) - 4} y={py(biomass(d)) - 4} width="8" height="8" fill="var(--color-cyan)" transform={`rotate(45 ${px(d)} ${py(biomass(d))})`} />
                    <text x={d === 0 ? px(d) + 12 : px(d) - 12} y={Y0 + 4} textAnchor={d === 0 ? "start" : "end"} fill="var(--color-cyan)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.08em">
                      {t.intervalo.timeline.sample.toUpperCase()}
                    </text>
                  </g>
                ))}

                {/* cabeçote de leitura */}
                <g className="playhead" style={{ transform: `translateX(${px(DAYS)}px)` }}>
                  <line x1="0" y1={Y0 - 14} x2="0" y2={Y1 + 8} stroke="var(--color-fg)" strokeWidth="1" opacity="0.55" />
                  <path d="M-4,-14 L4,-14 L0,-7 Z" transform={`translate(0,${Y0})`} fill="var(--color-fg)" />
                </g>

                <text x={X0} y={Y1 + 40} fill="var(--color-fg-dim)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.09em">
                  {t.intervalo.timeline.gap.toUpperCase()}
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-12 grid gap-px bg-edge sm:grid-cols-3">
            {t.intervalo.facts.map((f) => (
              <div key={f.k} className="reveal bg-abyss px-6 py-7">
                <div className="display-m text-flare">{f.k}</div>
                <p className="mt-2.5 text-[15px] leading-relaxed text-fg-mute">{f.v}</p>
              </div>
            ))}
          </div>

          <p className="reveal mt-10 max-w-[52ch] text-fg" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.22rem", lineHeight: 1.35, letterSpacing: "-0.02em" }}>
            {t.intervalo.kicker}
          </p>
        </div>
      </div>
    </section>
  );
}
