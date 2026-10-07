/* Como funciona: passo a passo (tabs) sobre uma represa genérica em canvas 2D.
   Tudo é demonstração com dados fictícios (contorno inventado, não corresponde a nenhum reservatório real).

   Desempenho (07/10/2026, queixa "pesado e lento"):
   - os pixels das camadas (água, margem, cor real, sinais) são calculados num Worker inline (Blob URL),
     disparado num momento ocioso assim que o módulo carrega (~1,5 tela antes da seção). O main thread só
     faz putImageData/drawImage, em fatias ociosas. Sem Worker, o mesmo gerador roda fatiado em
     requestIdleCallback; se a seção aparecer antes do fim, as fatias aceleram (setTimeout, ~40 ms cada)
     e a moldura mostra um estado de carregamento leve sobre o SVG de reserva;
   - a máscara da água só avalia cada braço dentro da sua caixa (antes: 37 segmentos por pixel);
   - o rAF só roda durante a transição do passo e com a seção na tela; o pulso do passo 4 é CSS. */
(function () {
  const sec = document.querySelector('.sec--como');
  if (!sec) return;
  const ALG = window.ALG || {};
  const reduced = ALG.reduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onVisible = ALG.onVisible || ((el, cb) => { const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting)), { rootMargin: '120px' }); io.observe(el); });
  const idle = (fn, timeout) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout }) : setTimeout(() => fn(null), 30));

  const W = 640, H = 400;
  const S = (ALG.isMobile ? ALG.isMobile() : window.innerWidth < 768) ? 1.25 : 2; // o canvas do celular não passa de ~720 px
  const HOT = { x: 196, y: 150 };         // núcleo fictício do sinal (braço noroeste)
  const DAM = { x: 604, y: 250 };
  const RISK = ['#1F5F72', '#2F8A7A', '#C9B13A', '#E07A2E', '#D13D2B'];

  // ---------- pixels das camadas: gerador autossuficiente (roda no Worker ou fatiado no main) ----------
  function* PIX(W, H) {
    const DAMX = 604, HX = 196, HY = 150, C = 5;
    function hash(x, y) { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; h ^= h >>> 16; return (h >>> 0) / 4294967295; }
    const sm = (t) => t * t * (3 - 2 * t);
    function vnoise(x, y) {
      const xi = Math.floor(x), yi = Math.floor(y), u = sm(x - xi), v = sm(y - yi);
      const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    }
    const g = (x, y, cx, cy, r) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * r * r));
    function field(x, y) {
      let f = 0.07 + 0.1 * (1 - x / W);
      f += 0.95 * g(x, y, HX, HY, 22) + 0.32 * g(x, y, 160, 126, 12);
      f += 0.5 * g(x, y, 100, 230, 30) + 0.44 * g(x, y, 436, 112, 18) + 0.3 * g(x, y, 376, 338, 16) + 0.16 * g(x, y, 300, 236, 36);
      f += 0.13 * (vnoise(x / 22, y / 22) - 0.5) + 0.06 * (vnoise(x / 8 + 40, y / 8) - 0.5);
      return Math.max(0, Math.min(1, f));
    }
    // [x, y, meia-largura] ao longo de cada braço; contorno inventado
    const NET = [
      [[604, 250, 30], [560, 247, 29], [512, 246, 27], [452, 238, 25], [384, 246, 22], [300, 234, 19], [232, 242, 16], [162, 228, 12], [104, 234, 9], [56, 222, 4], [36, 226, 1]],
      [[452, 238, 14], [446, 190, 12], [432, 142, 9], [440, 98, 6], [428, 62, 1.5]],
      [[300, 234, 13], [262, 196, 12], [218, 162, 10], [172, 130, 7], [132, 112, 2]],
      [[384, 246, 13], [394, 292, 11], [372, 334, 8], [384, 372, 2]],
      [[540, 247, 10], [548, 296, 7], [566, 332, 2]],
      [[232, 242, 8], [238, 282, 6], [214, 314, 1.5]],
      [[162, 228, 6], [148, 192, 4], [160, 166, 1]],
      [[446, 190, 6], [490, 172, 4], [524, 160, 1]],
      [[218, 162, 5], [232, 122, 3.5], [226, 94, 1]],
      [[512, 246, 7], [500, 206, 4], [512, 182, 1]],
      [[104, 234, 5], [96, 264, 3], [76, 286, 1]],
    ];
    const RGB = [[31, 95, 114], [47, 138, 122], [201, 177, 58], [224, 122, 46], [209, 61, 43]];
    const cls = (f) => (f < 0.24 ? 0 : f < 0.42 ? 1 : f < 0.6 ? 2 : f < 0.8 ? 3 : 4);
    const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const buf = (w, h) => ({ w, h, data: new Uint8ClampedArray(w * h * 4) });
    const put = (b, k, r, gg, bb, a) => { const d = b.data; d[k] = r; d[k + 1] = gg; d[k + 2] = bb; d[k + 3] = a; };

    // água: max(meia-largura - distância) só na caixa de cada segmento (além de 14 unidades o
    // resultado já é "terra longe" e sai igual ao cálculo completo), depois o ruído da margem
    const WV = new Float32Array(W * H).fill(-99);
    for (const arm of NET) for (let s = 0; s < arm.length - 1; s++) {
      const a = arm[s], b = arm[s + 1], vx = b[0] - a[0], vy = b[1] - a[1], l2 = vx * vx + vy * vy, m = Math.max(a[2], b[2]) + 14;
      const i0 = Math.max(0, Math.floor(Math.min(a[0], b[0]) - m)), i1 = Math.min(W - 1, Math.ceil(Math.max(a[0], b[0]) + m));
      const j0 = Math.max(0, Math.floor(Math.min(a[1], b[1]) - m)), j1 = Math.min(H - 1, Math.ceil(Math.max(a[1], b[1]) + m));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const x = i + .5, y = j + .5;
        let t = ((x - a[0]) * vx + (y - a[1]) * vy) / l2; t = t < 0 ? 0 : t > 1 ? 1 : t;
        const v = a[2] + (b[2] - a[2]) * t - Math.hypot(x - a[0] - vx * t, y - a[1] - vy * t), k = j * W + i;
        if (v > WV[k]) WV[k] = v;
      }
      yield;
    }
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) { const x = i + .5, y = j + .5, k = j * W + i; WV[k] = x > DAMX ? -9 : WV[k] + 5 * (vnoise(x / 13, y / 13) - .5) + 2.2 * (vnoise(x / 5 + 7, y / 5) - .5); }
      if ((j & 7) === 7) yield;
    }
    const A = (i, j) => { const v = WV[Math.min(H - 1, Math.max(0, j)) * W + Math.min(W - 1, Math.max(0, i))]; return v >= .5 ? 1 : v <= -.5 ? 0 : v + .5; };

    const mask = buf(W, H), edge = buf(W, H), landT = buf(W, H), landG = buf(W, H);
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const k = (j * W + i) * 4, a = A(i, j);
        put(mask, k, 255, 255, 255, a * 255);
        const e = a > .3 && (A(i - 1, j) < .3 || A(i + 1, j) < .3 || A(i, j - 1) < .3 || A(i, j + 1) < .3);
        put(edge, k, 191, 240, 220, e ? 255 : 0);
        // terra em cor real (mata, pasto, solo) e a mesma em cinza para a máscara
        const wv = WV[j * W + i], near = wv > 0 ? 0 : Math.max(0, 1 + wv / 9);
        const n = vnoise(i / 34, j / 34), mm = vnoise(i / 11 + 9, j / 11 + 3), p = vnoise(i / 70 + 3, j / 70);
        let c = mix([78, 84, 56], [34, 52, 38], Math.min(1, n * 1.3));
        if (p > .62) c = mix(c, [92, 82, 62], Math.min(1, (p - .62) * 3));
        c = mix(c, [24, 40, 30], near);
        const q = .86 + .2 * mm, r = c[0] * q, gg = c[1] * q, bb = c[2] * q;
        put(landT, k, r, gg, bb, 255);
        const l = (r * .3 + gg * .59 + bb * .11) * .42;
        put(landG, k, l + 4, l + 9, l + 8, 255);
      }
      if ((j & 3) === 3) yield;
    }
    const landD = buf(W / 4, H / 4), rawL = buf(W / 2, H / 2), waterT = buf(W / 2, H / 2), sig = buf(W / C, H / C), sigA = buf(W / C, H / C);
    for (let j = 0; j < H / 4; j++) for (let i = 0; i < W / 4; i++) { const v = 14 + 5 * vnoise(i / 10, j / 10); put(landD, (j * W / 4 + i) * 4, v, v + 7, v + 5, 255); }
    yield;
    for (let j = 0; j < H / 2; j++) {
      for (let i = 0; i < W / 2; i++) {
        const k = (j * W / 2 + i) * 4, v = 22 + 10 * vnoise(i / 12, j / 12) + 5 * hash(i, j);
        put(rawL, k, v, v + 5, v + 5, 255);
        const x = i * 2 + 1, y = j * 2 + 1, f = field(x, y);
        const c = mix([14, 38, 42], [76, 100, 46], Math.max(0, (f - .22) / .7) ** .9), q = .93 + .12 * vnoise(x / 6, y / 6);
        put(waterT, k, c[0] * q, c[1] * q, c[2] * q, 255);
      }
      if ((j & 7) === 7) yield;
    }
    for (let j = 0; j < H / C; j++) for (let i = 0; i < W / C; i++) {
      const k = (j * W / C + i) * 4, c = RGB[cls(field(i * C + C / 2, j * C + C / 2))];
      put(sig, k, c[0], c[1], c[2], 255);
      put(sigA, k, 255, 255, 255, WV[(j * C + 2) * W + i * C + 2] > 0 ? 255 : 0);
    }
    return { mask, edge, landT, landG, landD, rawL, waterT, sig, sigA };
  }

  // ---------- cálculo fora do main thread, montagem em fatias ----------
  let L = null, started = false, urgent = false, bufs = null;
  const onReady = [];
  const next = (fn) => (urgent ? setTimeout(fn, 0) : idle(fn, 2000));
  function startCompute() {
    if (started) return; started = true;
    try {
      const src = 'const PIX=' + PIX.toString() + ';onmessage=(e)=>{const it=PIX(e.data.W,e.data.H);let r;while(!(r=it.next()).done);const o=r.value;postMessage(o,Object.values(o).map((b)=>b.data.buffer));};';
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      const worker = new Worker(url);
      URL.revokeObjectURL(url);
      worker.onmessage = (e) => { worker.terminate(); bufs = e.data; assemble(); };
      worker.onerror = (e) => { if (e.preventDefault) e.preventDefault(); worker.terminate(); sliced(); };
      worker.postMessage({ W, H });
    } catch (e) { sliced(); }
  }
  // plano B sem Worker: o mesmo gerador, em fatias ociosas (ou de ~40 ms se a seção já está na tela)
  function sliced() {
    const it = PIX(W, H);
    const run = (dl) => {
      const budget = urgent ? 40 : Math.max(4, Math.min(12, dl && dl.timeRemaining ? dl.timeRemaining() : 12));
      const until = performance.now() + budget;
      let r;
      do { r = it.next(); if (r.done) { bufs = r.value; assemble(); return; } } while (performance.now() < until);
      next(run);
    };
    next(run);
  }

  function canvasOf(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function fromBuf(b) { const c = canvasOf(b.w, b.h); c.getContext('2d').putImageData(new ImageData(b.data, b.w, b.h), 0, 0); return c; }
  function assemble() {
    const src = {}, out = {};
    const layer = (land, water, mask, edgeA, crisp) => {
      const c = canvasOf(W * S, H * S), x = c.getContext('2d'); x.scale(S, S);
      x.imageSmoothingEnabled = true; x.drawImage(land, 0, 0, W, H);
      const wc = canvasOf(W * S, H * S), wx = wc.getContext('2d'); wx.scale(S, S);
      water(wx);
      wx.globalCompositeOperation = 'destination-in'; wx.imageSmoothingEnabled = !crisp; wx.drawImage(mask, 0, 0, W, H); wx.globalCompositeOperation = 'source-over';
      x.drawImage(wc, 0, 0, W, H);
      wc.width = wc.height = 0;
      if (edgeA) { x.globalAlpha = edgeA; x.drawImage(src.edge, 0, 0, W, H); x.globalAlpha = 1; }
      return c;
    };
    const gridLines = (x, step, color) => { x.strokeStyle = color; x.lineWidth = .5; x.beginPath(); for (let i = 0; i <= W; i += step) { x.moveTo(i, 0); x.lineTo(i, H); } for (let j = 0; j <= H; j += step) { x.moveTo(0, j); x.lineTo(W, j); } x.stroke(); };
    const dam = (k) => { // barragem: traço reto no fim do corpo principal
      const x = out[k].getContext('2d'); x.setTransform(S, 0, 0, S, 0, 0);
      x.strokeStyle = k === 'cor' ? 'rgba(200,196,180,.8)' : 'rgba(191,240,220,.7)'; x.lineWidth = 2.2; x.lineCap = 'round';
      x.beginPath(); x.moveTo(DAM.x + 1, DAM.y - 36); x.lineTo(DAM.x + 1, DAM.y + 36); x.stroke();
    };
    const tasks = [
      () => { for (const k in bufs) src[k] = fromBuf(bufs[k]); bufs = null; },
      () => { out.raw = layer(src.rawL, (x) => { x.drawImage(src.rawL, 0, 0, W, H); x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(0, 0, W, H); }, src.mask, 0); },
      () => { out.cor = layer(src.landT, (x) => { x.drawImage(src.waterT, 0, 0, W, H); }, src.mask, 0); dam('cor'); },
      () => { out.mask = layer(src.landG, (x) => { x.fillStyle = '#1B4A50'; x.fillRect(0, 0, W, H); gridLines(x, 8, 'rgba(191,240,220,.2)'); }, src.mask, .95); dam('mask'); },
      () => { out.sinal = layer(src.landD, (x) => { x.imageSmoothingEnabled = false; x.drawImage(src.sig, 0, 0, W, H); gridLines(x, 5, 'rgba(10,16,15,.3)'); }, src.sigA, .3, true); dam('sinal'); },
    ];
    const run = () => {
      tasks.shift()();
      if (tasks.length) { next(run); return; }
      L = out;
      onReady.splice(0).forEach((f) => f());
    };
    next(run);
  }

  // ---------- canvas helper ----------
  function surface(canvas) {
    const ctx = canvas.getContext('2d');
    const s = { canvas, ctx, w: 0, h: 0 };
    s.fit = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (w !== canvas.width || h !== canvas.height) { canvas.width = w; canvas.height = h; }
      s.w = w; s.h = h;
      ctx.setTransform(w / W, 0, 0, h / H, 0, 0);
    };
    s.layer = (name, alpha = 1) => { ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = true; ctx.drawImage(L[name], 0, 0, W, H); ctx.globalAlpha = 1; };
    return s;
  }
  const ease = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);

  // ===================================================================
  // Passo a passo
  // ===================================================================
  const flow = sec.querySelector('[data-como-flow]');
  const tabs = [...flow.querySelectorAll('[role="tab"]')];
  const panel = flow.querySelector('[role="tabpanel"]');
  const frame = flow.querySelector('.como__frame');
  const stage = flow.querySelector('[data-como-stage]');
  const copies = [...flow.querySelectorAll('[data-copy]')];
  const tag = flow.querySelector('[data-como-tag]');
  const histEl = flow.querySelector('[data-como-hist]');
  const tablist = flow.querySelector('[role="tablist"]');
  const copyEl = flow.querySelector('[data-como-copy]');
  const autoBtn = flow.querySelector('[data-como-auto]');
  const autoLabel = flow.querySelector('[data-como-auto-label]');
  const fs = surface(flow.querySelector('[data-como-canvas="flow"]'));
  const TAGS = ['Imagem da represa inteira', 'Água separada da margem', 'Mapa de sinais de algas', 'Regra acionada · ocorrência aberta'];
  sec.classList.add('is-enhanced');

  // histórico fictício: passagens 1 a 8, a 4 descartada por nuvem
  const HIST = [1, 1, 2, null, 2, 3, 3, 4]; // classe máxima de cada passagem (null = nuvem)
  histEl.innerHTML = HIST.map((c, i) => '<li class="como__pass' + (c === null ? ' is-cloud' : '') + (i === HIST.length - 1 ? ' is-new' : '') + '"><span class="como__pass-bar"' + (c === null ? '' : ' style="--c:' + RISK[c] + ';--h:' + (30 + c * 17) + '%"') + '></span><span class="como__pass-n mono">' + (i + 1) + '</span></li>').join('');

  let step = 0, t0 = performance.now(), raf = 0, visible = false;
  const DUR = [2600, 1500, 1700, 900];

  function drawFlow(now) {
    if (!L) return;
    fs.fit();
    const c = fs.ctx, t = reduced ? 1 : ease((now - t0) / DUR[step]), lin = reduced ? 1 : Math.min(1, (now - t0) / DUR[step]);
    c.clearRect(0, 0, W, H);
    if (step === 0) {
      // faixa da passagem: a imagem se forma ao longo do traço do satélite
      const dx = -0.24, dy = 1, n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
      const s = -60 + lin * (H + 200);
      fs.layer('raw');
      c.save(); c.beginPath();
      const px = -uy, py = ux, cx = 340 + ux * s, cy = uy * s;
      c.moveTo(cx + px * 900, cy + py * 900); c.lineTo(cx - px * 900, cy - py * 900);
      c.lineTo(cx - px * 900 - ux * 900, cy - py * 900 - uy * 900); c.lineTo(cx + px * 900 - ux * 900, cy + py * 900 - uy * 900);
      c.closePath(); c.clip(); fs.layer('cor'); c.restore();
      if (lin < 1) {
        c.save();
        const grad = c.createLinearGradient(cx - ux * 70, cy - uy * 70, cx, cy);
        grad.addColorStop(0, 'rgba(191,240,220,0)'); grad.addColorStop(1, 'rgba(191,240,220,.22)');
        c.fillStyle = grad; c.beginPath();
        c.moveTo(cx + px * 900, cy + py * 900); c.lineTo(cx - px * 900, cy - py * 900);
        c.lineTo(cx - px * 900 - ux * 70, cy - py * 900 - uy * 70); c.lineTo(cx + px * 900 - ux * 70, cy + py * 900 - uy * 70); c.fill();
        c.strokeStyle = 'rgba(191,240,220,.95)'; c.lineWidth = 1.4; c.beginPath();
        c.moveTo(cx + px * 900, cy + py * 900); c.lineTo(cx - px * 900, cy - py * 900); c.stroke();
        c.restore();
      }
      c.save(); c.setLineDash([3, 6]); c.strokeStyle = 'rgba(191,240,220,.45)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(340 - ux * 40, -uy * 40); c.lineTo(340 + ux * 520, uy * 520); c.stroke(); c.restore();
      if (lin < 1) { c.fillStyle = '#BFF0DC'; c.beginPath(); c.arc(cx, cy, 4, 0, 7); c.fill(); c.strokeStyle = 'rgba(191,240,220,.4)'; c.beginPath(); c.arc(cx, cy, 10, 0, 7); c.stroke(); }
    } else if (step === 1) {
      // máscara: a água se separa da margem, crescendo a partir da barragem
      fs.layer('cor');
      const r = 20 + t * 700;
      c.save(); c.beginPath(); c.arc(DAM.x, DAM.y, r, 0, 7); c.clip(); fs.layer('mask'); c.restore();
      if (t < 1) { c.save(); c.strokeStyle = 'rgba(191,240,220,.6)'; c.lineWidth = 1.2; c.beginPath(); c.arc(DAM.x, DAM.y, r, 0, 7); c.stroke(); c.restore(); }
    } else {
      const sweep = step === 2 ? t : 1;
      fs.layer('mask');
      const x = -10 + sweep * (W + 20);
      c.save(); c.beginPath(); c.rect(0, 0, x, H); c.clip(); fs.layer('sinal'); c.restore();
      if (sweep < 1) { c.save(); c.strokeStyle = 'rgba(191,240,220,.9)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); c.restore(); }
      if (step === 3) {
        // escurece o mapa e marca o ponto de interesse; o pulso do anel é CSS (.como__pulse), sem rAF
        c.save(); c.fillStyle = 'rgba(10,16,15,' + (0.3 * t) + ')'; c.fillRect(0, 0, W, H);
        c.strokeStyle = 'rgba(209,61,43,.95)'; c.lineWidth = 1.6; c.beginPath(); c.arc(HOT.x, HOT.y, 15, 0, 7); c.stroke();
        c.fillStyle = '#F2F5F3'; c.translate(HOT.x, HOT.y); c.rotate(Math.PI / 4); c.fillRect(-3.5, -3.5, 7, 7);
        c.restore();
      }
    }
  }

  // o rAF só roda enquanto a transição do passo anima e a seção está na tela
  function loop(now) {
    raf = 0;
    drawFlow(now);
    if (visible && !reduced && now - t0 < DUR[step] + 50) raf = requestAnimationFrame(loop);
  }
  const kick = () => { if (!raf && visible && L) raf = requestAnimationFrame(loop); };

  function setStep(i, fromUser) {
    i = (i + tabs.length) % tabs.length;
    if (fromUser) stopAuto();
    if (i === step && !fromUser) return;
    step = i; t0 = performance.now();
    tabs.forEach((b, k) => {
      const on = k === i;
      b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      b.classList.toggle('is-done', k < i);
    });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    copies.forEach((c, k) => c.classList.toggle('is-active', k === i));
    frame.setAttribute('data-step-state', String(i));
    tag.textContent = TAGS[i];
    if (!visible) drawFlow(performance.now() + 1e5);
    kick();
  }

  tabs.forEach((b, k) => {
    b.addEventListener('click', () => setStep(k, true));
    b.addEventListener('keydown', (e) => {
      const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let n = null;
      if (e.key in map) n = step + map[e.key]; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault(); setStep(n, true); tabs[step].focus();
    });
  });

  // autoplay: só com movimento permitido. O tempo de cada passo é a animação CSS do progresso dentro
  // da aba ativa (--como-dwell); o fim dela avança o passo. Fica parado fora da tela, com a aba do
  // navegador oculta, com o ponteiro ou o foco no passo a passo. Tocar/clicar numa aba ou na imagem
  // para a sequência de vez; o botão visível Pausar/Reproduzir (WCAG 2.2.2) continua valendo.
  const DWELL = 6200;
  const auto = { on: !reduced, hover: false, focus: false };
  flow.style.setProperty('--como-dwell', DWELL + 'ms');
  function syncAuto() {
    const hold = !visible || document.hidden || auto.hover || auto.focus;
    flow.classList.toggle('is-auto', auto.on);
    flow.classList.toggle('is-hold', auto.on && hold);
    sec.classList.toggle('is-off', !visible || document.hidden);
    // durante o autoplay o texto troca sozinho: o leitor de tela não deve anunciar cada passo
    copyEl.setAttribute('aria-live', auto.on ? 'off' : 'polite');
    autoLabel.textContent = auto.on ? 'Pausar' : 'Reproduzir';
    autoBtn.classList.toggle('is-stopped', !auto.on);
  }
  function stopAuto() { if (!auto.on) return; auto.on = false; syncAuto(); }
  function startAuto() {
    auto.on = true; auto.focus = false; auto.hover = false;
    flow.classList.remove('is-auto'); void flow.offsetWidth; // reinicia o progresso do passo atual
    syncAuto();
  }
  tablist.addEventListener('animationend', (e) => {
    if (!auto.on || e.animationName !== 'como-prog') return;
    setStep(step + 1, false);
  });
  if (!reduced) {
    autoBtn.hidden = false;
    autoBtn.addEventListener('click', () => (auto.on ? stopAuto() : startAuto()));
  }
  stage.addEventListener('pointerdown', stopAuto);
  // pausa por ponteiro/foco só nas abas e no painel; o botão continua respondendo ao clique
  [tablist, panel].forEach((el) => {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { auto.hover = true; syncAuto(); } });
    el.addEventListener('pointerleave', () => { auto.hover = false; syncAuto(); });
    el.addEventListener('focusin', () => { auto.focus = true; syncAuto(); });
    el.addEventListener('focusout', () => { auto.focus = false; syncAuto(); });
  });
  document.addEventListener('visibilitychange', syncAuto);
  syncAuto();

  onReady.push(() => {
    sec.classList.remove('is-loading');
    sec.classList.add('is-drawn');
    t0 = performance.now();
    if (visible) kick(); else drawFlow(t0 + 1e5);
  });

  onVisible(panel, (v) => { // observa o painel: no desktop o .como__flow é display: contents (sem caixa)
    visible = v;
    syncAuto();
    if (!v) return;
    if (L) { t0 = performance.now(); kick(); return; }
    urgent = true;                     // fatias passam de ociosas a ~40 ms (só no plano B, sem Worker)
    sec.classList.add('is-loading');
    startCompute();
  });

  // calcula as camadas num momento ocioso logo que o módulo carrega (a seção ainda está ~1,5 tela abaixo)
  const kickoff = () => idle(startCompute, 1500);
  if (document.readyState === 'complete') kickoff(); else window.addEventListener('load', kickoff, { once: true });

  let rz = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { if (!L) return; drawFlow(performance.now()); kick(); }); });
})();
