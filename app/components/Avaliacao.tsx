import { useMemo, useState } from "react";
import { ScenePoster } from "~/components/scene/SceneMount";
import { submitLead } from "~/lib/leads";
import type { Copy, Lang } from "~/lib/copy";

/** Reconhece "-23.71, -46.73" e variações com ponto-e-vírgula ou espaço. */
function parseCoords(input: string): { lat: number; lon: number } | null {
  const m = input.trim().match(/^(-?\d{1,3}(?:[.,]\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:[.,]\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1].replace(",", "."));
  const lon = Number(m[2].replace(",", "."));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

type Status = "idle" | "sending" | "done" | "error";

export default function Avaliacao({ t, lang }: { t: Copy; lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const [reservoir, setReservoir] = useState("");
  const coords = useMemo(() => parseCoords(reservoir), [reservoir]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const result = await submitLead({
        data: {
          name: String(form.get("name") ?? ""),
          org: String(form.get("org") ?? ""),
          role: String(form.get("role") ?? ""),
          email: String(form.get("email") ?? ""),
          reservoir: String(form.get("reservoir") ?? ""),
          lang,
        },
      });
      setStatus(result.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const f = t.avaliacao.fields;

  return (
    <section id="avaliacao" className="rule-top relative overflow-hidden">
      {/* A cena da hero volta, desfocada — fecha o círculo sem custar
          um segundo contexto WebGL. */}
      <div aria-hidden="true" className="absolute inset-0" style={{ filter: "blur(38px)", opacity: 0.5 }}>
        <ScenePoster />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, var(--color-abyss) 0%, rgba(5,22,27,0.86) 45%, var(--color-abyss) 100%)" }}
      />

      <div className="shell relative z-10 py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="label label-cyan readout">{t.avaliacao.index}</span>
              <span className="h-px w-8 bg-edge" />
              <span className="label">{t.avaliacao.eyebrow}</span>
            </div>
            <h2 className="display-l mt-6 max-w-[17ch]">{t.avaliacao.h2}</h2>
            <p className="prose-lede mt-6">{t.avaliacao.lede}</p>

            <div className="mt-10 border-t border-edge pt-6">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: coords ? "var(--color-cyan)" : "var(--color-shelf)" }}
                />
                <span className="label">
                  {coords ? t.avaliacao.located : reservoir ? t.avaliacao.locating : t.avaliacao.notLocated}
                </span>
              </div>
              {coords ? (
                <p className="readout mt-2 text-[13px] text-cyan">
                  {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="panel p-6 sm:p-8">
            {status === "done" ? (
              <div className="flex min-h-[22rem] flex-col justify-center">
                <span className="chip chip-cyan self-start">✓</span>
                <h3 className="display-m mt-5">{t.avaliacao.successTitle}</h3>
                <p className="prose-body mt-3 text-[1rem]">{t.avaliacao.successBody}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {(
                  [
                    ["name", f.name, f.namePh, "text", "name"],
                    ["org", f.org, f.orgPh, "text", "organization"],
                    ["role", f.role, f.rolePh, "text", "organization-title"],
                    ["email", f.email, f.emailPh, "email", "email"],
                  ] as const
                ).map(([id, label, ph, type, ac]) => (
                  <label key={id} className="flex flex-col gap-2">
                    <span className="label">
                      {label}
                    </span>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      autoComplete={ac}
                      required={id === "name" || id === "email"}
                      placeholder={ph}
                      className="field"
                    />
                  </label>
                ))}

                <label className="flex flex-col gap-2">
                  <span className="label">
                    {f.reservoir}
                  </span>
                  <input
                    id="reservoir"
                    name="reservoir"
                    type="text"
                    required
                    value={reservoir}
                    onChange={(e) => setReservoir(e.target.value)}
                    placeholder={f.reservoirPh}
                    className="field"
                  />
                </label>

                <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-2 justify-center disabled:opacity-60">
                  {status === "sending" ? t.avaliacao.sending : t.avaliacao.submit}
                </button>

                {status === "error" ? (
                  <p className="text-[14px] leading-relaxed text-flare">{t.avaliacao.errorBody}</p>
                ) : null}

                <p className="label" style={{ lineHeight: 1.6 }}>
                  {t.avaliacao.privacy}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
