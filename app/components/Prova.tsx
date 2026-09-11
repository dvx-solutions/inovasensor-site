import { SectionHead } from "~/components/ui/Section";
import type { Copy } from "~/lib/copy";

export default function Prova({ t }: { t: Copy }) {
  return (
    <section id="prova" className="rule-top">
      <div className="shell py-24 md:py-32">
        <SectionHead index={t.prova.index} eyebrow={t.prova.eyebrow} title={t.prova.h2} lede={t.prova.lede} />

        <dl className="mt-14 grid gap-px bg-edge sm:grid-cols-2">
          {t.prova.items.map((item) => (
            <div key={item.k} className="reveal bg-abyss px-7 py-8">
              <dt className="label">{item.k}</dt>
              <dd>
                <p className="display-m mt-3">{item.v}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-mute">{item.note}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
