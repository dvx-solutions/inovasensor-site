/* 07 · Avaliação: formulário acessível (validação inline, mailto montado, cópia do pedido).
   Sem animação contínua, sem rAF em laço, sem observadores: só eventos de formulário. */
(function () {
  const sec = document.querySelector('.sec--avaliacao');
  if (!sec) return;

  const TO = 'gustavo.henrique@devexsolucoes.com.br';
  const SUBJECT = 'Avaliação Algeye';
  const ALG = window.ALG || {};

  const form = sec.querySelector('#ava-form');
  const done = sec.querySelector('#ava-done');
  const status = sec.querySelector('[data-ava-status]');
  const copied = sec.querySelector('[data-ava-copied]');
  const again = sec.querySelector('[data-ava-again]');
  const copyBtn = sec.querySelector('[data-ava-copy]');
  const editBtn = sec.querySelector('[data-ava-edit]');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const pick = (id) => form.querySelector('#' + id);
  // obrigatórios: nome, e-mail de trabalho e reservatório
  const FIELDS = [
    { id: 'ava-nome', label: 'Nome', msg: 'Informe o seu nome.' },
    { id: 'ava-email', label: 'E-mail', msg: 'Informe um e-mail válido, como nome@empresa.com.br.', email: true },
    { id: 'ava-res', label: 'Reservatório', msg: 'Informe o nome da represa ou o município.' },
  ].map((f) => {
    const input = pick(f.id);
    return { ...f, input, wrap: input.closest('.ava-field'), err: pick(f.id + '-err'), touched: false };
  });
  const OPTIONAL = [
    { label: 'Organização', input: pick('ava-org') },
    { label: 'Área', input: pick('ava-cargo') },
  ].filter((o) => o.input);

  const value = (f) => f.input.value.trim();
  const isValid = (f) => {
    const v = value(f);
    if (v.length < 2) return false;
    return f.email ? EMAIL_RE.test(v) : true;
  };

  function show(f, force) {
    const ok = isValid(f);
    const v = value(f);
    const bad = !ok && (force || (f.touched && v.length > 0) || f.wrap.classList.contains('is-bad'));
    f.wrap.classList.toggle('is-ok', ok);
    f.wrap.classList.toggle('is-bad', bad);
    f.input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    f.err.textContent = bad ? f.msg : '';
    return ok;
  }

  FIELDS.forEach((f) => {
    f.input.addEventListener('input', () => {
      if (f.wrap.classList.contains('is-bad') || f.wrap.classList.contains('is-ok')) show(f);
      if (status && status.textContent && FIELDS.every(isValid)) status.textContent = '';
    });
    f.input.addEventListener('blur', () => {
      if (value(f).length) f.touched = true;
      show(f);
    });
  });

  function bodyText() {
    const lines = FIELDS.map((f) => `${f.label}: ${value(f)}`);
    OPTIONAL.forEach((o) => { const v = o.input.value.trim(); if (v) lines.push(`${o.label}: ${v}`); });
    return [
      'Olá, equipe Algeye.',
      '',
      'Quero pedir a avaliação de um reservatório.',
      '',
      ...lines,
      '',
      'Enviado pelo formulário do site do Algeye.',
    ].join('\r\n');
  }
  const mailto = () => `mailto:${TO}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(bodyText())}`;

  function say(el, msg) {
    if (!el) return;
    el.textContent = '';
    setTimeout(() => { el.textContent = msg; }, 30);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = FIELDS.filter((f) => !show(f, true));
    if (bad.length) {
      say(status, bad.length === 1 ? 'Falta 1 campo. Ele está destacado acima.' : `Faltam ${bad.length} campos. Eles estão destacados acima.`);
      bad[0].input.focus();
      return;
    }
    const href = mailto();
    if (again) again.href = href;
    try { window.location.href = href; } catch (_) { /* sem cliente de e-mail: copiar, endereço e WhatsApp seguem visíveis */ }
    form.hidden = true;
    done.hidden = false;
    say(status, '');
    const title = done.querySelector('#ava-done-title');
    title && title.focus({ preventScroll: true });
    const top = done.closest('.ava-card').getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * .6) {
      const y = window.scrollY + top - 96;
      ALG.lenis ? ALG.lenis.scrollTo(y) : window.scrollTo({ top: y, behavior: ALG.reduced ? 'auto' : 'smooth' });
    }
  });

  copyBtn && copyBtn.addEventListener('click', async () => {
    const text = `Para: ${TO}\r\nAssunto: ${SUBJECT}\r\n\r\n${bodyText()}`;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      ta.remove();
    }
    const missing = FIELDS.filter((f) => !isValid(f)).length;
    say(copied, !ok
      ? 'Não foi possível copiar. Use o WhatsApp ou escreva para o endereço acima.'
      : missing ? 'Pedido copiado. Complete os campos em branco no seu e-mail e envie para o endereço acima.'
        : 'Pedido copiado. Cole no seu e-mail e envie para o endereço acima.');
  });

  editBtn && editBtn.addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    say(status, '');
    FIELDS[0].input.focus();
  });
})();
