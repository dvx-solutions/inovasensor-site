import type { ReactNode } from "react";

/** Marca provisória: uma íris com faixa de varredura. Ponte até a identidade oficial. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10.25" stroke="var(--color-cyan)" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="4" fill="var(--color-cyan)" opacity="0.9" />
        <path d="M1.75 12h20.5" stroke="var(--color-abyss)" strokeWidth="2.6" />
        <path d="M1.75 12h20.5" stroke="var(--color-cyan)" strokeWidth="1.1" opacity="0.55" />
      </svg>
      <span
        className="text-fg"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.075rem",
          letterSpacing: "-0.022em",
        }}
      >
        AlgEye
      </span>
    </span>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : ""}>
      <div className={`reveal flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span className="label label-cyan readout">{index}</span>
        <span className="h-px w-8 bg-edge" />
        <span className="label">{eyebrow}</span>
      </div>
      <h2 className="reveal display-l mt-6 max-w-[19ch]" style={align === "center" ? { maxWidth: "none" } : undefined}>
        {title}
      </h2>
      {lede ? (
        <p className={`reveal prose-lede mt-6 ${align === "center" ? "mx-auto" : ""}`}>{lede}</p>
      ) : null}
    </div>
  );
}
