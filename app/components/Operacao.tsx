import { SectionHead } from "~/components/ui/Section";
import type { Copy } from "~/lib/copy";

export default function Operacao({ t }: { t: Copy }) {
  return (
    <section id="operacao" className="rule-top">
      <div className="shell py-24 md:py-32">
        <SectionHead index={t.operacao.index} eyebrow={t.operacao.eyebrow} title={t.operacao.h2} lede={t.operacao.lede} />

        <div className="reveal mt-14 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                {t.operacao.table.head.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="label border-b border-edge px-4 py-3.5 text-left align-bottom"
                    style={{
                      width: i === 0 ? "34%" : "33%",
                      color: i === 2 ? "var(--color-cyan)" : undefined,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.operacao.table.rows.map((row) => (
                <tr key={row[0]}>
                  <th
                    scope="row"
                    className="border-b px-4 py-4 text-left align-top text-[15px] font-normal text-fg"
                    style={{ borderColor: "color-mix(in oklab, var(--color-edge) 45%, transparent)" }}
                  >
                    {row[0]}
                  </th>
                  <td
                    className="border-b px-4 py-4 align-top text-[15px] text-fg-dim"
                    style={{ borderColor: "color-mix(in oklab, var(--color-edge) 45%, transparent)" }}
                  >
                    {row[1]}
                  </td>
                  <td
                    className="border-b px-4 py-4 align-top text-[15px] text-fg"
                    style={{
                      borderColor: "color-mix(in oklab, var(--color-edge) 45%, transparent)",
                      background: "color-mix(in oklab, var(--color-cyan) 4%, transparent)",
                    }}
                  >
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ancoragem: a única cifra da página é o que o operador já gasta. */}
        <div className="reveal mt-14 grid gap-8 border-l-2 border-flare py-1 pl-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-baseline md:gap-10">
          <div>
            <div className="readout text-flare" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.9rem,4vw,2.9rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {t.operacao.anchor.value}
            </div>
            <div className="label mt-2">{t.operacao.anchor.unit}</div>
          </div>
          <p className="prose-body text-[1.0625rem]">{t.operacao.anchor.note}</p>
        </div>
      </div>
    </section>
  );
}
