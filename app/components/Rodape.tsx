import { Wordmark } from "~/components/ui/Section";
import { routeFor, type Copy, type Lang } from "~/lib/copy";

export default function Rodape({ t, lang }: { t: Copy; lang: Lang }) {
  const other: Lang = lang === "pt" ? "en" : "pt";

  return (
    <footer className="rule-top bg-deep">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Wordmark />
            <p className="prose-body mt-4 max-w-[34ch] text-[15px]">{t.rodape.tagline}</p>
            <p className="label mt-5">
              {t.rodape.location}
            </p>
          </div>

          <div>
            <p className="label">{t.rodape.contact}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a href={`mailto:${t.rodape.email}`} className="tap readout text-[13px] text-fg-mute transition-colors hover:text-cyan">
                  {t.rodape.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${t.rodape.phoneHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap readout text-[13px] text-fg-mute transition-colors hover:text-cyan"
                >
                  {t.rodape.phone} · {t.rodape.whatsapp}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="label">{t.rodape.legalTitle}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li className="readout text-[13px] text-fg-mute">{t.rodape.entity}</li>
              <li className="readout text-[13px] text-fg-dim">{t.rodape.cnpj}</li>
              <li>
                <a href={routeFor(other)} className="tap readout text-[13px] text-fg-mute transition-colors hover:text-cyan">
                  {other === "en" ? "English" : "Português"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            © {new Date().getFullYear()} AlgEye · {t.rodape.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
