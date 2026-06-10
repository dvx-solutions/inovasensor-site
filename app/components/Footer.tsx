export default function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="inovaSensor" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Strategic Consulting & Predictive AI. Transformando dados em decisões que importam.
            </p>
          </div>

          {/* Produtos */}
          <div>
            <h5 className="text-white text-sm font-semibold mb-4">Produtos</h5>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><a href="#palpite-bar" className="hover:text-slate-300 transition-colors">Palpite Bar</a></li>
              <li><a href="#monitoramento" className="hover:text-slate-300 transition-colors">Monitoramento de Reservatórios</a></li>
              <li><a href="#bpoai" className="hover:text-slate-300 transition-colors">BPO-AI</a></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h5 className="text-white text-sm font-semibold mb-4">Empresa</h5>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><a href="#sobre" className="hover:text-slate-300 transition-colors">Sobre nós</a></li>
              <li><a href="#equipe" className="hover:text-slate-300 transition-colors">Equipe</a></li>
              <li><a href="#contato" className="hover:text-slate-300 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Stores */}
          <div>
            <h5 className="text-white text-sm font-semibold mb-4">Palpite Bar</h5>
            <div className="flex flex-col gap-2">
              <a
                href="https://apps.apple.com/br/app/palpitebar/id6744611194"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/6 text-slate-400 hover:text-white hover:border-white/12 transition-all text-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.inovasensor.palpitebar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/6 text-slate-400 hover:text-white hover:border-white/12 transition-all text-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.83 1-.97 1.4-.43l16.21 8.5c.37.2.37.73 0 .93L4.4 20.93C4 21.47 3 21.33 3 20.5z" />
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {year} inovaSensor. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-xs">
            Vale do Paraíba · São Paulo · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
