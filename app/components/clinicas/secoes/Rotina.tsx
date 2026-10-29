import {useEffect, useLayoutEffect, useRef, useState, type CSSProperties} from 'react';
import {Flip} from 'gsap/Flip';
import {gsap, ScrollTrigger, reduzido, aoVisivel} from '../motion';
import {Icon, type IconName} from '../icons';
import './rotina.css';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

// Ícones extras: Phosphor regular (@phosphor-icons/core 2.1.1, licença MIT), copiados como path.
const extras = {
  telefone: 'M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z',
  pessoa: 'M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z',
  planilha: 'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z',
  alerta: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z',
  cuidado: 'M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z',
  relogio: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z',
  brilho: 'M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z',
} as const;
type Extra = keyof typeof extras;
type Ico = IconName | Extra;

function Ic({n, size = 20}: {n: Ico; size?: number}) {
  if (n in extras) return <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d={extras[n as Extra]} /></svg>;
  return <Icon name={n as IconName} size={size} />;
}

type Tarefa = {
  hora: string; ico: Ico; col: 'ela' | 'ia'; i: number;
  caos: [string, string]; ordem: [string, string];
  d: [number, number, number]; // desktop: x%, y%, rotação
  m: [number, number, number]; // celular
  t: [number, number]; // inclinação 3D rx, ry
};

// Um dia fictício. Cada coisa que cai na mesa tem um destino quando a IA está por trás.
const TAREFAS: Tarefa[] = [
  {hora: '08:06', ico: 'telefone', col: 'ela', i: 0, caos: ['Telefone tocando', 'Marcos quer remarcar'], ordem: ['Falar com o paciente', 'Com tempo para ouvir o Marcos.'], d: [1, 5, -7], m: [0, 1, -6], t: [10, -14]},
  {hora: '08:15', ico: 'conversa', col: 'ia', i: 0, caos: ['WhatsApp sem resposta', 'Ana: tem horário amanhã?'], ordem: ['Rascunhos de resposta', 'Preço, convênio, endereço, preparo.'], d: [63, 2, 6], m: [40, 6, 5], t: [-8, 16]},
  {hora: '09:20', ico: 'pessoa', col: 'ela', i: 1, caos: ['Paciente no balcão', 'Clara chegou adiantada'], ordem: ['Acolher no balcão', 'Olho no olho com quem chega.'], d: [6, 31, 4], m: [3, 17, 4], t: [6, 18]},
  {hora: '10:05', ico: 'orcamento', col: 'ia', i: 1, caos: ['Orçamento para montar', 'Anotação do doutor na mesa'], ordem: ['Orçamento pronto', 'A partir da anotação do doutor.'], d: [60, 26, -5], m: [39, 25, -5], t: [12, -10]},
  {hora: '11:30', ico: 'alerta', col: 'ia', i: 2, caos: ['Paciente que faltou', 'Pedro não veio. Cadeira vazia.'], ordem: ['Lista de confirmação', 'Véspera e dia, vaga vai ao encaixe.'], d: [31, 15, -3], m: [16, 36, -3], t: [-12, -8]},
  {hora: '13:10', ico: 'relogio', col: 'ela', i: 2, caos: ['Encaixe pedido', 'Rita pode vir às 15h?'], ordem: ['Decidir encaixes', 'A IA mostra a vaga. Ela escolhe.'], d: [61, 51, 8], m: [40, 46, 7], t: [8, 14]},
  {hora: '14:45', ico: 'agenda', col: 'ia', i: 3, caos: ['Retorno para marcar', 'Bia saiu sem agendar'], ordem: ['Lembretes do pós-consulta', 'Cuidados, retorno e avaliação.'], d: [0, 58, -4], m: [0, 55, -4], t: [-6, -16]},
  {hora: '16:05', ico: 'volta', col: 'ia', i: 4, caos: ['Pacientes sumidos', 'Ninguém teve tempo de olhar'], ordem: ['Lista de sumidos', 'Quem não vem há 6 ou 12 meses.'], d: [35, 45, 5], m: [28, 64, 5], t: [14, 10]},
  {hora: '17:20', ico: 'cuidado', col: 'ela', i: 3, caos: ['Situação delicada', 'Lúcia quer falar da cobrança'], ordem: ['Resolver o que é delicado', 'Conversa difícil é com gente.'], d: [12, 79, -8], m: [2, 76, -7], t: [-10, 12]},
  {hora: '18:10', ico: 'planilha', col: 'ia', i: 5, caos: ['Planilha do fim do dia', 'Fechar o dia na mão'], ordem: ['Resumo da semana', 'Consultas, faltas, orçamentos.'], d: [52, 75, 3], m: [40, 85, 3], t: [8, -12]},
];

const INICIO = 7 * 60 + 58, FIM = 18 * 60 + 40;
const PIN = 1400; // rolagem (px) com o palco preso no desktop
const hhmm = (m: number) => {
  const v = Math.round(m);
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
};
const minutos = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };

const ELA = TAREFAS.filter(t => t.col === 'ela');
const IA = TAREFAS.filter(t => t.col === 'ia');

export default function Rotina() {
  const ref = useRef<HTMLElement>(null);
  const relogio = useRef<HTMLSpanElement>(null);
  const [ia, setIa] = useState(false);
  const [tocou, setTocou] = useState(false);
  const flipEstado = useRef<Flip.FlipState | null>(null);
  const chamadas = useRef<gsap.core.Tween[]>([]);

  // Animações de entrada / pin + scrub.
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const mm = gsap.matchMedia();
    const pararVivo = aoVisivel(raiz, v => raiz.classList.toggle('is-vivo', v));
    const escrever = (m: number) => { if (relogio.current) relogio.current.textContent = hhmm(m); };

    if (reduzido()) {
      escrever(FIM);
      return () => { pararVivo(); mm.revert(); };
    }

    let ctx: gsap.Context | null = null;
    try {
    ctx = gsap.context(() => {
      const quedas = gsap.utils.toArray<HTMLElement>('.rt-c__queda');
      const tempo = {m: INICIO};

      // Desktop: a recepção fica parada na tela e o dia passa conforme a rolagem.
      mm.add('(min-width: 900px)', () => {
        const palco = raiz.querySelector<HTMLElement>('.rt-palco')!;
        const mesa = raiz.querySelector<HTMLElement>('.rt-mesa')!;
        const total = 10;
        tempo.m = INICIO;
        // O pin segura o palco; o dia começa a correr antes, quando a seção ainda está entrando.
        // As duas pontas usam o mesmo palco como referência (sem depender de outro gatilho).
        ScrollTrigger.create({trigger: palco, start: 'top top+=68', end: `+=${PIN}`, pin: true, anticipatePin: 1});
        const tl = gsap.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: palco, start: 'top 70%', end: `top top-=${PIN - 68}`, scrub: 0.6, invalidateOnRefresh: true,
            onUpdate: s => raiz.classList.toggle('is-fim', s.progress > 0.92),
          },
        });
        tl.to(tempo, {m: FIM, duration: total, onUpdate: () => escrever(tempo.m)}, 0);
        tl.fromTo('.rt-dia__barra', {scaleX: 0}, {scaleX: 1, duration: total}, 0);
        tl.fromTo('.rt-foto__estresse', {opacity: 0}, {opacity: 1, duration: total}, 0);
        quedas.forEach((q, k) => {
          const p = (minutos(TAREFAS[k].hora) - INICIO) / (FIM - INICIO) * total;
          tl.fromTo(q,
            {y: () => -window.innerHeight * 0.9, rotation: k % 2 ? 22 : -24, opacity: 0},
            {y: 0, rotation: 0, opacity: 1, duration: 0.7, ease: 'power2.in', immediateRender: true},
            Math.max(0, p - 0.75));
        });
        tl.to({}, {duration: 0.6});
        escrever(INICIO);

        // Mouse inclina as camadas (cartões mais perto mexem mais).
        const xTo = gsap.quickTo(mesa, '--mx', {duration: 0.7, ease: 'power3'});
        const yTo = gsap.quickTo(mesa, '--my', {duration: 0.7, ease: 'power3'});
        const mover = (e: PointerEvent) => {
          const r = mesa.getBoundingClientRect();
          xTo(gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width - 0.5) * 2));
          yTo(gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        };
        const sair = () => { xTo(0); yTo(0); };
        mesa.addEventListener('pointermove', mover);
        mesa.addEventListener('pointerleave', sair);
        return () => { mesa.removeEventListener('pointermove', mover); mesa.removeEventListener('pointerleave', sair); };
      });

      // Celular: sem pin. O dia passa rápido quando a mesa entra na tela.
      mm.add('(max-width: 899.98px)', () => {
        tempo.m = INICIO;
        escrever(INICIO);
        const tl = gsap.timeline({scrollTrigger: {trigger: '.rt-mesa', start: 'top 85%', toggleActions: 'play none none none'}});
        tl.to(tempo, {m: FIM, duration: 3, ease: 'none', onUpdate: () => escrever(tempo.m)}, 0);
        tl.fromTo('.rt-dia__barra', {scaleX: 0}, {scaleX: 1, duration: 3, ease: 'none'}, 0);
        tl.fromTo('.rt-foto__estresse', {opacity: 0}, {opacity: 1, duration: 3, ease: 'none'}, 0);
        tl.fromTo(quedas, {y: -320, rotation: (k: number) => (k % 2 ? 18 : -18), opacity: 0},
          {y: 0, rotation: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.27}, 0.1);
      });
    }, raiz);
    } catch (e) {
      // Animação nunca derruba a página: limpa o que deu e deixa o estado estático legível.
      console.warn('rotina: animação desligada', e);
      try { mm.revert(); ctx?.revert(); } catch { /* nada */ }
      escrever(FIM);
    }

    // Fotos mudam a altura: recalcula os gatilhos quando carregam.
    const imgs = Array.from(raiz.querySelectorAll('img'));
    const refrescar = () => { try { ScrollTrigger.refresh(); } catch { /* nada */ } };
    imgs.forEach(i => { if (!i.complete) i.addEventListener('load', refrescar, {once: true}); });

    return () => {
      imgs.forEach(i => i.removeEventListener('load', refrescar));
      try { pararVivo(); mm.revert(); ctx?.revert(); chamadas.current.forEach(c => c.kill()); } catch { /* nada */ }
    };
  }, []);

  // Liga/desliga a IA: guarda as posições, troca o layout e anima (FLIP).
  function alternar() {
    setTocou(true);
    const raiz = ref.current;
    try {
      if (raiz && !reduzido()) flipEstado.current = Flip.getState(raiz.querySelectorAll('.rt-c, .rt-foto'), {props: 'borderRadius'});
    } catch { flipEstado.current = null; }
    setIa(v => !v);
  }

  useLayoutEffect(() => {
    const raiz = ref.current, estado = flipEstado.current;
    if (!raiz || !estado) return;
    flipEstado.current = null;
    try {
    chamadas.current.forEach(c => c.kill());
    chamadas.current = [];
    const celularAgora = !matchMedia('(min-width: 900px)').matches;
    Flip.from(estado, {
      duration: 0.9, ease: 'power3.inOut', absolute: true,
      stagger: {each: 0.03, from: 'end'},
      onComplete: () => { if (celularAgora) { try { ScrollTrigger.refresh(); } catch { /* nada */ } } },
    });
    gsap.fromTo(raiz.querySelectorAll(ia ? '.rt-c__ordem' : '.rt-c__caos'), {opacity: 0}, {opacity: 1, duration: 0.4, delay: 0.45, clearProps: 'opacity'});
    if (ia) {
      raiz.querySelectorAll<HTMLElement>('.rt-chip').forEach((c, k) => {
        c.dataset.estado = 'preparando';
        chamadas.current.push(gsap.delayedCall(1 + k * 0.32, () => { c.dataset.estado = 'pronto'; }));
      });
    }
    } catch (e) { console.warn('rotina: troca sem animação', e); }
  }, [ia]);

  const estilo = (t: Tarefa, k: number) => ({
    '--x': `${t.d[0]}%`, '--y': `${t.d[1]}%`, '--r': `${t.d[2]}deg`,
    '--xm': `${t.m[0]}%`, '--ym': `${t.m[1]}%`, '--rm': `${t.m[2]}deg`,
    '--rx': `${t.t[0]}deg`, '--ry': `${t.t[1]}deg`, '--d': 6 + (k % 4) * 4, '--z': k + 3,
    '--gd': t.i + 2, '--gm': t.col === 'ela' ? t.i + 2 : t.i + 7, '--col': t.col === 'ela' ? 1 : 2,
  }) as CSSProperties;

  return <section id="rotina" ref={ref} className={`s-rotina${ia ? ' is-ia' : ''}${tocou ? ' is-tocou' : ''}`} data-tema="claro" aria-labelledby="rotina-titulo">
    <div className="rt-costura" aria-hidden="true" />

    <div className="rt-palco cl-wrap">
      <div className="rt-texto">
        <div className="rt-cabeca">
          <h2 id="rotina-titulo" className="cl-h2 rt-titulo">Uma recepcionista. <em>Dez funções.</em></h2>
          <p className="cl-lead rt-lead">Telefone, WhatsApp, balcão, orçamento, planilha. Tudo cai na mesma mesa, o dia inteiro. Ligue a IA por trás e veja o que muda.</p>
        </div>

        <div className="rt-relogio" aria-hidden="true">
          <div className="rt-relogio__linha">
            <span className="rt-relogio__ico"><Ic n="relogio" size={16} /></span>
            <span>Recepção · hoje</span>
          </div>
          <span className="rt-relogio__hora" ref={relogio}>{hhmm(FIM)}</span>
          <div className="rt-dia">
            <span className="rt-dia__barra" />
            {TAREFAS.map(t => <span key={t.hora} className="rt-dia__marca" style={{left: `${(minutos(t.hora) - INICIO) / (FIM - INICIO) * 100}%`}} />)}
          </div>
        </div>

        <div className="rt-controle">
          <button type="button" role="switch" aria-checked={ia} className="rt-chave" onClick={alternar}>
            <span className="cl-sr">Com IA por trás</span>
            <span className="rt-chave__polegar" aria-hidden="true" />
            <span className="rt-chave__lado rt-chave__lado--sem" aria-hidden="true">Sem IA</span>
            <span className="rt-chave__lado rt-chave__lado--com" aria-hidden="true"><Ic n="brilho" size={18} />Com IA por trás</span>
          </button>
          <p className="rt-dica" aria-hidden="true">{ia ? 'Ela no comando. A IA deixou pronto.' : <>
            <span className="rt-dica__m">Toque e ligue a IA por trás</span>
            <span className="rt-dica__d">Ligue a IA por trás</span>
            <span className="rt-dica__f">Agora ligue a IA por trás</span>
          </>}</p>
          <p className="cl-sr" aria-live="polite">{ia
            ? 'Com IA por trás. Continua com ela: falar com o paciente, acolher no balcão, decidir encaixes, resolver o que é delicado. A IA prepara: rascunhos de resposta, lista de confirmação, orçamento pronto a partir da anotação do doutor, lembretes do pós-consulta, lista de sumidos, resumo da semana. Ela revisa e envia.'
            : 'Sem IA. Tudo cai em cima dela.'}</p>
        </div>
      </div>

      <div className="rt-mesa-area">
        <span className="cl-demo-rotulo rt-rotulo" aria-hidden="true">Demonstração · dados fictícios</span>
        <div className="rt-mesa" aria-hidden="true">
          <div className="rt-fundo rt-fundo--ela" />
          <div className="rt-fundo rt-fundo--ia"><span className="rt-fundo__luz" /></div>
          <div className="rt-cab rt-cab--ela"><strong>Continua com ela</strong><span>Júlia, na recepção</span></div>
          <div className="rt-cab rt-cab--ia"><span className="rt-nucleo"><Ic n="brilho" size={18} /></span><strong>A IA prepara</strong><span>Ela revisa e envia</span></div>

          <figure className="rt-foto">
            <img src="/clinicas-assets/recepcao-560.webp" srcSet="/clinicas-assets/recepcao-560.webp 560w, /clinicas-assets/recepcao-896.webp 896w"
              sizes="(min-width: 900px) 340px, 64vw" width={560} height={700} alt="" loading="lazy" decoding="async" />
            <span className="rt-foto__estresse" />
            <span className="rt-foto__nome">Júlia · recepção</span>
          </figure>

          {TAREFAS.map((t, k) => <div key={t.hora} className="rt-c" data-col={t.col} style={estilo(t, k)}>
            <div className="rt-c__queda">
              <div className="rt-c__face">
                <div className="rt-c__caos">
                  <span className={`rt-c__ico rt-c__ico--${t.ico}`}><Ic n={t.ico} size={18} /></span>
                  <span className="rt-c__txt">
                    <span className="rt-c__hora">{t.hora}</span>
                    <strong>{t.caos[0]}</strong>
                    <span>{t.caos[1]}</span>
                  </span>
                  <span className="rt-c__ponto" />
                </div>
                <div className="rt-c__ordem">
                  <span className="rt-c__ico"><Ic n={t.ico} size={16} /></span>
                  <span className="rt-c__txt">
                    <strong>{t.ordem[0]}</strong>
                    <span>{t.ordem[1]}</span>
                  </span>
                  {t.col === 'ia' && <span className="rt-chip" data-estado="pronto">
                    <span className="rt-chip__prep"><span className="rt-giro" /></span>
                    <span className="rt-chip__ok"><Icon name="check" size={14} /></span>
                  </span>}
                </div>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div>

    <ul className="cl-sr">
      <li>Sem IA, tudo cai em cima da recepcionista: {TAREFAS.map(t => `${t.hora} ${t.caos[0].toLowerCase()} (${t.caos[1]})`).join('; ')}.</li>
      <li>Com IA por trás, continua com ela: {ELA.map(t => t.ordem[0].toLowerCase()).join(', ')}.</li>
      <li>A IA prepara, e ela revisa e envia: {IA.map(t => t.ordem[0].toLowerCase()).join(', ')}.</li>
    </ul>

    <div className="rt-fecho cl-wrap">
      <p className="rt-fecho__frase"><span>Não é robô falando com paciente.</span> <em>É a IA preparando o trabalho para a sua equipe.</em></p>
    </div>
    <div className="rt-costura-fim" aria-hidden="true" />
  </section>;
}
