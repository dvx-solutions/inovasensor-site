import { useEffect, useRef, useState } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const WHATSAPP = "5512988028865";

export default function Contato() {
  const headRef = useReveal();
  const formRef = useReveal();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [produto, setProduto] = useState("");

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Olá! Me chamo ${nome}${email ? ` (${email})` : ""}.\n\n` +
      `${produto ? `Interesse em: ${produto}\n\n` : ""}` +
      `${mensagem || "Gostaria de saber mais sobre a inovaSensor."}`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
  };

  const reasons = [
    { emoji: "🌿", label: "Monitoramento de Reservatórios", value: "Monitoramento Preditivo de Algas" },
    { emoji: "🏆", label: "Palpite Bar", value: "Palpite Bar" },
    { emoji: "🤖", label: "BPO-AI (Gestão Contábil + IA)", value: "BPO-AI — Gestão Contábil com WhatsApp AI" },
    { emoji: "🤝", label: "Parceria / Investimento", value: "Parceria ou Investimento" },
  ];

  return (
    <section id="contato" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(59,130,246,0.05),transparent)]" />
      <div className="max-w-7xl mx-auto relative">

        <div ref={headRef} className="reveal text-center mb-16">
          <span className="badge badge-blue mb-4">Contato</span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Vamos construir algo
            <br />
            <span className="gradient-text">extraordinário juntos</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Seja para uma demo, parceria, investimento ou só para entender melhor como podemos
            resolver um problema da sua empresa — a conversa começa aqui.
          </p>
        </div>

        <div ref={formRef} className="reveal grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Form — 3 cols */}
          <form onSubmit={handleWhatsApp} className="md:col-span-3 glass rounded-2xl p-8 border border-white/5 flex flex-col gap-5">
            <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
              Enviar mensagem
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-medium">Nome *</label>
                <input
                  required
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-medium">E-mail *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium">Interesse</label>
              <div className="grid grid-cols-2 gap-2">
                {reasons.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setProduto(prev => prev === r.value ? "" : r.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      produto === r.value
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                        : "bg-white/3 border-white/6 text-slate-400 hover:border-white/12 hover:text-slate-300"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium">Mensagem</label>
              <textarea
                rows={4}
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                placeholder="Me conte mais sobre o que você precisa..."
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366] hover:bg-[#1da554] text-white font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Enviar pelo WhatsApp
            </button>
          </form>

          {/* Info — 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {/* Direct contact */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h4 className="text-white font-semibold text-sm mb-4">Contato direto</h4>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-center text-[#25d366] group-hover:bg-[#25d366]/20 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </span>
                  (12) 9 8802-8865
                </a>
                <a
                  href="mailto:gustavo.henrique@devexsolucoes.com.br"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  gustavo.henrique@devexsolucoes.com.br
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h4 className="text-white font-semibold text-sm mb-3">Localização</h4>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Vale do Paraíba · São Paulo, Brasil
              </div>
            </div>

            {/* Products quick links */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h4 className="text-white font-semibold text-sm mb-4">Nossos produtos</h4>
              <div className="space-y-2.5">
                {[
                  { emoji: "🏆", name: "Palpite Bar", href: "#palpite-bar" },
                  { emoji: "🛰️", name: "Monitoramento de Reservatórios", href: "#monitoramento" },
                  { emoji: "🤖", name: "BPO-AI", href: "#bpoai" },
                ].map(p => (
                  <a
                    key={p.name}
                    href={p.href}
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    <svg className="w-3 h-3 ml-auto text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
