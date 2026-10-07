/* 02 intervalo: represa genérica, 3 pontos de coleta fixos, mancha fictícia em 4 passagens.
   Demonstração · dados fictícios. Sem datas e sem escala de distância (BRIEF regra 9). */
(function () {
  const sec = document.getElementById('intervalo');
  if (!sec) return;
  const ALG = window.ALG || {};
  const reduced = ALG.reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = sec.querySelector('.iv');
  const map = sec.querySelector('.iv__map');
  const blobs = [...sec.querySelectorAll('.iv__blob')];
  const passBtns = [...sec.querySelectorAll('[data-pass]')];
  const viewBtns = [...sec.querySelectorAll('[data-view]')].filter((b) => b.tagName === 'BUTTON');
  const playBtn = sec.querySelector('.iv__play');
  const caption = sec.querySelector('.iv__caption');
  const trailLine = sec.querySelector('.iv__trail-line');
  const trailG = sec.querySelector('.iv__trail');
  const pts = Object.fromEntries([...sec.querySelectorAll('.iv__pt')].map((g) => [g.dataset.p, g]));
  const tags = Object.fromEntries([...sec.querySelectorAll('.iv__tag')].map((t) => [t.dataset.tag, t]));
  const rows = Object.fromEntries([...sec.querySelectorAll('.iv__list li')].map((li) => [li.dataset.k, li]));

  const allHead = sec.querySelector('.iv__col--all .iv__col-h');
  const LEVEL_COLOR = ['', 'var(--r-leve)', 'var(--r-moderado)', 'var(--r-alto)', 'var(--r-critico)'];
  const PT_TEXT = ['Sem alteração', 'Alteração leve', 'Alteração moderada', 'Alteração alta'];
  const ARM_TEXT = ['Sem sinal', 'Sinal leve', 'Sinal moderado', 'Sinal alto'];

  // [cx, cy, r, nível]  r = 0 esconde. Seis manchas reaproveitadas entre passagens.
  const PASSES = [
    {
      blobs: [[702, 104, 46, 1], [654, 128, 30, 1], [356, 62, 0, 1], [392, 470, 0, 1], [600, 210, 0, 1], [600, 380, 0, 1]],
      core: [722, 98],
      pts: { A: 0, B: 0, C: 0 }, arms: { leste: 1, norte: 0, sul: 0 },
      text: 'Um sinal leve aparece no braço leste, longe de qualquer ponto de coleta.',
      only: 'Os três pontos registram água sem alteração. O braço leste fica sem dado.',
    },
    {
      blobs: [[664, 130, 44, 2], [712, 100, 30, 1], [356, 60, 24, 1], [392, 470, 0, 1], [600, 210, 0, 1], [600, 380, 0, 1]],
      core: [668, 134],
      pts: { A: 0, B: 0, C: 0 }, arms: { leste: 2, norte: 1, sul: 0 },
      text: 'A mancha cresce no braço leste e surge no braço norte. Os três pontos seguem sem alteração.',
      only: 'Os três pontos seguem sem alteração. Os braços leste e norte ficam sem dado.',
    },
    {
      blobs: [[628, 168, 58, 3], [690, 122, 40, 2], [356, 88, 36, 2], [390, 466, 26, 1], [566, 232, 32, 1], [600, 380, 0, 1]],
      core: [618, 174],
      pts: { A: 0, B: 0, C: 0 }, arms: { leste: 3, norte: 2, sul: 1 },
      text: 'O braço leste chega a sinal alto. Para quem vê só os pontos, a represa parece igual.',
      only: 'Nos pontos A, B e C, nada muda. Fora deles, a represa fica sem dado.',
    },
    {
      blobs: [[716, 104, 26, 1], [520, 372, 40, 2], [362, 118, 24, 1], [400, 440, 54, 3], [470, 400, 30, 2], [604, 378, 40, 1]],
      core: [430, 425], via: [[588, 262], [560, 330], [492, 372]],
      pts: { A: 1, B: 0, C: 0 }, arms: { leste: 1, norte: 1, sul: 3 },
      text: 'A mancha migra para o braço sul. Só a borda alcança o ponto A, que registra uma alteração leve.',
      only: 'Só o ponto A registra uma alteração leve. O resto da represa fica sem dado.',
    },
  ];

  // Estado inicial = passagem 3 (o HTML já vem assim): é o que se vê sem JS e com reduced motion.
  const START = 2;
  let cur = -1;
  let view = 'inteira';
  const SVGNS = 'http://www.w3.org/2000/svg';

  function setRow(key, level, texts) {
    const li = rows[key];
    if (!li) return;
    li.dataset.l = String(level);
    li.querySelector('.iv__v').textContent = texts[level];
  }

  // braços: no modo "só os pontos" quem opera não tem dado fora dos pontos
  function paintArms() {
    const s = PASSES[cur];
    if (!s) return;
    Object.entries(s.arms).forEach(([k, l]) => {
      if (view === 'pontos') {
        const li = rows[k];
        if (!li) return;
        li.dataset.l = 'x';
        li.querySelector('.iv__v').textContent = 'Sem dado';
      } else setRow(k, l, ARM_TEXT);
    });
  }

  function writeCaption() {
    const s = PASSES[cur];
    caption.textContent = `Passagem ${cur + 1}. ${view === 'pontos' ? s.only : s.text}`;
  }

  function render(i) {
    const s = PASSES[i];
    s.blobs.forEach(([cx, cy, r, l], k) => {
      const c = blobs[k];
      if (!c) return;
      // posição no <g> (translate) e tamanho no círculo (scale de r=1): só transform, sem mexer em
      // cx/cy/r. Mancha parada não recebe estilo novo: anima só fill/opacity se o nível mudar.
      const g = c.parentNode, pos = `translate(${cx}px, ${cy}px)`, size = `scale(${r})`;
      if (g.style.transform !== pos) g.style.transform = pos;
      if (c.style.transform !== size) c.style.transform = size;
      c.dataset.l = String(l);
    });
    Object.entries(s.pts).forEach(([k, l]) => {
      setRow(k, l, PT_TEXT);
      const hit = l > 0;
      if (pts[k]) { pts[k].classList.toggle('is-hit', hit); pts[k].style.setProperty('--hit', LEVEL_COLOR[l] || ''); }
      // tag mantém fundo ink (contraste AA); o nível vira anel colorido
      if (tags[k]) { tags[k].classList.toggle('is-hit', hit); tags[k].style.setProperty('--hit', LEVEL_COLOR[l] || ''); }
    });

    // rastro do núcleo da mancha até a passagem atual
    const path = PASSES.slice(0, i + 1).map((p) => p.core);
    const line = PASSES.slice(0, i + 1).flatMap((p) => [...(p.via || []), p.core]);
    trailLine.setAttribute('points', line.map((p) => p.join(',')).join(' '));
    trailG.querySelectorAll('.iv__trail-mark').forEach((n) => n.remove());
    path.forEach(([x, y], n) => {
      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'iv__trail-mark');
      g.setAttribute('transform', `translate(${x} ${y})`);
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('r', n === i ? 11 : 9); c.setAttribute('class', 'iv__trail-dot');
      const t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('class', 'iv__trail-n'); t.setAttribute('y', 0); t.setAttribute('dominant-baseline', 'central'); t.textContent = String(n + 1);
      g.append(c, t); trailG.appendChild(g);
    });

    passBtns.forEach((b, k) => {
      const on = k === i;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    const changed = i !== cur;
    cur = i;
    paintArms();
    if (changed) writeCaption();
  }

  function setView(v) {
    const changed = v !== view;
    view = v;
    map.dataset.view = v;
    root.dataset.view = v;
    viewBtns.forEach((b) => {
      const on = b.dataset.view === v;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (allHead) allHead.textContent = v === 'pontos' ? 'Fora dos pontos, quem opera tem' : 'A represa inteira mostra';
    paintArms();
    if (changed) writeCaption();
  }

  // ---------- autoplay: só visível (viewport e aba), só sem reduced-motion; para ao primeiro toque ----------
  const STEP = 4200;
  root.style.setProperty('--iv-step', STEP + 'ms');
  let timer = 0, playing = false, visible = false, userStopped = false;
  const live = () => visible && !document.hidden;

  function schedule() {
    clearTimeout(timer);
    root.classList.toggle('is-playing', playing && live());
    if (!playing || !live()) return;
    timer = setTimeout(() => { render((cur + 1) % PASSES.length); restartTick(); schedule(); }, STEP);
  }
  function restartTick() { // reinicia a animação da barra de progresso no botão ativo
    const t = passBtns[cur] && passBtns[cur].querySelector('.iv__tick');
    if (!t) return;
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  }
  function setPlaying(on) {
    playing = on;
    // durante o autoplay a legenda não é anunciada; volta a "polite" quando a troca vem do usuário
    caption.setAttribute('aria-live', on ? 'off' : 'polite');
    playBtn.setAttribute('aria-pressed', String(on));
    playBtn.setAttribute('aria-label', on ? 'Pausar as passagens' : 'Reproduzir as passagens');
    if (on) restartTick();
    schedule();
  }
  function userTook() { if (playing) { userStopped = true; setPlaying(false); } }

  // ---------- eventos ----------
  function radioKeys(btns, onPick) {
    btns.forEach((b, k) => b.addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (k + 1) % btns.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (k - 1 + btns.length) % btns.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = btns.length - 1;
      if (n === null) return;
      e.preventDefault(); onPick(n); btns[n].focus();
    }));
  }
  passBtns.forEach((b, k) => b.addEventListener('click', () => { userTook(); render(k); }));
  radioKeys(passBtns, (n) => { userTook(); render(n); });
  viewBtns.forEach((b) => b.addEventListener('click', () => { userTook(); setView(b.dataset.view); }));
  radioKeys(viewBtns, (n) => { userTook(); setView(viewBtns[n].dataset.view); });
  playBtn.addEventListener('click', () => {
    if (playing) { userStopped = true; setPlaying(false); }
    else { userStopped = false; setPlaying(true); }
  });
  document.addEventListener('visibilitychange', schedule);

  render(START);
  setView('inteira');
  playBtn.hidden = false;

  const watch = ALG.onVisible
    ? (cb) => ALG.onVisible(map, cb, '0px')
    : (cb) => { const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting))); io.observe(map); };
  let started = false;
  watch((v) => {
    visible = v;
    if (v && !started && !reduced && !userStopped) { started = true; setPlaying(true); return; }
    schedule();
  });
})();
