import type { ReactNode } from "react";

/**
 * Marca do AlgEye — "Pálpebra d'água".
 *
 * A pálpebra de baixo ondula: ela é a superfície da água. Manter essa
 * ondulação é o que separa a marca de um olho de empresa de vigilância,
 * e por isso ela vive no contorno, não num detalhe interno — assim nada
 * essencial se perde quando reduz.
 *
 * A marca oficial: um olho contendo o globo e um satélite. Ela existe
 * hoje só em raster, então entra como <img> e não como SVG inline.
 *
 * O arquivo é exportado a 4× o tamanho de uso (96 px de altura para 24 em
 * tela), o que a deixa nítida em retina e pesa 6 kB. Quando houver vetor,
 * isto vira um SVG inline e o `size` continua sendo a única medida.
 *
 * Só a versão branca vive aqui porque a marca sempre aparece sobre o
 * fundo escuro do site. A verde (#0A5B45) está ao lado, em
 * `public/marca/`, para material impresso e fundo claro.
 */
export function AlgEyeMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/marca/algeye-branco.png"
      width={Math.round(size * 1.786)}
      height={size}
      className={className}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ height: size, width: "auto" }}
    />
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
