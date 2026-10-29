import {Fragment, useEffect, useRef, type CSSProperties} from 'react';
import {CTA} from '../cta';
import {Icon, type IconName} from '../icons';
import {gsap, reduzido, celular, temWebGL, aoVisivel} from '../motion';
import './inicio.css';

// Phosphor regular (MIT), só usados aqui.
const BRILHO = 'M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119A8,8,0,0,0,137,123.78L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z';
const WHATS = 'M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z';
const Svg = ({d, size = 16}: {d: string; size?: number}) =>
  <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d={d} /></svg>;

const LINHA1 = 'IA trabalhando na sua clínica.';
const LINHA2 = 'As pessoas mantêm o comando.';

// Cada palavra numa máscara; a subida é CSS (roda no primeiro paint, sem esperar a hidratação).
function Palavras({texto, de}: {texto: string; de: number}) {
  const ps = texto.split(' ');
  return <>{ps.map((p, i) => <Fragment key={i}><span className="ini-w"><span style={{'--i': de + i} as CSSProperties}>{p}</span></span>{i < ps.length - 1 ? ' ' : ''}</Fragment>)}</>;
}

// Cartões do plano 2D (fallback sem WebGL / movimento reduzido). Posições em % do palco.
const PLANO: {rotulo: string; icone: IconName | 'whats'; x: number; y: number; mx: number; my: number; r: number; ok?: boolean}[] = [
  {rotulo: 'WhatsApp', icone: 'whats', x: 6, y: 8, mx: 3, my: 5, r: -8},
  {rotulo: 'Orçamento', icone: 'orcamento', x: 62, y: 4, mx: 56, my: 3, r: 7},
  {rotulo: 'Pacientes sumidos', icone: 'volta', x: 0, y: 36, mx: 0, my: 64, r: 4},
  {rotulo: 'Resumo da semana', icone: 'numeros', x: 66, y: 34, mx: 50, my: 31, r: -6},
  {rotulo: 'Agenda', icone: 'agenda', x: 58, y: 64, mx: 47, my: 62, r: 0, ok: true},
  {rotulo: 'Pós-consulta', icone: 'estrela', x: 54, y: 76, mx: 42, my: 80, r: 0, ok: true},
];

export default function Inicio() {
  const secRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const telaRef = useRef<HTMLDivElement>(null);
  const legRef = useRef<HTMLParagraphElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Cena 3D: import dinâmico, só no navegador, só com WebGL e sem movimento reduzido.
  useEffect(() => {
    const sec = secRef.current, palco = palcoRef.current, tela = telaRef.current;
    if (!sec || !palco || !tela) return;
    // animações CSS infinitas pausam fora da tela
    let soltarFora: (() => void) | null = null;
    try { soltarFora = aoVisivel(sec, v => sec.classList.toggle('is-fora', !v)); } catch { /* segue */ }
    let vivo = true;
    const fim = () => { vivo = false; soltarFora?.(); };
    try { if (reduzido() || !temWebGL()) return fim; } catch { return fim; }
    let cena: {ligar(v: boolean): void; destruir(): void} | null = null;
    let soltarVis: (() => void) | null = null;
    import('./inicio-cena').then(async ({criarCena}) => {
      if (!vivo) return;
      const c = await criarCena({pai: tela, area: sec, legenda: legRef.current, celular: celular(), aoPronto: () => palco.classList.add('is-3d')});
      if (!vivo) { c.destruir(); return; }
      cena = c;
      soltarVis = aoVisivel(tela, v => c.ligar(v));
    }).catch(() => { palco.classList.remove('is-3d'); /* sem 3D: o plano 2D continua na tela */ });
    return () => {
      fim();
      try { soltarVis?.(); cena?.destruir(); } catch { /* nada */ }
      palco.classList.remove('is-3d');
    };
  }, []);

  // Cartão 2D vivo: mensagem chega, IA prepara, a Júlia envia. Depois, lembretes aprovados.
  useEffect(() => {
    const demo = demoRef.current;
    if (!demo) return;
    try { if (reduzido()) return; } catch { return; }
    const q = (s: string) => demo.querySelector(s) as HTMLElement;
    const texto = q('[data-a="texto"]');
    if (!texto) return;
    const completo = texto.textContent ?? '';
    let soltarVis: (() => void) | null = null;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    try { ctx = gsap.context(() => {
      const A = q('[data-cena="a"]'), B = q('[data-cena="b"]');
      const dedo = q('[data-a="dedo"]');
      const tl = gsap.timeline({repeat: -1, paused: true, defaults: {ease: 'power3.out'}});
      const digitar = {n: 0};
      // ciclo A: WhatsApp
      tl.set(B, {autoAlpha: 0})
        .set(A, {autoAlpha: 1})
        .set('[data-a="msg"]', {autoAlpha: 1, y: 0})
        .set('[data-a="chip"],[data-a="rascunho"]', {autoAlpha: 0, y: 12})
        .set('[data-a="ok"]', {autoAlpha: 0, y: 8})
        .set('[data-a="botao"]', {autoAlpha: 1, scale: 1})
        .set(dedo, {autoAlpha: 0, x: 70, y: 46, scale: 1})
        .call(() => { texto.textContent = ''; digitar.n = 0; })
                // a mensagem da Ana já está na tela desde o primeiro paint; só ganha um toque de chegada
        .fromTo('[data-a="msg"]', {scale: .96, transformOrigin: '0% 100%'}, {scale: 1, duration: .5, ease: 'back.out(2)'}, .05)
        .to('[data-a="chip"]', {autoAlpha: 1, y: 0, duration: .45}, .7)
        .to('[data-a="rascunho"]', {autoAlpha: 1, y: 0, duration: .4}, 1.05)
        .to(digitar, {n: completo.length, duration: 1.9, ease: 'none', onUpdate: () => { texto.textContent = completo.slice(0, Math.round(digitar.n)); }}, 1.2)
        .to(dedo, {autoAlpha: 1, x: 0, y: 0, duration: .6, ease: 'power2.inOut'}, 3.5)
        .to(dedo, {scale: .78, duration: .12, yoyo: true, repeat: 1}, 4.15)
        .to('[data-a="botao"]', {scale: .94, duration: .12, yoyo: true, repeat: 1}, 4.15)
        .to('[data-a="botao"]', {autoAlpha: 0, duration: .2}, 4.45)
        .to('[data-a="ok"]', {autoAlpha: 1, y: 0, duration: .45, ease: 'back.out(2)'}, 4.5)
        .to(dedo, {autoAlpha: 0, y: 14, duration: .3}, 4.6)
        // ciclo B: agenda de amanhã
        .to(A, {autoAlpha: 0, y: -10, duration: .45, ease: 'power2.in'}, 7.2)
        .set(A, {y: 0})
        .set('[data-b="alerta"],[data-b="chip"],[data-b="linha"]', {autoAlpha: 0, y: 10})
        .set('[data-b="check"]', {autoAlpha: 0, scale: .4})
        .set('[data-b="ok"]', {autoAlpha: 0, y: 8})
        .set('[data-b="botao"]', {autoAlpha: 1, scale: 1})
        .set(dedo, {autoAlpha: 0, x: 70, y: 46, scale: 1})
        .to(B, {autoAlpha: 1, duration: .4}, 7.65)
        .to('[data-b="alerta"]', {autoAlpha: 1, y: 0, duration: .45}, 7.9)
        .to('[data-b="chip"]', {autoAlpha: 1, y: 0, duration: .45}, 8.6)
        .to('[data-b="linha"]', {autoAlpha: 1, y: 0, duration: .4, stagger: .18}, 8.9)
        .to(dedo, {autoAlpha: 1, x: 0, y: 0, duration: .6, ease: 'power2.inOut'}, 10.1)
        .to(dedo, {scale: .78, duration: .12, yoyo: true, repeat: 1}, 10.75)
        .to('[data-b="botao"]', {scale: .94, duration: .12, yoyo: true, repeat: 1}, 10.75)
        .to('[data-b="botao"]', {autoAlpha: 0, duration: .2}, 11.05)
        .to('[data-b="check"]', {autoAlpha: 1, scale: 1, duration: .35, stagger: .12, ease: 'back.out(2.4)'}, 11.05)
        .to('[data-b="ok"]', {autoAlpha: 1, y: 0, duration: .45, ease: 'back.out(2)'}, 11.15)
        .to(dedo, {autoAlpha: 0, y: 14, duration: .3}, 11.2)
        .to(B, {autoAlpha: 0, y: -10, duration: .45, ease: 'power2.in'}, 14)
        .set(B, {y: 0}, 14.5);
      soltarVis = aoVisivel(demo, v => (v ? tl.play() : tl.pause()));
    }, demo); } catch { /* animação nunca derruba a página: fica o estado final do HTML */ }
    return () => {
      try { soltarVis?.(); ctx?.revert(); } catch { /* nada */ }
      texto.textContent = completo;
    };
  }, []);

  return <section id="inicio" className="s-inicio" data-tema="escuro" aria-labelledby="inicio-titulo" ref={secRef}>
    <div className="ini-fundo" aria-hidden="true"><span className="ini-fundo__luz" /><span className="ini-fundo__grade" /></div>

    <div className="cl-wrap ini-grade">
      <div className="ini-texto">
        <p className="cl-kicker ini-kicker">Para clínicas com a recepção sobrecarregada</p>
        <h1 id="inicio-titulo" className="ini-h1">
          <span className="ini-l1"><Palavras texto={LINHA1} de={0} /></span>{' '}
          <span className="ini-l2"><Palavras texto={LINHA2} de={5} /></span>
        </h1>
        <p className="cl-lead ini-lead">Sua recepção faz tudo ao mesmo tempo. A IA deixa pronto o repetitivo: confirmações, respostas, orçamentos e retornos. Sua equipe revisa e envia.</p>
        <div className="ini-acao">
          <a className="cl-btn ini-cta" href="#avaliacao" data-cta="avaliacao" data-cta-pos="hero">{CTA}<Icon name="seta" size={20} /></a>
          <p className="ini-garantia"><span className="ini-garantia__ic" aria-hidden="true"><Icon name="check" size={14} /></span>Odonto, médica, estética e fisio. Avaliação gratuita, sem compromisso.</p>
        </div>
      </div>

      <div className="ini-palco" ref={palcoRef}>
        <div className="ini-tela" ref={telaRef}>
          {/* Plano 2D: aparece antes do 3D carregar, sem WebGL e com movimento reduzido */}
          <div className="ini-plano" aria-hidden="true">
            <span className="ini-plano__halo" />
            <span className="ini-plano__anel ini-plano__anel--1" />
            <span className="ini-plano__anel ini-plano__anel--2" />
            <span className="ini-plano__nucleo" />
            {PLANO.map(c => <span key={c.rotulo} className={`ini-plano__cartao${c.ok ? ' is-ok' : ''}`} style={{'--x': `${c.x}%`, '--y': `${c.y}%`, '--mx': `${c.mx}%`, '--my': `${c.my}%`, '--r': `${c.r}deg`} as CSSProperties}>
              <span className="ini-plano__ic">{c.icone === 'whats' ? <Svg d={WHATS} size={18} /> : <Icon name={c.icone} size={18} />}</span>
              <span className="ini-plano__txt"><b>{c.rotulo}</b><small>{c.ok ? 'Aprovado pela recepção' : 'pendente'}</small></span>
            </span>)}
          </div>
        </div>
        <p className="ini-legenda" ref={legRef} aria-hidden="true"><span data-legenda-texto><span className="ini-so-mouse">Clique</span><span className="ini-so-toque">Toque</span> num cartão: veja o que a IA preparou</span></p>

        <div className="ini-demo" ref={demoRef} aria-hidden="true">
          <span className="cl-demo-rotulo ini-demo__rotulo">Demonstração · dados fictícios</span>
          <div className="ini-demo__corpo">
            <div className="ini-cena" data-cena="a">
              <div className="ini-cab ini-cab--a">
                <span className="ini-av">A</span>
                <span className="ini-cab__nome"><b>Ana</b><small>WhatsApp da clínica · 08:12</small></span>
                <span className="ini-cab__canal"><Svg d={WHATS} size={16} /></span>
              </div>
              <p className="ini-bolha ini-bolha--pac" data-a="msg"><small className="ini-bolha__de">Ana · WhatsApp · 08:12</small>Tem horário amanhã de manhã?</p>
              <p className="ini-chip" data-a="chip"><Svg d={BRILHO} size={14} />IA preparou a resposta</p>
              <p className="ini-bolha ini-bolha--ia" data-a="rascunho"><span data-a="texto">Oi, Ana! Amanhã temos 9h ou 10h30. Qual fica melhor para você?</span><i className="ini-caret" /></p>
              <div className="ini-pe">
                <span className="ini-botao" data-a="botao">Enviar<Icon name="seta" size={14} /></span>
                <span className="ini-ok" data-a="ok"><span className="ini-ok__ic"><Icon name="check" size={12} /></span>Enviado pela Júlia</span>
              </div>
            </div>

            <div className="ini-cena ini-cena--b" data-cena="b">
              <div className="ini-cab ini-cab--b">
                <span className="ini-av ini-av--ic"><Icon name="agenda" size={16} /></span>
                <span className="ini-cab__nome"><b>Agenda de amanhã</b><small>Recepção · 17:40</small></span>
              </div>
              <small className="ini-bolha__de ini-de-b">Agenda de amanhã · Recepção · 17:40</small>
              <p className="ini-alerta" data-b="alerta"><span className="ini-alerta__ponto" />3 consultas de amanhã sem confirmação</p>
              <p className="ini-chip" data-b="chip"><Svg d={BRILHO} size={14} />Lembretes prontos</p>
              <ul className="ini-lista">
                {[['Marcos', '08:30'], ['Carla', '10:00'], ['Paulo', '14:15']].map(([n, h]) =>
                  <li key={n} data-b="linha"><span className="ini-lista__h">{h}</span><span className="ini-lista__n">{n}</span><span className="ini-lista__st">lembrete pronto</span><span className="ini-lista__ck" data-b="check"><Icon name="check" size={11} /></span></li>)}
              </ul>
              <div className="ini-pe">
                <span className="ini-botao" data-b="botao">Aprovar<Icon name="check" size={14} /></span>
                <span className="ini-ok" data-b="ok"><span className="ini-ok__ic"><Icon name="check" size={12} /></span>Aprovado pela Júlia</span>
              </div>
            </div>
          </div>
          <span className="ini-dedo" data-a="dedo" />
        </div>
        <p className="cl-sr">Demonstração com dados fictícios: a paciente Ana pergunta no WhatsApp se tem horário amanhã de manhã. A IA prepara a resposta e a recepcionista Júlia revisa e envia. Depois, a IA prepara os lembretes das consultas de amanhã que ainda não foram confirmadas e a recepção aprova.</p>
      </div>
    </div>

  </section>;
}
