/* Algeye core: smooth scroll, reveals, nav, trilho do fluxo, barra fixa do celular e
   carregamento das seções sob demanda. Dono: integrador. Expõe window.ALG para as seções.

   Desempenho (07/10/2026, queixa "pesado e lento"):
   - nenhuma leitura de layout no handler de scroll: tema do nav, link ativo e trilho vêm de
     IntersectionObservers; o scroll só move a barra de progresso e o estado do nav;
   - reveals curtos (0,4 s, 12 px) por IntersectionObserver; o que já está na tela aparece sem animação;
   - o JS das seções 2..7 é importado só quando a seção se aproxima (lista em #alg-sections). */
(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (reduced) root.classList.add('reduced');

  const ALG = (window.ALG = {
    gsap, ScrollTrigger, lenis: null, reduced,
    isMobile: () => window.matchMedia('(max-width: 767px)').matches,
    /* cb(true|false) quando o elemento entra/sai da viewport (para pausar WebGL). */
    onVisible(el, cb, rootMargin = '120px') {
      const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting)), { rootMargin });
      io.observe(el);
      return () => io.disconnect();
    },
  });

  const idle = (fn, timeout) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 60));

  // ---------- Seções sob demanda ----------
  // build.py lista em #alg-sections o JS das seções depois da primeira. Cada uma é importada quando
  // chega a ~1,5 tela de distância, num momento ocioso: a carga inicial fica só com o voo.
  function initLazySections() {
    const tag = document.getElementById('alg-sections');
    if (!tag) return;
    let map = {};
    try { map = JSON.parse(tag.textContent); } catch (e) { return; }
    const done = new Set();
    const load = (id) => {
      if (done.has(id) || !map[id]) return;
      done.add(id);
      import(new URL(map[id], document.baseURI).href).catch((e) => console.warn('[core] seção', id, e));
    };
    ALG.loadSection = load;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      idle(() => load(e.target.id), 1200);
    }), { rootMargin: '0px 0px 150% 0px' });
    Object.keys(map).forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); else load(id); });
  }
  initLazySections();

  // libera a seção logo abaixo do voo (presa por .cv-hold para aliviar a primeira pintura)
  const release = () => root.classList.remove('cv-hold');
  if (root.classList.contains('cv-hold')) {
    window.addEventListener('scroll', release, { once: true, passive: true });
    window.addEventListener('load', () => idle(release, 1500), { once: true });
  }

  // ---------- Lenis ----------
  if (!reduced && window.Lenis && gsap && ScrollTrigger) {
    // lerp curto: a rodinha responde já e assenta rápido (antes: duration 1.1, sentido como "pesado")
    const lenis = new window.Lenis({ lerp: 0.15, wheelMultiplier: 1, smoothWheel: true });
    ALG.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // âncoras internas: rolagem suave pelo Lenis (ou nativa) e hash na URL
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    if (!ALG.lenis) return;           // sem Lenis: o navegador rola sozinho (scroll-padding-top no CSS)
    e.preventDefault();
    const offset = id === '#voo' ? 0 : -8;
    // as seções no caminho ainda podem estar com a altura reservada (content-visibility):
    // ao chegar, confere o alvo e completa o ajuste, se preciso
    ALG.lenis.scrollTo(t, { offset, onComplete: () => {
      const d = t.getBoundingClientRect().top + offset;
      if (Math.abs(d) > 3) ALG.lenis.scrollTo(t, { offset, duration: .35 });
    } });
    history.replaceState(null, '', id);
  });

  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // ---------- Reveals ----------
  // Equivale a start 'top 92%'. O que já está na tela no momento do bind (ou ao sair do voo para
  // a próxima seção) aparece sem animação: sem pico de tweens na saída do voo.
  function initReveals() {
    const els = [...document.querySelectorAll('[data-reveal]')];
    const show = (el) => el.classList.add('is-in');
    if (reduced || !gsap) { els.forEach(show); return; }
    const vh = () => window.innerHeight;
    const animate = (el) => {
      if (el.classList.contains('is-in')) return;
      const stagger = el.getAttribute('data-reveal') === 'stagger';
      const targets = stagger ? el.children : el;
      el.classList.add('is-in');
      gsap.fromTo(targets, { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: .4, ease: 'power2.out', stagger: stagger ? .05 : 0, clearProps: 'transform,opacity' });
    };
    // Sem leitura de layout no bind: a primeira resposta do observer diz o que já estava na tela.
    const seen = new WeakSet();
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const first = !seen.has(e.target);
      seen.add(e.target);
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      // já estava na tela no bind, ou rolagem longa num salto (âncora, barra): aparece direto
      if (first || e.boundingClientRect.bottom < vh() * .25) show(e.target); else animate(e.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    // Saída do voo: a página rola sozinha até a seção seguinte. Mostra já, sem animação, o que vai
    // estar na tela quando ela assentar.
    const voo = document.getElementById('voo');
    if (voo) {
      const next = voo.nextElementSibling;
      new MutationObserver(() => {
        if (voo.dataset.vooState !== 'exit' || !next) return;
        const top = next.getBoundingClientRect().top;
        next.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
          if (el.getBoundingClientRect().top - top < vh()) { io.unobserve(el); show(el); }
        });
      }).observe(voo, { attributes: true, attributeFilter: ['data-voo-state'] });
    }
    ALG.revealAll = () => els.forEach(show);
  }

  // ---------- Estado do scroll: só barra de progresso e nav (sem leituras de layout) ----------
  const scrollHooks = [];
  let docMax = 1;
  const measure = () => { docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
  function initScroll() {
    measure();
    let stT = 0;
    if (window.ResizeObserver) new ResizeObserver(() => {
      measure(); onScroll();
      // seção que acabou de ser pintada pela primeira vez pode mudar a altura da página
      if (ScrollTrigger) { clearTimeout(stT); stT = setTimeout(() => ScrollTrigger.refresh(), 300); }
    }).observe(document.body);
    window.addEventListener('resize', () => { measure(); onScroll(); });
    let q = false;
    const onScroll = () => { const y = window.scrollY; scrollHooks.forEach((f) => f(y)); };
    window.addEventListener('scroll', () => { if (q) return; q = true; requestAnimationFrame(() => { q = false; onScroll(); }); }, { passive: true });
    onScroll();
  }

  // ---------- Nav ----------
  function initNav() {
    const nav = document.querySelector('[data-nav]');
    if (!nav) return;
    const burger = nav.querySelector('.nav__burger');
    const menu = nav.querySelector('.nav__mobile');
    const setOpen = (open) => {
      nav.toggleAttribute('data-open', open); burger.setAttribute('aria-expanded', String(open)); menu.hidden = !open;
      document.dispatchEvent(new CustomEvent('alg:menu', { detail: open }));
    };
    burger.addEventListener('click', () => setOpen(!nav.hasAttribute('data-open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.hasAttribute('data-open')) setOpen(false); });

    let lastY = 0;
    scrollHooks.push((y) => {
      nav.classList.toggle('is-scrolled', y > 24);
      if (y > 600 && y > lastY + 4 && !nav.hasAttribute('data-open')) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 600) nav.classList.remove('is-hidden');
      lastY = y;
    });

    // tema do nav = tema da seção sob a faixa de 1 px em y = 40 (altura do meio do nav)
    const zones = [...document.querySelectorAll('main > .sec, .foot')];
    let under = null, io = null;
    const paint = () => nav.classList.toggle('is-light', !!under && under.getAttribute('data-theme') === 'light');
    const build = () => {
      if (io) io.disconnect();
      const below = Math.max(0, window.innerHeight - 41);
      io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) under = e.target; else if (under === e.target) under = null; });
        paint();
      }, { rootMargin: `-40px 0px -${below}px 0px` });
      zones.forEach((z) => io.observe(z));
    };
    build();
    let rz = 0;
    window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(build, 150); });
    // seções que trocam de tema em runtime (ilustração do voo termina em Névoa)
    new MutationObserver(paint).observe(document.querySelector('main') || document.body, { subtree: true, attributes: true, attributeFilter: ['data-theme'] });
  }

  // ---------- Seção ativa: link do nav + trilho (linha em 40% da altura) ----------
  function initActive() {
    const nav = document.querySelector('[data-nav]');
    const links = nav ? [...nav.querySelectorAll('.nav__links a')] : [];
    const rail = document.querySelector('[data-rail-nav]');
    const secs = [...document.querySelectorAll('main > .sec')];
    let items = [], railSecs = [];
    if (rail) {
      const list = rail.querySelector('.rail__list');
      railSecs = secs.filter((s) => s.hasAttribute('data-rail'));
      railSecs.forEach((s) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${s.id}"><span class="rail__label">${s.dataset.rail}</span><span class="rail__dot"></span></a>`;
        list.appendChild(li);
      });
      items = [...list.querySelectorAll('a')];
      const fill = rail.querySelector('.rail__fill');
      scrollHooks.push((y) => { fill.style.transform = `scaleY(${Math.min(1, y / docMax).toFixed(4)})`; });
    }
    let lastIdx = -1, flashT = 0;
    const setActive = (sec) => {
      const id = sec ? sec.id : null;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      if (!rail) return;
      const idx = sec ? railSecs.indexOf(sec) : -1;
      if (idx < 0) return;
      items.forEach((a, i) => { a.classList.toggle('is-active', i === idx); a.classList.toggle('is-done', i < idx); });
      if (idx !== lastIdx) { // mostra o rótulo da nova seção por um instante, depois recolhe (não cobre o conteúdo)
        items.forEach((a) => a.classList.remove('is-flash'));
        if (lastIdx !== -1) { items[idx].classList.add('is-flash'); clearTimeout(flashT); flashT = setTimeout(() => items[idx] && items[idx].classList.remove('is-flash'), 1500); }
        lastIdx = idx;
      }
      rail.classList.toggle('is-light', sec.dataset.theme === 'light');
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target); });
    }, { rootMargin: '-40% 0px -60% 0px' });
    secs.forEach((s) => io.observe(s));
    if (window.scrollY < 2 && secs[0]) setActive(secs[0]);
  }

  // ---------- Barra fixa do celular (depois do voo) ----------
  // Entra quando #voo sai da tela; some com #avaliacao (ou o rodapé) visível e com o menu aberto.
  function initMobileBar() {
    const bar = document.querySelector('[data-mbar]');
    if (!bar) return;
    const voo = document.getElementById('voo');
    const goal = [document.getElementById('avaliacao'), document.querySelector('.foot')].filter(Boolean);
    const vis = new Map();
    let menuOpen = false;
    const update = () => {
      const onVoo = voo ? vis.get(voo) !== false : false;
      const onGoal = goal.some((g) => vis.get(g));
      const on = !onVoo && !onGoal && !menuOpen;
      if (on === bar.classList.contains('is-on')) return;
      bar.classList.toggle('is-on', on);
      bar.toggleAttribute('inert', !on);
      bar.setAttribute('aria-hidden', String(!on));
    };
    const io = new IntersectionObserver((es) => { es.forEach((e) => vis.set(e.target, e.isIntersecting)); update(); });
    // o voo conta como fora quando a borda de baixo dele encosta no topo (borda com borda ainda "intersecta")
    if (voo) new IntersectionObserver((es) => { es.forEach((e) => vis.set(e.target, e.isIntersecting)); update(); }, { rootMargin: '-2px 0px 0px 0px' }).observe(voo);
    goal.forEach((g) => io.observe(g));
    document.addEventListener('alg:menu', (e) => { menuOpen = !!e.detail; update(); });
  }

  document.querySelectorAll('[data-year]').forEach((n) => (n.textContent = new Date().getFullYear()));
  initScroll(); initReveals(); initNav(); initActive(); initMobileBar();
  if (ScrollTrigger) window.addEventListener('load', () => { measure(); ScrollTrigger.refresh(); });
})();
