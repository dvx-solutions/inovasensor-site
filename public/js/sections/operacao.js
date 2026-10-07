/* Seção 05 · Na operação: demonstração da ocorrência (dados fictícios) + confronto coleta x estimativa.
   Nenhum dado real. Textos digitados pelo visitante ficam só nesta aba (textContent, nada é enviado). */
(function () {
  const sec = document.getElementById('operacao');
  if (!sec) return;
  const ALG = window.ALG || {};
  const reduced = ALG.reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const demo = sec.querySelector('[data-op-demo]');
  const $ = (s) => demo.querySelector(s);
  const logEl = $('[data-op-log]');
  const countEl = $('[data-op-count]');
  const pathEl = $('[data-op-path]');
  const statusEl = $('[data-op-status]');
  const ownerEl = $('[data-op-owner]');
  const assigneeEl = $('[data-op-assignee]');
  const coletaEl = $('[data-op-coleta]');
  const composer = $('[data-op-composer]');
  const acts = [...demo.querySelectorAll('[data-act]')];
  const trackItems = [...demo.querySelectorAll('.op-track li')];

  const descEl = $('[data-op-desc]');
  const emptyEl = $('[data-op-empty]');
  const DESC = { aberta: 'Ninguém assumiu ainda.', analise: 'Alguém assumiu e o nome aparece.', coleta: 'Há coleta de campo marcada, com horário.', resolvida: 'Encerrada, com o texto do que foi feito.' };
  const LABEL = { aberta: 'Aberta', analise: 'Em análise', coleta: 'Coleta agendada', resolvida: 'Resolvida' };
  const RESPONSAVEIS = ['Analista de qualidade', 'Coordenação da ETA', 'Equipe de campo'];
  const SUGESTAO_RESOLVER = 'Resultado de laboratório registrado e confrontado com a estimativa. Encerrada conforme o protocolo da equipe.';

  let st;
  function fresh() {
    st = { status: 'aberta', owner: null, assignee: null, coleta: null, path: ['aberta'], clock: 8 * 60 + 12, n: 0, open: null };
  }
  const hhmm = (m) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function addEvent(kind, who, what, quote, animate = true) {
    if (st.n > 0) st.clock += 3 + Math.floor(Math.random() * 7);
    st.n += 1;
    const li = el('li', 'op-ev' + (animate && !reduced ? ' is-new' : ''));
    li.dataset.k = kind;
    li.appendChild(el('span', 'op-ev__t', hhmm(st.clock)));
    const b = el('div', 'op-ev__b');
    const w = el('p', 'op-ev__who');
    w.appendChild(el('b', null, who));
    b.appendChild(w);
    const p = el('p', 'op-ev__what', what);
    if (quote) p.appendChild(el('span', 'op-ev__q', quote));
    b.appendChild(p);
    li.appendChild(b);
    logEl.appendChild(li);
    countEl.textContent = st.n + (st.n === 1 ? ' registro' : ' registros');
    logEl.scrollTo({ top: logEl.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }

  function setStatus(s) {
    if (st.status === s) return;
    st.status = s;
    if (st.path[st.path.length - 1] !== s) st.path.push(s);
    statusEl.textContent = 'Estado da ocorrência: ' + LABEL[s] + '.';
    render();
  }

  function setMeta(node, value, empty) {
    const was = node.textContent;
    node.textContent = value || empty;
    node.classList.toggle('is-empty', !value);
    if (value && was !== value && !reduced) {
      node.classList.remove('is-new'); void node.offsetWidth; node.classList.add('is-new');
    }
  }

  function render() {
    const visited = new Set(st.path);
    trackItems.forEach((li) => {
      const on = li.dataset.s === st.status;
      li.classList.toggle('is-on', on);
      li.classList.toggle('was', !on && visited.has(li.dataset.s));
      if (on) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    if (descEl) descEl.textContent = DESC[st.status];
    if (emptyEl) emptyEl.hidden = st.n > 1;
    pathEl.textContent = st.path.map((s) => LABEL[s]).join(' → ');
    setMeta(ownerEl, st.owner, 'ninguém ainda');
    setMeta(assigneeEl, st.assignee, 'não atribuído');
    setMeta(coletaEl, st.coleta, 'não agendada');
    const done = st.status === 'resolvida';
    demo.querySelector('[data-op-reset]').classList.toggle('is-ready', done);
    acts.forEach((b) => {
      const a = b.dataset.act;
      b.disabled = done || (a === 'assumir' && st.owner === 'Você') || (a === 'agendar' && !!st.coleta);
    });
  }

  // ---------- compositor (formulário curto por ação) ----------
  function closeComposer(focusBack) {
    const prev = st.open;
    st.open = null;
    composer.hidden = true;
    composer.replaceChildren();
    acts.forEach((b) => b.hasAttribute('aria-expanded') && b.setAttribute('aria-expanded', 'false'));
    if (focusBack && prev) {
      const btn = demo.querySelector(`[data-act="${prev}"]`);
      if (btn && !btn.disabled) btn.focus();
    }
  }

  function row(goLabel, onGo) {
    const r = el('div', 'op-composer__row');
    const go = el('button', 'op-composer__go', goLabel); go.type = 'submit';
    const cancel = el('button', 'op-composer__cancel', 'Cancelar'); cancel.type = 'button';
    cancel.addEventListener('click', () => closeComposer(true));
    const err = el('p', 'op-composer__err'); err.setAttribute('role', 'alert');
    r.append(go, cancel, err);
    return { r, err, onGo };
  }

  function openComposer(act) {
    if (st.open === act) { closeComposer(true); return; }
    closeComposer(false);
    st.open = act;
    const btn = demo.querySelector(`[data-act="${act}"]`);
    btn.setAttribute('aria-expanded', 'true');
    const form = el('form'); form.noValidate = true;
    let focusEl, ctl;

    if (act === 'atribuir') {
      const fs = el('fieldset');
      fs.appendChild(el('legend', null, 'Atribuir a (perfis fictícios)'));
      const ch = el('div', 'op-choices');
      RESPONSAVEIS.forEach((r, i) => {
        const lab = el('label', 'op-choice');
        const inp = document.createElement('input');
        inp.type = 'radio'; inp.name = 'op-resp'; inp.value = r;
        if (r === st.assignee || (!st.assignee && i === 0)) inp.checked = true;
        lab.append(inp, el('span', null, r));
        ch.appendChild(lab);
        if (inp.checked) focusEl = inp;
      });
      fs.appendChild(ch); form.appendChild(fs);
      ctl = row('Atribuir', () => {
        const v = form.querySelector('input[name="op-resp"]:checked').value;
        if (v === st.assignee) return 'Essa pessoa já é a responsável.';
        st.assignee = v;
        addEvent('atribuir', 'Você', 'Atribuiu a ocorrência a ' + v + '.');
        render();
      });
    }

    if (act === 'comentar') {
      const id = 'op-c-' + Date.now();
      const lab = el('label', null, 'Comentário'); lab.htmlFor = id;
      const inp = document.createElement('input');
      inp.type = 'text'; inp.id = id; inp.maxLength = 140; inp.autocomplete = 'off';
      inp.placeholder = 'Ex.: conferir a margem leste na próxima passagem';
      form.append(lab, inp);
      focusEl = inp;
      ctl = row('Registrar comentário', () => {
        const v = inp.value.trim();
        if (!v) return 'Escreva o comentário para registrar.';
        addEvent('comentar', 'Você', 'Comentou:', v);
      });
      form.appendChild(el('p', 'op-composer__hint', 'Comentar não muda o estado. Fica só nesta página, nada é enviado.'));
    }

    if (act === 'agendar') {
      const fs = el('fieldset');
      fs.appendChild(el('legend', null, 'Coleta de campo no ponto P3'));
      const ch = el('div', 'op-choices');
      ['amanhã, 07:30', 'amanhã, 13:00', 'em dois dias, 08:00'].forEach((r, i) => {
        const lab = el('label', 'op-choice');
        const inp = document.createElement('input');
        inp.type = 'radio'; inp.name = 'op-col'; inp.value = r; inp.checked = i === 0;
        lab.append(inp, el('span', null, r));
        ch.appendChild(lab);
        if (i === 0) focusEl = inp;
      });
      fs.appendChild(ch); form.appendChild(fs);
      ctl = row('Agendar', () => {
        const v = form.querySelector('input[name="op-col"]:checked').value;
        st.coleta = 'P3 · ' + v;
        addEvent('agendar', 'Você', 'Agendou coleta de campo no ponto P3 para ' + v + '.');
        setStatus('coleta'); render();
      });
      form.appendChild(el('p', 'op-composer__hint', 'A coleta é feita pela sua equipe. O registro guarda o agendamento e, depois, o resultado.'));
    }

    if (act === 'resolver') {
      const id = 'op-r-' + Date.now();
      const lab = el('label', null, 'O que foi feito? (obrigatório, é o que fica no registro)'); lab.htmlFor = id;
      const ta = document.createElement('textarea');
      ta.id = id; ta.maxLength = 220; ta.value = SUGESTAO_RESOLVER;
      form.append(lab, ta);
      focusEl = ta;
      ctl = row('Resolver ocorrência', () => {
        const v = ta.value.trim();
        if (!v) return 'Descreva o que foi feito para resolver.';
        addEvent('resolver', 'Você', 'Resolveu a ocorrência:', v);
        setStatus('resolvida');
      });
    }

    form.appendChild(ctl.r);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = ctl.onGo();
      if (msg) { ctl.err.textContent = msg; return; }
      closeComposer(false);
      const next = acts.find((b) => !b.disabled);
      (st.status === 'resolvida' ? demo.querySelector('[data-op-reset]') : (btn.disabled ? next : btn))?.focus();
    });
    form.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeComposer(true); } });
    composer.appendChild(form);
    composer.hidden = false;
    if (!reduced) { composer.classList.remove('is-in'); void composer.offsetWidth; composer.classList.add('is-in'); }
    if (focusEl) focusEl.focus({ preventScroll: true });
    const r = composer.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 16) {
      const y = window.scrollY + r.bottom - window.innerHeight + 24;
      if (ALG.lenis) ALG.lenis.scrollTo(y, { duration: reduced ? 0 : .6 }); else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  acts.forEach((b) => b.addEventListener('click', () => {
    acts.forEach((x) => x.classList.remove('is-hint'));
    const a = b.dataset.act;
    if (a === 'assumir') {
      closeComposer(false);
      st.owner = 'Você';
      addEvent('assumir', 'Você', 'Assumiu a ocorrência.');
      if (st.status === 'aberta') setStatus('analise');
      render();
      return;
    }
    openComposer(a);
  }));

  function reset(animate) {
    fresh();
    closeComposer(false);
    logEl.replaceChildren();
    statusEl.textContent = '';
    addEvent('sistema', 'Sistema', 'Regra de alerta acionada na avaliação da passagem 7. Ocorrência aberta.', null, animate);
    render();
  }
  demo.querySelector('[data-op-reset]').addEventListener('click', () => {
    reset(true);
    statusEl.textContent = 'Demonstração recomeçada. Estado da ocorrência: Aberta.';
    demo.querySelector('[data-act="assumir"]').focus();
  });

  reset(false);

  // Convite discreto: quando a demo aparece pela primeira vez, o anel de "Assumir" pulsa 3 vezes.
  // O anel é um ::after (opacity/transform). Fora da tela a animação pausa (.op-off); ao terminar,
  // ou no primeiro clique, o observador é desligado e nada fica rodando.
  const assumir = demo.querySelector('[data-act="assumir"]');
  let offVis = null;
  const stopHint = () => {
    acts.forEach((x) => x.classList.remove('is-hint'));
    sec.classList.remove('op-off');
    if (offVis) { offVis(); offVis = null; }
  };
  assumir.addEventListener('animationend', (e) => { if (e.pseudoElement === '::after') stopHint(); });
  acts.forEach((b) => b.addEventListener('click', stopHint));
  const hintOnce = () => {
    if (reduced || st.n !== 1) return;
    assumir.classList.add('is-hint');
    if (ALG.onVisible) offVis = ALG.onVisible(sec, (v) => sec.classList.toggle('op-off', !v), '0px');
  };
  if (ALG.onVisible && !reduced) {
    let off = null, done = false;
    off = ALG.onVisible(demo, (v) => { if (v && !done) { done = true; setTimeout(hintOnce, 900); off && off(); } }, '-20% 0px');
  }

})();
