import { useState } from "react";
import type { Copy } from "~/lib/copy";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * Retrato com degradação: se o arquivo ainda não estiver em
 * `public/team/`, a ficha cai para as iniciais em vez de mostrar
 * imagem quebrada. Isso deixa o site publicável antes de todas as
 * fotos chegarem.
 */
function Portrait({ name, photo }: { name: string; photo: string | null }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photo && !failed;

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-deep">
      {showPhoto ? (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="readout text-cyan-d" style={{ fontSize: "1.6rem", letterSpacing: "0.08em" }} aria-hidden="true">
            {initials(name)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Time({ t }: { t: Copy }) {
  return (
    <section id="time" className="rule-top">
      <div className="shell py-24 md:py-32">
        <div className="flex items-center gap-3">
          <span className="label label-cyan readout">{t.time.index}</span>
          <span className="h-px w-8 bg-edge" />
          <span className="label">{t.time.eyebrow}</span>
        </div>
        <h2 className="display-l mt-6 max-w-[16ch]">{t.time.h2}</h2>

        <ul className="mt-14 grid gap-px bg-edge sm:grid-cols-2 lg:grid-cols-4">
          {t.time.members.map((m) => (
            <li key={m.name} className="reveal bg-abyss p-5">
              <Portrait name={m.name} photo={m.photo} />
              <p className="mt-4 text-[15px] leading-snug text-fg">{m.name}</p>
              <p className="label mt-1.5">
                {m.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
