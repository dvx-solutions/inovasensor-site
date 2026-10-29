import {useCallback, useEffect, useRef, useState, type KeyboardEvent} from 'react';
import './exemplos.css';
import {gsap, reduzido, celular, temWebGL, aoVisivel} from '../motion';
import {Icon, type IconName} from '../icons';
import {DemoAgenda, DemoSumidos, DemoOrcamentos, DemoPos, DemoRespostas, DemoNumeros, type DemoProps} from './exemplos-demos';
import type {Cena} from './exemplos-cena';

// Phosphor "Heart" (regular, MIT), só para o exemplo de pós-consulta.
const CORACAO = 'M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z';
const PATHS: Record<string, string> = {
  agenda: 'M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z',
  volta: 'M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z',
  orcamento: 'M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z',
  coracao: CORACAO,
  conversa: 'M168,112a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,112Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm72-8A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z',
  numeros: 'M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z',
};

function Ic({nome, size = 22}: {nome: string; size?: number}) {
  if (nome !== 'coracao') return <Icon name={nome as IconName} size={size} />;
  return <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d={CORACAO} /></svg>;
}

type Item = {id: string; aba: string; icone: string; tela: string; frase: string; Demo: (p: DemoProps) => React.JSX.Element};
const ITENS: Item[] = [
  {id: 'agenda', aba: 'Agenda', icone: 'agenda', tela: 'Agenda de amanhã', Demo: DemoAgenda,
    frase: 'Confirmação e lembrete da véspera e do dia saem prontos. Vaga que abre vai direto para a lista de encaixe, e a cadeira não fica vazia.'},
  {id: 'sumidos', aba: 'Pacientes sumidos', icone: 'volta', tela: 'Pacientes sumidos', Demo: DemoSumidos,
    frase: 'Quem não vem há 6 ou 12 meses aparece numa lista, com a mensagem de limpeza, manutenção ou revisão já escrita.'},
  {id: 'orcamentos', aba: 'Orçamentos', icone: 'orcamento', tela: 'Orçamentos', Demo: DemoOrcamentos,
    frase: 'A anotação do doutor vira um orçamento claro. E quem não respondeu entra no acompanhamento sem ninguém precisar lembrar.'},
  {id: 'pos', aba: 'Pós-consulta', icone: 'coracao', tela: 'Pós-consulta', Demo: DemoPos,
    frase: 'Cuidados, lembrete do retorno e pedido de avaliação no Google ficam prontos. A recepção confere e envia.'},
  {id: 'respostas', aba: 'Respostas prontas', icone: 'conversa', tela: 'WhatsApp', Demo: DemoRespostas,
    frase: 'Preço, convênio, endereço e preparo viram resposta pronta. A recepcionista escolhe e envia com um clique.'},
  {id: 'numeros', aba: 'Números da semana', icone: 'numeros', tela: 'Números da semana', Demo: DemoNumeros,
    frase: 'Consultas, faltas, orçamentos em aberto e faturamento num resumo simples toda semana, sem montar planilha.'},
];
// Um erro de animação ou da cena nunca derruba a página: o conteúdo continua legível.
function seguro(f: () => void | (() => void)) {
  try {
    const limpar = f();
    return limpar ? () => { try { limpar(); } catch { /* ignora */ } } : undefined;
  } catch { return undefined; }
}

const N = ITENS.length;
const ESPERA_AVANCO = 2600;
// Posições do anel 2D arredondadas (iguais no servidor e no navegador)
const r2 = (v: number) => Math.round(v * 100) / 100;
const ANEL2D = ITENS.map((_, i) => {
  const a = (i / N) * Math.PI * 2;
  return {x: r2(300 + Math.sin(a) * 250), y: r2(200 + Math.cos(a) * 122), l: r2(50 + Math.sin(a) * 41.6), t: r2(47.6 + Math.cos(a) * 29)};
});

export default function Exemplos() {
  const secRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const telaRef = useRef<HTMLDivElement>(null);
  const abasRef = useRef<(HTMLButtonElement | null)[]>([]);
  const cenaRef = useRef<Cena | null>(null);

  const [ativo, setAtivo] = useState(0);
  const [modo3d, setModo3d] = useState(false);
  const [estatico, setEstatico] = useState(true); // SSR e reduced motion: estado final, sem animação
  const [ciclo, setCiclo] = useState(0); // vira 1 quando a seção aparece na tela
  const [auto, setAuto] = useState(true);

  const autoRef = useRef(true);
  const visivelRef = useRef(false);
  const fimPendente = useRef(false);
  const timer = useRef(0);
  const ativoRef = useRef(0);
  ativoRef.current = ativo;

  const pararAuto = useCallback(() => {
    if (!autoRef.current) return;
    autoRef.current = false;
    setAuto(false);
    clearTimeout(timer.current);
    fimPendente.current = false;
  }, []);

  const agendarProximo = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!autoRef.current) return;
      if (!visivelRef.current) { fimPendente.current = true; return; }
      setAtivo((a) => (a + 1) % N);
    }, ESPERA_AVANCO);
  }, []);

  const onFim = useCallback(() => {
    if (!autoRef.current) return;
    if (visivelRef.current) agendarProximo();
    else fimPendente.current = true;
  }, [agendarProximo]);

  // Decide o modo (3D ou SVG, animado ou estático), monta a cena e observa a visibilidade
  useEffect(() => seguro(() => {
    const sec = secRef.current;
    if (!sec) return;
    const parado = reduzido();
    const gl = !parado && temWebGL();
    if (gl) setEstatico(false);
    else { autoRef.current = false; setAuto(false); }

    let desligar: (() => void) | null = null;
    let cancelado = false;
    let visivelPalco = false;
    const host = palcoRef.current?.querySelector<HTMLDivElement>('.ex-3d');

    if (gl && host) {
      import('./exemplos-cena').then(({criarCena}) => {
        if (cancelado) return null;
        return criarCena(host, {
          itens: ITENS.map((it) => ({rotulo: it.aba, path: PATHS[it.icone]})),
          ativo: ativoRef.current,
          celular: celular(),
          aoEscolher: (i) => { pararAuto(); setAtivo(i); },
          aoInteragir: pararAuto,
          aoPronto: () => setModo3d(true),
        });
      }).then((cena) => {
        if (!cena) return;
        if (cancelado) { cena.dispose(); return; }
        cenaRef.current = cena;
        cena.ativar(ativoRef.current);
        desligar = aoVisivel(host, (v) => { visivelPalco = v; cena.rodar(visivelPalco); });
      }).catch(() => setModo3d(false));
    }

    const offSec = aoVisivel(sec, (v) => {
      visivelRef.current = v;
      if (v) {
        setCiclo((c) => (c === 0 ? 1 : c));
        if (fimPendente.current && autoRef.current) { fimPendente.current = false; agendarProximo(); }
      }
    });

    return () => {
      cancelado = true;
      offSec();
      desligar?.();
      cenaRef.current?.dispose();
      cenaRef.current = null;
      clearTimeout(timer.current);
    };
  }), [agendarProximo, pararAuto]);

  useEffect(() => { cenaRef.current?.ativar(ativo); }, [ativo]);

  // Inclinação 3D da mini-tela com o mouse (só desktop, só com movimento)
  useEffect(() => seguro(() => {
    const tela = telaRef.current;
    if (!tela || estatico || !matchMedia('(hover: hover) and (min-width: 1000px)').matches) return;
    const ctx = gsap.context(() => {
      const rx = gsap.quickTo(tela, 'rotationX', {duration: 0.7, ease: 'power3.out'});
      const ry = gsap.quickTo(tela, 'rotationY', {duration: 0.7, ease: 'power3.out'});
      const mover = (e: PointerEvent) => {
        const r = tela.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 6);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 5);
      };
      const sair = () => { rx(0); ry(0); };
      tela.addEventListener('pointermove', mover);
      tela.addEventListener('pointerleave', sair);
      return () => { tela.removeEventListener('pointermove', mover); tela.removeEventListener('pointerleave', sair); };
    }, tela);
    return () => ctx.revert();
  }), [estatico]);

  // Entrada da seção
  useEffect(() => seguro(() => {
    const sec = secRef.current;
    if (!sec || estatico) return;
    const ctx = gsap.context(() => {
      gsap.from('.ex-cabeca > *', {opacity: 0, y: 24, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {trigger: sec, start: 'top 72%', toggleActions: 'play none none none'}});
      gsap.from('.ex-tela-cena', {opacity: 0, y: 40, duration: 1, ease: 'power3.out',
        scrollTrigger: {trigger: '.ex-corpo', start: 'top 78%', toggleActions: 'play none none none'}});
      gsap.from('.ex-aba', {opacity: 0, y: 14, stagger: 0.05, duration: 0.5, ease: 'power2.out',
        scrollTrigger: {trigger: '.ex-abas', start: 'top 92%', toggleActions: 'play none none none'}});
    }, sec);
    return () => ctx.revert();
  }), [estatico]);

  // Título da tela e frase "na prática" trocam com suavidade
  useEffect(() => seguro(() => {
    const sec = secRef.current;
    if (estatico || !sec) return;
    const ctx = gsap.context(() => {
      gsap.from('.ex-tela__titulo span', {opacity: 0, y: 8, duration: 0.35, ease: 'power2.out'});
      gsap.from('.ex-pratica p', {opacity: 0, y: 10, duration: 0.45, ease: 'power2.out'});
    }, sec);
    return () => ctx.revert();
  }), [ativo, estatico]);

  // A aba ativa fica visível na faixa rolável (celular) sem mexer na rolagem da página
  useEffect(() => seguro(() => {
    const aba = abasRef.current[ativo];
    const faixa = aba?.parentElement;
    if (!aba || !faixa || faixa.scrollWidth <= faixa.clientWidth + 2) return;
    const alvo = aba.offsetLeft - (faixa.clientWidth - aba.offsetWidth) / 2;
    faixa.scrollTo({left: alvo, behavior: estatico ? 'auto' : 'smooth'});
  }), [ativo, estatico]);

  const escolher = (i: number) => { pararAuto(); setAtivo(i); };

  const onTecla = (e: KeyboardEvent<HTMLDivElement>) => {
    let novo = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') novo = (ativo + 1) % N;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') novo = (ativo - 1 + N) % N;
    else if (e.key === 'Home') novo = 0;
    else if (e.key === 'End') novo = N - 1;
    if (novo < 0) return;
    e.preventDefault();
    escolher(novo);
    abasRef.current[novo]?.focus();
  };

  const item = ITENS[ativo];
  const rodar = !estatico && ciclo > 0;
  const Demo = item.Demo;

  return <section id="exemplos" className="s-exemplos" data-tema="escuro" aria-labelledby="exemplos-titulo"
    ref={secRef} onClick={(e) => { if ((e.target as HTMLElement).closest('button')) pararAuto(); }}
    onKeyDown={(e) => { if (e.key !== 'Tab' && e.key !== 'Shift') pararAuto(); }}>
    <div className="ex-fundo" aria-hidden="true" />
    <div className="cl-wrap">
      <div className="ex-corpo">
        <div className="ex-esq">
          <header className="ex-cabeca">
            <h2 id="exemplos-titulo" className="cl-h2">O que sai das costas <em>da recepção</em></h2>
            <p className="cl-lead">{modo3d ? 'Gire o anel ou escolha um exemplo.' : 'Escolha um exemplo.'} Cada um mostra o que a IA deixa pronto e o que continua na mão da sua equipe.</p>
          </header>
          <div className={`ex-palco${modo3d ? ' is-3d' : ''}`} ref={palcoRef}>
            <div className="ex-3d" aria-hidden="true" />
            <div className="ex-anel2d" aria-hidden="true">
              <svg className="ex-anel2d__svg" viewBox="0 0 600 420" focusable="false" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="exNucleo" cx="50%" cy="42%" r="55%">
                    <stop offset="0" stopColor="#ffe3ee" />
                    <stop offset=".35" stopColor="#ff2d78" />
                    <stop offset="1" stopColor="#5a0a2c" />
                  </radialGradient>
                  <radialGradient id="exHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0" stopColor="#ff2d78" stopOpacity=".55" />
                    <stop offset="1" stopColor="#ff2d78" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="300" cy="200" rx="250" ry="122" fill="none" stroke="#ff2d78" strokeOpacity=".4" strokeWidth="1.5" />
                <ellipse cx="300" cy="200" rx="284" ry="142" fill="none" stroke="#ff8fb6" strokeOpacity=".3" strokeWidth="1.2" strokeDasharray="2 7" />
                {ITENS.map((it, i) => <line key={it.id} x1="300" y1="200" x2={ANEL2D[i].x} y2={ANEL2D[i].y}
                  stroke="#ff2d78" strokeOpacity={i === ativo ? 0.9 : 0.25} strokeWidth={i === ativo ? 2 : 1} />)}
                <circle cx="300" cy="200" r="130" fill="url(#exHalo)" />
                <circle cx="300" cy="200" r="46" fill="url(#exNucleo)" />
                <circle cx="300" cy="200" r="64" fill="none" stroke="#ff8a5c" strokeOpacity=".5" />
              </svg>
              {ITENS.map((it, i) => <button key={it.id} type="button" tabIndex={-1} className={`ex-no2d${i === ativo ? ' is-on' : ''}`}
                style={{left: `${ANEL2D[i].l}%`, top: `${ANEL2D[i].t}%`}} onClick={() => escolher(i)}>
                <span className="ex-no2d__disco"><Ic nome={it.icone} size={22} /></span>
                <span className="ex-no2d__rot">{it.aba}</span>
              </button>)}
            </div>
            <p className="ex-dica" aria-hidden="true">{modo3d ? 'Arraste para girar · toque num exemplo' : 'Toque num exemplo'}</p>
            <p className="cl-sr">Anel com os seis exemplos ao redor de um núcleo que representa a IA. Use as abas para ver cada um.</p>
          </div>

          <div className="ex-abas" role="tablist" aria-label="Exemplos" onKeyDown={onTecla}>
            {ITENS.map((it, i) => <button key={it.id} ref={(el) => { abasRef.current[i] = el; }} type="button" role="tab"
              id={`ex-aba-${it.id}`} aria-selected={i === ativo} aria-controls="ex-painel" tabIndex={i === ativo ? 0 : -1}
              className="ex-aba" onClick={() => escolher(i)}>
              <Ic nome={it.icone} size={18} />
              <span>{it.aba}</span>
            </button>)}
          </div>
        </div>

        <div className="ex-dir">
          <div className="ex-tela-cena">
            <div className="ex-tela" ref={telaRef} id="ex-painel" role="tabpanel" aria-labelledby={`ex-aba-${item.id}`} tabIndex={0}>
              <div className="ex-tela__barra">
                <span className="ex-pontos" aria-hidden="true"><i /><i /><i /></span>
                <p className="ex-tela__titulo"><span key={item.id}><Ic nome={item.icone} size={16} />{item.tela}</span></p>
                <span className="cl-demo-rotulo">Demonstração · dados fictícios</span>
              </div>
              <div className="ex-tela__corpo">
                <Demo key={`${item.id}-${rodar ? 1 : 0}`} rodar={rodar} auto={auto} onFim={onFim} />
              </div>
            </div>
          </div>
          <div className="ex-pratica">
            <span className="ex-pratica__k">Na prática</span>
            <p key={item.id}>{item.frase}</p>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
