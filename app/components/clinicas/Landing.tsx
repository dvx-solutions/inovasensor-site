import {useEffect, useState} from 'react';
import './base.css';
import {CTA} from './cta';
import {Icon} from './icons';
import {ScrollTrigger} from './motion';
import Inicio from './secoes/Inicio';
import Rotina from './secoes/Rotina';
import Exemplos from './secoes/Exemplos';
import Como from './secoes/Como';
import AvaliacaoSecao from './secoes/AvaliacaoSecao';

function useTopoRolado() {
  const [rolado, setRolado] = useState(false);
  useEffect(() => {
    const f = () => setRolado(window.scrollY > 24);
    f();
    addEventListener('scroll', f, {passive: true});
    return () => removeEventListener('scroll', f);
  }, []);
  return rolado;
}

// A barra fixa do celular aparece depois do botão do hero e some quando o formulário está na tela.
function useBarraFixa() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const topo = document.querySelector('[data-cta-pos="hero"]');
    const form = document.getElementById('avaliacao');
    if (!topo || !form) return;
    let passouTopo = false, formNaTela = false;
    const io = new IntersectionObserver(entradas => {
      for (const e of entradas) {
        if (e.target === topo) passouTopo = !e.isIntersecting && e.boundingClientRect.top < 0;
        else formNaTela = e.isIntersecting;
      }
      setVisivel(passouTopo && !formNaTela);
    });
    io.observe(topo);
    io.observe(form);
    return () => io.disconnect();
  }, []);
  return visivel;
}

// Quem abre direto em /#avaliacao: o pin da seção 02 muda a altura da página depois do salto do
// navegador, então refaz o salto quando tudo carregou.
function useSaltoDoHash() {
  useEffect(() => {
    const alvo = location.hash && document.getElementById(location.hash.slice(1));
    if (!alvo) return;
    const saltar = () => { try { ScrollTrigger.refresh(); alvo.scrollIntoView({block: 'start'}); } catch { /* sem animação, sem problema */ } };
    if (document.readyState === 'complete') { const t = setTimeout(saltar, 300); return () => clearTimeout(t); }
    addEventListener('load', saltar, {once: true});
    return () => removeEventListener('load', saltar);
  }, []);
}

export default function Landing() {
  const rolado = useTopoRolado();
  const barra = useBarraFixa();
  useSaltoDoHash();

  return <div className="clinicas">
    <a className="cl-pular" href="#avaliacao">Pular para o formulário</a>
    <header className={`cl-topo${rolado ? ' is-rolado' : ''}`}>
      <div className="cl-wrap cl-topo__barra">
        <a href="#inicio" className="cl-marca" aria-label="InovaSensor, início">
          <img src="/mentoria-assets/brand/logo-inova.webp" alt="InovaSensor" width={150} height={30} />
        </a>
        <nav className="cl-nav" aria-label="Seções">
          <a href="#rotina">A recepção</a>
          <a href="#exemplos">O que muda</a>
          <a href="#como">Como funciona</a>
        </nav>
        <a className="cl-btn cl-btn--sm" href="#avaliacao" data-cta="avaliacao" data-cta-pos="topo">{CTA}</a>
      </div>
    </header>

    <main>
      <Inicio />
      <Rotina />
      <Exemplos />
      <Como />
      <AvaliacaoSecao />
    </main>

    <footer className="cl-rodape">
      <div className="cl-wrap cl-rodape__grid">
        <img src="/mentoria-assets/brand/logo-inova.webp" alt="InovaSensor" width={130} height={26} loading="lazy" />
        <p>IA trabalhando na sua clínica. As pessoas mantêm o comando.</p>
        <p>© {new Date().getFullYear()} InovaSensor. Parque de Inovação Tecnológica de São José dos Campos. <a href="/privacidade">Política de privacidade</a></p>
      </div>
    </footer>

    <div className={`cl-barra${barra ? ' is-on' : ''}`} aria-hidden={!barra}>
      <a className="cl-btn" href="#avaliacao" tabIndex={barra ? 0 : -1} data-cta="avaliacao" data-cta-pos="barra">
        {CTA}<Icon name="seta" size={18} />
      </a>
    </div>
  </div>;
}
