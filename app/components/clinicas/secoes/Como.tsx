import {useEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {gsap, ScrollTrigger, reduzido, aoVisivel} from '../motion';
import {Icon} from '../icons';
import {CTA} from '../cta';
import './como.css';

// Phosphor MapPin (regular, MIT), só nesta seção.
const PIN = 'M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z';

const iv = (i: number) => ({'--i': i} as CSSProperties);

// O time, em leque 3D: tocar numa foto traz essa pessoa para a frente.
const TIME = [
  {id: 'gustavo', nome: 'Gustavo Bilonia'},
  {id: 'guilherme', nome: 'Guilherme Bilonia'},
  {id: 'marcelo', nome: 'Marcelo Bilonia'},
  {id: 'vinicius', nome: 'Vinícius Oliveira'},
];

function VisMapa() {
  const linhas: [string, boolean][] = [
    ['Confirmar a agenda de amanhã', true],
    ['Responder preço e convênio', true],
    ['Receber quem chega no balcão', false],
    ['Montar e cobrar orçamento', true],
  ];
  return <div className="s-como__vis s-como__vis--mapa" aria-hidden="true">
    <div className="s-como__vis-topo"><span>Rotina da recepção</span><span>mapa</span></div>
    <ul>
      {linhas.map(([t, rep], i) => <li key={t} className={rep ? 'is-rep' : 'is-fica'} style={iv(i)}>
        <span className="s-como__marca" />
        <span className="s-como__lt">{t}</span>
        <span className="s-como__tag">{rep ? 'repete todo dia' : 'fica com a pessoa'}</span>
      </li>)}
    </ul>
  </div>;
}

function VisAplicar() {
  const linhas: [string, string, string][] = [
    ['Confirmação da agenda', 'rodando', 'on'],
    ['Respostas prontas', 'entrando', 'meio'],
    ['Orçamentos', 'depois', 'off'],
  ];
  return <div className="s-como__vis s-como__vis--aplicar" aria-hidden="true">
    <div className="s-como__vis-topo"><span>Um de cada vez</span><span>IA</span></div>
    <ul>
      {linhas.map(([t, est, k], i) => <li key={t} className={`is-${k}`} style={iv(i)}>
        <span className="s-como__lt">{t}</span>
        <span className="s-como__est">{est}</span>
        <span className="s-como__chave"><span /></span>
      </li>)}
    </ul>
  </div>;
}

function VisCapacitar() {
  return <div className="s-como__vis s-como__vis--cap" aria-hidden="true">
    <div className="s-como__vis-topo"><span>Na rotina do time</span><span>treino</span></div>
    <div className="s-como__bolha"><b>A IA preparou</b>Lembrete do retorno, pronto para enviar.</div>
    <div className="s-como__acoes">
      <span className="s-como__b2">Revisar</span>
      <span className="s-como__b1">Aprovar</span>
    </div>
    <div className="s-como__ok"><Icon name="check" size={14} /> Aprovado pela recepção</div>
  </div>;
}

const PASSOS = [
  {n: '01', titulo: 'Mapear a operação', texto: 'A gente acompanha a rotina da recepção e lista onde o tempo some: o que se repete todo dia, o que trava, o que sempre fica para depois.', lado: 'e', Vis: VisMapa},
  {n: '02', titulo: 'Aplicar IA nos processos', texto: 'A IA entra nos processos repetitivos, um de cada vez. Começa pelo que mais pesa na recepção, e o próximo só entra quando esse estiver rodando.', lado: 'd', Vis: VisAplicar},
  {n: '03', titulo: 'Capacitar o time na rotina', texto: 'A gente treina o time para usar no dia a dia, dentro da rotina da clínica. A IA prepara; a pessoa revisa e aprova.', lado: 'e', Vis: VisCapacitar},
] as const;

const NAO = [
  {risco: 'Trocar a sua equipe', diz: 'A recepção continua com as pessoas de sempre. A IA tira o repetitivo das costas delas.'},
  {risco: 'Colocar robô falando com paciente', diz: 'Quem fala com o paciente é a sua equipe. A IA só deixa a mensagem pronta para ela enviar.'},
  {risco: 'Pedir dados de pacientes', diz: 'Para mapear a operação, a gente olha o processo. Não pedimos a ficha de ninguém.'},
  {risco: 'Amarrar você a um sistema novo', diz: 'Ninguém precisa trocar de sistema para começar. A gente parte da rotina que vocês já têm.'},
];

export default function Como() {
  const ref = useRef<HTMLElement>(null);
  const [frente, setFrente] = useState(0);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    try {
    const red = reduzido();
    const limpar: (() => void)[] = [];
    const trilha = raiz.querySelector<HTMLElement>('.s-como__trilha')!;
    const svg = trilha.querySelector<SVGSVGElement>('.s-como__svg')!;
    const guia = svg.querySelector<SVGPathElement>('.s-como__guia')!;
    const linha = svg.querySelector<SVGPathElement>('.s-como__linha')!;
    const cometa = svg.querySelector<SVGCircleElement>('.s-como__cometa')!;
    const passos = Array.from(trilha.querySelectorAll<HTMLElement>('.s-como__passo'));
    const laco = trilha.querySelector<HTMLElement>('.s-como__laco')!;
    let total = 1;
    let marcos: number[] = [];
    let prog = red ? 1 : 0;

    const centro = (el: Element, base: DOMRect) => {
      const r = el.getBoundingClientRect();
      return {x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top, r: r.width / 2};
    };

    const aplicar = () => {
      const feito = prog * total;
      linha.style.strokeDashoffset = String(total - feito);
      passos.forEach((p, i) => p.classList.toggle('is-on', feito >= marcos[i] - 2));
      laco.classList.toggle('is-on', prog > 0.985);
      if (!red && total > 1) {
        const pt = linha.getPointAtLength(Math.max(0.01, Math.min(feito, total - 0.01)));
        cometa.setAttribute('cx', pt.x.toFixed(1));
        cometa.setAttribute('cy', pt.y.toFixed(1));
        cometa.style.opacity = prog > 0.002 && prog < 0.999 ? '1' : '0';
      }
    };

    // Monta a trilha a partir da posição real dos cartões (muda com o layout).
    const montar = () => {
      const base = trilha.getBoundingClientRect();
      if (!base.width) return;
      svg.setAttribute('viewBox', `0 0 ${base.width.toFixed(0)} ${base.height.toFixed(0)}`);
      const pts = passos.map(p => centro(p.querySelector('.s-como__ponto')!, base));
      const anel = centro(laco.querySelector('.s-como__anel')!, base);
      const R = anel.r + 12;
      const f = (n: number) => n.toFixed(1);
      const inicio = `M${f(pts[0].x)},0`;
      const partes: string[] = [];
      let prev = {x: pts[0].x, y: 0};
      for (const q of pts) {
        const dy = (q.y - prev.y) * 0.55;
        partes.push(`C${f(prev.x)},${f(prev.y + dy)} ${f(q.x)},${f(q.y - dy)} ${f(q.x)},${f(q.y)}`);
        prev = q;
      }
      const topo = {x: anel.x, y: anel.y - R};
      const dyf = (topo.y - prev.y) * 0.7;
      partes.push(`C${f(prev.x)},${f(prev.y + dyf)} ${f(topo.x - R * 1.3)},${f(topo.y)} ${f(topo.x)},${f(topo.y)}`);
      // mede o comprimento até cada cartão
      marcos = [];
      let parcial = inicio;
      for (let i = 0; i < pts.length; i++) {
        parcial += partes[i];
        linha.setAttribute('d', parcial);
        marcos.push(linha.getTotalLength());
      }
      const d = parcial + partes[pts.length] +
        `A${f(R)},${f(R)} 0 1 1 ${f(topo.x)},${f(anel.y + R)}` +
        `A${f(R)},${f(R)} 0 1 1 ${f(topo.x - 0.5)},${f(topo.y)}`;
      linha.setAttribute('d', d);
      guia.setAttribute('d', d);
      total = linha.getTotalLength();
      linha.style.strokeDasharray = `${total} ${total}`;
      raiz.classList.add('is-trilha');
      aplicar();
    };

    const ctx = gsap.context(() => {
      montar();
      if (red) return;
      raiz.classList.add('is-js');

      const estado = {p: 0};
      gsap.to(estado, {
        p: 1, ease: 'none',
        scrollTrigger: {trigger: trilha, start: 'top 72%', end: 'bottom 72%', scrub: 0.7},
        onUpdate: () => { prog = estado.p; aplicar(); },
      });

      // cartões sobem inclinados ao entrar; número grande em parallax
      passos.forEach(p => {
        gsap.from(p.querySelector('.s-como__face'), {y: 90, rotationX: 16, opacity: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: {trigger: p, start: 'top 88%', toggleActions: 'play none none none'}});
        gsap.fromTo(p.querySelector('.s-como__num'), {yPercent: 18}, {yPercent: -22, ease: 'none',
          scrollTrigger: {trigger: p, start: 'top bottom', end: 'bottom top', scrub: true}});
      });

      gsap.from(raiz.querySelectorAll('.s-como__cab > *'), {y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {trigger: raiz.querySelector('.s-como__cab'), start: 'top 85%', toggleActions: 'play none none none'}});

      const preco = raiz.querySelector('.s-como__preco-in');
      gsap.from(preco, {y: 60, rotation: -2.5, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {trigger: preco, start: 'top 90%', toggleActions: 'play none none none'}});

      // confiança: rota agência -> clínica e camadas da foto em parallax
      const rota = raiz.querySelector<SVGPathElement>('.s-como__rota-linha');
      if (rota) {
        const L = rota.getTotalLength();
        gsap.fromTo(rota, {strokeDasharray: `${L} ${L}`, strokeDashoffset: L}, {strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
          scrollTrigger: {trigger: raiz.querySelector('.s-como__rota'), start: 'top 90%', toggleActions: 'play none none none'}});
      }
      const fotos = raiz.querySelector('.s-como__fotos');
      gsap.fromTo(raiz.querySelector('.s-como__time'), {y: 40}, {y: -30, ease: 'none',
        scrollTrigger: {trigger: fotos, start: 'top bottom', end: 'bottom top', scrub: true}});
      gsap.from(raiz.querySelectorAll('.s-como__frase > *'), {y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: {trigger: raiz.querySelector('.s-como__frase'), start: 'top 88%', toggleActions: 'play none none none'}});

      // "não faz": cada frase é riscada em sequência
      raiz.querySelectorAll('.s-como__nao li').forEach(li => {
        const tl = gsap.timeline({scrollTrigger: {trigger: li, start: 'top 86%', toggleActions: 'play none none none'}});
        tl.from(li.querySelector('.s-como__xis'), {scale: 0, rotation: -90, duration: 0.5, ease: 'back.out(2)'})
          .from(li.querySelector('.s-como__risco'), {backgroundSize: '0% 5px', duration: 0.7, ease: 'power2.inOut'}, '-=0.15')
          .from(li.querySelector('.s-como__diz'), {y: 16, opacity: 0, duration: 0.5, ease: 'power2.out'}, '-=0.2');
      });

      // inclinação 3D com o mouse (só desktop com mouse)
      if (matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches) {
        raiz.querySelectorAll<HTMLElement>('[data-inclina]').forEach(el => {
          const alvo = el.querySelector<HTMLElement>('[data-inclina-alvo]') ?? el;
          const qx = gsap.quickTo(alvo, 'rotationY', {duration: 0.6, ease: 'power3.out'});
          const qy = gsap.quickTo(alvo, 'rotationX', {duration: 0.6, ease: 'power3.out'});
          const forca = Number(el.dataset.inclina) || 8;
          const mover = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
            qx(x * forca); qy(-y * forca * 0.8);
            alvo.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
            alvo.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
          };
          const sair = () => { qx(0); qy(0); };
          el.addEventListener('pointermove', mover);
          el.addEventListener('pointerleave', sair);
          limpar.push(() => { el.removeEventListener('pointermove', mover); el.removeEventListener('pointerleave', sair); });
        });
      }
    }, raiz);

    // refaz a trilha quando o layout muda (fontes, resize, imagens)
    let raf = 0;
    let primeira = true;
    const ro = new ResizeObserver(() => {
      if (primeira) { primeira = false; return; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { montar(); ScrollTrigger.refresh(); });
    });
    ro.observe(trilha);
    limpar.push(() => { ro.disconnect(); cancelAnimationFrame(raf); });

    // o laço só gira com ele na tela
    limpar.push(aoVisivel(laco, v => raiz.classList.toggle('is-visivel', v)));

    return () => {
      try {
        limpar.forEach(fn => fn());
        ctx.revert();
      } catch { /* nada a desfazer */ }
      raiz.classList.remove('is-js', 'is-trilha', 'is-visivel');
    };
    } catch (erro) {
      // animação nunca derruba a página: o HTML já está completo
      console.warn('[como] animação desligada', erro);
      raiz.classList.remove('is-js');
    }
  }, []);

  return <section ref={ref} id="como" className="s-como" data-tema="claro" aria-labelledby="como-titulo">
    <div className="s-como__fundo" aria-hidden="true" />
    <div className="cl-wrap">
      <header className="s-como__cab">
        <p className="cl-kicker">Como funciona</p>
        <h2 id="como-titulo" className="cl-h2">Três passos.<br /><span>Um de cada vez.</span></h2>
        <p className="cl-lead">Nada muda de uma vez. A gente entra na rotina da clínica, coloca a IA onde ela tira trabalho e fica junto todo mês.</p>
      </header>

      <div className="s-como__trilha">
        <svg className="s-como__svg" aria-hidden="true" focusable="false" preserveAspectRatio="none">
          <defs>
            <linearGradient id="como-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d4145a" />
              <stop offset=".6" stopColor="#ff2d78" />
              <stop offset="1" stopColor="#ff8a5c" />
            </linearGradient>
          </defs>
          <path className="s-como__guia" d="M0,0" />
          <path className="s-como__linha" d="M0,0" stroke="url(#como-grad)" />
          <circle className="s-como__cometa" r="7" cx="-20" cy="-20" />
        </svg>

        <ol className="s-como__passos">
          {PASSOS.map(({n, titulo, texto, lado, Vis}) => <li key={n} className={`s-como__passo s-como__passo--${lado} s-como__passo--${n}`} data-inclina="9">
            <span className="s-como__ponto" aria-hidden="true" />
            <article className="s-como__face" data-inclina-alvo>
              <span className="s-como__num" data-n={n} aria-hidden="true">{n}</span>
              <div className="s-como__corpo">
                <h3>{titulo}</h3>
                <p className="s-como__txt">{texto}</p>
              </div>
              <Vis />
              <span className="s-como__brilho" aria-hidden="true" />
            </article>
          </li>)}
        </ol>

        <div className="s-como__laco">
          <div className="s-como__anel" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="s-como__giro">
              <circle cx="100" cy="100" r="84" />
              <path d="M175 109 L184 98 L193 109" />
              <path d="M7 91 L16 102 L25 91" />
            </svg>
            <span className="s-como__mes">Todo<br />mês</span>
          </div>
          <div className="s-como__laco-txt">
            <h3>Todo mês a gente acompanha e ajusta.</h3>
            <p>O que funcionou fica. O que travou, a gente muda. E o time aprende junto, sem largar a recepção.</p>
          </div>
        </div>
      </div>

      <div className="s-como__preco" data-inclina="4">
        <div className="s-como__preco-in" data-inclina-alvo>
          <div className="s-como__preco-a">
            <p className="s-como__preco-big">Serviço<br />mensal.</p>
          </div>
          <div className="s-como__preco-b">
            <p>O valor é combinado depois da avaliação, conforme o tamanho da operação. <strong>Você só decide depois de ver onde a IA entra na sua clínica.</strong></p>
            <a className="cl-btn" href="#avaliacao" data-cta="avaliacao" data-cta-pos="como-preco">{CTA}<Icon name="seta" size={20} /></a>
          </div>
        </div>
      </div>

      <div className="s-como__conf">
        <div className="s-como__frase">
          <p className="cl-kicker">Por que confiar</p>
          <p className="s-como__frase-big">O mesmo método já roda no dia a dia de agências de viagem que atendemos. <span>Agora levamos para clínicas.</span></p>
          <div className="s-como__rota" aria-hidden="true">
            <span className="s-como__chip">Agências de viagem</span>
            <svg viewBox="0 0 160 40" preserveAspectRatio="none"><path className="s-como__rota-linha" d="M4 30 C 50 -6, 110 -6, 154 24" /><path className="s-como__rota-ponta" d="M143 17 L155 25 L141 30" /></svg>
            <span className="s-como__rota-seta"><Icon name="seta" size={18} /></span>
            <span className="s-como__chip s-como__chip--on">Clínicas</span>
          </div>
        </div>

        <figure className="s-como__fotos" data-inclina="7">
          <div className="s-como__fotos-in" data-inclina-alvo>
            <div className="s-como__time" role="group" aria-label="O time da InovaSensor">
              {TIME.map((p, i) => <button key={p.id} type="button" className="s-como__carta" data-pos={(i - frente + TIME.length) % TIME.length}
                aria-pressed={i === frente} aria-label={`Mostrar ${p.nome} na frente`} onClick={() => setFrente(i)}>
                <img src={`/clinicas-assets/time/${p.id}.webp`} alt="" width={400} height={500} loading="lazy" decoding="async" />
                <span className="s-como__foto-nome">{p.nome}</span>
              </button>)}
            </div>
          </div>
          <figcaption className="s-como__quem">
            <strong>O time da InovaSensor</strong>
            <span>Gustavo, Guilherme e Marcelo Bilonia, e Vinícius Oliveira.</span>
            <span className="s-como__dica-time" aria-hidden="true">Toque numa foto</span>
            <span className="s-como__lugar"><svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d={PIN} /></svg>Parque de Inovação Tecnológica de São José dos Campos</span>
          </figcaption>
        </figure>
      </div>
    </div>

    <div className="s-como__escuro">
      <div className="cl-wrap"><div className="s-como__painel">
        <div className="s-como__nao-cab">
          <h3 className="s-como__nao-tit">O que a gente <em>não</em> faz</h3>
        </div>
        <ul className="s-como__nao">
          {NAO.map(({risco, diz}) => <li key={risco}>
            <span className="s-como__xis" aria-hidden="true"><Icon name="x" size={22} /></span>
            <p className="s-como__risco-txt"><span className="cl-sr">A gente não vai {risco.charAt(0).toLowerCase() + risco.slice(1)}.</span><span className="s-como__risco" aria-hidden="true">{risco}</span></p>
            <p className="s-como__diz">{diz}</p>
          </li>)}
        </ul>
      </div></div>
    </div>
  </section>;
}
