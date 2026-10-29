import {useEffect, useRef, useState} from 'react';
import Avaliacao from './Avaliacao';
import {Icon} from './icons';
import {Como, CTA, Exemplos, Inicio, Rotina} from './Secoes';
import './clinicas.css';

function useReveal(raiz: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = raiz.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    el.dataset.motion = 'on';
    const io = new IntersectionObserver(entradas => {
      for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, {rootMargin: '0px 0px -8% 0px'});
    el.querySelectorAll('.rv').forEach(n => io.observe(n));
    // Rede de segurança: nada fica invisível se o observador falhar.
    const t = setTimeout(() => el.querySelectorAll('.rv').forEach(n => n.classList.add('is-in')), 4000);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [raiz]);
}

// A barra fixa do celular aparece depois do botão do topo e some quando o formulário está na tela.
function useBarraFixa() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const topo = document.querySelector('.cl-inicio__acoes');
    const form = document.getElementById('avaliacao');
    if (!topo || !form) return;
    let passouTopo = false, formNaTela = false;
    const atualizar = () => setVisivel(passouTopo && !formNaTela);
    const io = new IntersectionObserver(entradas => {
      for (const e of entradas) {
        if (e.target === topo) passouTopo = !e.isIntersecting && e.boundingClientRect.top < 0;
        else formNaTela = e.isIntersecting;
      }
      atualizar();
    });
    io.observe(topo);
    io.observe(form);
    return () => io.disconnect();
  }, []);
  return visivel;
}

export default function Landing() {
  const raiz = useRef<HTMLDivElement>(null);
  useReveal(raiz);
  const barra = useBarraFixa();

  return <div className="clinicas" ref={raiz}>
    <a className="cl-pular" href="#avaliacao">Pular para o formulário</a>
    <header className="cl-topo">
      <div className="cl-wrap cl-topo__barra">
        <a href="#inicio" className="cl-marca" aria-label="InovaSensor, início">
          <img src="/mentoria-assets/brand/logo-inova.webp" alt="InovaSensor" width={150} height={30} />
        </a>
        <nav className="cl-nav" aria-label="Seções">
          <a href="#exemplos">O que muda</a>
          <a href="#como">Como funciona</a>
        </nav>
        <a className="cl-btn cl-btn--primary cl-btn--sm" href="#avaliacao" data-cta="avaliacao" data-cta-pos="topo">{CTA}</a>
      </div>
    </header>

    <main>
      <Inicio />
      <Rotina />
      <Exemplos />
      <Como />
      <section id="avaliacao" className="cl-sec cl-avaliacao" aria-labelledby="avaliacao-titulo">
        <div className="cl-wrap cl-avaliacao__grid">
          <div className="cl-avaliacao__texto">
            <h2 id="avaliacao-titulo" className="cl-h2">Veja o que dá para tirar das costas da sua recepção</h2>
            <p className="cl-texto">A avaliação é gratuita e leva uns 2 minutos para pedir. Sem compromisso.</p>
            <ol className="cl-depois">
              <li><strong>A gente chama você no WhatsApp</strong> para marcar um horário.</li>
              <li><strong>Mapeamos a rotina da recepção</strong> e mostramos onde a IA entra primeiro.</li>
              <li><strong>Se fizer sentido,</strong> você recebe a proposta mensal para o tamanho da sua clínica.</li>
            </ol>
          </div>
          <Avaliacao />
        </div>
      </section>
    </main>

    <footer className="cl-rodape">
      <div className="cl-wrap cl-rodape__grid">
        <img src="/mentoria-assets/brand/logo-inova.webp" alt="InovaSensor" width={130} height={26} loading="lazy" />
        <p>IA trabalhando na sua clínica. As pessoas mantêm o comando.</p>
        <p className="cl-rodape__pe">© {new Date().getFullYear()} InovaSensor. Parque de Inovação Tecnológica de São José dos Campos. <a href="/privacidade">Política de privacidade</a></p>
      </div>
    </footer>

    <div className={`cl-barra${barra ? ' is-on' : ''}`} aria-hidden={!barra}>
      <a className="cl-btn cl-btn--primary" href="#avaliacao" tabIndex={barra ? 0 : -1} data-cta="avaliacao" data-cta-pos="barra">
        {CTA}<Icon name="seta" size={18} />
      </a>
    </div>
  </div>;
}
