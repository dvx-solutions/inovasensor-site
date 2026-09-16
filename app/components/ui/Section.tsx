import type { ReactNode } from "react";

/**
 * Marca do AlgEye — "Pálpebra d'água".
 *
 * A pálpebra de baixo ondula: ela é a superfície da água. Manter essa
 * ondulação é o que separa a marca de um olho de empresa de vigilância,
 * e por isso ela vive no contorno, não num detalhe interno — assim nada
 * essencial se perde quando reduz.
 *
 * Herda a cor do texto ao redor (`currentColor`), então um único desenho
 * serve colorido, mono-escuro e mono-claro.
 *
 * PROVISÓRIA: a marca definitiva já foi escolhida — um olho contendo globo
 * e satélite, em verde #0A5B45 — mas só existe em PNG, esperando vetor.
 * Enquanto não houver SVG, este desenho segura o cabeçalho e o favicon.
 */
export function AlgEyeMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={{ color: "var(--color-cyan)" }}
      aria-hidden="true"
    >
      <path
        d="M6 50C20 24 36 14 50 14C64 14 80 24 94 50C90 63 83 72 72 74C61 76 54 68 42 70C30 72 14 63 6 50Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="44" r="12" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AlgEyeMark size={24} />
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
