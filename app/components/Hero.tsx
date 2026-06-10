import React, { useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Satellite, Trophy, Bot, ArrowRight, Sparkles } from "lucide-react";

const fadeUp = (delay: number): React.CSSProperties => ({
  opacity: 0,
  animation: `fade-up 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards`,
});

// ── RetroGrid: perspective grid (pure CSS, SSR-safe) ──────────────────────────
function RetroGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:280px]">
      <div
        className="absolute inset-0"
        style={{ transform: "rotateX(58deg)", transformOrigin: "top center" }}
      >
        <div
          className="animate-grid absolute h-[300vh] w-[600vw]"
          style={{
            marginLeft: "-200%",
            backgroundImage:
              "linear-gradient(to right, rgba(225,62,107,0.07) 1px, transparent 0)," +
              "linear-gradient(to bottom, rgba(99,140,255,0.05) 1px, transparent 0)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      {/* Fade bottom so grid doesn't overpower content */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020c1b] via-[#020c1b]/20 to-transparent" />
    </div>
  );
}

// ── GridGlow: canvas animated color blobs (SSR-safe) ─────────────────────────
function GridGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["#e13e6b", "#3b82f6", "#06b6d4", "#8b5cf6", "#e13e6b"];
    const GRID = 80;
    type Glow = { x: number; y: number; tx: number; ty: number; r: number; speed: number; color: string; alpha: number };
    let glows: Glow[] = [];
    let frame: number;

    const mkGlow = (): Glow => {
      const cols = Math.max(1, Math.floor(canvas.offsetWidth / GRID));
      const rows = Math.max(1, Math.floor(canvas.offsetHeight / GRID));
      return {
        x: Math.floor(Math.random() * cols) * GRID,
        y: Math.floor(Math.random() * rows) * GRID,
        tx: Math.floor(Math.random() * cols) * GRID,
        ty: Math.floor(Math.random() * rows) * GRID,
        r: Math.random() * 130 + 60,
        speed: Math.random() * 0.01 + 0.005,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0,
      };
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      glows = Array.from({ length: 8 }, mkGlow);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      glows.forEach((g) => {
        g.x += (g.tx - g.x) * g.speed;
        g.y += (g.ty - g.y) * g.speed;
        if (Math.abs(g.tx - g.x) < 2 && Math.abs(g.ty - g.y) < 2) {
          const cols = Math.max(1, Math.floor(canvas.width / GRID));
          const rows = Math.max(1, Math.floor(canvas.height / GRID));
          g.tx = Math.floor(Math.random() * cols) * GRID;
          g.ty = Math.floor(Math.random() * rows) * GRID;
        }
        g.alpha = Math.min(1, g.alpha + 0.006);
        ctx.globalAlpha = g.alpha * 0.4;
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        grad.addColorStop(0, g.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      frame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full opacity-45"
    />
  );
}

// ── Product mini-cards ────────────────────────────────────────────────────────
const products = [
  {
    icon: Trophy,
    name: "Palpite Bar",
    desc: "Gamificação Copa 2026",
    href: "#palpite-bar",
    badge: "Ao vivo",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    hoverBorder: "hover:border-amber-500/35",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: Satellite,
    name: "Monitoramento",
    desc: "Alertas de cianobactérias 72h",
    href: "#monitoramento",
    badge: "TRL 4",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/35",
    glow: "rgba(16,185,129,0.12)",
  },
  {
    icon: Bot,
    name: "BPO-AI",
    desc: "Contador + WhatsApp AI",
    href: "#bpoai",
    badge: "Em breve",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    badgeBg: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    hoverBorder: "hover:border-violet-500/35",
    glow: "rgba(139,92,246,0.12)",
  },
];

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">

      {/* Layer 1: RetroGrid perspective */}
      <RetroGrid />

      {/* Layer 2: Canvas animated glows */}
      <GridGlow />

      {/* Layer 3: Brand pink top spotlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_50%_-5%,rgba(225,62,107,0.14),transparent)]" />

      {/* Layer 4: Improved dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-25" />

      {/* Layer 5: Beam lines */}
      <div className="beam" />
      <div className="beam beam-delay" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div style={fadeUp(0.05)} className="flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(225,62,107,0.1)",
              border: "1px solid rgba(225,62,107,0.28)",
              color: "#f9a8c0",
            }}
          >
            <Sparkles className="w-3 h-3" />
            Strategic Consulting & Predictive AI
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{ ...fadeUp(0.18), fontFamily: "var(--font-heading)", lineHeight: 1.05 }}
          className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold tracking-tight mb-6"
        >
          Inteligência artificial
          <br />
          <span className="gradient-text">para desafios reais</span>
        </h1>

        {/* Sub */}
        <p
          style={fadeUp(0.32)}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Desenvolvemos plataformas de IA que transformam dados complexos em decisões simples —
          do monitoramento ambiental à gestão financeira e ao entretenimento.
        </p>

        {/* CTAs */}
        <div style={fadeUp(0.44)} className="flex flex-wrap items-center justify-center gap-3 mb-20">
          <a href="#produtos">
            <Button size="lg" variant="brand" className="gap-2 px-8 shadow-[0_0_32px_rgba(225,62,107,0.35)]">
              Ver nossos produtos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <a href="#sobre">
            <Button size="lg" variant="ghost">
              Sobre a inovaSensor
            </Button>
          </a>
        </div>

        {/* Product mini-cards */}
        <div style={fadeUp(0.58)} className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {products.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className={`spotlight-card group relative rounded-2xl border border-white/6 bg-white/[0.025] p-4 text-left transition-all duration-300 hover:-translate-y-1.5 ${p.hoverBorder}`}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at 30% 50%, ${p.glow}, transparent 70%)` }}
              />
              <div className="relative flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${p.iconBg}`}>
                  <p.icon className={`w-4 h-4 ${p.iconColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold text-white">{p.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${p.badgeBg}`}>
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <p style={fadeUp(0.72)} className="mt-10 text-xs text-slate-600 tracking-widest uppercase">
          Construído no Vale do Paraíba · São Paulo · Brasil
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25 pointer-events-none">
        <span className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-slate-500" style={{ animation: "fade-up 1.5s ease infinite" }} />
        </div>
      </div>
    </section>
  );
}
