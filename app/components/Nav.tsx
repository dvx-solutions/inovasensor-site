import { useEffect, useState } from "react";
import { Wordmark } from "~/components/ui/Section";
import { routeFor, type Copy, type Lang } from "~/lib/copy";

export default function Nav({ t, lang }: { t: Copy; lang: Lang }) {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const other: Lang = lang === "pt" ? "en" : "pt";

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: lifted ? "color-mix(in oklab, var(--color-abyss) 88%, transparent)" : "transparent",
        backdropFilter: lifted ? "blur(14px)" : "none",
        borderBottom: lifted ? "1px solid color-mix(in oklab, var(--color-edge) 55%, transparent)" : "1px solid transparent",
      }}
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-cyan focus:px-3 focus:py-2 focus:text-abyss">
        {t.nav.skip}
      </a>

      <div className="shell flex h-[68px] items-center justify-between gap-6">
        <a href={routeFor(lang)} aria-label="AlgEye" className="tap">
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {t.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="tap label transition-colors hover:text-fg"
              style={{ fontSize: "11.5px" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={routeFor(other)}
            className="tap label border border-edge px-3 transition-colors hover:text-fg"
          >
            {t.nav.switchTo}
          </a>
          <a href="#avaliacao" className="btn btn-primary hidden sm:inline-flex">
            {t.nav.cta}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="flex h-11 w-11 items-center justify-center border border-edge md:hidden"
          >
            <span className="relative block h-[9px] w-4">
              <span
                className="absolute left-0 h-px w-full bg-fg transition-transform"
                style={{ top: open ? 4 : 0, transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 h-px w-full bg-fg transition-transform"
                style={{ top: open ? 4 : 8, transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-edge bg-abyss md:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {t.nav.links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="tap label py-2.5 hover:text-fg">
                {l.label}
              </a>
            ))}
            <a href="#avaliacao" onClick={() => setOpen(false)} className="btn btn-primary mt-3 justify-center">
              {t.nav.cta}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
