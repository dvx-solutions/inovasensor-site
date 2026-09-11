import { useEffect, useRef } from "react";
import { SectionHead } from "~/components/ui/Section";
import { canAnimate, ensureGsap } from "~/lib/motion";
import type { Copy } from "~/lib/copy";

/* Série sintética determinística: mesma curva nas duas metades,
   a diferença é só onde a nuvem apagou o dado. */
const N = 96;
const W = 900;
const H = 190;
const PAD = 26;

const seriesValue = (i: number) => {
  const x = i / N;
  return (
    38 +
    26 * Math.sin(x * Math.PI * 2.1) +
    12 * Math.sin(x * Math.PI * 6.3 + 1.1) +
    22 * Math.pow(x, 2.4) * 3
  );
};

const sx = (i: number) => PAD + (i / (N - 1)) * (W - PAD * 2);
const sy = (v: number) => H - PAD - (Math.min(v, 130) / 130) * (H - PAD * 2);

/* Blocos de dias perdidos por nuvem — o que o operador realmente recebe. */
const CLOUDED = new Set<number>();
[[9, 17], [26, 31], [40, 52], [61, 66], [74, 86]].forEach(([a, b]) => {
  for (let i = a; i <= b; i++) CLOUDED.add(i);
});

const fullPath = (() => {
  const pts: string[] = [];
  for (let i = 0; i < N; i++) pts.push(`${sx(i).toFixed(1)},${sy(seriesValue(i)).toFixed(1)}`);
  return `M${pts.join(" L")}`;
})();

const rawSegments = (() => {
  const segs: string[] = [];
  let current: string[] = [];
  for (let i = 0; i < N; i++) {
    if (CLOUDED.has(i)) {
      if (current.length > 1) segs.push(`M${current.join(" L")}`);
      current = [];
    } else {
      current.push(`${sx(i).toFixed(1)},${sy(seriesValue(i)).toFixed(1)}`);
    }
  }
  if (current.length > 1) segs.push(`M${current.join(" L")}`);
  return segs;
})();

const gapBands = (() => {
  const bands: Array<[number, number]> = [];
  let start: number | null = null;
  for (let i = 0; i < N; i++) {
    if (CLOUDED.has(i) && start === null) start = i;
    if (!CLOUDED.has(i) && start !== null) {
      bands.push([start, i - 1]);
      start = null;
    }
  }
  if (start !== null) bands.push([start, N - 1]);
  return bands;
})();

function Chart({ mode }: { mode: "raw" | "filled" }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      {[0, 0.33, 0.66, 1].map((f) => (
        <line
          key={f}
          x1={PAD}
          y1={PAD + f * (H - PAD * 2)}
          x2={W - PAD}
          y2={PAD + f * (H - PAD * 2)}
          stroke="var(--color-shelf)"
          strokeWidth="1"
        />
      ))}

      {mode === "raw"
        ? gapBands.map(([a, b]) => (
            <rect
              key={a}
              x={sx(a)}
              y={PAD - 8}
              width={Math.max(sx(b) - sx(a), 2)}
              height={H - PAD * 2 + 16}
              fill="rgba(154,176,180,0.10)"
            />
          ))
        : gapBands.map(([a, b]) => (
            <rect
              key={a}
              x={sx(a)}
              y={PAD - 8}
              width={Math.max(sx(b) - sx(a), 2)}
              height={H - PAD * 2 + 16}
              fill="rgba(63,208,201,0.07)"
            />
          ))}

      {mode === "raw" ? (
        rawSegments.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="var(--color-fg-dim)" strokeWidth="1.8" strokeLinecap="round" />
        ))
      ) : (
        <>
          <path d={fullPath} fill="none" stroke="var(--color-cyan)" strokeWidth="1.8" strokeLinecap="round" />
          {gapBands.map(([a, b]) => (
            <line
              key={a}
              x1={sx(a)}
              y1={PAD - 8}
              x2={sx(a)}
              y2={H - PAD + 8}
              stroke="var(--color-cyan)"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.45"
            />
          ))}
        </>
      )}
    </svg>
  );
}

export default function Nuvens({ t }: { t: Copy }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canAnimate()) return;
    const { gsap } = ensureGsap();

    /* Também sem pin: o corte varre sozinho quando o painel aparece. */
    const RUN = 1.7;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".cloud-figure", start: "top 78%", once: true },
      });

      tl.fromTo(
        ".layer-filled",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: RUN, ease: "power2.inOut" },
        0,
      )
        .fromTo(".wipe-handle", { left: "0%" }, { left: "100%", duration: RUN, ease: "power2.inOut" }, 0)
        .fromTo(".label-after", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.25)
        .fromTo(".label-before", { opacity: 1 }, { opacity: 0.35, duration: 0.4 }, RUN - 0.5);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="nuvens" className="rule-top relative">
      <div>
        <div className="shell py-24 md:py-28">
          <SectionHead index={t.nuvens.index} eyebrow={t.nuvens.eyebrow} title={t.nuvens.h2} lede={t.nuvens.lede} />

          <div className="cloud-figure reveal panel relative mt-14 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-5 py-3">
              <span className="label-before label flex items-center gap-2">
                <span className="h-2 w-2 bg-fg-dim" />
                {t.nuvens.before.label} — {t.nuvens.before.note}
              </span>
              <span className="label-after label label-cyan flex items-center gap-2">
                <span className="h-2 w-2 bg-cyan" />
                {t.nuvens.after.label} — {t.nuvens.after.note}
              </span>
            </div>

            <div className="relative px-2 py-5">
              <div className="relative">
                <Chart mode="raw" />
                <div className="layer-filled absolute inset-0" style={{ clipPath: "inset(0 0% 0 0)" }}>
                  <Chart mode="filled" />
                </div>
              </div>

              {/* haste do corte */}
              <div
                className="wipe-handle pointer-events-none absolute inset-y-4 w-px"
                style={{ left: "100%", background: "var(--color-cyan)" }}
              >
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-cyan" />
              </div>
            </div>

            <div className="border-t border-edge px-5 py-3">
              <span className="label">
                {t.nuvens.drag}
              </span>
            </div>
          </div>

          <p
            className="reveal mt-10 max-w-[58ch] text-fg"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.22rem", lineHeight: 1.35, letterSpacing: "-0.02em" }}
          >
            {t.nuvens.kicker}
          </p>
        </div>
      </div>
    </section>
  );
}
