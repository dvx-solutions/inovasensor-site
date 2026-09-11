import type { Copy } from "~/lib/copy";

/**
 * Bloco 06 — o respiro.
 *
 * Zero animação de scroll, de propósito. Depois de duas seções pinadas
 * e uma tabela, o silêncio visual é o que faz a regulação soar séria.
 */
export default function Ana({ t }: { t: Copy }) {
  return (
    <section id="ana" className="rule-top bg-deep">
      <div className="shell py-28 md:py-36">
        <div className="max-w-[46rem]">
          <div className="flex items-center gap-3">
            <span className="label label-cyan readout">{t.ana.index}</span>
            <span className="h-px w-8 bg-edge" />
            <span className="label">{t.ana.eyebrow}</span>
          </div>

          <h2 className="display-l mt-7">{t.ana.h2}</h2>

          <p className="mt-8 text-[1.15rem] leading-[1.65] text-fg-mute">{t.ana.body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={t.ana.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="tap label label-cyan gap-2 border-b border-cyan-d transition-colors hover:text-fg"
            >
              {t.ana.link}
              <span aria-hidden="true">↗</span>
            </a>
            <span className="label">
              {t.ana.footnote}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
