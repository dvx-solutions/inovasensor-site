import { SectionHead } from "~/components/ui/Section";
import type { Copy } from "~/lib/copy";

/**
 * Bloco 04 — o painel.
 *
 * Reconstrução da interface real do AlgEye a partir de captura do time,
 * com reservatório e usuário descaracterizados: nenhum nome real existe
 * neste arquivo. Foi reconstruída em vez de embutida como imagem porque
 * assim fica nítida em qualquer tela, pesa alguns kB em vez de centenas,
 * herda a paleta do site e não corre risco de carregar junto qualquer
 * coisa que estivesse na tela no momento do print.
 *
 * Para trocar pela captura real: salve em `public/painel.png` e troque
 * <PanelMock/> por <img src="/painel.png" alt="" />.
 */

/* ── série de passagens do rodapé ───────────────────────────── */
const BARS = 92;
/* Determinística: calma quase o ano inteiro, com picos isolados. */
const series = Array.from({ length: BARS }, (_, i) => {
  const base = 0.18 + 0.1 * Math.abs(Math.sin(i * 0.7)) + 0.06 * Math.abs(Math.sin(i * 2.3));
  const spikes: Record<number, number> = { 47: 0.55, 74: 0.62, 79: 0.5, 85: 1.0, 88: 0.42 };
  return spikes[i] ?? base;
});
const barColor = (v: number) =>
  v >= 0.9 ? "var(--color-flare)" : v >= 0.5 ? "#c9a227" : "var(--color-cyan-d)";

/* ── mancha do reservatório, em falsa cor do índice ─────────── */
const LAKE =
  "M300 74 C352 44, 420 58, 470 52 C520 46, 560 66, 566 108 C572 152, 548 186, 520 214 " +
  "C498 236, 486 268, 470 300 C452 336, 408 352, 372 338 C338 324, 322 292, 312 258 " +
  "C300 216, 268 190, 256 152 C246 118, 262 86, 300 74 Z";

function PanelMock({ t }: { t: Copy }) {
  const m = t.painel.mock;

  return (
    <div className="panel overflow-hidden">
      {/* ── barra de aplicação ── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-edge bg-deep px-4 py-2.5">
        <span className="flex items-center gap-2">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="var(--color-cyan)" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="4" fill="var(--color-cyan)" />
          </svg>
          <span className="text-[13px] font-medium text-fg">{m.brand}</span>
        </span>

        <span className="flex items-center gap-2 border border-edge px-2.5 py-1">
          <span className="readout text-[11px] text-fg">{m.picker}</span>
          <span className="text-fg-dim" aria-hidden="true">⌄</span>
        </span>

        <nav className="hidden items-center gap-4 lg:flex">
          {m.nav.map((item, i) => (
            <span
              key={item}
              className="text-[12px]"
              style={
                i === 0
                  ? { color: "var(--color-fg)", background: "var(--color-shelf)", padding: "3px 9px" }
                  : { color: "var(--color-fg-dim)" }
              }
            >
              {item}
            </span>
          ))}
        </nav>

        <span className="ml-auto hidden items-center gap-4 xl:flex">
          {m.readouts.map(([k, v]) => (
            <span key={k} className="label flex items-center gap-1.5">
              {k} <b className="readout font-normal text-fg">{v}</b>
            </span>
          ))}
        </span>

        <span className="flex items-center gap-2">
          <span
            className="readout flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-abyss"
            style={{ background: "var(--color-cyan)" }}
          >
            {m.user.initials}
          </span>
          <span className="hidden text-[12px] text-fg-mute sm:inline">{m.user.name}</span>
        </span>
      </div>

      {/* ── corpo: mapa + sobreposições ── */}
      <div className="relative">
        <div className="relative aspect-[16/8] w-full overflow-hidden" style={{ background: "#e8ece6" }}>
          <svg viewBox="0 0 820 410" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect width="820" height="410" fill="#e8ece6" />
            {[60, 150, 240, 330].map((y) => (
              <rect key={y} x="0" y={y} width="820" height="34" fill="#dfe6db" />
            ))}
            {[120, 300, 640, 760].map((x) => (
              <rect key={x} x={x} width="26" height="410" fill="#dfe6db" />
            ))}
            <path d="M0 96 L820 84" stroke="#f2c14e" strokeWidth="3" fill="none" />
            <path d="M690 0 L640 410" stroke="#f2c14e" strokeWidth="3" fill="none" />
            <path d="M150 410 L210 0" stroke="#ffffff" strokeWidth="4" fill="none" />
            <path
              d="M256 152 C228 196, 236 268, 262 330 L300 410 L392 410 L356 330 C330 272, 300 208, 300 152 Z"
              fill="#bcd9e6"
            />

            <defs>
              <linearGradient id="ndci-fill" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="#1f6b6d" />
                <stop offset="62%" stopColor="#20706b" />
                <stop offset="100%" stopColor="#2f7a63" />
              </linearGradient>
              <pattern id="ndci-grain" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="transparent" />
                <circle cx="1" cy="1" r="0.7" fill="#2f8f86" opacity="0.55" />
                <circle cx="3" cy="3" r="0.6" fill="#17595c" opacity="0.5" />
              </pattern>
            </defs>
            <path d={LAKE} fill="url(#ndci-fill)" />
            <path d={LAKE} fill="url(#ndci-grain)" />

            {/* franjas acima de moderado, nas bordas rasas */}
            <path
              d="M470 300 C452 336, 408 352, 372 338 C348 328, 332 308, 322 284 C344 306, 372 320, 402 318 C432 316, 454 308, 470 300 Z"
              fill="#c9a227"
              opacity="0.75"
            />
            <path d="M312 258 C316 276, 320 292, 328 306 C314 292, 306 274, 306 256 Z" fill="#c9a227" opacity="0.6" />

            {/* ponto de coleta */}
            <circle cx="404" cy="140" r="15" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
            <circle cx="404" cy="140" r="3.5" fill="#ffffff" />
          </svg>

          <span
            className="readout absolute left-[46%] top-[38%] px-1.5 py-0.5 text-[11px] text-fg"
            style={{ background: "rgba(5,22,27,0.82)" }}
          >
            {m.marker}
          </span>

          {/* camadas disponíveis */}
          <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-1.5">
            {m.layers.map((layer, i) => (
              <span
                key={layer}
                className="readout px-2.5 py-1 text-[11px]"
                style={
                  i === 0
                    ? {
                        background: "var(--color-abyss)",
                        color: "var(--color-fg)",
                        border: "1px solid var(--color-edge)",
                      }
                    : { background: "rgba(5,22,27,0.55)", color: "var(--color-fg-mute)", border: "1px solid transparent" }
                }
              >
                {layer}
              </span>
            ))}
          </div>

          {/* ficha do reservatório */}
          <div
            className="absolute left-3 top-3 w-[16.5rem] max-w-[46%] border border-edge p-4"
            style={{ background: "rgba(5,22,27,0.94)" }}
          >
            <p className="text-[15px] font-medium text-fg">{m.card.title}</p>
            <p className="label mt-1.5">{m.card.meta}</p>

            <p className="label mt-4">
              {m.card.archiveLabel} <b className="readout font-normal text-fg">95%</b>
            </p>
            <div className="mt-2 h-1 w-full" style={{ background: "var(--color-shelf)" }}>
              <div className="h-full" style={{ width: "95%", background: "var(--color-cyan)" }} />
            </div>
            <p className="mt-2 text-[12px] leading-snug text-fg-mute">{m.card.archiveNote}</p>

            <p className="label mt-5">{m.card.mirrorLabel}</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="readout text-[2rem] leading-none text-cyan">{m.card.mirrorValue}</span>
              <span className="text-[13px] text-fg-mute">{m.card.mirrorUnit}</span>
            </p>
            <div className="mt-3 flex h-1 w-full overflow-hidden">
              <span style={{ width: "90%", background: "var(--color-cyan-d)" }} />
              <span style={{ width: "9%", background: "#c9a227" }} />
              <span style={{ width: "1%", background: "var(--color-flare)" }} />
            </div>
            <div className="mt-2 flex justify-between gap-1">
              {m.card.classes.map(([k, v]) => (
                <span key={k} className="label" style={{ letterSpacing: "0.05em" }}>
                  {k} {v}
                </span>
              ))}
            </div>
          </div>

          {/* legenda do índice */}
          <div
            className="absolute right-3 top-3 hidden w-[14rem] border border-edge p-4 md:block"
            style={{ background: "rgba(5,22,27,0.94)" }}
          >
            <p className="label">{m.legend.title}</p>
            <div
              className="mt-3 h-2 w-full"
              style={{ background: "linear-gradient(90deg,#1f6b6d,#2f8f86,#c9a227,#ff6b3d)" }}
            />
            <div className="mt-1.5 flex justify-between">
              {m.legend.scale.map((v) => (
                <span key={v} className="label">
                  {v}
                </span>
              ))}
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {m.legend.classes.map(([k, v], i) => (
                <li key={k} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: ["var(--color-flare)", "#e08b3a", "#c9a227", "var(--color-cyan)"][i] }}
                  />
                  <span className="text-[12px] text-fg-mute">
                    {k} · {v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── série de passagens ── */}
        <div className="grid gap-px border-t border-edge bg-edge lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div className="bg-abyss px-5 py-4">
            <p className="label">{m.series.label}</p>
            <p className="readout mt-2 text-[1.2rem] text-fg">{m.series.date}</p>
            <p className="mt-1 text-[12px] text-fg-mute">{m.series.note}</p>
          </div>
          <div className="flex items-end gap-[2px] bg-abyss px-5 py-4" style={{ height: "6.5rem" }}>
            {series.map((v, i) => (
              <span
                key={i}
                className="flex-1"
                style={{ height: `${Math.round(v * 100)}%`, background: barColor(v), minWidth: 2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Painel({ t }: { t: Copy }) {
  return (
    <section id="painel" className="rule-top">
      <div className="shell py-24 md:py-32">
        <SectionHead index={t.painel.index} eyebrow={t.painel.eyebrow} title={t.painel.h2} lede={t.painel.lede} />

        <figure className="reveal mt-14">
          <PanelMock t={t} />
          <figcaption className="label mt-3.5 block">{t.painel.disclaimer}</figcaption>
        </figure>
      </div>
    </section>
  );
}
