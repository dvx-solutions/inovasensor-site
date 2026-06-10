import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ── Palpite Bar ── */
function PalpiteBar() {
  const r1 = useReveal(0);
  const r2 = useReveal(100);

  return (
    <div id="palpite-bar" className="relative rounded-3xl overflow-hidden border border-amber-500/15 bg-[#0c0d07]">
      {/* Amber glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(245,158,11,0.08),transparent)]" />

      <div className="relative grid md:grid-cols-2 gap-0">
        {/* Text */}
        <div ref={r1} className="reveal p-10 md:p-14 flex flex-col justify-center">
          <span className="badge badge-amber mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Ao vivo · Copa 2026
          </span>
          <h3
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="gradient-text-amber">Palpite Bar</span>
          </h3>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Transforma qualquer bar em arena da Copa do Mundo. Clientes fazem palpites de placar,
            cartões e escanteios pelo celular — competindo em ranking ao vivo na telinha do bar.
            Dono de bar cria a sala em 1 minuto, sem hardware extra.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: "🏟️", label: "64 jogos", sub: "Copa 2026" },
              { icon: "📱", label: "100% gratuito", sub: "até 19 Jul 2026" },
              { icon: "⚡", label: "1 minuto", sub: "para criar a sala" },
              { icon: "🏆", label: "Ranking ao vivo", sub: "em tempo real" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-xl p-3.5 border border-white/5">
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-white text-sm font-semibold">{f.label}</div>
                <div className="text-slate-500 text-xs">{f.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com/br/app/palpitebar/id6744611194"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.inovasensor.palpitebar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#01875f] hover:bg-[#01a072] text-white text-sm font-semibold transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83 1-.97 1.4-.43l16.21 8.5c.37.2.37.73 0 .93L4.4 20.93C4 21.47 3 21.33 3 20.5z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>

        {/* Visual */}
        <div ref={r2} className="reveal flex items-center justify-center p-8 md:p-12">
          <div className="relative w-56 animate-float">
            {/* Phone mockup */}
            <div className="w-56 h-[460px] rounded-[2.5rem] bg-gradient-to-b from-amber-500/20 to-amber-900/10 border-2 border-amber-500/30 flex flex-col items-center justify-start p-4 overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.15)]">
              {/* Status bar */}
              <div className="w-full flex justify-between items-center px-2 mb-3 text-[9px] text-amber-300/60">
                <span>9:41</span><span>●●●</span>
              </div>
              {/* App header */}
              <div className="w-full text-center mb-4">
                <div className="text-amber-400 font-bold text-base">🏆 Bar do Zé</div>
                <div className="text-slate-400 text-[10px]">Brasil × Argentina</div>
              </div>
              {/* Scoreboard */}
              <div className="w-full glass rounded-xl p-3 mb-3 text-center border border-amber-500/20">
                <div className="flex justify-between items-center">
                  <div className="text-2xl">🇧🇷</div>
                  <div className="text-white font-bold text-2xl">2 – 1</div>
                  <div className="text-2xl">🇦🇷</div>
                </div>
                <div className="text-amber-400 text-[9px] mt-1">72' ⚽ Rodrygo</div>
              </div>
              {/* Ranking */}
              <div className="w-full space-y-1.5">
                {["🥇 Carlos · 980pts", "🥈 Mariana · 840pts", "🥉 João · 720pts", "4º Você · 680pts"].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                    style={{
                      background: i === 3 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)",
                      color: i === 3 ? "#fcd34d" : "#94a3b8",
                      border: i === 3 ? "1px solid rgba(245,158,11,0.3)" : "none",
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
              {/* Bottom bar */}
              <div className="absolute bottom-6 left-4 right-4">
                <div className="w-full py-2 rounded-xl bg-amber-500 text-black font-bold text-[11px] text-center">
                  Fazer Palpite
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 bg-amber-400/5 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Monitoramento ── */
function Monitoramento() {
  const r1 = useReveal(0);
  const r2 = useReveal(100);

  return (
    <div id="monitoramento" className="relative rounded-3xl overflow-hidden border border-emerald-500/15 bg-[#040d0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(16,185,129,0.07),transparent)]" />

      <div className="relative grid md:grid-cols-2 gap-0">
        {/* Visual */}
        <div ref={r2} className="reveal hidden md:flex items-center justify-center p-10 order-last md:order-first">
          <div className="relative w-full max-w-sm animate-float" style={{ animationDelay: "0.8s" }}>
            {/* Dashboard mockup */}
            <div className="rounded-2xl bg-gradient-to-b from-emerald-900/20 to-slate-900/40 border border-emerald-500/20 p-5 shadow-[0_0_60px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-400 text-xs font-semibold">Reservatório CASAL — Alagoas</span>
                <span className="badge badge-green text-[10px] py-0.5">Ao vivo</span>
              </div>
              {/* Satellite image placeholder */}
              <div className="relative rounded-xl overflow-hidden mb-4 h-32 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-blue-900/30 border border-white/5">
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 100">
                  {[20,40,60,80,100,120,140,160,180].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#10b981" strokeWidth="0.5" />
                  ))}
                  {[25,50,75].map(y => (
                    <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#10b981" strokeWidth="0.5" />
                  ))}
                  {/* Bloom hotspot */}
                  <ellipse cx="120" cy="45" rx="28" ry="18" fill="#10b981" opacity="0.25" />
                  <ellipse cx="120" cy="45" rx="18" ry="12" fill="#10b981" opacity="0.4" />
                  <ellipse cx="120" cy="45" rx="8" ry="6" fill="#10b981" opacity="0.7" />
                </svg>
                <div className="absolute bottom-2 left-2 text-[9px] text-emerald-300/60 font-mono">
                  Sentinel-3 · 620nm · 12/06 08:40 UTC
                </div>
                <div className="absolute top-2 right-2 bg-red-500/20 border border-red-500/30 rounded px-1.5 py-0.5 text-[9px] text-red-300 font-semibold">
                  ⚠ Floração detectada
                </div>
              </div>
              {/* Alert */}
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-400 text-xs font-bold">⚡ Alerta Preditivo</span>
                  <span className="text-[9px] text-slate-500">há 2 min</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Probabilidade de floração crítica em{" "}
                  <span className="text-emerald-400 font-bold">72h</span>.
                  Concentração de ficocianina 3.2× acima do limiar.
                </p>
              </div>
              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: "Ficocianina", v: "84 µg/L", c: "#10b981" },
                  { k: "Acurácia", v: "94.2%", c: "#06b6d4" },
                  { k: "Antecipação", v: "72h", c: "#8b5cf6" },
                ].map(m => (
                  <div key={m.k} className="glass rounded-lg p-2 text-center border border-white/5">
                    <div className="font-bold text-sm" style={{ color: m.c }}>{m.v}</div>
                    <div className="text-[9px] text-slate-500">{m.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={r1} className="reveal p-10 md:p-14 flex flex-col justify-center">
          <span className="badge badge-green mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TRL 4 · Piloto CASAL
          </span>
          <h3
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="gradient-text-emerald">Monitoramento Preditivo</span>
            <br />
            de Reservatórios
          </h3>
          <p className="text-slate-400 text-base leading-relaxed mb-6">
            Plataforma SaaS que detecta florações de cianobactérias 72 horas antes da crise — usando
            satélites Sentinel-3 e Sentinel-2 e um algoritmo proprietário de Gap Filling que continua
            funcionando mesmo com cobertura de nuvens.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { icon: "🛰️", text: "Sentinel-3 + Sentinel-2 — banda 620nm detecta ficocianina com precisão" },
              { icon: "☁️", text: "Gap Filling proprietário — resolve o maior problema do sensoriamento tropical" },
              { icon: "📊", text: "Dashboard de alertas com ROI de 14x a 50x vs. monitoramento manual" },
              { icon: "⚖️", text: "Conformidade nativa com Resolução ANA 188/2024 (automonitoramento obrigatório)" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-slate-400 text-sm leading-relaxed">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#contato">
              <Button variant="emerald" size="lg">Solicitar demo →</Button>
            </a>
            <a href="#contato">
              <Button variant="ghost" size="lg">Falar com a equipe</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── BPO-AI ── */
function BpoAI() {
  const r1 = useReveal(0);
  const r2 = useReveal(100);

  return (
    <div id="bpoai" className="relative rounded-3xl overflow-hidden border border-violet-500/15 bg-[#08040d]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(139,92,246,0.08),transparent)]" />

      <div className="relative grid md:grid-cols-2 gap-0">
        {/* Text */}
        <div ref={r1} className="reveal p-10 md:p-14 flex flex-col justify-center">
          <span className="badge badge-violet mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Em breve · Fase MVP
          </span>
          <h3
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="gradient-text-violet">BPO-AI</span>
            <br />
            <span className="text-slate-300 text-2xl">Gestão contábil com IA</span>
          </h3>
          <p className="text-slate-400 text-base leading-relaxed mb-6">
            Plataforma para contadores que dá visibilidade total sobre a carteira de clientes —
            enquanto os clientes resolvem emissão de NFS-e, lançamentos e extratos direto pelo
            WhatsApp, sem instalar nada.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { title: "Dashboard do Contador", desc: "Saúde de cada cliente em tempo real" },
              { title: "WhatsApp AI", desc: "Cliente emite nota por texto ou áudio" },
              { title: "Emissão NFS-e", desc: "Integração com certificado A1" },
              { title: "DRE Automático", desc: "Resultado por cliente, mês a mês" },
            ].map((f) => (
              <div key={f.title} className="glass rounded-xl p-4 border border-violet-500/10">
                <div className="text-violet-300 font-semibold text-sm mb-1">{f.title}</div>
                <div className="text-slate-500 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl p-4 border border-violet-500/15">
            <div className="text-slate-400 text-sm italic leading-relaxed">
              "Seu cliente resolve tudo pelo WhatsApp.{" "}
              <span className="text-violet-300 not-italic font-medium">
                Você acompanha a carteira inteira em um painel — e age antes que o problema apareça.
              </span>"
            </div>
          </div>
        </div>

        {/* Visual */}
        <div ref={r2} className="reveal flex items-center justify-center p-8 md:p-12">
          <div className="relative w-full max-w-xs animate-float" style={{ animationDelay: "1.2s" }}>
            <div className="rounded-2xl bg-gradient-to-b from-violet-900/20 to-slate-900/40 border border-violet-500/20 p-5 shadow-[0_0_60px_rgba(139,92,246,0.1)]">
              <div className="text-violet-400 text-xs font-semibold mb-4">Dashboard · Carteira</div>
              {/* Client health list */}
              <div className="space-y-2 mb-4">
                {[
                  { name: "Padaria Silva Ltda", status: "Ativo", color: "#10b981", dot: "#10b981", metric: "R$ 12.400" },
                  { name: "Auto Peças MG", status: "Atenção", color: "#f59e0b", dot: "#f59e0b", metric: "Cert. 12d" },
                  { name: "Studio Hair SP", status: "Ativo", color: "#10b981", dot: "#10b981", metric: "R$ 8.200" },
                  { name: "Mercearia Fonseca", status: "Crítico", color: "#ef4444", dot: "#ef4444", metric: "3 notas ≥" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                      <span className="text-slate-300 text-[11px] font-medium">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-bold" style={{ color: c.color }}>{c.status}</div>
                      <div className="text-[9px] text-slate-500">{c.metric}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* WhatsApp message */}
              <div className="rounded-xl bg-[#075e54]/20 border border-[#25d366]/20 p-3">
                <div className="text-[9px] text-[#25d366] font-semibold mb-1.5">💬 WhatsApp AI</div>
                <div className="bg-[#202c33] rounded-lg rounded-tl-none p-2 text-[10px] text-slate-300 mb-1.5">
                  Preciso emitir nota pra empresa ABC, R$ 1.500, serviço de consultoria
                </div>
                <div className="bg-[#005c4b] rounded-lg rounded-tr-none p-2 text-[10px] text-white ml-6">
                  ✅ NFS-e emitida! Nº 2847 · PDF enviado para seu e-mail.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Produtos section ── */
export default function Produtos() {
  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="produtos" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(15,23,42,0.8),transparent)]" />
      <div className="max-w-7xl mx-auto relative">

        <div ref={headRef} className="reveal text-center mb-16">
          <span className="badge badge-blue mb-4">Nossos Produtos</span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Três problemas reais,
            <br />
            <span className="gradient-text">três plataformas de IA</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Cada produto nasce de uma dor real, validada com quem vive o problema todos os dias.
          </p>
        </div>

        <div className="space-y-8">
          <PalpiteBar />
          <Monitoramento />
          <BpoAI />
        </div>
      </div>
    </section>
  );
}
