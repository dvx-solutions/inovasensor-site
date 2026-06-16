import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Satellite, Trophy, Bot, ChevronDown, Menu, X } from "lucide-react";

const products = [
  {
    icon: Trophy,
    name: "Palpite Bar",
    desc: "Gamificação de futebol para bares",
    href: "#palpite-bar",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "Ao vivo",
    badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/25",
  },
  {
    icon: Satellite,
    name: "Monitoramento",
    desc: "Alertas preditivos de cianobactérias",
    href: "#monitoramento",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "TRL 4",
    badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  },
  {
    icon: Bot,
    name: "BPO-AI",
    desc: "Gestão contábil com WhatsApp AI",
    href: "#bpoai",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    badge: "Em breve",
    badgeColor: "text-violet-400 bg-violet-500/15 border-violet-500/25",
  },
];

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Equipe", href: "#equipe" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!prodOpen) return;
    const handler = () => setProdOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [prodOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-3 bg-[#020c1b]/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "py-5 bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="flex items-center flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="inovaSensor"
              className="w-28 h-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Produtos dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setProdOpen((v) => !v); }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  prodOpen
                    ? "text-white bg-white/8"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                Produtos
                <ChevronDown
                  className={cn("w-3.5 h-3.5 transition-transform duration-200", prodOpen && "rotate-180")}
                />
              </button>

              {/* Dropdown */}
              {prodOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[340px] rounded-2xl border border-white/8 bg-[#0a1628]/95 backdrop-blur-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {products.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      onClick={() => setProdOpen(false)}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors duration-150 group/item"
                    >
                      <div className={cn("mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", p.bg)}>
                        <p.icon className={cn("w-4 h-4", p.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white group-hover/item:text-white">
                            {p.name}
                          </span>
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full border", p.badgeColor)}>
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#contato">
              <Button size="sm" variant="brand" className="px-5 h-9 shadow-[0_0_20px_rgba(225,62,107,0.3)]">
                Fale Conosco
              </Button>
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[300px] bg-[#071425] border-l border-white/8 p-6 flex flex-col gap-2 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <img src="/logo.png" alt="inovaSensor" className="h-8 w-auto object-contain" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold px-2 mb-1">Produtos</p>
            {products.map((p) => (
              <a
                key={p.name}
                href={p.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", p.bg)}>
                  <p.icon className={cn("w-4 h-4", p.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                </div>
              </a>
            ))}

            <div className="h-px bg-white/6 my-2" />
            <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold px-2 mb-1">Empresa</p>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}

            <div className="mt-auto pt-4">
              <a href="#contato" onClick={() => setMobileOpen(false)}>
                <Button variant="brand" className="w-full">Fale Conosco</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
