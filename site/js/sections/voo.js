/* =============================================================================
   Seção 01 · voo (abertura em voo: órbita → represa → água)
   -----------------------------------------------------------------------------
   ESTRUTURA (contrato com o resto do site, não muda quando a camada visual mudar)
   - #voo-stage ........ a CAMADA VISUAL (vídeo por paradas ou ilustração em canvas).
   - [data-voo-hero] ... promessa + CTAs (primeira tela).
   - [data-beat="orbita|represa|agua"] ... textos das batidas, independentes da camada visual.

   CAMADAS VISUAIS
   1. PADRÃO: voo em vídeo POR PARADAS (.voo--video; refeito em 07/10/2026 a pedido do Bil:
      "se eu rolar 10 vezes numa única ação ele precisa descer apenas 1 frame").
      Não é mais scrub (rolagem → currentTime). A seção mede uma tela (100svh) e o voo é uma
      navegação por GESTO entre três paradas:
        P0 órbita (hero: promessa + CTA)  →  P1 represa  →  P2 água  →  saída para "O problema".
      - Um gesto (rajada de rodinha/trackpad, swipe, PageDown/Espaço/seta) = um trecho tocado
        numa duração fixa, com aceleração e frenagem suaves (curva trapezoidal):
          P0→P1 toca d1 + c1 (8 s de filme) em 2,6 s · P1→P2 toca d2 + c2 (10 s) em 2,8 s ·
          P2→saída toca d3 (5 s) em 2,4 s, e aos ~45% a página rola sozinha (1 s) até "O problema".
        Total de ida ~8 s. Volta (gesto para cima): P1→P0 em 1,8 s, P2→P1 em 2,0 s (playbackRate até 6).
        Clipe que não está pronto em ~0,9 s do gesto: o trecho vira crossfade dos posters (resposta imediata).
      - Ida: play() nativo com playbackRate controlado a cada quadro (segue a curva e corrige
        pela posição); nas emendas o clipe seguinte começa quando o atual mostra o último quadro
        (os conectores começam no quadro final do dive anterior, então a troca é invisível).
        Volta: scrub por requestAnimationFrame (seek só quando o decodificador está livre).
      - TRAVA: durante o trecho a entrada fica travada (10 tiques ou um swipe forte não pulam
        duas cenas). Depois, só conta um gesto NOVO: a rajada atual (inclusive o momentum do
        trackpad) precisa parar por IDLE_MS (220 ms). Teclas com repetição (e.repeat) não contam.
        Limiar: 24 px acumulados (1 tique de rodinha ~100 px vale); rajada de pixels finos (deltaMode 0
        e |deltaY| < 10, trackpad) exige 45 px, para um toque leve no trackpad não disparar.
      - Enquanto está no voo a rolagem da janela fica parada (Lenis.stop() + preventDefault em
        wheel/touchmove/teclas, overscroll-behavior-y: none no <html> contra pull-to-refresh). Na saída o
        Lenis volta e o resto da rajada é engolido até ela acabar. Voltando ao topo (scrollY 0),
        entra de novo no voo pela P2 (se o vídeo ficou no fim de d3, ele volta suave até a P2).
        Na reentrada, um toque que começa até 600 ms depois do repouso não volta (P2→P1): quem só
        queria chegar ao topo costuma emendar outro swipe.
      - Nunca prende: clique em link "#..." (menu, CTA, "Como funciona") sai do voo e deixa o
        core.js rolar; arrastar a barra de rolagem, busca na página ou foco que role a janela também
        soltam (a parada atual é mantida). Rodinha com o cursor SOBRE a barra (o navegador rola sem
        'wheel') vale como gesto do voo: a janela volta ao 0 e o trecho toca. Home volta à P0 (também
        fora do voo: sobe ao topo e cai na P0, não na parada guardada); End = "Pular abertura" (link ao lado
        da dica): solta a trava e vai para #intervalo. O pull-to-refresh é travado só no <html> e só no modo 'voo'.
      - Batidas: hero na P0, [data-beat=represa] na P1, [data-beat=agua] na P2; o texto (e a etapa) do
        destino entra no início do trecho e fica visível durante a travessia. [data-beat=orbita] fica só no modo estático/ilustração (no vídeo, a P0 é o hero),
        sempre na árvore de acessibilidade. 3 pontos de etapa + dica "Role para continuar" na P0
        (na P1/P2 a mesma dica aparece mais discreta nos primeiros ~3 s de repouso e some).
        Selo "Imagem ilustrativa gerada por IA" (.voo__ia) sempre visível no voo.
      - Clipes em STREAMING (URL direta, preload=auto, 'canplaythrough'), sob demanda: d1 + c1 já (o <video>
        do d1 nasce no script inline da seção, antes do CSS/JS); d2 + c2 no ócio depois deles (ou ao chegar
        à P1); d3 ao chegar à P1/P2; nada novo começa durante uma viagem. Blob só como plano B ('error' ou
        servidor sem byte-range, detectado nos metadados). Celular (toque ou <= 860 px) usa as versões -m
        9:16 e os posters -m; o poster da P0 tem uma URL só (--voo-poster do script inline = <img> do JS).
        Estado exposto em data-voo-stop / data-voo-state / data-voo-mode / data-voo-clips (testes).
   2. POSTERS (.voo--posters): movimento reduzido, Save-Data ou 2g/3g: só o poster de cada cena e o
      texto das 3 batidas, sem baixar nenhum .mp4 (decidido no script inline, só CSS).
   3. FALLBACK: ilustração em canvas 2D (createScene / startLive, scrub por ScrollTrigger, sem
      trava) se o poster não carrega (voo não publicado); sem GSAP/canvas ou sem JS: modo estático.

   TEMA EM RUNTIME
   - Modo vídeo: #voo fica data-theme="dark" do começo ao fim.
   - Ilustração: applyText() troca para "light" quando p > .98 (palco termina em Névoa).

   ACESSIBILIDADE
   - [data-voo-live] (aria-live="polite") anuncia a etapa ao chegar.
   - Foco de teclado num CTA do hero fora da P0 volta o voo para a P0.
   ========================================================================== */

const sec = document.getElementById('voo');

async function boot() {
  const ALG = window.ALG || {};
  const gsap = ALG.gsap || window.gsap;
  const ST = ALG.ScrollTrigger || window.ScrollTrigger;
  const reduced = typeof ALG.reduced === 'boolean' ? ALG.reduced : matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = sec.querySelector('#voo-stage canvas');
  const ok2d = !!(canvas && canvas.getContext && canvas.getContext('2d'));
  const goStatic = () => {
    sec.classList.remove('voo--live', 'voo--pinned', 'voo--video', 'voo--video-on');
    sec.classList.add('voo--static', 'voo--ready');
    if (ok2d) startStatic(canvas);
    if (ST) requestAnimationFrame(() => ST.refresh());
  };

  // movimento reduzido, Save-Data, 2g/3g: só posters + texto das 3 batidas, sem nenhum .mp4 (CSS .voo--posters)
  const goPosters = () => {
    sec.classList.remove('voo--live', 'voo--pinned', 'voo--video', 'voo--video-on');
    sec.classList.add('voo--static', 'voo--posters', 'voo--ready');
    if (ST) requestAnimationFrame(() => ST.refresh());
  };
  if (reduced || !vooCanPlay()) return goPosters();

  // 1) modo padrão: voo em vídeo por paradas. O poster do primeiro clipe aparece já (CSS).
  sec.classList.remove('voo--static', 'voo--posters');
  sec.classList.add('voo--live', 'voo--video', 'voo--ready');
  let ok = false;
  try { ok = await mountVooVideo(sec, ALG); } catch (e) { console.warn('[voo]', e); ok = false; }
  if (ok) { if (ST) requestAnimationFrame(() => ST.refresh()); return; }
  sec.classList.remove('voo--video', 'voo--video-on');
  if (window.__vooD1) { try { window.__vooD1.removeAttribute('src'); window.__vooD1.load(); } catch (e) {} }

  // 2) fallback: ilustração (voo não publicado ou poster indisponível)
  if (!gsap || !ST || !ok2d) return goStatic();
  sec.classList.remove('voo--static');
  sec.classList.add('voo--live', 'voo--ready');
  startLive(canvas, gsap, ST, ALG);
}

/* ======================================================= voo em vídeo por paradas */
const VOO_BASE = window.__vooBase || new URL('../../assets/voo/', import.meta.url).href;   // a mesma base do script inline (URLs idênticas: sem pedido repetido)
const A = (f) => VOO_BASE + f;
const CLIP = {                                    // durações nominais (as reais vêm do vídeo)
  d1: { src: 'd1-orbita', dur: 5 },
  c1: { src: 'c1-orbita-represa', dur: 3 },
  d2: { src: 'd2-represa', dur: 5 },
  c2: { src: 'c2-represa-agua', dur: 5 },
  d3: { src: 'd3-agua', dur: 5 },
};
const FILM_OFF = { d1: 0, c1: 5, d2: 8, c2: 13, d3: 18 };   // posição no filme inteiro (barra de progresso)
const FILM_TOTAL = 23;
const STOP_CLIP = ['d1', 'd2', 'd3'];             // em repouso, cada parada mostra o quadro 0 deste clipe
const STOP_POSTER = ['orbita', 'represa', 'agua'];
const STOP_TEXT = ['hero', 'represa', 'agua'];
const LEGS = [                                    // T = ida (s), back = volta (s)
  { clips: ['d1', 'c1'], T: 2.6, back: 1.8 },     // P0 → P1
  { clips: ['d2', 'c2'], T: 2.8, back: 2.0 },     // P1 → P2
  { clips: ['d3'], T: 2.4 },                      // P2 → saída
];
const EXIT_SCROLL_AT = 0.45;                      // fração do d3 em que a página começa a rolar
const EXIT_SCROLL_DUR = 1.0;                      // s
const SETTLE_DUR = 1.0;                           // s: volta do fim de d3 até a P2 ao reentrar
const READY_MS = 900;                             // gesto sem clipe pronto em até ~0,9 s: crossfade de posters (resposta imediata)
const IDLE_MS = 220;                              // silêncio que encerra uma rajada (rodinha/trackpad)
const WHEEL_MIN = 24;                             // delta acumulado mínimo para valer como gesto (1 tique de rodinha ~100)
const TRACKPAD_MIN = 45;                          // idem, numa rajada de pixels finos (deltaMode 0, |deltaY| < 10: trackpad)
const FINE_DELTA = 10;
const SWIPE_MIN = 30;                             // px de arrasto vertical para valer como swipe
const REENTRY_BACK_MS = 600;                      // reentrada pelo topo: toque que começa até aqui depois do repouso não volta
const CUE_DELAY_MS = 700;                         // dica na P1/P2: entra depois do texto da batida...
const CUE_HOLD_MS = 3200;                         // ...e some sozinha
const ric = (cb) => (window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 400));

function vooCanPlay() {
  if (window.ALG && window.ALG.reduced) return false;
  const c = navigator.connection;
  if (c && (c.saveData || /2g|3g/.test(c.effectiveType || ''))) return false;   // Save-Data, 2g, 3g: ilustração
  return true;
}

/* curva da viagem: acelera nos primeiros ACC, velocidade constante, freia nos últimos DEC */
const ACC = 0.2, DEC = 0.26, VMAX = 1 / (1 - (ACC + DEC) / 2);
function trap(x) {
  x = clamp(x);
  if (x < ACC) return (VMAX * x * x) / (2 * ACC);
  if (x > 1 - DEC) { const y = 1 - x; return 1 - (VMAX * y * y) / (2 * DEC); }
  return VMAX * (ACC / 2 + (x - ACC));
}
function trapV(x) {
  x = clamp(x);
  if (x < ACC) return (VMAX * x) / ACC;
  if (x > 1 - DEC) return (VMAX * (1 - x)) / DEC;
  return VMAX;
}
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function mountVooVideo(section, ALG) {
  const stage = section.querySelector('#voo-stage');
  if (!stage) return false;
  const coarse = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const phone = coarse || matchMedia('(max-width: 860px)').matches;
  const sfx = typeof window.__vooSfx === 'string' ? window.__vooSfx : (phone ? '-m' : '');   // mesma regra do script inline

  const lenis = () => (window.ALG && window.ALG.lenis) || null;
  const root = document.documentElement;
  const hero = section.querySelector('[data-voo-hero]');
  const texts = { hero, represa: section.querySelector('[data-beat="represa"]'), agua: section.querySelector('[data-beat="agua"]') };
  const stopsLi = [...section.querySelectorAll('.voo__stops li')];
  const meter = section.querySelector('.voo__meter-fill');
  const live = section.querySelector('[data-voo-live]');
  const cueTxt = section.querySelector('[data-voo-cue]');
  if (cueTxt && coarse) cueTxt.textContent = 'Deslize para continuar';

  /* ---------- camadas: posters das paradas + vídeos ---------- */
  stage.removeAttribute('role'); stage.removeAttribute('aria-label'); stage.setAttribute('aria-hidden', 'true');
  const layer = document.createElement('div');
  layer.className = 'voo__vids';
  // posters: o da P0 é a mesma URL do CSS (--voo-poster), então vem do cache e serve de sonda de publicação;
  // os das P1/P2 só são pedidos junto com os clipes delas (ou num crossfade)
  const posters = STOP_POSTER.map((n, i) => {
    const img = document.createElement('img');
    img.className = 'voo__poster' + (i === 0 ? ' is-on' : '');
    img.alt = ''; img.decoding = 'async';
    img.dataset.src = A(n + sfx + '.webp');
    layer.appendChild(img);
    return img;
  });
  const posterSrc = (i) => { const p = posters[i]; if (p && !p.getAttribute('src')) p.src = p.dataset.src; return p; };
  const p0 = posterSrc(0);
  const probeOk = await new Promise((res) => {
    if (p0.complete && p0.naturalWidth) return res(true);
    p0.addEventListener('load', () => res(true), { once: true });
    p0.addEventListener('error', () => res(false), { once: true });
    setTimeout(() => res(!!p0.naturalWidth || !p0.complete), 8000);   // rede lenta: segue (o vídeo tem plano B)
  });
  if (!probeOk) return false;                                        // voo não publicado: ilustração
  stage.appendChild(layer);

  const V = {};                                   // clipe → <video> pronto
  const loaded = {};                              // clipe → Promise<boolean>
  function makeVideo(url) {
    const v = document.createElement('video');
    v.className = 'voo__vid';
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.disablePictureInPicture = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    if (url) v.src = url;
    return v;
  }
  // espera o clipe poder tocar até o fim ('canplaythrough'); false em 'error'
  const canPlay = (v, ms) => new Promise((res) => {
    if (v.error) return res(false);
    if (v.readyState >= 4) return res(true);
    let t = 0;
    const fin = (ok) => { v.removeEventListener('canplaythrough', yes); v.removeEventListener('error', no); clearTimeout(t); res(ok); };
    const yes = () => fin(true), no = () => fin(false);
    v.addEventListener('canplaythrough', yes); v.addEventListener('error', no);
    t = setTimeout(() => fin(v.readyState >= 3), ms);
  });
  // o servidor deixa navegar no clipe? Com byte-range o seekable cobre o clipe inteiro já nos metadados;
  // sem byte-range (ex.: http.server local) fica [0, 0] mesmo depois de baixar tudo: aí o seek não funciona.
  const meta = (v, ms) => new Promise((res) => {
    if (v.error) return res(false);
    if (v.readyState >= 1) return res(true);
    let t = 0;
    const fin = (ok) => { v.removeEventListener('loadedmetadata', yes); v.removeEventListener('error', no); clearTimeout(t); res(ok); };
    const yes = () => fin(true), no = () => fin(false);
    v.addEventListener('loadedmetadata', yes); v.addEventListener('error', no);
    t = setTimeout(() => fin(v.readyState >= 1), ms);
  });
  const seekable = (v) => { const s = v.seekable, d = v.duration; return !!(d && isFinite(d) && s && s.length && s.start(0) <= 0.05 && s.end(s.length - 1) >= d - 0.1); };
  let rangeOk = null;                              // null: ainda não sabe; false: servidor sem byte-range, vai direto ao Blob
  const stopVideo = (v) => { try { v.removeAttribute('src'); v.load(); } catch (e) {} };
  // streaming (URL direta, preload=auto); Blob só como plano B ('error' ou seek que não funciona)
  async function loadClip(k) {
    const url = A(CLIP[k].src + sfx + '.mp4');
    let v = null;
    try {
      const pre = window.__vooD1;
      if (k === 'd1' && pre && pre.src === url && !pre.error) { v = pre; window.__vooD1 = null; }   // pedido cedo do script inline
      else v = makeVideo(rangeOk === false ? '' : url);
      layer.appendChild(v);
      let ok = rangeOk !== false && (await meta(v, 10000));
      if (ok) { ok = seekable(v); rangeOk = ok; }  // sem byte-range: corta o streaming já nos metadados (sem baixar duas vezes)
      if (ok) ok = await canPlay(v, 20000);
      if (!ok) {                                   // plano B: Blob (sempre navegável)
        stopVideo(v);
        section.dataset.vooBlob = ((section.dataset.vooBlob || '') + ' ' + k).trim();
        const r = await fetch(url);
        if (!r.ok) throw new Error(r.status);
        const blob = await r.blob();
        v.src = URL.createObjectURL(blob);
        if (!(await canPlay(v, 15000))) throw new Error('blob');
      }
      if (!v.duration || !isFinite(v.duration)) throw new Error('sem duração');
      V[k] = v;
      section.dataset.vooClips = Object.keys(V).join(' ');
      if (userReady) primeVideo(v);
      // o clipe da parada atual entra assim que pinta (é o mesmo quadro do poster)
      if (!busy && STOP_CLIP[stop] === k && !atEnd) { await seekTo(v, 0); if (!busy && STOP_CLIP[stop] === k) showClip(k); }
      return true;
    } catch (e) {
      if (v) { stopVideo(v); v.remove(); }
      return false;
    }
  }
  // carga sob demanda: d1 + c1 já; d2 + c2 no ócio depois deles (ou ao chegar à P1); d3 ao chegar à P1/P2
  const need = (k) => (loaded[k] || (loaded[k] = loadClip(k)));
  const whenReady = (keys, ms) => Promise.race([
    Promise.all(keys.map(need)).then((a) => a.every(Boolean)),
    sleep(ms).then(() => false),
  ]);
  function loadFor(i) {                            // ao chegar à P1/P2: d2 + c2 (se o ócio ainda não pediu) e d3
    if (i >= 1) { need('d2'); need('c2'); need('d3'); posterSrc(1); whenIdle(() => posterSrc(2)); }
  }
  // nada de carga nova durante a viagem (decodificar metadados e posters no meio do trecho custa quadros)
  const whenIdle = (fn) => ric(() => (busy ? setTimeout(() => whenIdle(fn), 400) : fn()));
  Promise.all([need('d1'), need('c1')]).then(() => whenIdle(() => { need('d2'); need('c2'); posterSrc(1); }));

  function seekTo(v, t) {
    return new Promise((res) => {
      const tt = clamp(t, 0, Math.max(0, (v.duration || 0) - 0.001));
      if (!v.seeking && Math.abs(v.currentTime - tt) < 0.0005) return res();
      let done = false;
      const fin = () => { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); };
      v.addEventListener('seeked', fin);
      try { v.currentTime = tt; } catch (e) { fin(); }
      setTimeout(fin, 900);
    });
  }
  const playSafe = (v) => { try { const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} };
  const pauseAll = () => { for (const k in V) { try { V[k].pause(); } catch (e) {} } };
  function showClip(k) { for (const key in V) V[key].classList.toggle('is-on', key === k); }
  function showPoster(i) { posters.forEach((p, j) => p.classList.toggle('is-on', j === i)); }

  // iOS: um vídeo mudo só pinta de forma confiável depois de um play() num gesto
  let userReady = false;
  function primeVideo(v) {
    if (!coarse || !v) return;
    const t = v.currentTime;
    try { const p = v.play(); if (p && p.then) p.then(() => { v.pause(); v.currentTime = t; }).catch(() => {}); } catch (e) {}
  }

  /* ---------- estado ---------- */
  let stop = 0;          // parada atual 0..2
  let mode = 'voo';      // 'voo' = janela parada, gestos navegam | 'free' = rolagem normal
  let busy = false;      // trecho em curso: entrada travada
  let atEnd = false;     // o vídeo ficou no fim de d3 (depois da saída)
  let run = 0;           // ficha da animação atual (abortar = run++)
  let autoScroll = false;
  let restAt = -1e9;     // quando chegou à parada atual (performance.now)
  let reentered = false; // entrou de novo no voo pelo topo e ainda não houve gesto (trava de volta no toque)

  const setState = (s) => { section.dataset.vooState = s; section.classList.toggle('voo--travel', s === 'travel' || s === 'back' || s === 'exit' || s === 'settle'); };
  function setMeter(film) { if (meter) meter.style.transform = `scaleX(${clamp(film / FILM_TOTAL).toFixed(4)})`; }
  let onScreen = true;                            // IntersectionObserver da seção
  const syncCue = () => section.classList.toggle('voo--cue-off', !onScreen || !(section.classList.contains('voo--at-hero') || section.classList.contains('voo--cue-rest')));
  function setText(which) {
    for (const k in texts) if (texts[k]) texts[k].classList.toggle('is-shown', k === which);
    section.style.setProperty('--voo-vis', which ? '1' : '0');
    section.classList.toggle('voo--at-hero', which === 'hero');
    cueRest(false);
  }
  /* dica "Role/Deslize para continuar" também na P1/P2: só nos primeiros segundos de repouso */
  let cueT1 = 0, cueT2 = 0;
  function cueRest(on) {
    clearTimeout(cueT1); clearTimeout(cueT2);
    if (!on) { section.classList.remove('voo--cue-rest'); syncCue(); return; }
    cueT1 = setTimeout(() => {
      if (busy || mode !== 'voo' || stop === 0) return;
      section.classList.add('voo--cue-rest'); syncCue();
      cueT2 = setTimeout(() => { section.classList.remove('voo--cue-rest'); syncCue(); }, CUE_HOLD_MS);
    }, CUE_DELAY_MS);
  }
  const markStops = (i) => stopsLi.forEach((li, j) => { li.classList.toggle('is-on', j === i); li.classList.toggle('is-done', j < i); });
  function setStop(i) {
    stop = i;
    section.dataset.vooStop = String(i);
    markStops(i);
    if (live) live.textContent = `Etapa ${i + 1} de 3: ${STOPS[i]}`;
  }
  function setMode(m) {
    mode = m;
    section.dataset.vooMode = m;
    const L = lenis();
    if (m === 'voo') { if (L) L.stop(); root.style.overscrollBehaviorY = 'none'; }
    else { if (L) L.start(); root.style.overscrollBehaviorY = ''; }
  }

  /* ---------- reprodução ---------- */
  // ida: play() nativo; playbackRate segue a curva e corrige pela posição; emendas sem buraco
  function playForward(keys, T, onFilm, token) {
    return new Promise(async (resolve) => {
      const vs = keys.map((k) => V[k]);
      const D = vs.map((v) => v.duration);
      const off = []; let tot = 0; D.forEach((d) => { off.push(tot); tot += d; });
      await Promise.all(vs.map((v) => seekTo(v, 0)));
      if (token !== run) return resolve(false);
      showClip(keys[0]);
      let i = 0, next = -1;
      vs[0].playbackRate = 0.25; playSafe(vs[0]);
      const t0 = performance.now();
      const step = (now) => {
        if (token !== run) { vs.forEach((v) => v.pause()); return resolve(false); }
        const x = (now - t0) / 1000 / T;
        const F = trap(x) * tot;
        const vF = (trapV(x) * tot) / T;
        let cur = vs[i];
        if (next < 0 && i < vs.length - 1) {                  // emenda: o próximo começa no último quadro do atual
          const left = (D[i] - cur.currentTime) / Math.max(0.25, cur.playbackRate);
          if (cur.ended || left < 0.034) { next = i + 1; vs[next].playbackRate = clamp(cur.playbackRate, 0.25, 6); playSafe(vs[next]); }
        }
        if (next >= 0 && vs[next].currentTime > 0.001) {     // o próximo já pintou: troca
          showClip(keys[next]); cur.pause(); i = next; next = -1; cur = vs[i];
        }
        const target = clamp(F - off[i], 0, D[i]);
        const rate = clamp(vF + (target - cur.currentTime) * 3, 0.25, 6);
        if (Math.abs(cur.playbackRate - rate) > 0.04) cur.playbackRate = rate;
        if (cur.paused && !cur.ended && next < 0) playSafe(cur);
        onFilm && onFilm(off[i] + cur.currentTime, tot);
        const last = i === vs.length - 1;
        const arrived = last && (cur.ended || cur.currentTime >= D[i] - 0.045);
        if ((x >= 1 && arrived) || x > 1 + 1.5 / T) {
          vs.forEach((v) => v.pause());
          if (!arrived) { seekTo(cur, D[i]).then(() => resolve(true)); return; }
          return resolve(true);
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  // volta: scrub por rAF de F0 até 0 (seek só com o decodificador livre)
  function playBackward(keys, T, F0, onFilm, token) {
    return new Promise(async (resolve) => {
      const vs = keys.map((k) => V[k]);
      const D = vs.map((v) => v.duration);
      const off = []; let tot = 0; D.forEach((d) => { off.push(tot); tot += d; });
      if (F0 == null) F0 = tot;
      const clipAt = (F) => { let j = 0; for (let k = 0; k < vs.length; k++) if (F > off[k] + 0.0005) j = k; return j; };
      let cj = clipAt(F0);
      await Promise.all(vs.map((v, j) => (j === cj ? seekTo(v, F0 - off[j]) : j < cj ? seekTo(v, D[j] - 0.02) : Promise.resolve())));
      if (token !== run) return resolve(false);
      pauseAll(); showClip(keys[cj]);
      const t0 = performance.now();
      const step = async (now) => {
        if (token !== run) return resolve(false);
        const x = (now - t0) / 1000 / T;
        const F = F0 * (1 - trap(x));
        const j = clipAt(F);
        if (j !== cj) { cj = j; showClip(keys[j]); }
        const v = vs[j];
        const t = clamp(F - off[j], 0, D[j] - 0.02);
        if (!v.seeking && Math.abs(v.currentTime - t) > 0.012) { try { v.currentTime = t; } catch (e) {} }
        onFilm && onFilm(off[j] + t, tot);
        if (x >= 1) { showClip(keys[0]); await seekTo(vs[0], 0); return resolve(token === run); }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  const posterOk = (i) => { const p = posters[i]; return !!(p && p.complete && p.naturalWidth); };
  // poster de parada só entra inteiro (nunca meio carregado); se ainda não chegou, entra quando chegar
  function posterWhenReady(i, withClip) {
    const p = posterSrc(i);
    if (posterOk(i)) { if (withClip) showClip(null); showPoster(i); return true; }
    p.addEventListener('load', () => { if (stop === i && !busy) { if (withClip && !V[STOP_CLIP[i]]) showClip(null); showPoster(i); } }, { once: true });
    return false;
  }
  async function posterFade(i) {                       // sem clipe: crossfade dos posters
    const p = posterSrc(i);
    if (!posterOk(i)) await Promise.race([new Promise((r) => { p.addEventListener('load', r, { once: true }); p.addEventListener('error', r, { once: true }); }), sleep(1200)]);
    if (posterWhenReady(i, true)) await sleep(950);
  }

  /* ---------- trechos ---------- */
  async function travel(i) {                          // Pi → Pi+1
    const token = ++run; busy = true; setState('travel');
    setText(STOP_TEXT[i + 1]); markStops(i + 1);      // o texto (e a etapa) do destino entram já e ficam durante a travessia
    const leg = LEGS[i];
    const base = FILM_OFF[leg.clips[0]];
    const ok = await whenReady(leg.clips, READY_MS);
    if (token !== run) return;
    if (ok) {
      const done = await playForward(leg.clips, leg.T, (f) => setMeter(base + f), token);
      if (token !== run) return;
      // o último quadro do conector é o quadro 0 da parada: se o clipe dela ainda não chegou, o conector fica
      // parado nesse quadro e o loadClip troca quando ele pintar
      const rest = V[STOP_CLIP[i + 1]];
      if (done && rest) { await seekTo(rest, 0); if (token !== run) return; showClip(STOP_CLIP[i + 1]); }
    } else await posterFade(i + 1);
    if (token !== run) return;
    arrive(i + 1);
    prepare();
  }
  async function travelBack(i) {                      // Pi+1 → Pi
    const token = ++run; busy = true; setState('back');
    setText(STOP_TEXT[i]); markStops(i);
    const leg = LEGS[i];
    const base = FILM_OFF[leg.clips[0]];
    const ok = await whenReady(leg.clips, READY_MS);
    if (token !== run) return;
    if (ok) await playBackward(leg.clips, leg.back, null, (f) => setMeter(base + f), token);
    else await posterFade(i);
    if (token !== run) return;
    arrive(i);
    prepare();
  }
  function arrive(i) {
    loadFor(i);
    setStop(i); posterWhenReady(i, false); setMeter(FILM_OFF[STOP_CLIP[i]]);
    setText(STOP_TEXT[i]);
    busy = false; setState('rest');
    restAt = performance.now();
    if (i > 0 && mode === 'voo') cueRest(true);
  }
  function prepare() {                                // deixa o próximo trecho pronto no quadro 0
    if (busy) return;
    const leg = LEGS[stop];
    if (leg) leg.clips.forEach((k) => { need(k); if (V[k] && k !== STOP_CLIP[stop]) seekTo(V[k], 0); });
  }
  async function exitVoo() {                          // P2 → saída: toca d3 e libera a página
    const token = ++run; busy = true; setState('exit');
    setText(null);
    let scrollP = null;
    const startScroll = () => { if (!scrollP) scrollP = scrollPast(token); };
    const ok = await whenReady(['d3'], READY_MS);
    if (token !== run) return;
    if (ok) {
      await playForward(['d3'], LEGS[2].T, (f, tot) => { setMeter(FILM_OFF.d3 + f); if (f / tot >= EXIT_SCROLL_AT) startScroll(); }, token);
      atEnd = token === run;
    }
    startScroll();
    await scrollP;
    if (token !== run) return;
    busy = false; setState('free');
    if (atEnd && section.getBoundingClientRect().bottom <= 1) jumpRest(2);   // já fora da tela: quem subir encontra a P2
  }
  function scrollPast(token) {                        // rola até o topo da seção seguinte
    const next = section.nextElementSibling;
    const y = next ? Math.round(next.getBoundingClientRect().top + window.scrollY) : window.innerHeight;
    autoScroll = true;
    swallow = true;
    setMode('free');
    return new Promise((res) => {
      let ended = false;
      const fin = () => { if (ended) return; ended = true; autoScroll = false; res(); };
      const L = lenis();
      if (L) L.scrollTo(y, { duration: EXIT_SCROLL_DUR, easing: easeInOutCubic, lock: true, force: true, onComplete: fin });
      else {
        const y0 = window.scrollY, t0 = performance.now();
        const st = (now) => {
          if (token !== run) return fin();
          const k = clamp((now - t0) / 1000 / EXIT_SCROLL_DUR);
          window.scrollTo(0, y0 + (y - y0) * easeInOutCubic(k));
          if (k < 1) requestAnimationFrame(st); else fin();
        };
        requestAnimationFrame(st);
      }
      setTimeout(fin, (EXIT_SCROLL_DUR + 0.8) * 1000);
    });
  }
  async function settle() {                           // reentrada com o vídeo no fim de d3: volta suave até a P2
    const token = ++run; busy = true; setState('settle');
    setText('agua');
    const v = V.d3;
    if (v) await playBackward(['d3'], SETTLE_DUR, v.currentTime, (f) => setMeter(FILM_OFF.d3 + f), token);
    if (token !== run) return;
    atEnd = false;
    arrive(2);
    prepare();
  }
  function jumpRest(i) {                              // sem animação (Home, foco no hero, link no meio do trecho)
    run++; busy = false; atEnd = false; pauseAll();
    const k = STOP_CLIP[i];
    if (V[k]) seekTo(V[k], 0).then(() => { if (!busy && stop === i) showClip(k); });
    else showClip(null);
    arrive(i);
    if (mode === 'free') setState('free');           // assentou fora do voo: o estado continua 'free'
    prepare();
  }

  function go(dir) {
    if (busy) return;
    if (dir > 0) { if (stop < 2) travel(stop); else exitVoo(); }
    else if (stop > 0) travelBack(stop - 1);
  }

  /* ---------- entrada: rodinha/trackpad, toque, teclado ---------- */
  let lastWheel = -1e9, burstUsed = false, acc = 0, fine = false, swallow = false;
  const navOpen = () => !!document.querySelector('[data-nav][data-open]');
  function onWheel(e) {
    const now = performance.now();
    const gap = now - lastWheel; lastWheel = now;
    if (mode === 'free') {                            // resto da rajada que saiu do voo: não rola a página adiante
      if (swallow && gap < IDLE_MS) { if (e.cancelable) e.preventDefault(); e.stopPropagation(); return; }
      swallow = false; return;
    }
    if (e.ctrlKey) return;                            // pinça de zoom
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();                              // o Lenis (parado) não precisa ver
    if (gap > IDLE_MS) { burstUsed = false; acc = 0; fine = false; }
    if (busy) { burstUsed = true; return; }           // rajada que começou durante o trecho não conta depois
    if (burstUsed || navOpen()) return;
    let dy = e.deltaY, dx = e.deltaX;
    if (e.deltaMode === 0 && Math.abs(dy) < FINE_DELTA) fine = true;   // pixels finos: trackpad (rodinha manda ~100 por tique)
    if (e.deltaMode === 1) { dy *= 40; dx *= 40; } else if (e.deltaMode === 2) { dy *= window.innerHeight; dx *= window.innerWidth; }
    if (Math.abs(dy) < Math.abs(dx)) return;          // gesto horizontal
    acc += dy;
    if (Math.abs(acc) >= (fine ? TRACKPAD_MIN : WHEEL_MIN)) { burstUsed = true; reentered = false; go(Math.sign(acc)); }
  }
  let tY = 0, tX = 0, tUsed = true, tNoBack = false;
  function onTouchStart(e) {
    if (e.touches.length !== 1) { tUsed = true; return; }
    tY = e.touches[0].clientY; tX = e.touches[0].clientX;
    tUsed = busy || mode === 'free';                  // um toque que começa durante o trecho não conta
    // reentrada pelo topo: quem só queria chegar ao topo costuma emendar outro swipe; até REENTRY_BACK_MS
    // depois do repouso, esse toque não leva de volta (P2→P1). Para a frente continua valendo.
    tNoBack = reentered && (tUsed || performance.now() - restAt < REENTRY_BACK_MS);
    if (!userReady) { userReady = true; for (const k in V) primeVideo(V[k]); }
  }
  function onTouchMove(e) {
    if (mode === 'free') return;
    if (navOpen() && e.target.closest && e.target.closest('[data-nav]')) return;
    if (e.cancelable) e.preventDefault();             // sem rolagem nem pull-to-refresh no voo
    if (tUsed || busy || e.touches.length !== 1) { tUsed = true; return; }
    const dy = tY - e.touches[0].clientY, dx = tX - e.touches[0].clientX;
    if (Math.abs(dy) > SWIPE_MIN && Math.abs(dy) > Math.abs(dx) * 1.2) {
      tUsed = true;
      if (dy < 0 && tNoBack) return;                  // swipe para trás logo depois da reentrada: ignorado
      reentered = false; go(Math.sign(dy));
    }
  }
  function onKey(e) {
    if (mode === 'free' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    let dir = 0;
    switch (e.key) {
      case 'ArrowDown': case 'PageDown': case 'Down': dir = 1; break;
      case 'ArrowUp': case 'PageUp': case 'Up': dir = -1; break;
      case ' ': case 'Spacebar':
        if (t && t.closest && t.closest('button, [role="button"], summary')) return;
        dir = e.shiftKey ? -1 : 1; break;
      case 'Home': e.preventDefault(); if (!e.repeat && stop !== 0) jumpRest(0); return;
      case 'End': e.preventDefault(); if (!e.repeat) skipIntro(false); return;   // End = Pular abertura
      default: return;
    }
    e.preventDefault();
    if (e.repeat || busy) return;
    go(dir);
  }
  /* rodinha com o cursor sobre a barra de rolagem nativa: o navegador rola sem disparar 'wheel'.
     Sem botão apertado (não é arrasto), essa rolagem vale como gesto do voo: volta ao 0 e avança. */
  let overBar = false, btnDown = false;
  const onBar = (e) => e.clientX >= root.clientWidth && root.clientWidth < window.innerWidth;
  window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') overBar = onBar(e); }, { passive: true, capture: true });
  window.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') { btnDown = true; overBar = onBar(e); } }, { passive: true, capture: true });
  window.addEventListener('mousedown', (e) => { btnDown = true; overBar = onBar(e); }, { passive: true, capture: true });   // o clique na barra não gera pointerdown em todo navegador
  window.addEventListener('mouseup', () => { btnDown = false; }, { passive: true, capture: true });
  window.addEventListener('pointerup', () => { btnDown = false; }, { passive: true, capture: true });
  document.addEventListener('mouseleave', () => { overBar = false; });
  function barWheel() {
    window.scrollTo(0, 0);
    const now = performance.now();
    const gap = now - lastWheel; lastWheel = now;
    if (gap > IDLE_MS) burstUsed = false;
    if (busy) { burstUsed = true; return; }
    if (burstUsed || navOpen()) return;
    burstUsed = true; go(1);
  }

  window.addEventListener('wheel', onWheel, { passive: false, capture: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
  window.addEventListener('keydown', onKey, { capture: true });

  /* Home fora do voo (modo 'free'): volta ao topo e cai na P0 (hero com CTA), não na parada guardada.
     Fase de bolha: abas, rádios e gráficos que usam Home (preventDefault) continuam com a tecla. */
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Home' || mode !== 'free' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    e.preventDefault();
    swallow = false; autoScroll = false;
    jumpRest(0);                                      // aborta a saída em curso, se houver
    const L = lenis();
    if (L) L.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    if (window.scrollY < 2) onScroll();               // já no topo: reentra agora
  });

  /* "Pular abertura" (link e tecla End): solta a trava e vai para a seção 02. Não é atalho de gesto. */
  const skipLink = section.querySelector('[data-voo-skip]');
  const nextSec = () => document.getElementById('intervalo') || section.nextElementSibling;
  function skipIntro(viaClick) {
    if (busy) { const s = section.dataset.vooState; jumpRest(clamp(s === 'travel' ? stop + 1 : s === 'back' ? stop - 1 : 2, 0, 2)); }
    run++; busy = false; swallow = false; autoScroll = false;
    setState('free'); setMode('free');
    const t = nextSec();
    if (!viaClick && t) {                              // tecla End: rola daqui (no clique, o core.js rola)
      const L = lenis();
      if (L) L.scrollTo(t, { offset: -8, force: true }); else t.scrollIntoView({ behavior: 'smooth' });
    }
    if (t) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); try { t.focus({ preventScroll: true }); } catch (e) {} }
  }
  if (skipLink) skipLink.addEventListener('click', () => skipIntro(true));

  /* links "#..." (menu, CTA, Como funciona): saem do voo e o core.js rola */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || (mode === 'free' && !busy)) return;
    const href = a.getAttribute('href');
    if (href === '#voo' || href === '#inicio' || href === '#') {
      if (mode !== 'free') { e.preventDefault(); e.stopPropagation(); if (stop !== 0) jumpRest(0); }
      return;
    }
    if (busy) {                                       // no meio do trecho: assenta na parada mais próxima
      const s = section.dataset.vooState;
      const target = s === 'travel' ? stop + 1 : s === 'back' ? stop - 1 : 2;
      jumpRest(clamp(target, 0, 2));
    }
    swallow = false;
    setState('free'); setMode('free');               // o handler do core.js (Lenis.scrollTo) roda depois deste
  }, true);

  /* a janela rolou sem gesto do voo (barra de rolagem, busca, foco, âncora) ou voltou ao topo */
  function onScroll() {
    const y = window.scrollY;
    section.style.setProperty('--voo-seam', clamp(y / (window.innerHeight * 0.55)).toFixed(3));
    if (autoScroll) return;
    if (mode === 'free' && y < 2) {                   // voltou ao topo: entra no voo pela parada atual (P2 depois da saída)
      setMode('voo');
      if (y > 0) window.scrollTo(0, 0);               // assenta no pixel 0 (o Lenis pode parar em fração)
      burstUsed = true; lastWheel = performance.now(); tUsed = true;   // a rajada que trouxe até aqui não conta
      reentered = true;                               // + trava de volta no toque (REENTRY_BACK_MS depois do repouso)
      if (busy) return;
      setState('rest');
      if (atEnd) settle();
      else { restAt = performance.now(); if (stop > 0) cueRest(true); }
    } else if (mode === 'voo' && y > 0 && overBar && !btnDown) {
      barWheel();                                     // rodinha sobre a barra: gesto, não saída
    } else if (mode === 'voo' && y > 4) {
      if (busy && section.dataset.vooState !== 'exit') jumpRest(stop);
      setState('free'); setMode('free');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* fora da tela depois da saída: volta para a P2 em repouso (quem subir encontra a água) */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((en) => {
      onScreen = en.isIntersecting; syncCue();       // pausa a animação da dica (voo-cue) fora da tela
      if (!en.isIntersecting && atEnd && !busy) jumpRest(2);
      if (!en.isIntersecting && !busy) pauseAll();
    }), { threshold: 0 }).observe(section);
  }

  /* teclado: foco num CTA do hero fora da P0 volta o voo para a P0 */
  hero.addEventListener('focusin', () => { if (stop !== 0 || busy) jumpRest(0); });

  /* ---------- início ---------- */
  section.classList.add('voo--video-on');
  setStop(0); setText('hero'); setMeter(0); setState('rest');
  if (window.scrollY > 2) { setMode('free'); setState('free'); } else setMode('voo');
  // depois do load o navegador pode restaurar a rolagem: o onScroll solta o voo nesse caso
  return true;
}

/* ---------------------------------------------------------------- utilidades */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const easeIn = (x) => x * x * x;
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
/* janela: sobe de a até b, fica, desce de c até d */
const win = (p, a, b, c, d) => (p < a || p > d) ? 0 : p < b ? smooth(a, b, p) : p <= c ? 1 : 1 - smooth(c, d, p);
function rng(seed) { // mulberry32: cena sempre igual
  return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

const C = {
  ink2: '#050807', ink: '#0A100F', brand: '#0E5C4A', agua: '#3FB58E', agua2: '#39D0A8', menta: '#BFF0DC',
  paper: '#F2F5F3', areia: '#D8CCB4', musgo: '#A9B8B2',
  rBaixo: '#1F5F72', rLeve: '#2F8A7A', rMod: '#C9B13A', rAlto: '#E07A2E', rCrit: '#D13D2B',
};

/* Coreografia (p de 0 a 1) */
const T = { orbEnd: .30, descEnd: .44, outline: [.44, .51], heat: [.45, .555], diveStart: .66, line: [.70, .77], fade: [.95, .995] };
const BEATS = { hero: [-1, -1, .03, .11], orbita: [.10, .15, .27, .31], represa: [.43, .48, .62, .66], agua: [.72, .77, .945, .99] };
const STOPS = ['Órbita', 'Represa', 'Água'];
const stopOf = (p) => (p < .38 ? 0 : p < .70 ? 1 : 2);

/* hide=true só para o hero (tem links: apagado, não pode receber clique); as batidas
   ficam sempre na árvore de acessibilidade, escondidas apenas por opacidade */
function setVis(el, v, dy, hide) {
  if (!el) return;
  el.style.opacity = v.toFixed(3);
  el.style.transform = `translate3d(0, ${(dy * (1 - v)).toFixed(1)}px, 0)`;
  if (hide) el.style.pointerEvents = v > .5 ? '' : 'none';
}

/* ------------------------------------------------- represa genérica (inventada) */
/* espaço de textura 1400 × 1400; cada ponto: x, y, meia-largura */
const RES = {
  arms: [
    // canal principal, sinuoso, largo perto da barragem e fino na cabeceira
    [[1045, 1125, 44], [985, 1050, 66], [905, 995, 74], [820, 940, 66], [770, 860, 56], [700, 805, 52], [612, 790, 46], [548, 720, 40], [520, 628, 33], [452, 566, 27], [392, 492, 20], [352, 410, 14], [318, 330, 8], [300, 262, 3]],
    // braço maior, subindo para a direita
    [[905, 995, 50], [968, 905, 44], [1000, 822, 36], [1066, 768, 28], [1112, 700, 20], [1168, 650, 12], [1214, 612, 4]],
    // dedos curtos (afluentes afogados), lados alternados e comprimentos diferentes
    [[820, 940, 30], [760, 1002, 24], [700, 1034, 16], [646, 1082, 8], [616, 1112, 2]],
    [[700, 805, 28], [722, 726, 22], [776, 668, 16], [798, 600, 9], [842, 552, 3]],
    [[548, 720, 22], [470, 744, 15], [402, 776, 8], [350, 810, 2]],
    [[452, 566, 16], [520, 512, 11], [556, 452, 6], [584, 410, 2]],
    [[985, 1050, 24], [1056, 1016, 15], [1116, 998, 7], [1162, 1004, 2]],
    [[1066, 768, 14], [1052, 704, 9], [1034, 652, 3]],
    [[612, 790, 18], [604, 868, 12], [566, 926, 6], [546, 962, 2]],
    [[1000, 822, 12], [944, 790, 7], [906, 764, 2]],
    [[392, 492, 10], [330, 520, 6], [286, 548, 2]],
  ],
  river: [[1058, 1150], [1072, 1200], [1058, 1262], [1094, 1330], [1104, 1430]],
  bbox: [280, 250, 1225, 1125],
  dive: [872, 972],
};

let SHARED = null; // camadas pesadas, criadas uma vez
function samplesOf() {
  const r = rng(7);
  const out = [];
  RES.arms.forEach((pts, ai) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const n = Math.max(2, Math.round(len / 3));
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t;
        const cr = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        const x = cr(p0[0], p1[0], p2[0], p3[0]);
        const y = cr(p0[1], p1[1], p2[1], p3[1]);
        const s = (ai * 997 + i * 61 + j) * 0.9;
        const wob = 1 + 0.16 * Math.sin(s * 0.11 + ai) + 0.1 * Math.sin(s * 0.31 + ai * 3);
        const rad = Math.max(6, lerp(p1[2], p2[2], t) * wob);
        out.push([x, y, rad]);
        if (j % 9 === 0 && r() < 0.55 && rad > 8) { // enseadas
          const dx = p2[0] - p1[0], dy = p2[1] - p1[1], dl = Math.hypot(dx, dy) || 1;
          const side = r() < 0.5 ? -1 : 1;
          out.push([x + (-dy / dl) * rad * 0.85 * side, y + (dx / dl) * rad * 0.85 * side, rad * (0.28 + r() * 0.22)]);
        }
      }
    }
  });
  return out;
}

function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function buildShared(TS) {
  const k = TS / 1400;
  const S = samplesOf();
  const blobs = (g, expand, style) => {
    g.fillStyle = style; g.beginPath();
    for (const [x, y, r] of S) { g.moveTo((x + r + expand) * k, y * k); g.arc(x * k, y * k, Math.max(0.5, (r + expand) * k), 0, Math.PI * 2); }
    g.fill();
  };
  const hasFilter = 'filter' in makeCanvas(1, 1).getContext('2d');

  /* máscara da água */
  const mask = makeCanvas(TS, TS); const m = mask.getContext('2d');
  blobs(m, 0, '#fff');

  /* água com variação de tom */
  const water = makeCanvas(TS, TS); const w = water.getContext('2d');
  w.fillStyle = '#0b3533'; w.fillRect(0, 0, TS, TS);
  const wr = rng(11);
  for (let i = 0; i < 26; i++) {
    const x = (380 + wr() * 840) * k, y = (230 + wr() * 900) * k, rr = (60 + wr() * 160) * k;
    const g = w.createRadialGradient(x, y, 0, x, y, rr);
    const light = wr() < 0.6;
    g.addColorStop(0, light ? 'rgba(26,96,88,.55)' : 'rgba(6,36,34,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    w.fillStyle = g; w.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  // reflexo de céu claro
  const sk = w.createLinearGradient(0, 0, TS, TS);
  sk.addColorStop(0, 'rgba(191,240,220,.10)'); sk.addColorStop(.5, 'rgba(191,240,220,0)'); sk.addColorStop(1, 'rgba(216,204,180,.06)');
  w.fillStyle = sk; w.fillRect(0, 0, TS, TS);
  w.globalCompositeOperation = 'destination-in'; w.drawImage(mask, 0, 0);

  /* margem, mata ciliar, clareiras, rio e barragem */
  const res = makeCanvas(TS, TS); const g = res.getContext('2d');
  const cr = rng(23);
  for (let i = 0; i < 38; i++) { // manchas de vegetação em escala grande
    const x = cr() * TS, y = cr() * TS, rr = (70 + cr() * 220) * k;
    const gg = g.createRadialGradient(x, y, 0, x, y, rr);
    const kind = cr();
    const col = kind < .45 ? 'rgba(40,74,46,.45)' : kind < .8 ? 'rgba(6,18,12,.45)' : 'rgba(92,90,64,.28)';
    gg.addColorStop(0, col); gg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  if (hasFilter) g.filter = `blur(${Math.round(10 * k)}px)`;
  blobs(g, 34, 'rgba(34,66,42,.7)');        // mata ciliar mais viva
  if (hasFilter) g.filter = `blur(${Math.max(1, Math.round(3 * k))}px)`;
  blobs(g, 6, 'rgba(104,98,74,.5)');        // faixa estreita de margem exposta
  if (hasFilter) g.filter = 'none';
  // rio a jusante
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = '#0a2c2a'; g.lineWidth = 9 * k; g.beginPath();
  RES.river.forEach(([x, y], i) => (i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k))); g.stroke();
  g.drawImage(water, 0, 0);
  // barragem: perpendicular ao canal
  const [a, b] = [RES.arms[0][0], RES.arms[0][1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy);
  const nx = -dy / dl, ny = dx / dl, half = a[2] + 12;
  g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 9 * k; g.beginPath();
  g.moveTo((a[0] + nx * half + 3) * k, (a[1] + ny * half + 5) * k); g.lineTo((a[0] - nx * half + 3) * k, (a[1] - ny * half + 5) * k); g.stroke();
  g.strokeStyle = '#c9d1cc'; g.lineWidth = 6 * k; g.beginPath();
  g.moveTo((a[0] + nx * half) * k, (a[1] + ny * half) * k); g.lineTo((a[0] - nx * half) * k, (a[1] - ny * half) * k); g.stroke();

  /* contorno da água (a IA separa a água) */
  const outline = makeCanvas(TS, TS); const o = outline.getContext('2d');
  blobs(o, 3.2, C.menta);
  o.globalCompositeOperation = 'destination-out'; blobs(o, 0, '#000');

  /* mapa de calor ilustrativo: só parte do espelho, escala sem verde */
  const heat = makeCanvas(TS, TS); const h = heat.getContext('2d');
  const spots = [
    [612, 790, 120, C.rBaixo, .8], [548, 720, 95, C.rBaixo, .7], [905, 995, 120, C.rBaixo, .75], [770, 860, 90, C.rBaixo, .7], [722, 726, 70, C.rBaixo, .6],
    [700, 805, 95, C.rLeve, .85], [820, 940, 85, C.rLeve, .8], [968, 905, 90, C.rLeve, .85], [520, 628, 60, C.rLeve, .65],
    [1000, 822, 80, C.rMod, .95], [776, 668, 50, C.rMod, .7], [660, 800, 46, C.rMod, .6],
    [1066, 768, 52, C.rAlto, .95], [1012, 812, 30, C.rAlto, .7],
    [1084, 748, 20, C.rCrit, 1],
  ];
  for (const [x, y, rr, col, al] of spots) {
    const gg = h.createRadialGradient(x * k, y * k, 0, x * k, y * k, rr * k);
    gg.addColorStop(0, rgba(col, al)); gg.addColorStop(.55, rgba(col, al * .55)); gg.addColorStop(1, rgba(col, 0));
    h.fillStyle = gg; h.fillRect((x - rr) * k, (y - rr) * k, rr * 2 * k, rr * 2 * k);
  }
  // leitura em grade (cara de mapa de dados), recortada pela água em alta definição
  const cell = Math.max(4, Math.round(11 * k));
  const lo = makeCanvas(Math.ceil(TS / cell), Math.ceil(TS / cell)); const lg = lo.getContext('2d');
  lg.drawImage(heat, 0, 0, lo.width, lo.height);
  h.clearRect(0, 0, TS, TS); h.imageSmoothingEnabled = false;
  h.drawImage(lo, 0, 0, lo.width * cell, lo.height * cell);
  h.globalCompositeOperation = 'destination-in'; h.drawImage(mask, 0, 0);

  /* dossel de mata em mosaico (preenche além da textura) */
  const TILE = 260; const tile = makeCanvas(TILE, TILE); const tg = tile.getContext('2d');
  tg.fillStyle = '#10221a'; tg.fillRect(0, 0, TILE, TILE);
  const tr = rng(5); const cols = ['#132a1f', '#173323', '#1c3b27', '#0b1912', '#21402b', '#183020'];
  for (let i = 0; i < 1100; i++) {
    const x = tr() * TILE, y = tr() * TILE, rr = 1.5 + tr() * 5.5;
    tg.fillStyle = cols[(tr() * cols.length) | 0]; tg.globalAlpha = .55 + tr() * .45;
    for (const ox of [-TILE, 0, TILE]) for (const oy of [-TILE, 0, TILE]) {
      if (x + ox + rr < 0 || x + ox - rr > TILE || y + oy + rr < 0 || y + oy - rr > TILE) continue;
      tg.beginPath(); tg.arc(x + ox, y + oy, rr, 0, Math.PI * 2); tg.fill();
    }
  }
  tg.globalAlpha = 1;

  /* sprites de partículas (algas suspensas) */
  const sprite = (col, soft) => {
    const s = 64; const c = makeCanvas(s, s); const x = c.getContext('2d');
    const gg = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    if (soft) { gg.addColorStop(0, rgba(col, .9)); gg.addColorStop(.4, rgba(col, .35)); gg.addColorStop(1, rgba(col, 0)); }
    else { gg.addColorStop(0, rgba(col, 1)); gg.addColorStop(.28, rgba(col, .95)); gg.addColorStop(.42, rgba(col, .25)); gg.addColorStop(1, rgba(col, 0)); }
    x.fillStyle = gg; x.fillRect(0, 0, s, s); return c;
  };
  const pcols = [C.agua, C.agua2, '#9BE3C0', C.menta, '#7FD4A8'];
  const sprites = pcols.map((c) => [sprite(c, false), sprite(c, true)]);

  return { TS, k, res, outline, heat, tile, sprites };
}

/* ------------------------------------------------------------------- cena */
function createScene(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  const R = rng(3);
  let quality = 1; // cai sozinho em aparelho lento (ver degrade)
  let W = 1, H = 1, dpr = 1, portrait = false, pattern = null, earthLayer = null, underBg = null, rayLayer = null;
  const textSide = opts.textSide !== false; // no modo vivo o texto ocupa a esquerda (desktop) ou a base (mobile)

  const stars = Array.from({ length: 240 }, () => ({ x: R(), y: R(), s: .4 + R() * 1.1, a: .25 + R() * .6, f: .5 + R() * 2, ph: R() * 6.28 }));
  const puffs = Array.from({ length: 9 }, (_, i) => ({ a: (i / 9) * 6.28 + R() * .5, r: .35 + R() * .35, s: .16 + R() * .2 }));
  let parts = [], colonies = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    portrait = W / H < 0.9;
    let d = Math.min(window.devicePixelRatio || 1, 2) * quality;
    const budget = portrait ? 2e6 : 3e6;
    if (W * H * d * d > budget) d = Math.sqrt(budget / (W * H));
    dpr = d;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    if (!SHARED) SHARED = buildShared(portrait || W < 900 ? 1000 : 1400);
    pattern = ctx.createPattern(SHARED.tile, 'repeat');
    const n = portrait ? 200 : 300;
    const pr = rng(9);
    parts = Array.from({ length: n }, () => { const soft = pr() < .16; return { x: pr(), y: pr() * 1.4, z: .1 + pr() * .9, r: soft ? 1 + pr() * .9 : .8 + pr() * 1.6, c: (pr() * 5) | 0, soft, ph: pr() * 6.28, sp: .4 + pr() }; });
    colonies = Array.from({ length: portrait ? 18 : 34 }, () => { const m = 3 + ((pr() * 4) | 0), a = pr() * 6.28; const cells = []; let x = 0, y = 0; for (let i = 0; i < m; i++) { cells.push([x, y]); x += Math.cos(a + (pr() - .5)); y += Math.sin(a + (pr() - .5)); } return { x: pr(), y: pr() * 1.4, z: .2 + pr() * .8, c: (pr() * 3) | 0, ph: pr() * 6.28, cells }; });
    earthLayer = buildEarth();
    buildUnder();
  }

  /* ---------------- órbita */
  function earthGeom() {
    if (portrait) return { cx: W * .78, top: H * .37, R: W * 2.4 };
    return textSide ? { cx: W * .9, top: H * .54, R: W * 1.55 } : { cx: W * .72, top: H * .5, R: W * 1.5 };
  }
  function satPos(p) {
    const q = clamp(p / .36);
    if (portrait) return { x: lerp(W * .3, W * .74, q), y: H * .17 + Math.sin(q * 3) * 4, s: 30 };
    if (textSide) return { x: lerp(W * .6, W * .84, q), y: H * .22, s: 44 };
    return { x: lerp(W * .32, W * .66, q), y: H * .2, s: 34 };
  }
  function drawSat(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.22 + Math.sin(t * .4) * .02);
    // painéis (duas barras de cada lado, como no logo)
    for (const side of [-1, 1]) {
      for (const yy of [-.13, .03]) {
        const x0 = side < 0 ? -s * .66 : s * .17, w = s * .49, h = s * .1;
        ctx.fillStyle = '#245b63'; ctx.fillRect(x0, yy * s, w, h);
        ctx.strokeStyle = 'rgba(191,240,220,.55)'; ctx.lineWidth = .7; ctx.strokeRect(x0 + .35, yy * s + .35, w - .7, h - .7);
        ctx.strokeStyle = 'rgba(191,240,220,.22)'; ctx.beginPath();
        for (let i = 1; i < 4; i++) { ctx.moveTo(x0 + (w * i) / 4, yy * s); ctx.lineTo(x0 + (w * i) / 4, yy * s + h); }
        ctx.stroke();
      }
      ctx.fillStyle = '#9fb0aa'; ctx.fillRect(side < 0 ? -s * .17 : s * .11, -s * .02, s * .06, s * .04);
    }
    // corpo e antena
    ctx.fillStyle = '#dde6e2'; ctx.fillRect(-s * .11, -s * .32, s * .22, s * .6);
    ctx.fillStyle = 'rgba(10,16,15,.25)'; ctx.fillRect(s * .02, -s * .32, s * .09, s * .6);
    ctx.fillStyle = '#dde6e2'; ctx.beginPath(); ctx.arc(0, s * .38, s * .1, Math.PI, 0); ctx.fill();
    ctx.fillRect(-s * .02, s * .28, s * .04, s * .1);
    // brilho
    const gl = Math.max(0, Math.sin(t * 1.3)) ** 6;
    if (gl > .02) { const g = ctx.createRadialGradient(s * .4, -s * .08, 0, s * .4, -s * .08, s * .5); g.addColorStop(0, `rgba(255,255,255,${.7 * gl})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-s, -s, s * 2, s * 2); }
    ctx.restore();
  }
  function buildEarth() {
    const { cx, top, R: ER } = earthGeom();
    const cy = top + ER;
    const s = Math.min(dpr, 1.5);
    const c = makeCanvas(Math.max(1, Math.round(W * s)), Math.max(1, Math.round(H * s)));
    const g = c.getContext('2d'); g.scale(s, s);
    const limbY = (x) => cy - Math.sqrt(Math.max(0, ER * ER - (x - cx) * (x - cx)));
    // atmosfera
    const ag = g.createRadialGradient(cx, cy, ER * .985, cx, cy, ER * 1.045);
    ag.addColorStop(0, 'rgba(63,181,142,.5)'); ag.addColorStop(.25, 'rgba(57,208,168,.2)'); ag.addColorStop(1, 'rgba(57,208,168,0)');
    g.fillStyle = ag; g.beginPath(); g.arc(cx, cy, ER * 1.045, 0, Math.PI * 2); g.fill();
    // disco
    const eg = g.createRadialGradient(cx, cy, ER * .9, cx, cy, ER);
    eg.addColorStop(0, '#06100d'); eg.addColorStop(.8, '#0a1814'); eg.addColorStop(.975, '#123329'); eg.addColorStop(1, '#2a6d5c');
    g.fillStyle = eg; g.beginPath(); g.arc(cx, cy, ER, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(cx, cy, ER, 0, Math.PI * 2); g.clip();
    // terras e nuvens achatadas pela perspectiva perto da borda
    const er = rng(31);
    const place = (u, depth) => { // u: posição ao longo da tela (0..1), depth: px abaixo da borda
      const x = u * W; const y = limbY(x) + depth;
      const ang = Math.atan2(x - cx, cy - y);
      return [x, y, ang];
    };
    const blurOk = 'filter' in g;
    if (blurOk) g.filter = 'blur(3px)';
    for (let i = 0; i < 22; i++) {
      const depth = Math.pow(er(), 1.4) * H * .45 + 6;
      const [x, y, ang] = place(er() * 1.1 - .05, depth);
      const w = (.06 + er() * .2) * W; const f = clamp(depth / (H * .45));
      g.fillStyle = er() < .7 ? 'rgba(28,66,46,.42)' : 'rgba(70,74,52,.3)';
      g.save(); g.translate(x, y); g.rotate(ang); g.beginPath(); g.ellipse(0, 0, w, w * (.04 + .3 * f), 0, 0, Math.PI * 2); g.fill(); g.restore();
    }
    if (blurOk) g.filter = 'blur(1.5px)';
    for (let i = 0; i < 46; i++) {
      const depth = Math.pow(er(), 1.8) * H * .3 + 3;
      const [x, y, ang] = place(er() * 1.1 - .05, depth);
      const w = (.015 + er() * .07) * W; const f = clamp(depth / (H * .45));
      g.fillStyle = `rgba(226,236,232,${.04 + er() * .1})`;
      g.save(); g.translate(x, y); g.rotate(ang);
      for (let j = 0; j < 3; j++) { g.beginPath(); g.ellipse((j - 1) * w * .7, (er() - .5) * w * .1 * f, w * (.5 + er() * .5), Math.max(.8, w * (.025 + .1 * f)), 0, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
    if (blurOk) g.filter = 'none';
    // noite à esquerda, amanhecer à direita
    const tg = g.createLinearGradient(cx - ER * .5, 0, cx + ER * .02, 0);
    tg.addColorStop(0, 'rgba(3,6,5,.8)'); tg.addColorStop(1, 'rgba(3,6,5,0)');
    g.fillStyle = tg; g.fillRect(0, 0, W, H);
    // brilho difuso perto da borda (espessura da atmosfera vista de lado)
    const rim = g.createRadialGradient(cx, cy, ER * .96, cx, cy, ER);
    rim.addColorStop(0, 'rgba(63,181,142,0)'); rim.addColorStop(1, 'rgba(63,181,142,.22)');
    g.fillStyle = rim; g.fillRect(0, 0, W, H);
    g.restore();
    g.strokeStyle = 'rgba(191,240,220,.62)'; g.lineWidth = 1.3; g.beginPath(); g.arc(cx, cy, ER, 0, Math.PI * 2); g.stroke();
    // luz do amanhecer (areia, nunca laranja)
    const dx = Math.min(cx, W * 1.02), dy = limbY(dx);
    g.globalCompositeOperation = 'lighter';
    const dg = g.createRadialGradient(dx, dy, 0, dx, dy, W * .45);
    dg.addColorStop(0, 'rgba(216,204,180,.28)'); dg.addColorStop(.35, 'rgba(216,204,180,.07)'); dg.addColorStop(1, 'rgba(216,204,180,0)');
    g.fillStyle = dg; g.fillRect(dx - W * .5, dy - W * .5, W, W);
    return c;
  }
  function drawOrbit(p, t, alpha) {
    const { cx, top, R: ER } = earthGeom();
    const cy = top + ER;
    const limbY = (x) => cy - Math.sqrt(Math.max(0, ER * ER - (x - cx) * (x - cx)));
    const sat = satPos(p);
    const F = { x: clamp(sat.x, 0, W), y: limbY(clamp(sat.x, 0, W)) + 10 };
    const z = 1 + 5 * easeIn(smooth(.27, T.descEnd, p));
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(F.x, F.y); ctx.scale(z, z); ctx.translate(-F.x, -F.y);
    for (const s of stars) {
      const x = s.x * W, y = s.y * (top + 40) - p * 30;
      const a = s.a * (.7 + .3 * Math.sin(t * s.f + s.ph));
      ctx.fillStyle = `rgba(230,240,236,${a})`; ctx.fillRect(x, y, s.s, s.s);
    }
    ctx.drawImage(earthLayer, 0, 0, W, H);
    // feixe sutil
    ctx.globalCompositeOperation = 'lighter';
    const I = .4 + .6 * smooth(.04, .15, p);
    const bw = (portrait ? W * .3 : W * .13);
    const bg = ctx.createLinearGradient(0, sat.y, 0, F.y);
    bg.addColorStop(0, 'rgba(57,208,168,0)'); bg.addColorStop(1, `rgba(57,208,168,${.14 * I})`);
    ctx.fillStyle = bg; ctx.beginPath();
    ctx.moveTo(sat.x - 1, sat.y + sat.s * .4); ctx.lineTo(sat.x + 1, sat.y + sat.s * .4);
    ctx.lineTo(F.x + bw / 2, F.y); ctx.lineTo(F.x - bw / 2, F.y); ctx.closePath(); ctx.fill();
    const fg = ctx.createRadialGradient(F.x, F.y, 0, F.x, F.y, bw * .6);
    fg.addColorStop(0, `rgba(191,240,220,${.32 * I})`); fg.addColorStop(1, 'rgba(191,240,220,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(F.x, F.y, bw * .6, bw * .1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 2; i++) { // anéis de varredura
      const q = (((t * .35 + i * .5) % 1) + 1) % 1;
      ctx.strokeStyle = `rgba(191,240,220,${.35 * (1 - q) * I})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(F.x, F.y, bw * .5 * q, bw * .08 * q, 0, 0, Math.PI * 2); ctx.stroke();
    }
    drawSat(sat.x + Math.sin(t * .5) * 2, sat.y + Math.cos(t * .4) * 2, sat.s, t);
    ctx.restore();
    return F;
  }

  /* ---------------- represa vista de cima */
  function repCamera(p) {
    const [x0, y0, x1, y1] = RES.bbox; const bw = x1 - x0, bh = y1 - y0;
    let ax, ay, rw, rh;
    if (portrait) { ax = W * .5; ay = H * .4; rw = W * .86; rh = H * .38; }
    else if (textSide) { ax = W * .69; ay = H * .5; rw = W * .46; rh = H * .7; }
    else { ax = W * .5; ay = H * .57; rw = W * .7; rh = H * .7; } // quadro estático: cantoneiras inteiras
    const s0 = Math.min(rw / bw, rh / bh);
    let fx = (x0 + x1) / 2, fy = (y0 + y1) / 2;
    const eIn = easeOut(smooth(.30, T.descEnd, p));
    let sc = s0 * lerp(.3, 1, eIn);
    let rot = lerp(-.22, 0, eIn) - .04 * smooth(T.descEnd, T.diveStart, p);
    sc *= 1 + .06 * smooth(T.descEnd, T.diveStart, p);
    const eD = Math.pow(smooth(T.diveStart - .01, .725, p), 2.2);
    const m = smooth(T.diveStart, .71, p);
    fx = lerp(fx, RES.dive[0], m); fy = lerp(fy, RES.dive[1], m);
    ax = lerp(ax, W / 2, m); ay = lerp(ay, H / 2, m);
    sc *= Math.pow(26, eD);
    return { ax, ay, sc, rot, fx, fy };
  }
  function drawRepresa(p, t, alpha) {
    const cam = repCamera(p);
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(cam.ax, cam.ay); ctx.rotate(cam.rot); ctx.scale(cam.sc, cam.sc); ctx.translate(-cam.fx, -cam.fy);
    // mata
    ctx.fillStyle = pattern; ctx.fillRect(-2400, -2400, 6200, 6200);
    ctx.drawImage(SHARED.res, 0, 0, 1400, 1400);
    // contorno (separa a água)
    const oa = smooth(T.outline[0], T.outline[1], p) * (1 - smooth(T.diveStart, .69, p));
    if (oa > 0) {
      ctx.globalAlpha = alpha * oa * (.75 + .25 * Math.sin(t * 2.2));
      ctx.drawImage(SHARED.outline, 0, 0, 1400, 1400);
      ctx.globalAlpha = alpha;
    }
    // mapa de calor com varredura
    const hp = smooth(T.heat[0], T.heat[1], p);
    const ha = .9 * (1 - smooth(T.diveStart + .005, .695, p));
    const [bx0, by0, bx1, by1] = RES.bbox;
    if (hp > 0 && ha > 0) {
      const sx = lerp(bx0 - 20, bx1 + 30, hp);
      ctx.save(); ctx.beginPath(); ctx.rect(bx0 - 40, by0 - 40, sx - bx0 + 40, by1 - by0 + 80); ctx.clip();
      ctx.globalAlpha = alpha * ha; ctx.drawImage(SHARED.heat, 0, 0, 1400, 1400);
      ctx.restore();
      if (hp < 1) { // linha de varredura
        const la = Math.sin(Math.PI * hp) * alpha;
        const lg = ctx.createLinearGradient(sx - 60, 0, sx, 0);
        lg.addColorStop(0, 'rgba(191,240,220,0)'); lg.addColorStop(1, `rgba(191,240,220,${.22 * la})`);
        ctx.fillStyle = lg; ctx.fillRect(sx - 60, by0 - 30, 60, by1 - by0 + 60);
        ctx.fillStyle = `rgba(191,240,220,${.9 * la})`; ctx.fillRect(sx - 1.2 / cam.sc, by0 - 30, 2.4 / cam.sc, by1 - by0 + 60);
      }
    }
    // cantoneiras de enquadramento: a represa inteira
    const ba = smooth(T.descEnd, .48, p) * (1 - smooth(.63, .68, p));
    if (ba > 0) {
      const L = 26 / cam.sc, pad = 30;
      ctx.strokeStyle = `rgba(191,240,220,${.75 * ba * alpha})`; ctx.lineWidth = 1.5 / cam.sc;
      const cs = [[bx0 - pad, by0 - pad, 1, 1], [bx1 + pad, by0 - pad, -1, 1], [bx0 - pad, by1 + pad, 1, -1], [bx1 + pad, by1 + pad, -1, -1]];
      ctx.beginPath();
      for (const [x, y, sx2, sy2] of cs) { ctx.moveTo(x + L * sx2, y); ctx.lineTo(x, y); ctx.lineTo(x, y + L * sy2); }
      ctx.stroke();
    }
    ctx.restore();
    // vinheta
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.hypot(W, H) * .62);
    vg.addColorStop(0, 'rgba(5,8,7,0)'); vg.addColorStop(1, `rgba(5,8,7,${.6 * alpha})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  /* ---------------- superfície e subaquático */
  function drawRipples(t, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const rows = portrait ? 16 : 20;
    for (let i = 0; i < rows; i++) {
      const y0 = ((i + .5) / rows) * H;
      ctx.strokeStyle = `rgba(191,240,220,${a * (.05 + .05 * Math.sin(i * 1.7))})`; ctx.lineWidth = 1.2 + (i % 3) * .5;
      ctx.beginPath();
      for (let x = -10; x <= W + 10; x += 18) {
        const y = y0 + Math.sin(x * .012 + t * .9 + i) * 6 + Math.sin(x * .031 - t * .6 + i * 2) * 3;
        x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function wavy(y, t, amp) {
    ctx.moveTo(-10, y);
    for (let x = -10; x <= W + 10; x += 14) ctx.lineTo(x, y + Math.sin(x * .014 + t * 1.4) * amp + Math.sin(x * .037 - t) * amp * .4);
  }
  function buildUnder() {
    const s = .5;
    const bgc = makeCanvas(Math.max(1, Math.round(W * s)), Math.max(1, Math.round(H * s)));
    const g = bgc.getContext('2d'); g.scale(s, s);
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#4fa08b'); bg.addColorStop(.22, '#25786a'); bg.addColorStop(.55, '#0E5C4A'); bg.addColorStop(1, '#04201b');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const hz = g.createRadialGradient(W * .5, -H * .1, 0, W * .5, -H * .1, H * .9);
    hz.addColorStop(0, 'rgba(191,240,220,.35)'); hz.addColorStop(1, 'rgba(191,240,220,0)');
    g.fillStyle = hz; g.fillRect(0, 0, W, H);
    const rc = makeCanvas(Math.max(1, Math.round(W * 1.2 * s)), Math.max(1, Math.round(H * s)));
    const r = rc.getContext('2d'); r.scale(s, s);
    if ('filter' in r) r.filter = `blur(${Math.round(Math.max(W, H) * .012)}px)`;
    const rr = rng(41);
    const n = portrait ? 5 : 7;
    for (let i = 0; i < n; i++) {
      const x = (i + .2 + rr() * .6) / n * W * 1.2, w = (.03 + rr() * .07) * W, lean = W * (.08 + rr() * .08);
      const gg = r.createLinearGradient(0, 0, 0, H * .95);
      gg.addColorStop(0, `rgba(222,245,236,${.16 + rr() * .14})`); gg.addColorStop(.6, 'rgba(222,245,236,.05)'); gg.addColorStop(1, 'rgba(222,245,236,0)');
      r.fillStyle = gg; r.beginPath();
      r.moveTo(x, -20); r.lineTo(x + w, -20); r.lineTo(x + w * 2.2 + lean, H * .95); r.lineTo(x + lean - w * .4, H * .95); r.closePath(); r.fill();
    }
    underBg = bgc; rayLayer = rc;
  }
  function drawUnder(p, t) {
    const u = clamp((p - T.line[0]) / (1 - T.line[0]));
    ctx.drawImage(underBg, 0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = .75 + .25 * Math.sin(t * .6);
    ctx.drawImage(rayLayer, -W * .1 + Math.sin(t * .22) * W * .025, 0, W * 1.2, H);
    ctx.restore();
    // colônias: pequenas cadeias de células
    const sp = SHARED.sprites;
    for (const c of colonies) {
      const yy = (((c.y - u * c.z * 1.1) % 1.4) + 1.4) % 1.4 * H - H * .2 + Math.sin(t * .45 + c.ph) * 5;
      const xx = c.x * W + Math.sin(t * .2 + c.ph) * 12 * c.z;
      const sz = (1.4 + c.z * 2.2);
      ctx.globalAlpha = .45 + .5 * c.z;
      for (const [ox, oy] of c.cells) ctx.drawImage(sp[c.c][0], xx + ox * sz * 1.5 - sz, yy + oy * sz * 1.5 - sz, sz * 2, sz * 2);
    }
    // partículas suspensas, com profundidade
    for (const q of parts) {
      const yy = (((q.y - u * q.z * 1.2) % 1.4) + 1.4) % 1.4 * H - H * .2 + Math.sin(t * .5 * q.sp + q.ph) * 6;
      const xx = q.x * W + Math.sin(t * .25 * q.sp + q.ph) * 14 * q.z;
      const sz = q.soft ? q.r * (3 + q.z * 7) : q.r * (1.1 + q.z * 2.2);
      ctx.globalAlpha = q.soft ? .22 + .35 * q.z : .55 + .45 * q.z;
      ctx.drawImage(sp[q.c][q.soft ? 1 : 0], xx - sz, yy - sz, sz * 2, sz * 2);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- quadro completo */
  function render(p, t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = C.ink2; ctx.fillRect(0, 0, W, H);

    const orbA = 1 - smooth(.35, .42, p);
    if (orbA > 0) drawOrbit(p, t, orbA);

    const repA = smooth(.31, .40, p);
    if (repA > 0 && p < T.line[1] + .01) {
      drawRepresa(p, t, repA);
      // perto da superfície só há água: espelho uniforme com ondulação
      const wa = smooth(.68, .72, p);
      if (wa > 0) {
        const wg = ctx.createLinearGradient(0, 0, 0, H);
        wg.addColorStop(0, rgba('#1b5e58', wa)); wg.addColorStop(1, rgba('#0a3532', wa));
        ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H);
      }
      drawRipples(t, smooth(.665, .72, p));
    }

    // descida por entre nuvens
    const va = Math.sin(Math.PI * clamp((p - .3) / .13));
    if (va > 0.01) {
      ctx.save();
      const k = clamp((p - .3) / .13);
      for (const f of puffs) {
        const rr = Math.min(W, H) * f.s * (1 + k * 2.2);
        const d = Math.min(W, H) * f.r * (.4 + k * 1.6);
        const x = W / 2 + Math.cos(f.a) * d, y = H / 2 + Math.sin(f.a) * d;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
        g.addColorStop(0, `rgba(232,242,238,${.07 * va})`); g.addColorStop(1, 'rgba(232,242,238,0)');
        ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
      ctx.fillStyle = `rgba(232,242,238,${.03 * va})`; ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // linha d'água subindo: a câmera rompe a superfície
    if (p > T.line[0]) {
      const e = easeOut(smooth(T.line[0], T.line[1], p));
      const ly = lerp(H * 1.08, -H * .12, e);
      ctx.save(); ctx.beginPath(); wavy(ly, t, 9); ctx.lineTo(W + 10, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
      drawUnder(p, t);
      ctx.restore();
      if (ly > -H * .1) {
        const mg = ctx.createLinearGradient(0, ly - 6, 0, ly + 40);
        mg.addColorStop(0, 'rgba(242,245,243,0)'); mg.addColorStop(.18, 'rgba(242,245,243,.55)'); mg.addColorStop(1, 'rgba(191,240,220,0)');
        ctx.save(); ctx.beginPath(); wavy(ly - 6, t, 9); ctx.lineTo(W + 10, ly + 46); ctx.lineTo(-10, ly + 46); ctx.closePath(); ctx.clip();
        ctx.fillStyle = mg; ctx.fillRect(0, ly - 20, W, 70); ctx.restore();
        ctx.strokeStyle = 'rgba(242,245,243,.8)'; ctx.lineWidth = 1.6; ctx.beginPath(); wavy(ly, t, 9); ctx.stroke();
      }
    }

    // luz difusa e passagem para a seção clara
    const l = smooth(.80, .97, p);
    if (l > 0) {
      const g = ctx.createRadialGradient(W * .5, -H * .2, 0, W * .5, -H * .2, Math.hypot(W, H));
      g.addColorStop(0, `rgba(242,245,243,${.55 * l})`); g.addColorStop(1, 'rgba(242,245,243,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    const f = smooth(T.fade[0], T.fade[1], p);
    if (f > 0) { ctx.fillStyle = `rgba(242,245,243,${f})`; ctx.fillRect(0, 0, W, H); }
  }

  /* reduz a resolução do canvas quando os quadros ficam lentos */
  function degrade() { if (quality <= .5) return false; quality = Math.max(.5, quality * .7); resize(); return true; }

  return { resize, render, degrade };
}

/* ------------------------------------------------------------- modo vivo */
function startLive(canvas, gsap, ST, ALG) {
  const pin = sec.querySelector('.voo__pin');
  const track = sec.querySelector('.voo__track');
  const hero = sec.querySelector('[data-voo-hero]');
  const beats = ['orbita', 'represa', 'agua'].map((id) => [id, sec.querySelector(`[data-beat="${id}"]`)]);
  const legend = sec.querySelector('.voo__legend');
  const cue = sec.querySelector('.voo__cue');
  const stops = [...sec.querySelectorAll('.voo__stops li')];
  const meter = sec.querySelector('.voo__meter-fill');
  const label = sec.querySelector('[data-voo-label]');
  const scrim = sec.querySelector('.voo__scrim');
  const live = sec.querySelector('[data-voo-live]');
  const stage = sec.querySelector('#voo-stage');
  const scene = createScene(canvas, { textSide: true });
  if (stage && stage.dataset.labelLive) stage.setAttribute('aria-label', stage.dataset.labelLive);

  let cost = 8, sampled = 0, idle = 0, target = 0, shown = 0, last = -1, visible = true, running = false, raf = 0, prevT = 0, lastStop = 0;
  const t0 = performance.now();

  function applyText(p) {
    const h = win(p, ...BEATS.hero);
    setVis(hero, h, -28, true);
    for (const [id, el] of beats) {
      const [a, b, c, d] = BEATS[id];
      const v = win(p, a, b, c, d);
      setVis(el, v, p < (b + c) / 2 ? 26 : -26);
    }
    if (legend) { const lv = win(p, .555, .585, .64, .67); /* só depois da varredura pintar o mapa inteiro */ setVis(legend, lv, 10); legend.style.visibility = lv < .01 ? 'hidden' : 'visible'; }
    const cueA = 1 - smooth(0, .035, p);
    if (cue) cue.style.opacity = cueA.toFixed(3);
    sec.classList.toggle('voo--cue-off', cueA < .01 || !visible);
    if (stops[0]) stops[0].parentElement.style.opacity = smooth(.025, .06, p).toFixed(3);
    const idx = stopOf(p);
    stops.forEach((li, i) => li.classList.toggle('is-on', i === idx));
    if (live && idx !== lastStop) { live.textContent = `Etapa ${idx + 1} de 3: ${STOPS[idx]}`; lastStop = idx; }
    if (meter) meter.style.transform = `scaleX(${clamp(p / .95).toFixed(4)})`;
    // o rótulo "ilustração" fica visível até o fim do voo; o HUD e o scrim saem junto com a passagem para a Névoa
    const out = 1 - smooth(.95, .99, p);
    if (label) { label.parentElement.style.opacity = '1'; const hud = label.parentElement.querySelector('.voo__hud'); if (hud) hud.style.opacity = out.toFixed(3); }
    if (scrim) scrim.style.opacity = (out * (1 - .45 * smooth(.3, .4, p) + .45 * smooth(.72, .78, p))).toFixed(3);
    // no fim o palco já é Névoa: avisa o nav (core lê data-theme da seção sob ele)
    const theme = p > .98 ? 'light' : 'dark';
    if (sec.getAttribute('data-theme') !== theme) sec.setAttribute('data-theme', theme);
  }

  function frame(now) {
    raf = 0;
    const dt = Math.min(.05, (now - (prevT || now)) / 1000); prevT = now;
    const k = 1 - Math.exp(-dt * 9);
    shown += (target - shown) * k;
    if (Math.abs(target - shown) < .0004) shown = target;
    const t = Math.max(0, (now - t0) / 1000);
    // parado: só a animação ambiente, a ~30 fps (economiza bateria e CPU)
    idle = target === shown ? idle + 1 : 0;
    if (idle > 2 && (idle & 1)) { if (running) raf = requestAnimationFrame(frame); return; }
    const r0 = performance.now();
    scene.render(shown, t);
    cost = cost * .9 + (performance.now() - r0) * .1;
    if (++sampled > 40 && cost > 14) { sampled = 0; cost = 8; if (scene.degrade()) scene.render(shown, t); }
    if (Math.abs(shown - last) > .00005) { applyText(shown); last = shown; }
    if (running) raf = requestAnimationFrame(frame);
  }
  const play = () => { if (running) return; running = true; prevT = 0; raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  const sync = () => (visible && !document.hidden ? play() : stop());

  scene.resize();
  scene.render(0, 0); applyText(0);

  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, (c) => {
    const desk = c.conditions.desk;
    sec.classList.toggle('voo--pinned', desk);
    const st = ST.create({
      trigger: desk ? pin : track,
      start: 'top top',
      end: desk ? '+=112%' : 'bottom bottom',
      pin: desk ? pin : false,
      pinSpacing: true,
      anticipatePin: desk ? 1 : 0,
      invalidateOnRefresh: true,
      onUpdate: (self) => { target = self.progress; if (!running) { shown = target; scene.render(shown, (performance.now() - t0) / 1000); applyText(shown); } },
      onRefresh: (self) => { target = self.progress; },
    });
    requestAnimationFrame(() => { scene.resize(); ST.refresh(); });
    return () => { sec.classList.remove('voo--pinned'); st.kill(); };
  });

  if ('ResizeObserver' in window) {
    let rq = 0;
    new ResizeObserver(() => { cancelAnimationFrame(rq); rq = requestAnimationFrame(() => { scene.resize(); scene.render(shown, (performance.now() - t0) / 1000); }); }).observe(sec.querySelector('#voo-stage'));
  }
  const offVis = (ALG.onVisible || ((el, cb) => { const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting))); io.observe(el); }));
  offVis(sec, (v) => { visible = v; sec.classList.toggle('voo--cue-off', !v || shown > .035); sync(); }, '0px');

  /* teclado: foco num CTA do hero já apagado leva a rolagem de volta ao topo da seção */
  hero.addEventListener('focusin', () => {
    if (win(shown, ...BEATS.hero) > .5) return;
    const y = sec.getBoundingClientRect().top + window.scrollY;
    if (ALG.lenis && ALG.lenis.scrollTo) ALG.lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  });
  document.addEventListener('visibilitychange', sync);
  sync();
}

/* ---------------------------------------------------------- modo estático */
function startStatic(canvas) {
  const items = [[canvas, .03, { textSide: true }]];
  // represa: varredura concluída, mapa inteiro e cantoneiras ainda visíveis
  const P = { orbita: .17, represa: .645, agua: .86 };
  sec.querySelectorAll('.voo__frame[data-frame]').forEach((fr) => {
    const c = document.createElement('canvas'); c.setAttribute('aria-hidden', 'true'); fr.insertBefore(c, fr.firstChild);
    items.push([c, P[fr.dataset.frame], { textSide: false }]);
  });
  const scenes = items.map(([c, p, o]) => [createScene(c, o), p]);
  const draw = () => scenes.forEach(([s, p]) => { s.resize(); s.render(p, 4); });
  draw();
  let rq = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(rq); rq = requestAnimationFrame(draw); });
}

/* inicia depois de todas as declarações (const/let não sobem) */
if (sec) boot();
