import { useEffect, useRef } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15m-6.75-12.81a.75.75 0 00-.75.082M5 14.5l-1.9 1.9M5 14.5h14M19.8 15l1.9 1.9" />
      </svg>
    ),
    color: "text-blue-400",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    title: "IA com propósito",
    desc: "Não desenvolvemos IA por tendência. Cada modelo nasce de um problema real com impacto mensurável — vidas, dinheiro, experiência.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: "text-cyan-400",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
    title: "Dados → Decisões em tempo real",
    desc: "Saímos do relatório passivo para alertas acionáveis. O operador age antes do problema virar crise — não depois.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
      </svg>
    ),
    color: "text-violet-400",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    title: "Tecnologia sem hardware",
    desc: "Satélites, WhatsApp e smartphones já existem. Conectamos esses ativos com modelos de ML — zero capex para o cliente, escala imediata.",
  },
];

const stats = [
  { value: "3", label: "Produtos em desenvolvimento" },
  { value: "72h", label: "Antecipação ambiental" },
  { value: "TRL 4", label: "Maturidade tecnológica (algas)" },
  { value: "100%", label: "Sem hardware adicional" },
];

export default function Sobre() {
  const headRef = useReveal();
  const pillarsRef = useReveal();
  const statsRef = useReveal();

  return (
    <section id="sobre" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(59,130,246,0.04),transparent)]" />
      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div ref={headRef} className="reveal text-center mb-20">
          <span className="badge badge-blue mb-4">Sobre a inovaSensor</span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Uma empresa construída em cima
            <br />
            de{" "}
            <span className="gradient-text">problemas que importam</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A inovaSensor nasceu da frustração com soluções caras, passivas e cheias de hardware.
            Usamos IA, satélites e canais que as pessoas já têm para resolver problemas que antes
            precisavam de equipes inteiras.
          </p>
        </div>

        {/* Pillars */}
        <div
          ref={pillarsRef}
          className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              className="spotlight-card relative rounded-2xl p-7 glass glass-hover"
              style={{ border: `1px solid ${p.border}`, background: p.bg }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
              }}
            >
              <div className={`${p.color} mb-4`}>{p.icon}</div>
              <h3 className="font-bold text-white text-lg mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                {p.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="reveal glass rounded-2xl p-8 md:p-12 border border-white/5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div
                  className="text-4xl md:text-5xl font-bold gradient-text mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.value}
                </div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
