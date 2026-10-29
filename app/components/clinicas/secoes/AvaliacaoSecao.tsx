import {useEffect, useRef, type CSSProperties} from 'react';
import Avaliacao from '../Avaliacao';
import {Icon, type IconName} from '../icons';
import {gsap, reduzido, aoVisivel} from '../motion';
import './avaliacao.css';

const depois: {icone: IconName; tag: string; texto: string}[] = [
  {icone: 'conversa', tag: 'No WhatsApp', texto: 'A gente chama você no WhatsApp para marcar um horário.'},
  {icone: 'agenda', tag: 'Na avaliação', texto: 'Mapeamos a rotina da recepção e mostramos onde a IA entra primeiro.'},
  {icone: 'orcamento', tag: 'A proposta', texto: 'Se fizer sentido, você recebe a proposta mensal para o tamanho da sua clínica.'},
];

export default function AvaliacaoSecao() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Loops de fundo e da linha do tempo só rodam com a seção na tela e a aba visível.
    let parar = () => {};
    let ctx: gsap.Context | undefined;
    let soltar = () => {};
    try {
      parar = aoVisivel(el, v => el.classList.toggle('is-viva', v));
      if (reduzido()) return parar;

      // Sem once:true: um gatilho "já passado" se mata no refresh e derrubava a página ao recarregar no fim.
      ctx = gsap.context(() => {
        const umaVez = (trigger: string, start = 'top 85%') => ({trigger, start, toggleActions: 'play none none none'});
        gsap.from('.s-avaliacao__cab > *', {y: 36, opacity: 0, duration: .8, stagger: .09, ease: 'power3.out', scrollTrigger: umaVez('.s-avaliacao__cab')});
        gsap.from('.s-avaliacao__cartao-form', {y: 70, rotateX: 9, transformOrigin: '50% 0%', transformPerspective: 1400, duration: 1.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: umaVez('.s-avaliacao__palco', 'top 92%')});
        gsap.from('.s-avaliacao__etapa', {x: -28, opacity: 0, duration: .7, stagger: .16, ease: 'power3.out', scrollTrigger: umaVez('.s-avaliacao__linha')});
        gsap.fromTo('.s-avaliacao__fio-luz', {scaleY: 0}, {scaleY: 1, ease: 'none',
          scrollTrigger: {trigger: '.s-avaliacao__trilho', start: 'top 80%', end: 'bottom 65%', scrub: .6}});
      }, el);

      // Profundidade: a placa rosa acompanha o mouse (só desktop com mouse). O cartão do formulário fica parado.
      if (matchMedia('(pointer: fine) and (min-width: 1000px)').matches) {
        const palco = el.querySelector<HTMLElement>('.s-avaliacao__palco');
        const placa = el.querySelector('.s-avaliacao__placa');
        if (palco && placa) {
          gsap.set(placa, {x: 30, y: 30, z: -80, rotationY: -12, rotationX: 6});
          const ry = gsap.quickTo(placa, 'rotationY', {duration: .9, ease: 'power3'});
          const rx = gsap.quickTo(placa, 'rotationX', {duration: .9, ease: 'power3'});
          const mover = (e: PointerEvent) => {
            const r = palco.getBoundingClientRect();
            const px = Math.max(-.5, Math.min(.5, (e.clientX - r.left) / r.width - .5));
            const py = Math.max(-.5, Math.min(.5, (e.clientY - r.top) / r.height - .5));
            ry(-12 + px * 12); rx(6 - py * 8);
          };
          el.addEventListener('pointermove', mover);
          soltar = () => el.removeEventListener('pointermove', mover);
        }
      }
    } catch (erro) {
      // Animação é enfeite: se falhar, a seção fica estática e completa.
      try { ctx?.revert(); } catch { /* ignora */ }
      ctx = undefined;
      console.warn('avaliacao: animação desligada', erro);
    }

    return () => { try { ctx?.revert(); } catch { /* ignora */ } soltar(); parar(); };
  }, []);

  return <section ref={ref} id="avaliacao" className="s-avaliacao" data-tema="escuro" aria-labelledby="avaliacao-titulo">
    <div className="s-avaliacao__costura" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false"><path d="M0 0H1440V36C1180 112 920 120 720 120S260 112 0 36Z" fill="currentColor" /></svg>
    </div>
    <div className="s-avaliacao__fundo" aria-hidden="true">
      <span className="s-avaliacao__bolha s-avaliacao__bolha--1" />
      <span className="s-avaliacao__bolha s-avaliacao__bolha--2" />
      <span className="s-avaliacao__bolha s-avaliacao__bolha--3" />
      <span className="s-avaliacao__pontos" />
    </div>

    <div className="cl-wrap s-avaliacao__grade">
      <header className="s-avaliacao__cab">
        <p className="cl-kicker s-avaliacao__kicker">Avaliação gratuita</p>
        <h2 id="avaliacao-titulo" className="cl-h2 s-avaliacao__titulo">Veja o que dá para tirar <em>das costas da sua recepção</em></h2>
        <p className="cl-lead s-avaliacao__lead">A avaliação é gratuita e leva uns 2 minutos para pedir. Sem compromisso. O valor do serviço mensal só é combinado depois, se fizer sentido para você.</p>
      </header>

      <div className="s-avaliacao__linha">
        <h3 className="s-avaliacao__linha-titulo">Depois que você envia</h3>
        <div className="s-avaliacao__trilho">
          <span className="s-avaliacao__fio" aria-hidden="true"><span className="s-avaliacao__fio-luz" /><span className="s-avaliacao__fio-pulso" /></span>
          <ol className="s-avaliacao__etapas">
            {depois.map((d, i) => <li key={d.tag} className="s-avaliacao__etapa" style={{'--i': i} as CSSProperties}>
              <span className="s-avaliacao__no" aria-hidden="true"><Icon name={d.icone} size={24} /></span>
              <div className="s-avaliacao__etapa-cartao">
                <p className="s-avaliacao__etapa-tag">{d.tag}</p>
                <p className="s-avaliacao__etapa-texto">{d.texto}</p>
              </div>
            </li>)}
          </ol>
        </div>
      </div>
      <div className="s-avaliacao__palco">
        <span className="s-avaliacao__placa" aria-hidden="true" />
        <span className="s-avaliacao__selo s-avaliacao__selo--a" aria-hidden="true"><Icon name="check" size={14} />Sem compromisso</span>
        <div className="s-avaliacao__cartao-form">
          <span className="s-avaliacao__anel" aria-hidden="true" />
          <div className="s-avaliacao__miolo"><Avaliacao /></div>
        </div>
      </div>

    </div>
  </section>;
}
