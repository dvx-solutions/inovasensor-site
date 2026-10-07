/* 04 painel: réplica interativa do app Algeye. Represas, pontos, passagens e números são
   FICTÍCIOS e gerados aqui (forma da represa + ruído + manchas). Estrutura, componentes e
   textos seguem o app real (apps/web/src), sem nome de índice, unidade técnica ou limiar.

   CONTORNOS DAS REPRESAS: 100% PROCEDURAIS E INVENTADOS. Cada represa é desenhada a partir
   de "braços" (listas de pontos x, y, raio escritas à mão em REPRESAS[].arms), unidos por
   mínimo suave e deformados por ruído determinístico (geom()). NÃO são traçados, decalques
   nem simplificações de nenhum reservatório real; não há coordenada geográfica, escala de
   distância nem fonte de imagem. Os nomes (Serra Verde, Vale do Cedro, Campo Sereno,
   Ribeirão Manso) também são inventados. Não substituir por contorno real (BRIEF, regra 7). */
(function () {
  const sec = document.getElementById('painel');
  if (!sec) return;
  const ax = sec.querySelector('.ax');
  if (!ax) return;
  const ALG = window.ALG || {};
  const reduced = ALG.reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = (k, r = ax) => r.querySelector(`[data-ax="${k}"]`);
  const qa = (s, r = ax) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt1 = (x) => x.toFixed(1).replace('.', ',');

  /* ================= escala e dados fictícios ================= */
  const CLS = ['Baixo', 'Moderado', 'Alto', 'Crítico'];
  const CVAR = ['var(--rk-low)', 'var(--rk-mid)', 'var(--rk-high)', 'var(--rk-crit)'];
  const CHEX = [[27, 107, 140], [201, 138, 16], [210, 96, 27], [179, 39, 36]];
  const CUTS = [0.26, 0.44, 0.62]; // interno da demonstração, nunca exibido
  const clsOf = (v) => (v < CUTS[0] ? 0 : v < CUTS[1] ? 1 : v < CUTS[2] ? 2 : 3);
  const CLSF = ['Baixa', 'Moderada', 'Alta', 'Crítica']; // concordância com "concentração"
  const NP = 24;
  const uteis = (r) => NP - r.cloudFull.length; // passagens com leitura útil no acervo
  const acervoTxt = (r) => { const u = uteis(r), d = NP - u; return `${u} de ${NP} passagens com leitura útil, ${d} ${d === 1 ? 'descartada' : 'descartadas'} por nuvem`; };
  // laudo fictício: número sem unidade na mesma régua das classes (laudo maior = classe mais alta)
  const LK = 66;
  const labCls = (l) => clsOf(l / LK);
  const WW = 720, WH = 460, CS = 4, GW = WW / CS, GH = WH / CS, N = GW * GH;

  const REPRESAS = [
    {
      key: 'serra-verde', nome: 'Represa Serra Verde', curto: 'Serra Verde', uso: 'Abastecimento público', area: '18,4', seed: 3,
      arms: [
        [[352, 426, 7], [354, 392, 24], [360, 340, 38], [370, 290, 44], [380, 238, 38], [392, 186, 28], [402, 136, 19], [410, 86, 8]],
        [[372, 274, 28], [430, 264, 30], [490, 252, 25], [550, 262, 22], [600, 250, 14], [646, 236, 5]],
        [[362, 304, 26], [300, 298, 25], [240, 312, 20], [180, 300, 14], [128, 286, 5]],
        [[384, 206, 22], [330, 174, 17], [280, 144, 11], [238, 116, 4]],
        [[494, 254, 13], [508, 212, 9], [520, 172, 4]],
        [[300, 300, 13], [270, 350, 9], [252, 392, 4]],
      ],
      dam: [[338, 428], [368, 428]],
      zones: [['braço leste', 568, 256], ['braço norte', 404, 120], ['braço noroeste', 300, 160], ['braço oeste', 196, 302], ['corpo central', 368, 292], ['perto da captação', 354, 392], ['enseada sul', 268, 352]],
      pois: [{ id: 'A', x: 552, y: 260 }, { id: 'B', x: 356, y: 384 }],
      base: [0.13, 0.025], lvl: [[0, 0], [12, 0.02], [17, 0.06], [21, 0.1], [23, 0.1]],
      blooms: [
        { x: 566, y: 254, rx: 84, ry: 30, k: [[0, 0.04], [8, 0.07], [12, 0.15], [16, 0.3], [19, 0.46], [21, 0.58], [23, 0.62]] },
        { x: 300, y: 158, rx: 54, ry: 30, k: [[0, 0], [13, 0.05], [19, 0.2], [23, 0.25]] },
        // episódio curto perto da captação (ponto B) nas passagens 5 a 7: base da OC-2019
        { x: 356, y: 382, rx: 40, ry: 26, k: [[0, 0], [3, 0], [5, 0.21], [7, 0.02], [8, 0]] },
      ],
      cloudFull: [2, 8], cloudPart: { 15: [[210, 300, 120], [300, 170, 80]] },
      ocs: [
        { id: 2041, nivel: 3, poi: 'A', pass: 21, estado: 'Aberta', txt: 'Regra de área acionada: faixa crítica no braço leste, perto do ponto A.' },
        { id: 2036, nivel: 2, poi: 'A', pass: 19, estado: 'Em análise', resp: 'Qualidade da água', txt: 'Sinal sobe no braço leste há três passagens e chega à faixa alta no ponto A.' },
        { id: 2019, nivel: 1, poi: 'B', pass: 6, estado: 'Resolvida', txt: 'Sinal moderado perto da captação.', res: 'Coleta conferiu sinal moderado. Rotina mantida.' },
      ],
      cols: [{ p: 20, poi: 'A', j: 1.4 }, { p: 17, poi: 'A', j: -1.1 }, { p: 12, poi: 'B', j: 'fora' }],
    },
    {
      key: 'vale-do-cedro', nome: 'Reservatório Vale do Cedro', curto: 'Vale do Cedro', uso: 'Geração de energia', area: '42,7', seed: 11,
      arms: [
        [[110, 386, 5], [168, 352, 17], [230, 322, 28], [300, 290, 36], [370, 252, 42], [440, 212, 38], [510, 172, 30], [570, 132, 21], [622, 96, 11], [664, 70, 4]],
        [[402, 236, 21], [420, 300, 19], [430, 360, 13], [424, 412, 4]],
        [[300, 290, 17], [282, 222, 15], [270, 160, 9], [262, 108, 4]],
        [[510, 172, 15], [542, 230, 12], [584, 272, 5]],
        [[200, 336, 10], [190, 392, 4]],
      ],
      dam: [[652, 62], [676, 80]],
      zones: [['corpo central', 410, 232], ['braço sul', 426, 350], ['braço norte', 276, 180], ['cauda do reservatório', 170, 352], ['perto da barragem', 610, 104], ['enseada leste', 552, 236]],
      pois: [{ id: 'A', x: 432, y: 222 }, { id: 'B', x: 236, y: 320 }],
      base: [0.1, 0.02], lvl: [[0, 0], [5, 0.05], [9, 0.11], [12, 0.11], [16, 0.04], [23, 0]],
      blooms: [
        { x: 420, y: 228, rx: 90, ry: 40, k: [[0, 0.02], [5, 0.12], [9, 0.32], [12, 0.38], [15, 0.22], [19, 0.1], [23, 0.14]] },
        { x: 190, y: 350, rx: 50, ry: 30, k: [[0, 0.08], [10, 0.16], [23, 0.12]] },
        // episódio curto no ponto B nas passagens 6 a 8: base da OC-1975
        { x: 236, y: 322, rx: 42, ry: 28, k: [[0, 0], [4, 0], [6, 0.15], [8, 0.02], [9, 0]] },
      ],
      cloudFull: [4, 13], cloudPart: { 18: [[520, 160, 110], [420, 220, 60]] },
      ocs: [
        { id: 1987, nivel: 2, poi: 'A', pass: 11, estado: 'Resolvida', txt: 'Faixa alta no corpo central.', res: 'Coleta no ponto A conferiu floração. Monitoramento intensificado por três passagens.' },
        { id: 1975, nivel: 1, poi: 'B', pass: 7, estado: 'Resolvida', txt: 'Sinal moderado na cauda do reservatório.', res: 'Sem alteração no laudo. Encerrada.' },
      ],
      cols: [{ p: 11, poi: 'A', j: 0.9 }, { p: 9, poi: 'A', j: -1.6 }],
    },
    {
      key: 'campo-sereno', nome: 'Represa Campo Sereno', curto: 'Campo Sereno', uso: 'Aquicultura', area: '6,2', seed: 23,
      arms: [
        [[250, 214, 52], [320, 236, 64], [400, 222, 58], [470, 252, 40], [520, 286, 18]],
        [[336, 240, 36], [348, 318, 34], [334, 384, 12]],
        [[214, 198, 26], [160, 170, 12], [122, 150, 4]],
        [[420, 214, 26], [452, 150, 15], [470, 112, 4]],
      ],
      dam: [[322, 394], [346, 394]],
      zones: [['lâmina central', 330, 236], ['braço sul', 346, 330], ['enseada oeste', 180, 182], ['braço norte', 452, 150], ['enseada leste', 500, 274]],
      pois: [{ id: 'A', x: 318, y: 238 }, { id: 'B', x: 462, y: 254 }],
      base: [0.08, 0.025],
      blooms: [{ x: 190, y: 186, rx: 46, ry: 30, k: [[0, 0.12], [9, 0.2], [14, 0.26], [23, 0.18]] }, { x: 490, y: 268, rx: 40, ry: 24, k: [[0, 0.05], [20, 0.16], [23, 0.2]] },
        // episódio curto no ponto B nas passagens 13 a 15: base da OC-1902
        { x: 462, y: 254, rx: 34, ry: 22, k: [[0, 0], [11, 0], [13, 0.22], [15, 0.02], [16, 0]] }],
      cloudFull: [6, 19], cloudPart: { 11: [[350, 220, 90], [200, 190, 50]] },
      ocs: [{ id: 1902, nivel: 1, poi: 'B', pass: 14, estado: 'Resolvida', txt: 'Sinal moderado na enseada leste.', res: 'Laudo dentro do esperado para a época. Encerrada.' }],
      cols: [{ p: 14, poi: 'B', j: 0.7 }],
    },
    {
      key: 'ribeirao-manso', nome: 'Reservatório Ribeirão Manso', curto: 'Ribeirão Manso', uso: 'Captação industrial', area: '11,9', seed: 37,
      arms: [
        [[90, 124, 4], [140, 152, 13], [200, 172, 19], [262, 162, 23], [322, 190, 27], [364, 248, 31], [424, 280, 33], [492, 272, 29], [552, 302, 25], [600, 350, 17], [632, 402, 6]],
        [[262, 162, 13], [252, 104, 9], [242, 62, 3]],
        [[424, 282, 15], [402, 350, 11], [384, 402, 4]],
        [[492, 272, 12], [530, 220, 8], [556, 186, 3]],
      ],
      dam: [[620, 410], [646, 398]],
      zones: [['trecho médio', 420, 280], ['cauda', 150, 154], ['braço norte', 254, 110], ['braço sul', 400, 360], ['perto da captação', 600, 352], ['curva central', 336, 214]],
      pois: [{ id: 'A', x: 418, y: 280 }, { id: 'B', x: 590, y: 336 }],
      base: [0.12, 0.03], lvl: [[0, 0], [13, 0.02], [17, 0.07], [20, 0.08], [23, 0.06]],
      blooms: [{ x: 420, y: 276, rx: 80, ry: 40, k: [[0, 0.05], [10, 0.1], [15, 0.26], [18, 0.4], [21, 0.44], [23, 0.4]] }, { x: 200, y: 168, rx: 60, ry: 30, k: [[0, 0.1], [23, 0.16]] }],
      cloudFull: [3, 10, 21], cloudPart: { 6: [[300, 180, 100], [480, 280, 70]] },
      ocs: [
        { id: 2048, nivel: 2, poi: 'A', pass: 19, estado: 'Coleta agendada', resp: 'Operação', txt: 'Faixa alta no trecho médio, perto do ponto A.' },
        { id: 2012, nivel: 1, poi: 'A', pass: 15, estado: 'Resolvida', txt: 'Sinal moderado no trecho médio.', res: 'Acompanhamento até a passagem seguinte. Encerrada.' },
      ],
      cols: [{ p: 16, poi: 'A', j: -0.8 }],
    },
  ];
  const LOC = (z) => (z.startsWith('perto') ? z : /^(enseada|cauda|lâmina|curva)/.test(z) ? 'na ' + z : 'no ' + z);
  const ZONE_OF = (r, x, y) => r.zones.reduce((b, z) => { const d = (z[1] - x) ** 2 + (z[2] - y) ** 2; return d < b[1] ? [z[0], d] : b; }, ['', 1e12])[0];

  /* ================= ruído determinístico ================= */
  const hash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const sm = (t) => t * t * (3 - 2 * t);
  const noise = (x, y, s) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  const keyAt = (k, p) => { if (p <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (p <= k[i][0]) { const t = (p - k[i - 1][0]) / (k[i][0] - k[i - 1][0]); return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * t; } return k[k.length - 1][1]; };

  /* ================= geometria e campos ================= */
  /* Desempenho: geom() e build() são geradores retomáveis. O cálculo pode ser fatiado em
     momentos ociosos (sliced(), 4 linhas da grade ou 1/5 de passagem por fatia) ou concluído de
     uma vez quando a tela precisa (geom()/build() síncronos retomam de onde a fatia parou). */
  const its = new Map();
  const itOf = (k, mk) => { if (!its.has(k)) its.set(k, mk()); return its.get(k); };
  const runIt = (it) => { let s; do s = it.next(); while (!s.done); };
  function geom(r) { if (!r.g) runIt(itOf('g' + r.key, () => geomGen(r))); return r.g; }
  function build(r) { if (!r.d) runIt(itOf('d' + r.key, () => buildGen(r))); return r.d; }
  function* geomGen(r) {
    if (r.g) return;
    const sdf = new Float32Array(N), water = new Uint8Array(N);
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, nW = 0;
    // braços adensados e com meandros (deslocamento perpendicular por ruído), unidos com
    // mínimo suave: as junções viram enseadas em vez de cruzes
    const arms = r.arms.map((arm, ai) => {
      const out = [];
      for (let s = 0; s < arm.length - 1; s++) {
        const [x0, y0, r0] = arm[s], [x1, y1, r1] = arm[s + 1];
        const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
        const steps = Math.max(2, Math.round(L / 9));
        for (let k = 0; k < steps; k++) {
          const t = k / steps, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, rr = r0 + (r1 - r0) * t;
          const m = s === 0 && k === 0 ? 0 : (noise(x / 52, y / 52, r.seed + ai * 13) - 0.5) * (rr * 1.3 + 22);
          out.push([x + nx * m, y + ny * m, Math.max(5, rr * (0.78 + 0.5 * noise(x / 20, y / 20, r.seed + ai * 7 + 3)))]);
        }
      }
      out.push(arm[arm.length - 1]);
      let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
      out.forEach(([x, y, w]) => { bx0 = Math.min(bx0, x - w); by0 = Math.min(by0, y - w); bx1 = Math.max(bx1, x + w); by1 = Math.max(by1, y + w); });
      return { pts: out, bb: [bx0 - 30, by0 - 30, bx1 + 30, by1 + 30] };
    });
    const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
    for (let j = 0; j < GH; j++) {
    if (j && !(j & 3)) yield;
    for (let i = 0; i < GW; i++) {
      const x = i * CS + CS / 2, y = j * CS + CS / 2;
      let d = 60;
      for (const arm of arms) {
        if (x < arm.bb[0] || y < arm.bb[1] || x > arm.bb[2] || y > arm.bb[3]) continue;
        const P = arm.pts; let da = 1e9;
        for (let s = 0; s < P.length - 1; s++) {
          const [x0, y0, r0] = P[s], [x1, y1, r1] = P[s + 1];
          const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy;
          let t = L ? ((x - x0) * dx + (y - y0) * dy) / L : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
          const ex = x - x0 - dx * t, ey = y - y0 - dy * t;
          const dd = Math.sqrt(ex * ex + ey * ey) - (r0 + (r1 - r0) * t);
          if (dd < da) da = dd;
        }
        d = smin(d, da, 16);
      }
      d += 8 * (noise(x / 15, y / 15, r.seed) - 0.5) + 3.5 * (noise(x / 6, y / 6, r.seed + 1) - 0.5);
      const n = j * GW + i;
      sdf[n] = d;
      if (d < 0) { water[n] = 1; nW++; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
    }
    if (!r.g) r.g = { sdf, water, nW, bb: { x: minX - 6, y: minY - 6, w: maxX - minX + 12, h: maxY - minY + 12 } };
  }

  function cloudy(r, p, x, y) {
    if (r.cloudFull.includes(p)) return true;
    const cs = r.cloudPart[p];
    if (!cs) return false;
    for (const [cx, cy, rr] of cs) { const k = 0.75 + 0.5 * noise(x / 30, y / 30, r.seed + 50 + p); if ((x - cx) ** 2 + (y - cy) ** 2 < (rr * k) ** 2) return true; }
    return false;
  }

  function valueAt(r, p, x, y, sd) {
    let v = r.base[0] + r.base[1] * Math.sin(p * 0.55 + r.seed) + 0.09 * (noise(x / 55, y / 55, r.seed) - 0.5) + 0.06 * (noise(x / 17 + p * 0.9, y / 17, r.seed + p) - 0.5);
    v += 0.07 * Math.exp(sd / 8);
    if (r.lvl) v += keyAt(r.lvl, p); // nível geral do espelho ao longo das passagens
    for (const b of r.blooms) {
      const a = keyAt(b.k, p);
      if (a > 0) v += a * Math.exp(-(((x - b.x) / b.rx) ** 2) - (((y - b.y) / b.ry) ** 2)) * (0.72 + 0.56 * noise(x / 22 + p * 0.4, y / 22, r.seed + 7));
    }
    return Math.max(0, Math.min(1, v));
  }

  function* buildGen(r) {
    if (r.d) return;
    if (!r.g) yield* itOf('g' + r.key, () => geomGen(r));
    const g = geom(r);
    const fields = [], stats = [];
    for (let p = 0; p < NP; p++) {
      yield;
      const f = new Float32Array(N).fill(-1);
      const full = r.cloudFull.includes(p);
      const c = [0, 0, 0, 0]; let vis = 0, sum = 0; const vals = [];
      for (let n = 0; n < N; n++) {
        if (n && !(n & 4095)) yield;
        if (!g.water[n]) continue;
        const x = (n % GW) * CS + CS / 2, y = ((n / GW) | 0) * CS + CS / 2;
        if (full || cloudy(r, p, x, y)) { f[n] = NaN; continue; }
        const v = valueAt(r, p, x, y, g.sdf[n]);
        f[n] = v; c[clsOf(v)]++; vis++; sum += v; vals.push(v);
      }
      fields.push(f);
      if (full) { stats.push(null); continue; }
      vals.sort((a, b) => a - b);
      const raw = c.map((x) => (x / vis) * 100), pct = raw.map(Math.floor);
      let rest = 100 - pct.reduce((a, b) => a + b, 0);
      raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { pct[i]++; rest--; } });
      const pois = r.pois.map((pt) => { const i = Math.floor(pt.x / CS), j = Math.floor(pt.y / CS); const v = f[j * GW + i]; return Number.isNaN(v) || v < 0 ? null : v; });
      stats.push({
        pct, share: ((c[2] + c[3]) / vis) * 100, crit: (c[3] / vis) * 100, mean: sum / vis,
        vis: Math.min(98, Math.round((vis / g.nW) * 100 - hash(p, 3, r.seed) * 3)),
        cls: clsOf(vals[Math.floor(vals.length * 0.8)]), meanCls: clsOf(sum / vis), peak: clsOf(vals[Math.floor(vals.length * 0.995)]), pois,
      });
    }
    const vs = stats.filter(Boolean).map((s) => s.mean);
    if (!r.d) r.d = { fields, stats, min: Math.min(...vs), max: Math.max(...vs) };
  }
  // cálculo fatiado em momentos ociosos: faz unidades (4 linhas da geometria ou 1/5 de passagem)
  // enquanto o navegador tiver folga; com o prazo estourado, faz uma unidade por chamada
  const ric = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 400 }) : (f) => setTimeout(() => f({ timeRemaining: () => 6 }), 30);
  function sliced(r, done) {
    if (r.d) { if (done) done(); return; }
    const it = itOf('d' + r.key, () => buildGen(r));
    const step = (dl) => {
      let s = { done: !!r.d };
      while (!s.done) { s = it.next(); if (dl.timeRemaining() < 4) break; }
      if (s.done || r.d) { if (done) done(); } else ric(step);
    };
    ric(step);
  }

  /* ================= estado ================= */
  const S = { view: 'home', r: REPRESAS[0], p: NP - 1, tab: 'mapa', layer: 'sinais', ocSel: null, ocFilter: 'todas', model: 'boletim', period: 6, secs: ['destaques', 'resumo', 'distribuicao', 'pontos', 'recomendacao'], resolving: false };
  REPRESAS.forEach((r) => { r.ocs.forEach((o) => { o.tl = seedTimeline(r, o); }); r.emitted = [{ nome: `boletim-${r.key}-p13-p18.html`, p: 18, kb: 46 }]; });
  const live = q('live');
  let liveT = 0;
  const say = (t) => { clearTimeout(liveT); live.textContent = ''; liveT = setTimeout(() => { live.textContent = t; }, 60); };
  const isWide = () => ax.getBoundingClientRect().width >= 940;

  function seedTimeline(r, o) {
    const zone = ZONE_OF(r, ...xyOf(r, o.poi));
    const tl = [{ c: 'crit', t: `Regra de alerta acionada na avaliação da passagem ${o.pass}: ${CLS[o.nivel].toLowerCase()} ${LOC(zone)}.`, a: 'Sistema', p: o.pass }];
    if (o.estado !== 'Aberta') tl.push({ c: 'dim', t: `Assumida por ${o.resp || 'Qualidade da água'}.`, a: o.resp || 'Qualidade da água', p: o.pass });
    if (o.estado === 'Coleta agendada') tl.push({ c: 'mid', t: `Coleta agendada no ponto ${o.poi}.`, a: o.resp || 'Operação', p: o.pass });
    if (o.estado === 'Resolvida') tl.push({ c: 'teal', t: o.res, a: o.resp || 'Qualidade da água', p: Math.min(NP, o.pass + 2) });
    return tl;
  }
  function xyOf(r, id) { const pt = r.pois.find((x) => x.id === id); return [pt.x, pt.y]; }

  /* ================= cores ================= */
  const cssv = (n) => getComputedStyle(ax).getPropertyValue(n).trim();
  const hex = (h) => { h = (h || '#000000').replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  let PAL;
  function palette() {
    const light = ax.classList.contains('is-light');
    const water = hex(cssv('--water'));
    PAL = {
      light, map: cssv('--map') || '#070707', grid: cssv('--map-grid'),
      conc: [[0, water], [0.18, CHEX[0]], [0.4, CHEX[1]], [0.6, CHEX[2]], [0.82, CHEX[3]]],
      cor: [[0, [14, 38, 44]], [0.3, [28, 60, 52]], [0.55, [66, 96, 50]], [0.85, [118, 128, 58]]],
      land: light ? [[226, 231, 229], [208, 216, 212]] : [[10, 11, 11], [24, 27, 26]],
      cloud: light ? [[200, 208, 205], [182, 190, 187]] : [[58, 64, 63], [44, 49, 48]],
      dam: light ? '#7b8e89' : '#c0d0cb',
    };
  }
  const ramp = (stops, v) => { for (let i = 1; i < stops.length; i++) if (v <= stops[i][0]) return mix(stops[i - 1][1], stops[i][1], (v - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])); return stops[stops.length - 1][1]; };
  const tex = new Float32Array(N); for (let n = 0; n < N; n++) tex[n] = hash(n % GW, (n / GW) | 0, 11);

  /* ================= mapa ================= */
  const stage = q('stage'), canvas = q('canvas'), ctx = canvas.getContext('2d');
  const tip = q('tip'), poisEl = q('pois'), cloudMsg = q('cloudmsg');
  const offW = document.createElement('canvas'); offW.width = GW; offW.height = GH; const owx = offW.getContext('2d'); const imgW = owx.createImageData(GW, GH);
  const offL = document.createElement('canvas'); offL.width = GW; offL.height = GH; const olx = offL.getContext('2d');
  let disp = new Float32Array(N), V = { W: 0, H: 0, s0: 1, fx: 0, fy: 0, z: 1, cx: 0, cy: 0 }, landKey = '';

  function paintLand(r) {
    const k = r.key + (PAL.light ? 'l' : 'd');
    if (landKey === k) return; landKey = k;
    const img = olx.createImageData(GW, GH), d = img.data;
    for (let n = 0; n < N; n++) {
      const x = (n % GW) * CS, y = ((n / GW) | 0) * CS;
      const t = 0.55 * noise(x / 70, y / 70, r.seed + 90) + 0.3 * noise(x / 24, y / 24, r.seed + 91) + 0.15 * tex[n];
      let c = mix(PAL.land[0], PAL.land[1], t); const o = n * 4;
      const sd = r.g.sdf[n];
      if (sd > 0 && sd < 14) c = mix(c, PAL.land[1], 0.5 * (1 - sd / 14));
      const ex = Math.min(x, WW - x, y, WH - y);
      d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = Math.round(255 * Math.max(0, Math.min(1, ex / 110)));
    }
    olx.putImageData(img, 0, 0);
  }

  function paintWater() {
    const d = imgW.data, g = S.r.g;
    for (let n = 0; n < N; n++) {
      const o = n * 4;
      if (!g.water[n]) { d[o + 3] = 0; continue; }
      const v = disp[n];
      let c;
      if (Number.isNaN(v)) { const i = n % GW, j = (n / GW) | 0; c = PAL.cloud[((i + j) & 3) < 2 ? 0 : 1]; }
      else if (S.layer === 'sinais') { c = CHEX[clsOf(v)]; const k = 0.93 + 0.12 * tex[n]; c = [c[0] * k, c[1] * k, c[2] * k]; }
      else if (S.layer === 'conc') c = ramp(PAL.conc, v);
      else { c = ramp(PAL.cor, v); const k = 0.88 + 0.22 * tex[n]; c = [c[0] * k, c[1] * k, c[2] * k]; }
      d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
    }
    owx.putImageData(imgW, 0, 0);
  }

  function layout() {
    const rc = stage.getBoundingClientRect();
    if (!rc.width || !rc.height) return false;
    const W = rc.width, H = rc.height, wide = isWide();
    let ins;
    if (wide) {
      const side = ax.querySelector('.ax-side').getBoundingClientRect().width || 300;
      const right = ax.querySelector('.ax-right').getBoundingClientRect().width || 260;
      ins = { l: side + 74, r: right + 36, t: 62, b: 146 };
    } else ins = { l: 12, r: 54, t: 50, b: 34 };
    const bb = S.r.g.bb, aw = W - ins.l - ins.r, ah = H - ins.t - ins.b;
    V.W = W; V.H = H; V.s0 = Math.min(aw / bb.w, ah / bb.h); V.fx = ins.l + aw / 2; V.fy = ins.t + ah / 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }
  const scale = () => V.s0 * V.z;
  const toScreen = (x, y) => [V.fx + (x - V.cx) * scale(), V.fy + (y - V.cy) * scale()];
  const toWorld = (sx, sy) => [V.cx + (sx - V.fx) / scale(), V.cy + (sy - V.fy) / scale()];
  function resetView() { const bb = S.r.g.bb; V.z = 1; V.cx = bb.x + bb.w / 2; V.cy = bb.y + bb.h / 2; }

  let drawQ = 0;
  const reqDraw = () => { if (drawQ) return; drawQ = requestAnimationFrame(() => { drawQ = 0; draw(); }); };
  function draw() {
    if (S.view !== 'dam' || S.tab !== 'mapa' || !V.W) return;
    const { W, H } = V, s = scale();
    ctx.fillStyle = PAL.map; ctx.fillRect(0, 0, W, H);
    const [ox, oy] = toScreen(0, 0);
    ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s);
    ctx.imageSmoothingEnabled = true; ctx.globalAlpha = 0.9; ctx.drawImage(offL, 0, 0, WW, WH); ctx.globalAlpha = 1;
    ctx.restore();
    // malha de coordenadas do app (56 px), presa ao mapa
    ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1; ctx.beginPath();
    const step = 56;
    const gx = ((ox % step) + step) % step, gy = ((oy % step) + step) % step;
    for (let x = gx; x < W; x += step) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); }
    for (let y = gy; y < H; y += step) { ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); }
    ctx.stroke();
    ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(offW, 0, 0, WW, WH);
    // textura de pixel do raster quando aproximado
    if (CS * s >= 9) {
      ctx.strokeStyle = 'rgba(0,0,0,.16)'; ctx.lineWidth = 1 / s; ctx.beginPath();
      const [wx0, wy0] = toWorld(0, 0), [wx1, wy1] = toWorld(W, H);
      for (let x = Math.max(0, Math.floor(wx0 / CS) * CS); x <= Math.min(WW, wx1); x += CS) { ctx.moveTo(x, Math.max(0, wy0)); ctx.lineTo(x, Math.min(WH, wy1)); }
      for (let y = Math.max(0, Math.floor(wy0 / CS) * CS); y <= Math.min(WH, wy1); y += CS) { ctx.moveTo(Math.max(0, wx0), y); ctx.lineTo(Math.min(WW, wx1), y); }
      ctx.stroke();
    }
    // nuvens (passagem com nuvem)
    const p = S.p, cs = S.r.cloudFull.includes(p) ? fullClouds(S.r) : S.r.cloudPart[p];
    if (cs) cs.forEach(([cx, cy, rr]) => {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 1.15);
      const a = PAL.light ? 0.75 : 0.5;
      gr.addColorStop(0, `rgba(236,242,240,${a})`); gr.addColorStop(0.6, `rgba(220,230,227,${a * 0.45})`); gr.addColorStop(1, 'rgba(220,230,227,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, rr * 1.15, 0, Math.PI * 2); ctx.fill();
    });
    // barragem
    ctx.strokeStyle = PAL.dam; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...S.r.dam[0]); ctx.lineTo(...S.r.dam[1]); ctx.stroke();
    ctx.restore();
    placePois();
  }
  const fullClouds = (r) => { const b = r.g.bb; return [[b.x + b.w * 0.25, b.y + b.h * 0.4, b.w * 0.3], [b.x + b.w * 0.62, b.y + b.h * 0.35, b.w * 0.32], [b.x + b.w * 0.5, b.y + b.h * 0.75, b.w * 0.28]]; };

  function renderPois() {
    poisEl.innerHTML = S.r.pois.map((pt) => `<div class="ax-poi" data-poi="${pt.id}"><span class="ax-poi__dot"></span><span class="ax-poi__lbl">Ponto ${pt.id}<b></b></span></div>`).join('');
  }
  function placePois() {
    const st = S.r.d.stats[S.p];
    S.r.pois.forEach((pt, i) => {
      const el = poisEl.querySelector(`[data-poi="${pt.id}"]`); if (!el) return;
      const [x, y] = toScreen(pt.x, pt.y);
      const flip = isWide() ? x > V.W - (ax.querySelector('.ax-right').getBoundingClientRect().width + 150) : x > V.W - 130;
      el.classList.toggle('is-left', flip);
      el.style.transform = flip ? `translate(calc(${x + 6}px - 100%), ${y - 6}px)` : `translate(${x - 6}px, ${y - 6}px)`;
      el.style.opacity = x < -20 || y < -20 || x > V.W + 20 || y > V.H + 20 ? 0 : 1;
      const v = st && st.pois[i];
      const c = v == null ? 'var(--dim-2)' : CVAR[clsOf(v)];
      el.style.setProperty('--c', c);
      el.querySelector('b').textContent = v == null ? ' · sem leitura' : ' · ' + CLS[clsOf(v)];
      el.classList.toggle('is-crit', v != null && clsOf(v) === 3 && !reduced);
    });
  }

  /* transição entre passagens */
  let anim = 0;
  function animateTo(p) {
    cancelAnimationFrame(anim);
    const tgt = S.r.d.fields[p];
    if (reduced || !V.W) { disp = Float32Array.from(tgt); paintWater(); reqDraw(); return; }
    const from = Float32Array.from(disp), t0 = performance.now(), dur = 520;
    const step = (now) => {
      let t = Math.min(1, (now - t0) / dur); t = 1 - Math.pow(1 - t, 3);
      for (let n = 0; n < N; n++) { const a = from[n], b = tgt[n]; disp[n] = Number.isNaN(a) || Number.isNaN(b) || a < 0 ? b : a + (b - a) * t; }
      paintWater(); draw();
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  /* zoom e arraste */
  let zAnim = 0;
  function zoomTo(z, cx, cy) {
    const bb = S.r.g.bb;
    z = Math.max(1, Math.min(6, z));
    const clampC = (zz, x, y) => { const hw = (V.W / 2) / (V.s0 * zz), hh = (V.H / 2) / (V.s0 * zz); return [Math.max(bb.x - hw * 0.4, Math.min(bb.x + bb.w + hw * 0.4, x)), Math.max(bb.y - hh * 0.4, Math.min(bb.y + bb.h + hh * 0.4, y))]; };
    if (z === 1 && cx == null) { cx = bb.x + bb.w / 2; cy = bb.y + bb.h / 2; }
    [cx, cy] = clampC(z, cx ?? V.cx, cy ?? V.cy);
    cancelAnimationFrame(zAnim);
    stage.classList.toggle('is-zoomed', z > 1.01);
    if (reduced) { V.z = z; V.cx = cx; V.cy = cy; reqDraw(); return; }
    const z0 = V.z, x0 = V.cx, y0 = V.cy, t0 = performance.now();
    const step = (now) => { let t = Math.min(1, (now - t0) / 380); t = 1 - Math.pow(1 - t, 3); V.z = z0 + (z - z0) * t; V.cx = x0 + (cx - x0) * t; V.cy = y0 + (cy - y0) * t; draw(); if (t < 1) zAnim = requestAnimationFrame(step); };
    zAnim = requestAnimationFrame(step);
  }
  qa('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.zoom;
    if (k === 'in') zoomTo(V.z * 1.6); else if (k === 'out') zoomTo(V.z / 1.6 < 1.05 ? 1 : V.z / 1.6, V.z / 1.6 < 1.05 ? null : V.cx); else zoomTo(1);
    say(k === 'fit' ? 'Represa enquadrada.' : `Zoom ${k === 'in' ? 'aproximado' : 'afastado'}.`);
  }));
  q('mapfocus').addEventListener('keydown', (e) => {
    const k = e.key, st = 40 / scale();
    if (k === '+' || k === '=') zoomTo(V.z * 1.6);
    else if (k === '-' || k === '_') zoomTo(V.z / 1.6 < 1.05 ? 1 : V.z / 1.6);
    else if (k === '0') zoomTo(1);
    else if (k.startsWith('Arrow') && V.z > 1.01) zoomTo(V.z, V.cx + (k === 'ArrowLeft' ? -st : k === 'ArrowRight' ? st : 0), V.cy + (k === 'ArrowUp' ? -st : k === 'ArrowDown' ? st : 0));
    else return;
    e.preventDefault();
  });
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (V.z <= 1.01) { hover(e, e.pointerType !== 'mouse'); return; }
    drag = { x: e.clientX, y: e.clientY, cx: V.cx, cy: V.cy, moved: false };
    canvas.setPointerCapture(e.pointerId); stage.classList.add('is-drag');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      V.cx = drag.cx - dx / scale(); V.cy = drag.cy - dy / scale(); reqDraw(); tip.hidden = true; return;
    }
    if (e.pointerType === 'mouse') hover(e);
  });
  const endDrag = (e) => { if (!drag) return; const moved = drag.moved; drag = null; stage.classList.remove('is-drag'); if (!moved) hover(e, true); };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', () => { drag = null; stage.classList.remove('is-drag'); });
  canvas.addEventListener('pointerleave', () => { if (!drag) tip.hidden = true; });
  let tipT = 0;
  function hover(e, sticky) {
    const rc = canvas.getBoundingClientRect(), sx = e.clientX - rc.left, sy = e.clientY - rc.top;
    const [x, y] = toWorld(sx, sy), i = Math.floor(x / CS), j = Math.floor(y / CS);
    if (i < 0 || j < 0 || i >= GW || j >= GH || !S.r.g.water[j * GW + i]) { tip.hidden = true; return; }
    const v = S.r.d.fields[S.p][j * GW + i], zone = ZONE_OF(S.r, x, y);
    tip.innerHTML = Number.isNaN(v) ? `<i style="--c:var(--dim-2)"></i>${esc(cap(zone))}<span>sem leitura · nuvem</span>` : `<i style="--c:${CVAR[clsOf(v)]}"></i>${esc(cap(zone))}<span>${CLS[clsOf(v)]}</span>`;
    tip.hidden = false;
    const tw = tip.offsetWidth, left = sx + 12 + tw > V.W ? sx - tw - 12 : sx + 12;
    tip.style.transform = `translate(${left}px, ${sy - 14}px)`;
    clearTimeout(tipT); if (sticky) tipT = setTimeout(() => { tip.hidden = true; }, 2200);
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* camadas */
  const LEGK = { sinais: 'SINAIS DE ALGAS', conc: 'CONCENTRAÇÃO ESTIMADA', cor: 'COR REAL' };
  const LAYN = { sinais: 'Sinais de algas', conc: 'Concentração estimada', cor: 'Cor real' };
  qa('[data-layer]').forEach((b) => b.addEventListener('click', () => {
    S.layer = b.dataset.layer;
    qa('[data-layer]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    q('legk').textContent = LEGK[S.layer];
    ax.querySelector('.ax-legend').classList.toggle('is-cor', S.layer === 'cor');
    ax.querySelector('.ax-minileg').classList.toggle('is-cor', S.layer === 'cor');
    paintWater(); reqDraw();
    say(`Camada exibida: ${LAYN[S.layer]}.`);
  }));

  /* ================= painel e série ================= */
  const prevValid = (p) => { for (let i = p - 1; i >= 0; i--) if (S.r.d.stats[i]) return i; return -1; };
  function setMetric(k, txt, c) { const el = q(k); el.textContent = txt; el.style.setProperty('--c', c || 'var(--ink)'); }

  function renderPanel() {
    const r = S.r, d = r.d, st = d.stats[S.p], p = S.p;
    ax.classList.toggle('is-nodata', !st);
    q('name').textContent = r.nome;
    q('meta').textContent = `${r.area} km² · ${r.uso.toLowerCase()}`;
    const u = uteis(r), f = Math.round((u / NP) * 100);
    q('prepf').textContent = `${u}/${NP}`; q('prepbar').style.width = f + '%';
    q('preptxt').innerHTML = `<b>${u} de ${NP}</b> passagens com leitura útil, ${NP - u} ${NP - u === 1 ? 'descartada' : 'descartadas'} por nuvem`;
    q('passk').textContent = `PASSAGEM ${p + 1}`;
    q('toppass').textContent = String(p + 1);
    q('topcloud').textContent = st ? `${100 - st.vis}%` : 'descartada';
    const share = q('share');
    if (st) { share.textContent = fmt1(st.share); share.parentElement.style.setProperty('--c', CVAR[st.share > 10 ? 2 : st.share > 3 ? 1 : 0]); q('shareu').textContent = '% do visível'; }
    else { share.textContent = 'Sem leitura'; q('shareu').textContent = ''; }
    const bars = qa('i', q('stack'));
    bars.forEach((b, i) => { b.style.width = st ? st.pct[i] + '%' : '0%'; });
    q('stackl').innerHTML = st ? st.pct.map((x, i) => `<span>${CLS[i].slice(0, 4).toUpperCase()} ${x}%</span>`).join('') : '<span>Passagem descartada por nuvem</span>';
    if (st) {
      const pv = prevValid(p);
      setMetric('m1', CLS[st.meanCls], CVAR[st.meanCls]);
      setMetric('m2', CLS[st.peak], CVAR[st.peak]);
      setMetric('m3', CLSF[st.cls], CVAR[st.cls]);
      if (pv < 0) q('m3').insertAdjacentHTML('beforeend', '<small>primeira leitura</small>');
      else { const dl = Math.round(((st.mean - d.stats[pv].mean) / d.stats[pv].mean) * 100); q('m3').insertAdjacentHTML('beforeend', `<small>${dl > 0 ? '+' : dl < 0 ? '−' : ''}${Math.abs(dl)}% vs passagem ${pv + 1}</small>`); }
      setMetric('m4', st.vis + '%');
    } else ['m1', 'm2', 'm3', 'm4'].forEach((k) => setMetric(k, k === 'm4' ? 'nuvem' : 'sem leitura', 'var(--dim)'));
    // pontos monitorados
    q('pts').innerHTML = r.pois.map((pt, i) => {
      const v = st && st.pois[i];
      let cls = 'sem leitura', c = 'var(--dim-2)', varTxt = 'nuvem';
      if (v != null) {
        const k = clsOf(v); cls = CLS[k]; c = CVAR[k]; varTxt = 'primeira leitura';
        const pv = prevValid(p), pvV = pv >= 0 ? d.stats[pv].pois[i] : null;
        if (pvV != null) { const dk = k - clsOf(pvV); varTxt = dk === 0 ? 'estável' : `${dk > 0 ? '▲' : '▼'} ${Math.abs(dk)} classe${Math.abs(dk) > 1 ? 's' : ''}`; }
      } else if (st) { cls = 'sem leitura'; }
      return `<button type="button" class="ax-pt" data-pt="${i}" style="--c:${c}" aria-label="Aproximar no ponto de interesse ${pt.id}"><span class="ax-pt__bar"></span><span class="ax-pt__id"><b>Ponto de interesse ${pt.id}</b><span>${esc(ZONE_OF(r, pt.x, pt.y))}</span></span><span class="ax-pt__v"><b>${cls}</b><span>${varTxt}</span></span></button>`;
    }).join('');
    qa('.ax-pt').forEach((b) => b.addEventListener('click', () => { const pt = r.pois[+b.dataset.pt]; zoomTo(3, pt.x, pt.y); if (!isWide()) stage.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); say(`Mapa aproximado no ponto ${pt.id}.`); }));
    // alerta da passagem (mesma regra do app: alta + crítica acima de 5%)
    const al = q('alert');
    const show = !!st && st.share > 5;
    if (show) {
      const grave = st.crit > 2;
      const was = al.hidden; al.hidden = false;
      q('alk').textContent = `${grave ? 'ALERTA CRÍTICO' : 'ATENÇÃO'} · ${r.curto.toUpperCase()}`;
      q('alp').textContent = `passagem ${p + 1}`;
      const zone = hotZone(r, p);
      const pv = prevValid(p);
      const dl = pv >= 0 ? Math.round(((st.mean - d.stats[pv].mean) / d.stats[pv].mean) * 100) : 0;
      q('alt').textContent = `${fmt1(st.share)}% do espelho visível na faixa alta ou crítica, com núcleo ${LOC(zone)}.`;
      if (was && !reduced) { al.classList.remove('is-in'); void al.offsetWidth; al.classList.add('is-in'); }
    } else al.hidden = true;
    cloudMsg.hidden = !!st;
    q('mapfocus').setAttribute('aria-label', `Mapa de ${r.nome}, passagem ${p + 1}. ${st ? `${fmt1(st.share)}% do espelho visível acima de moderado; ponto A ${st.pois[0] == null ? 'sem leitura' : CLS[clsOf(st.pois[0])]}.` : 'Passagem descartada por nuvem.'} Teclas mais e menos aproximam e afastam; zero enquadra; setas movem o mapa quando aproximado.`);
    // série
    q('scur').textContent = `Passagem ${p + 1}`;
    q('ssub').textContent = st ? `sinal médio ${CLS[st.meanCls]} · ${st.vis}% visível` : 'descartada por nuvem · sem leitura';
    qa('.ax-bar').forEach((b, i) => { const on = i === p; b.setAttribute('aria-pressed', String(on)); b.tabIndex = on ? 0 : -1; });
  }
  function hotZone(r, p) {
    const f = r.d.fields[p]; let best = -1, bi = 0;
    for (let n = 0; n < N; n++) if (f[n] > best) { best = f[n]; bi = n; }
    return ZONE_OF(r, (bi % GW) * CS, ((bi / GW) | 0) * CS);
  }

  function renderBars() {
    const d = S.r.d;
    q('bars').innerHTML = d.stats.map((st, i) => {
      if (!st) return `<button type="button" class="ax-bar is-cloud" data-p="${i}" aria-pressed="false" tabindex="-1" aria-label="Passagem ${i + 1}, descartada por nuvem" title="Passagem ${i + 1} · descartada por nuvem"><i></i></button>`;
      const h = Math.max(6, ((st.mean - d.min) / (d.max - d.min || 1)) * 88 + 8);
      const part = S.r.cloudPart[i];
      const k = st.meanCls; // a MESMA classe do texto "sinal médio" do painel e da série
      return `<button type="button" class="ax-bar${part ? ' is-part' : ''}" data-p="${i}" style="--c:${CVAR[k]};--h:${h.toFixed(1)}%" aria-pressed="false" tabindex="-1" aria-label="Passagem ${i + 1}, sinal médio ${CLS[k]}, ${st.vis}% visível${part ? ', parte encoberta por nuvem' : ''}" title="Passagem ${i + 1} · sinal médio ${CLS[k]} · ${st.vis}% visível"><i></i></button>`;
    }).join('');
  }
  q('bars').addEventListener('click', (e) => { const b = e.target.closest('.ax-bar'); if (b) setPass(+b.dataset.p, true); });
  q('bars').addEventListener('keydown', (e) => {
    const k = e.key; let p = S.p;
    if (k === 'ArrowRight' || k === 'ArrowUp') p++; else if (k === 'ArrowLeft' || k === 'ArrowDown') p--; else if (k === 'Home') p = 0; else if (k === 'End') p = NP - 1; else return;
    e.preventDefault(); p = Math.max(0, Math.min(NP - 1, p)); setPass(p, true); q('bars').children[p].focus();
  });

  function setPass(p, announce) {
    if (p === S.p && announce) return;
    S.p = p; animateTo(p); renderPanel();
    if (announce) {
      const st = S.r.d.stats[p];
      say(st ? `Passagem ${p + 1}. Sinal médio ${CLS[st.meanCls]}, ${st.vis}% da represa visível.${S.r.cloudPart[p] ? ' Parte do espelho sem leitura por nuvem.' : ''}${st.share > 5 ? ' Alerta da passagem exibido.' : ''}` : `Passagem ${p + 1} descartada por nuvem.`);
    }
  }

  /* ================= alertas ================= */
  const ST = ['Aberta', 'Em análise', 'Coleta agendada', 'Resolvida'];
  const openCount = (r) => r.ocs.filter((o) => o.estado !== 'Resolvida').length;
  function renderOcBadge() { const n = openCount(S.r), b = q('ocn'); b.hidden = !n; b.textContent = n; }
  function spark(r, o) {
    const d = r.d, i = r.pois.findIndex((x) => x.id === o.poi), vals = [];
    for (let p = Math.max(0, o.pass - 9); p <= Math.min(NP - 1, o.pass - 1); p++) { const st = d.stats[p]; vals.push(st && st.pois[i] != null ? st.pois[i] : 0); }
    const mx = Math.max(...vals, 0.01);
    return `<span class="ax-spark" aria-hidden="true">${vals.map((v) => `<i style="height:${Math.max(6, (v / mx) * 100).toFixed(0)}%"></i>`).join('')}</span>`;
  }
  function renderAlerts() {
    const r = S.r, all = r.ocs;
    const ab = openCount(r), cr = all.filter((o) => o.nivel === 3 && o.estado !== 'Resolvida').length;
    q('ocsum').textContent = all.length ? `${ab} em aberto, ${cr} na faixa crítica, ${all.length} no total.` : 'Nenhuma ocorrência registrada nesta represa.';
    const f = S.ocFilter, list = all.filter((o) => f === 'todas' || (f === 'abertas' ? o.estado !== 'Resolvida' : o.estado === 'Resolvida'));
    if (S.ocSel == null || !all.find((o) => o.id === S.ocSel)) S.ocSel = (all.find((o) => o.estado !== 'Resolvida') || all[0] || {}).id ?? null;
    q('oclist').innerHTML = list.length ? list.map((o) => `
      <button type="button" class="ax-oc" data-oc="${o.id}" aria-pressed="${o.id === S.ocSel}" style="--c:${CVAR[o.nivel]}">
        <span class="ax-oc__id"><span class="ax-pill"><span class="ax-lvl">${CLS[o.nivel]}</span><span class="ax-oc__code">OC-${o.id}</span></span><b>Ponto de interesse ${o.poi}</b></span>
        <span class="ax-oc__txt">${esc(o.txt)}</span>
        ${spark(r, o)}
        <span class="ax-oc__st"><span class="mono">passagem ${o.pass}</span><span class="ax-st" data-s="${o.estado}">${o.estado}${o.resp && o.estado !== 'Resolvida' && o.estado !== 'Aberta' ? ' · ' + esc(o.resp) : ''}</span></span>
      </button>`).join('') : `<div class="ax-empty"><span class="ax-label">NADA POR AQUI</span>${all.length ? 'Nenhuma ocorrência atende a este filtro.' : 'As regras de alerta são avaliadas a cada passagem. Sem regra acionada, não há ocorrência.'}</div>`;
    renderRail();
    renderOcBadge();
  }
  function renderRail(newIdx) {
    const r = S.r, o = r.ocs.find((x) => x.id === S.ocSel), rail = q('ocrail');
    if (!o) { rail.innerHTML = '<div class="ax-rail__blk"><div class="ax-empty"><span class="ax-label">SEM OCORRÊNCIA</span>Selecione uma ocorrência para ver a linha do tempo.</div></div>'; return; }
    const res = o.estado === 'Resolvida';
    rail.innerHTML = `
      <div class="ax-rail__blk">
        <p class="ax-label">OC-${o.id} · PASSAGEM ${o.pass}</p>
        <h5>${CLS[o.nivel]} no ponto de interesse ${o.poi}</h5>
        <div class="ax-states" aria-label="Estado da ocorrência">${ST.map((s) => `<span class="${s === o.estado ? 'is-on' : ''}">${s}</span>`).join('')}</div>
        ${res ? `<p class="ax-small" style="color:var(--teal)">${esc(o.res || 'Resolvida.')}</p>` : S.resolving ? `
          <form class="ax-resolve" data-ax="resform"><label class="ax-label" for="ax-resinp">O QUE FOI FEITO PARA RESOLVER?</label><input id="ax-resinp" placeholder="Ex.: laudo conferiu, rotina mantida" autocomplete="off"><span class="ax-acts"><button type="submit" class="ax-btn ax-btn--brand">Confirmar</button><button type="button" class="ax-btn ax-btn--out" data-act="cancel">Cancelar</button></span></form>` : `
          <div class="ax-acts">
            <button type="button" class="ax-btn ax-btn--brand" data-act="assumir"${o.estado === 'Em análise' ? ' disabled' : ''}>${o.estado === 'Em análise' ? 'Assumida' : 'Assumir'}</button>
            <button type="button" class="ax-btn ax-btn--out" data-act="agendar"${o.estado === 'Coleta agendada' ? ' disabled' : ''}>${o.estado === 'Coleta agendada' ? 'Coleta agendada' : 'Agendar coleta'}</button>
            <button type="button" class="ax-btn ax-btn--out" data-act="resolver">Resolver</button>
          </div>`}
        <p class="ax-tiny ax-dim2">Os estados não seguem ordem obrigatória. Cada ação fica no histórico.</p>
      </div>
      <div class="ax-rail__blk">
        <p class="ax-label">LINHA DO TEMPO</p>
        ${o.tl.length > 5 ? `<p class="ax-tiny ax-dim2">${o.tl.length - 5} ${o.tl.length - 5 === 1 ? 'registro anterior' : 'registros anteriores'} no histórico</p>` : ''}
        <div class="ax-tl">${o.tl.map((e, i) => i < o.tl.length - 5 ? '' : `<div class="ax-tl__it${i === newIdx ? ' is-new' : ''}"><span class="ax-tl__rail"><i style="--c:${e.c === 'crit' ? 'var(--rk-crit)' : e.c === 'teal' ? 'var(--teal)' : e.c === 'mid' ? 'var(--rk-mid)' : 'var(--dim)'}"></i><s></s></span><span class="ax-tl__body"><p>${esc(e.t)}</p><span>passagem ${e.p} · ${esc(e.a)}</span></span></div>`).join('')}</div>
        ${res ? '' : '<form class="ax-note" data-ax="note"><input aria-label="Registrar decisão" placeholder="Registrar decisão…" autocomplete="off"><button type="submit" class="ax-btn ax-btn--out">Anotar</button></form>'}
      </div>
      <div class="ax-rail__blk">
        <p class="ax-label">NOTIFICADOS</p>
        <p class="ax-who"><i>QA</i>Qualidade da água<span>e-mail</span></p>
        <p class="ax-who"><i>OP</i>Operação<span>e-mail</span></p>
      </div>`;
  }
  q('oclist').addEventListener('click', (e) => { const b = e.target.closest('[data-oc]'); if (!b) return; S.ocSel = +b.dataset.oc; S.resolving = false; qa('[data-oc]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderRail(); if (!isWide()) q('ocrail').scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); });
  qa('[data-f]').forEach((b) => b.addEventListener('click', () => { S.ocFilter = b.dataset.f; qa('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderAlerts(); }));
  function ocAct(o, estado, t, c) {
    o.estado = estado; if (estado !== 'Aberta') o.resp = 'Você';
    o.tl.push({ c, t, a: 'Você', p: S.p + 1 });
    S.resolving = false;
    renderAlerts(); renderRail(o.tl.length - 1);
    say(`Ocorrência OC-${o.id}: ${estado}.`);
  }
  q('ocrail').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const o = S.r.ocs.find((x) => x.id === S.ocSel); if (!o) return;
    const a = b.dataset.act;
    if (a === 'assumir') ocAct(o, 'Em análise', 'Assumida por você.', 'dim');
    else if (a === 'agendar') { ocAct(o, 'Coleta agendada', `Coleta agendada no ponto ${o.poi}.`, 'mid'); }
    else if (a === 'resolver') { S.resolving = true; renderRail(); const i = q('ocrail').querySelector('#ax-resinp'); i && i.focus(); }
    else if (a === 'cancel') { S.resolving = false; renderRail(); }
  });
  q('ocrail').addEventListener('submit', (e) => {
    e.preventDefault();
    const o = S.r.ocs.find((x) => x.id === S.ocSel); if (!o) return;
    const inp = e.target.querySelector('input'), t = inp.value.trim();
    if (e.target.dataset.ax === 'resform') { o.res = t || 'Resolvida pela equipe.'; ocAct(o, 'Resolvida', o.res, 'teal'); return; }
    if (!t) { inp.focus(); return; }
    o.tl.push({ c: 'dim', t, a: 'Você', p: S.p + 1 }); renderRail(o.tl.length - 1); say('Decisão anotada na linha do tempo.');
    const ni = q('ocrail').querySelector('.ax-note input'); ni && ni.focus();
  });

  /* ================= coletas ================= */
  const form = q('form');
  function renderColetas(prefill) {
    const r = S.r, d = r.d;
    q('fponto').innerHTML = r.pois.map((pt) => `<option value="${pt.id}">Ponto de interesse ${pt.id}</option>`).join('');
    q('fpass').innerHTML = d.stats.map((st, i) => st ? `<option value="${i}">Passagem ${i + 1}</option>` : '').join('');
    let p = S.p; if (!d.stats[p]) p = prevValid(p) >= 0 ? prevValid(p) : NP - 1;
    q('fpass').value = String(p);
    if (prefill) q('fponto').value = prefill;
    renderColTable();
  }
  function estV(r, poi, p) { const i = r.pois.findIndex((x) => x.id === poi), st = r.d.stats[p]; const v = st && st.pois[i]; return v == null ? null : v; }
  const fmtLab = (l) => l.toFixed(1).replace('.', ',');
  const parseLab = (t) => parseFloat(String(t).replace(',', '.'));
  // Toda coleta recebe veredito a partir da MESMA lista (r.cols):
  //  sem estimativa no ponto (nuvem) -> sem par; classe do laudo = classe estimada -> dentro; senão -> fora.
  function verdict(r, c) {
    const v = estV(r, c.poi, c.p - 1);
    if (c.laudo == null) { // coletas de exemplo: laudo derivado da estimativa, coerente com a classe
      const base = v == null ? 0.2 : v;
      let l = base * LK + (typeof c.j === 'number' ? c.j : 0);
      if (c.j === 'fora') { const k = clsOf(base), up = k < 3; l = (up ? [CUTS[0], CUTS[1], CUTS[2]][k] : CUTS[1]) * LK + (up ? 4.2 : -4.2); }
      if (typeof c.j === 'number' && labCls(l) !== clsOf(base)) l = base * LK; // o desvio não muda a classe
      l = Math.max(0.5, Math.min(LK * 0.98, l));
      c.laudo = fmtLab(l);
    }
    const lab = parseLab(c.laudo), lk = labCls(lab);
    if (v == null) return { v, lab, lk, k: null, st: 'sem' };
    const k = clsOf(v);
    return { v, lab, lk, k, st: lk === k ? 'ok' : 'fora' };
  }
  function renderColTable(newRow) {
    const r = S.r;
    const rows = r.cols.map((c) => verdict(r, c));
    q('cols').innerHTML = r.cols.map((c, i) => {
      const x = rows[i];
      const conf = x.st === 'ok' ? '<span class="ax-ok">dentro da tolerância</span>' : x.st === 'fora' ? `<span class="ax-warn">fora da tolerância</span>` : '<span class="ax-dim">sem par · nuvem no ponto</span>';
      // no celular (container estreito) cada linha vira um cartão: passagem · ponto e o confronto
      // na primeira linha, laudo e estimativa rotulados na segunda (data-l), sem rolagem lateral
      return `<tr class="${i === 0 && newRow ? 'is-new' : ''}"><td class="mono ax-td-p">passagem ${c.p}</td><td class="ax-td-pt">Ponto ${c.poi}</td><td class="ax-td-l" data-l="Laudo"><span class="mono">${esc(c.laudo)}</span> <span class="ax-cls" style="--c:${CVAR[x.lk]}">${CLS[x.lk]}</span></td><td class="ax-td-e" data-l="Estimativa"><span class="ax-cls" style="--c:${x.k == null ? 'var(--dim)' : CVAR[x.k]}">${x.k == null ? 'sem leitura' : CLS[x.k]}</span></td><td class="ax-td-c">${conf}</td></tr>`;
    }).join('');
    q('colsn').textContent = `${r.cols.length} ${r.cols.length === 1 ? 'REGISTRADA' : 'REGISTRADAS'}`;
    // dispersão campo × estimativa na mesma régua (sem eixos numéricos): diagonal = concordância
    const pairs = rows.map((x, i) => [x, i]).filter(([x]) => x.st !== 'sem');
    const M = Math.max(0.5, ...pairs.map(([x]) => Math.max(x.v, x.lab / LK))) * 1.08;
    const X = (t) => 16 + (t / M) * 172, Y = (t) => 116 - (t / M) * 104;
    const band = CUTS.map((c) => `<line x1="${X(c).toFixed(1)}" y1="116" x2="${X(c).toFixed(1)}" y2="8" stroke="var(--line)"/><line x1="16" y1="${Y(c).toFixed(1)}" x2="190" y2="${Y(c).toFixed(1)}" stroke="var(--line)"/>`).join('');
    const pts = pairs.map(([x, i]) => `<circle cx="${X(x.lab / LK).toFixed(1)}" cy="${Y(x.v).toFixed(1)}" r="${i === 0 && newRow ? 5 : 4}" fill="${x.st === 'fora' ? 'var(--rk-high)' : 'var(--teal)'}" fill-opacity=".9"/>`).join('');
    q('scatter').innerHTML = `${band}<path d="M16 116 L${X(M).toFixed(1)} ${Y(M).toFixed(1)}" stroke="var(--line-2)" stroke-dasharray="3 3"/><line x1="16" y1="116" x2="190" y2="116" stroke="var(--line-2)"/><line x1="16" y1="116" x2="16" y2="8" stroke="var(--line-2)"/><text x="188" y="127" text-anchor="end" font-size="8" fill="var(--dim-2)" font-family="IBM Plex Mono, monospace">laboratório</text><text x="20" y="14" font-size="8" fill="var(--dim-2)" font-family="IBM Plex Mono, monospace">estimativa</text>${pts}`;
    const ok = pairs.filter(([x]) => x.st === 'ok').length;
    q('pairs').textContent = `${pairs.length} ${pairs.length === 1 ? 'PAR' : 'PARES'}`;
    q('pairsok').textContent = `${ok} de ${pairs.length}`;
    return rows;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lab = q('flab'), msg = q('fmsg'), raw = lab.value.trim().replace(/\s/g, '');
    const okNum = /^\d+([.,]\d+)?$/.test(raw) && parseLab(raw) > 0;
    lab.parentElement.classList.toggle('is-bad', !okNum);
    if (!okNum) { msg.className = 'ax-small ax-fmsg is-bad'; msg.textContent = 'Informe o resultado do laudo (número maior que zero).'; lab.focus(); return; }
    const r = S.r, poi = q('fponto').value, p = +q('fpass').value + 1;
    r.cols.unshift({ p, poi, laudo: fmtLab(parseLab(raw)) });
    if (r.cols.length > 5) r.cols.length = 5; // a tabela mostra as cinco mais recentes
    const o = r.ocs.find((x) => x.poi === poi && x.estado !== 'Resolvida');
    if (o) o.tl.push({ c: 'mid', t: `Coleta registrada no ponto ${poi}, confrontada com a passagem ${p}.`, a: 'Você', p });
    lab.value = ''; q('fobs').value = ''; q('fprof').value = '';
    const x = renderColTable(true)[0];
    const vtxt = x.st === 'ok' ? `Laudo na classe ${CLS[x.lk]}, a mesma da estimativa: dentro da tolerância.` : x.st === 'fora' ? `Laudo na classe ${CLS[x.lk]}, estimativa ${CLS[x.k]}: fora da tolerância.` : 'Sem leitura no ponto nesta passagem (nuvem): sem par.';
    msg.className = 'ax-small ax-fmsg is-ok';
    msg.textContent = `Coleta registrada no ponto ${poi}, passagem ${p}. ${vtxt}${o ? ` Anotada na OC-${o.id}.` : ''}`;
    say(msg.textContent);
  });
  q('flab').addEventListener('input', (e) => e.target.parentElement.classList.remove('is-bad'));

  /* ================= relatórios ================= */
  const MODELS = [
    { id: 'boletim', nome: 'Boletim da represa', desc: 'Passagens do período, classes do espelho e pontos monitorados.' },
    { id: 'pontos', nome: 'Acompanhamento dos pontos', desc: 'Pontos de interesse e coletas registradas no período.' },
    { id: 'ocorrencia', nome: 'Comunicado de ocorrência', desc: 'Emitido a partir de uma ocorrência, na tela de Alertas.' },
  ];
  const SECS = { destaques: 'Destaques numéricos', resumo: 'Resumo do período', distribuicao: 'Distribuição por classe', pontos: 'Pontos monitorados', recomendacao: 'Recomendações' };
  function renderReportForm() {
    q('models').innerHTML = MODELS.map((m) => `<button type="button" role="radio" class="ax-model" data-model="${m.id}" aria-checked="${S.model === m.id}"><span class="ax-model__r"></span><span><b>${m.nome}</b><span>${m.desc}</span></span></button>`).join('');
    q('periods').innerHTML = [6, 12, 24].map((n) => `<button type="button" class="ax-chip" data-period="${n}" aria-pressed="${S.period === n}">${n} passagens</button>`).join('');
    q('checks').innerHTML = Object.keys(SECS).map((k) => `<button type="button" role="checkbox" class="ax-check" data-sec="${k}" aria-checked="${S.secs.includes(k)}"><i></i>${SECS[k]}</button>`).join('');
  }
  function renderReport(flash) {
    const r = S.r, d = r.d, paper = q('paper');
    const model = MODELS.find((m) => m.id === S.model);
    q('prevh').textContent = `Prévia · ${model.nome}`;
    const emit = q('emit');
    if (S.model === 'ocorrencia') {
      emit.disabled = true;
      paper.innerHTML = '<p class="ax-paper__empty">O comunicado de ocorrência é emitido a partir de uma ocorrência específica, na tela de Alertas.</p>';
      return;
    }
    emit.disabled = !S.secs.length;
    if (!S.secs.length) { paper.innerHTML = '<p class="ax-paper__empty">Selecione ao menos uma seção para ver a prévia.</p>'; return; }
    let b = S.p; if (!d.stats[b]) b = prevValid(b);
    const a = Math.max(0, S.p - S.period + 1);
    const span = d.stats.slice(a, S.p + 1), useful = span.filter(Boolean).length, lost = span.length - useful;
    const st = d.stats[b], dom = st.pct.indexOf(Math.max(...st.pct));
    const head = st.share > 5 ? `Faixa alta e crítica em ${fmt1(st.share)}% do espelho na passagem ${b + 1}` : `Espelho predominantemente na classe ${CLS[dom]} na passagem ${b + 1}`;
    const worst = Math.max(...r.pois.map((pt, i) => { const v = st.pois[i]; return v == null ? 0 : clsOf(v); }));
    const ptMax = r.pois.map((pt, i) => { let mx = 0; for (let p = a; p <= S.p; p++) { const s = d.stats[p]; if (s && s.pois[i] != null) mx = Math.max(mx, s.pois[i]); } return mx; });
    const has = (k) => S.secs.includes(k);
    const ab = openCount(r);
    paper.innerHTML = `
      <div class="ax-paper__h"><div><b>${model.nome}</b><span>${esc(r.nome)} · passagens ${a + 1} a ${S.p + 1}</span></div><span class="ax-paper__brand"><img src="${logoSrc('logo-algeye.png')}" alt="" width="38" height="24">Algeye</span></div>
      <div class="ax-paper__head" style="--c:${CVAR[st.share > 5 ? (st.crit > 2 ? 3 : 2) : dom]}"><i></i><div><b>${head}</b>${has('resumo') ? `<p>Entre as passagens ${a + 1} e ${S.p + 1}, ${useful} tiveram leitura útil${lost ? ` e ${lost} ${lost === 1 ? 'foi descartada' : 'foram descartadas'} por nuvem` : ' e nenhuma foi descartada por nuvem'}. O ponto A terminou o período na classe ${st.pois[0] == null ? 'sem leitura' : CLS[clsOf(st.pois[0])]}.</p>` : ''}</div></div>
      ${has('destaques') ? `<div class="ax-paper__kpis"><div><b>${fmt1(st.share)}%</b><span>do espelho acima de moderado</span></div><div><b>${ab}</b><span>${ab === 1 ? 'ocorrência aberta' : 'ocorrências abertas'}</span></div><div><b>${st.vis}%</b><span>da represa visível</span></div></div>` : ''}
      ${has('distribuicao') ? `<div><p class="ax-paper__k">DISTRIBUIÇÃO DO ESPELHO POR CLASSE</p><div class="ax-paper__bar">${st.pct.map((x, i) => `<span style="width:${x}%;background:${CVAR[i]}"></span>`).join('')}</div><div class="ax-paper__barl">${st.pct.map((x, i) => `<span>${CLS[i]} ${x}%</span>`).join('')}</div></div>` : ''}
      ${has('pontos') ? `<div><p class="ax-paper__k">MAIOR CLASSE POR PONTO NO PERÍODO</p><div class="ax-paper__pts">${r.pois.map((pt, i) => { const k = clsOf(ptMax[i]); return `<div class="ax-paper__pt"><span>Ponto ${pt.id} <em>${esc(ZONE_OF(r, pt.x, pt.y))}</em></span><span class="ax-paper__track" aria-hidden="true"><i style="width:${((k + 1) / 4) * 100}%;background:${CVAR[k]}"></i></span><b>${CLS[k]}</b></div>`; }).join('')}</div></div>` : ''}
      ${has('recomendacao') ? `<div><p class="ax-paper__k">RECOMENDAÇÕES</p><p class="ax-paper__rec">Protocolo cadastrado pela sua equipe para a classe ${CLS[Math.max(worst, 1)]}: ${worst >= 2 ? 'intensificar a coleta no ponto A e acompanhar a próxima passagem.' : 'manter a rotina de coleta e acompanhar a série.'}</p></div>` : ''}
      <div class="ax-paper__f">Algeye, um produto InovaSensor · documento emitido em HTML</div>`;
    if (flash && !reduced) { paper.classList.remove('is-flash'); void paper.offsetWidth; paper.classList.add('is-flash'); }
  }
  function logoSrc(f) { const img = ax.querySelector('.ax-logo--l'); return img ? img.getAttribute('src').replace(/logo-algeye[^/]*$/, f) : 'assets/brand/' + f; }
  function renderEmitted(isNew) {
    q('emitted').innerHTML = S.r.emitted.map((e, i) => `<p class="ax-emit${i === 0 && isNew ? ' is-new' : ''}"><span class="mono">passagem ${e.p}</span><b>${esc(e.nome)}</b><span class="mono">${e.kb} KB</span><button type="button" data-open="${i}">Abrir</button></p>`).join('');
  }
  q('models').addEventListener('click', (e) => { const b = e.target.closest('[data-model]'); if (!b) return; S.model = b.dataset.model; renderReportForm(); renderReport(true); q('models').querySelector(`[data-model="${S.model}"]`).focus(); });
  q('periods').addEventListener('click', (e) => { const b = e.target.closest('[data-period]'); if (!b) return; S.period = +b.dataset.period; renderReportForm(); renderReport(true); q('periods').querySelector(`[data-period="${S.period}"]`).focus(); });
  q('checks').addEventListener('click', (e) => { const b = e.target.closest('[data-sec]'); if (!b) return; const k = b.dataset.sec; S.secs = S.secs.includes(k) ? S.secs.filter((x) => x !== k) : [...S.secs, k]; renderReportForm(); renderReport(); q('checks').querySelector(`[data-sec="${k}"]`).focus(); });
  q('emit').addEventListener('click', () => {
    const a = Math.max(0, S.p - S.period + 1);
    const pre = S.model === 'pontos' ? 'pontos' : 'boletim';
    S.r.emitted.unshift({ nome: `${pre}-${S.r.key}-p${a + 1}-p${S.p + 1}.html`, p: S.p + 1, kb: 38 + S.secs.length * 3 });
    if (S.r.emitted.length > 3) S.r.emitted.length = 3; // a lista mostra os três mais recentes
    renderEmitted(true); say('Relatório emitido em HTML e armazenado.');
  });
  q('emitted').addEventListener('click', (e) => { if (!e.target.closest('[data-open]')) return; renderReport(true); q('paper').scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); });

  /* ================= home ================= */
  function renderHome() {
    const cards = q('cards');
    const hot = REPRESAS.map((r) => [r, r.ocs.filter((o) => o.estado !== 'Resolvida').sort((a, b) => b.nivel - a.nivel)[0]]).filter((x) => x[1]).sort((a, b) => b[1].nivel - a[1].nivel)[0];
    q('notice').innerHTML = hot ? `<div class="ax-notice" style="--c:${CVAR[hot[1].nivel]}"><p class="ax-label">OCORRÊNCIA EM ABERTO</p><p>${esc(hot[0].curto)}: ${CLS[hot[1].nivel].toLowerCase()} no ponto de interesse ${hot[1].poi}, desde a passagem ${hot[1].pass}.</p><button type="button" class="ax-notice__go" data-open="${hot[0].key}">Abrir o mapa →</button></div>` : '';
    cards.innerHTML = REPRESAS.map((r, i) => `
      <button type="button" class="ax-card" data-open="${r.key}" aria-label="Abrir ${esc(r.nome)}">
        <span class="ax-card__id"><span class="ax-card__name">${esc(r.nome)}</span><span class="ax-card__sub">${esc(r.uso)}</span></span>
        <canvas class="ax-card__thumb" data-thumb="${r.key}" width="184" height="120" aria-hidden="true"></canvas>
        <span class="ax-card__prep">${uteis(r)} de ${NP} passagens com leitura útil</span>
        <dl class="ax-card__dl"><div><dt>ÁREA</dt> <dd>${r.area} km²</dd></div><div><dt>PONTOS</dt> <dd>${r.pois.length}</dd></div><div><dt>PASSAGEM</dt> <dd>${NP}</dd></div>${openCount(r) ? `<div><dt>ABERTAS</dt> <dd style="color:#e5675f">${openCount(r)}</dd></div>` : ''}</dl>
        <span class="ax-card__go" aria-hidden="true">Abrir →</span>
      </button>`).join('');
    drawThumbs();
  }
  function drawThumbs() {
    palette();
    qa('[data-thumb]').forEach((cv) => {
      const r = REPRESAS.find((x) => x.key === cv.dataset.thumb), g = geom(r), c = cv.getContext('2d');
      const f = thumbField(r);
      const img = c.createImageData(GW, GH), d = img.data;
      for (let n = 0; n < N; n++) {
        const o = n * 4; d[o + 3] = 0;
        if (!g.water[n]) continue;
        const col = CHEX[clsOf(f[n])]; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
      }
      const tmp = document.createElement('canvas'); tmp.width = GW; tmp.height = GH; tmp.getContext('2d').putImageData(img, 0, 0);
      c.fillStyle = PAL.map; c.fillRect(0, 0, cv.width, cv.height);
      const bb = g.bb, s = Math.min((cv.width - 12) / bb.w, (cv.height - 12) / bb.h);
      c.save(); c.translate(cv.width / 2 - (bb.x + bb.w / 2) * s, cv.height / 2 - (bb.y + bb.h / 2) * s); c.scale(s, s);
      c.imageSmoothingEnabled = false; c.drawImage(tmp, 0, 0, WW, WH); c.restore();
    });
  }
  function thumbField(r) {
    if (r.d) return r.d.fields[NP - 1];
    if (r.tf) return r.tf;
    const g = geom(r), f = new Float32Array(N);
    for (let n = 0; n < N; n++) if (g.water[n]) f[n] = valueAt(r, NP - 1, (n % GW) * CS + CS / 2, ((n / GW) | 0) * CS + CS / 2, g.sdf[n]);
    return (r.tf = f);
  }
  q('notice').addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (!b) return; openDam(b.dataset.open, 'mapa'); const t = ax.querySelector('#ax-t-mapa'); t && t.focus({ preventScroll: true }); });
  q('cards').addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (!b) return; openDam(b.dataset.open, 'mapa'); const t = ax.querySelector('#ax-t-mapa'); t && t.focus({ preventScroll: true }); });

  /* ================= navegação ================= */
  const homeEl = q('home'), damEl = q('dam'), url = sec.querySelector('[data-ax="url"]'), back = ax.closest('.pn-device').querySelector('[data-ax="back"]');
  const TABN = { mapa: 'Mapa', alertas: 'Alertas', coletas: 'Coletas', relatorios: 'Relatórios', entenda: 'Entenda' };
  function setUrl() { url.textContent = S.view === 'home' ? 'algeye / suas represas' : `algeye / ${S.r.key} / ${S.tab}`; }
  // no celular, cada troca de tela leva a página ao topo da moldura (a tela nova começa visível)
  const device = ax.closest('.pn-device');
  function keepInView() {
    if (isWide()) return;
    const top = device.getBoundingClientRect().top, off = 80;
    if (Math.abs(top - off) < 12) return;
    const y = window.scrollY + top - off;
    if (ALG.lenis) ALG.lenis.scrollTo(y, { immediate: reduced, force: true }); else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
  function openDam(key, tab, opts = {}) {
    const r = REPRESAS.find((x) => x.key === key) || REPRESAS[0];
    const changed = r !== S.r || S.view !== 'dam';
    S.r = r; build(r);
    if (changed) { S.p = NP - 1; S.ocSel = null; S.resolving = false; }
    S.view = 'dam'; ax.dataset.view = 'dam';
    homeEl.hidden = true; damEl.hidden = false; back.disabled = false;
    q('select').value = r.key;
    if (changed) { renderBars(); renderPois(); disp = Float32Array.from(r.d.fields[S.p]); landKey = ''; }
    renderPanel(); renderOcBadge();
    setTab(tab || S.tab, { focus: false, prefill: opts.prefill });
    if (changed) { requestAnimationFrame(() => { if (layout()) { resetView(); stage.classList.remove('is-zoomed'); paintLand(r); paintWater(); draw(); } }); }
    if (!opts.silent) { say(`Represa exibida: ${r.nome}. Tela: ${TABN[S.tab]}.`); keepInView(); }
  }
  function goHome() {
    S.view = 'home'; ax.dataset.view = 'home';
    damEl.hidden = true; homeEl.hidden = false; back.disabled = true; setUrl();
    renderHome();
    const first = homeEl.querySelector(`[data-open="${S.r.key}"]`); first && first.focus({ preventScroll: true });
    say('Tela: Suas represas.'); keepInView();
  }
  back.addEventListener('click', goHome);
  q('logo').addEventListener('click', goHome);
  q('select').innerHTML = REPRESAS.map((r) => `<option value="${r.key}">${esc(r.nome)}</option>`).join('');
  q('select').addEventListener('change', (e) => openDam(e.target.value, S.tab));

  const tabs = qa('.ax-tab');
  function setTab(t, { focus = false, prefill } = {}) {
    S.tab = t; ax.dataset.tab = t;
    tabs.forEach((b) => { const on = b.dataset.tab === t; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    qa('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== t; });
    centerTab(t);
    if (t === 'mapa') requestAnimationFrame(() => { if (layout()) { paintLand(S.r); paintWater(); draw(); } });
    if (t === 'alertas') renderAlerts();
    if (t === 'coletas') renderColetas(prefill);
    if (t === 'relatorios') { renderReportForm(); renderReport(); renderEmitted(); }
    setUrl();
  }
  const tabsEl = ax.querySelector('.ax-tabs');
  function tabFades() {
    const max = tabsEl.scrollWidth - tabsEl.clientWidth;
    tabsEl.classList.toggle('is-fl', max > 2 && tabsEl.scrollLeft > 2);
    tabsEl.classList.toggle('is-fr', max > 2 && tabsEl.scrollLeft < max - 2);
  }
  function centerTab(t) {
    const on = tabs.find((b) => b.dataset.tab === t);
    if (!on || tabsEl.scrollWidth <= tabsEl.clientWidth) { tabFades(); return; }
    const left = tabsEl.scrollLeft + (on.getBoundingClientRect().left - tabsEl.getBoundingClientRect().left) - (tabsEl.clientWidth - on.offsetWidth) / 2;
    tabsEl.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(tabFades, reduced ? 0 : 420);
  }
  tabsEl.addEventListener('scroll', tabFades, { passive: true });
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => { setTab(b.dataset.tab); say(`Tela: ${TABN[b.dataset.tab]}.`); keepInView(); });
    b.addEventListener('keydown', (e) => {
      let j = i;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = tabs.length - 1; else return;
      e.preventDefault(); setTab(tabs[j].dataset.tab, { focus: true });
    });
  });
  ax.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]'); if (!g) return;
    const t = g.dataset.goto;
    if (t === 'alertas') { const o = S.r.ocs.filter((x) => x.estado !== 'Resolvida').sort((a, b) => b.nivel - a.nivel)[0]; if (o) S.ocSel = o.id; S.ocFilter = 'todas'; qa('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === 'todas'))); }
    setTab(t, { focus: true, prefill: t === 'coletas' ? 'A' : undefined });
    if (t === 'coletas') { q('flab').focus({ preventScroll: true }); }
    say(`Tela: ${TABN[t]}.`); keepInView();
  });

  /* tema do app (claro/escuro), como o botão de lua do produto */
  qa('[data-ax="theme"]').forEach((b) => b.addEventListener('click', () => {
    ax.classList.toggle('is-light');
    palette(); landKey = '';
    if (S.view === 'dam') { paintLand(S.r); paintWater(); draw(); } else drawThumbs();
    say(ax.classList.contains('is-light') ? 'Tema claro.' : 'Tema escuro.');
  }));

  /* ================= início ================= */
  if (ALG.onVisible) ALG.onVisible(ax, (v) => ax.classList.toggle('is-off', !v));

  /* "Pedidos": na demonstração não há pedidos */
  const toast = q('toast');
  let toastT = 0;
  qa('[data-ax="pedidos"]').forEach((b) => b.addEventListener('click', () => {
    toast.hidden = false; clearTimeout(toastT);
    toastT = setTimeout(() => { toast.hidden = true; }, 5200);
    say('Na demonstração não há pedidos.');
  }));

  /* painel lateral (desktop): sombra de rolagem quando há conteúdo abaixo */
  const side = ax.querySelector('.ax-side');
  const sideFade = () => side.classList.toggle('is-more', side.scrollHeight - side.clientHeight - side.scrollTop > 4);
  side.addEventListener('scroll', sideFade, { passive: true });

  /* Desempenho (07/10): nada é calculado na carga. Quando a seção chega a 1,5 tela, a
     primeira represa é calculada em fatias ociosas (enquanto isso fica a home estática do
     HTML) e a réplica abre no mapa dela. As outras represas só são calculadas quando a home
     é exibida (miniaturas), quando o cartão recebe o ponteiro ou o foco, ou em fatias depois
     da primeira. */
  let started = false;
  function init() {
    if (started) return;
    started = true;
    palette();
    new ResizeObserver(sideFade).observe(side);
    let rzT = 0;
    const ro = new ResizeObserver(() => { clearTimeout(rzT); rzT = setTimeout(() => { tabFades(); if (S.view === 'dam' && S.tab === 'mapa' && layout()) { const z = V.z; if (z <= 1.01) resetView(); reqDraw(); } }, 60); });
    ro.observe(stage);
    // primeira impressão: a réplica abre no mapa da primeira represa; o voltar e o logo
    // levam a "Suas represas" (sem JS, ou até o cálculo terminar, fica a home estática)
    sliced(REPRESAS[0], () => {
      if (S.view === 'home' && !homeEl.querySelector('[data-open]')) { openDam(REPRESAS[0].key, 'mapa', { silent: true }); setUrl(); }
      sliced(REPRESAS[1]);
    });
  }
  const warm = (e) => { const b = e.target.closest && e.target.closest('[data-open]'); if (!b) return; const r = REPRESAS.find((x) => x.key === b.dataset.open); if (r) sliced(r); };
  homeEl.addEventListener('pointerover', warm, { passive: true });
  homeEl.addEventListener('focusin', warm);
  if (ALG.onVisible) { const off = ALG.onVisible(sec, (v) => { if (v) { init(); if (off) off(); } }, '150% 0px'); } else init();
})();
