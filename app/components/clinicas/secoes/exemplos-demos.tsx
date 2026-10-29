// Mini-telas (réplicas de interface) da seção exemplos. Dados 100% fictícios.
// O HTML inicial já é o estado final (legível sem JS); o GSAP anima a partir dele.
import {useEffect, useRef, useState} from 'react';
import {gsap} from '../motion';
import {Icon} from '../icons';

export type DemoProps = {rodar: boolean; auto: boolean; onFim: () => void};
type Q = (s: string) => Element[];

function useDemo(p: DemoProps, monta: (tl: gsap.core.Timeline, q: Q) => void, temBotao = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [enviado, setEnviado] = useState(false);
  const [toque, setToque] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const timers = useRef<number[]>([]);
  const pRef = useRef(p);
  pRef.current = p;
  const montaRef = useRef(monta);
  montaRef.current = monta;

  useEffect(() => {
    const el = ref.current;
    if (!p.rodar || !el) return;
    let ctx: gsap.Context | null = null;
    try {
    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          if (temBotao && pRef.current.auto) {
            timers.current.push(window.setTimeout(() => setToque(true), 650));
            timers.current.push(window.setTimeout(() => { setToque(false); setEnviado(true); }, 1150));
            timers.current.push(window.setTimeout(() => pRef.current.onFim(), 1300));
          } else pRef.current.onFim();
        },
      });
      montaRef.current(tl, gsap.utils.selector(el));
      tlRef.current = tl;
    }, el);
    } catch { /* animação falhou: fica o estado final, legível */ }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      try { ctx?.revert(); } catch { /* ignora */ }
      tlRef.current = null;
    };
  }, [p.rodar, temBotao]);

  const enviar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    tlRef.current?.progress(1, true);
    setToque(false);
    setEnviado(true);
  };
  return {ref, enviado, setEnviado, toque, enviar};
}

function Enviar({rotulo, feito, enviado, toque, onClick, desativado}: {
  rotulo: string; feito: string; enviado: boolean; toque: boolean; onClick: () => void; desativado?: boolean;
}) {
  return <button type="button" className={`ex-enviar${enviado ? ' is-feito' : ''}${toque ? ' is-toque' : ''}`} onClick={onClick} disabled={enviado || desativado}>
    <span className="ex-toque" aria-hidden="true" />
    {enviado ? <><Icon name="check" size={18} />{feito}</> : <>{rotulo}<Icon name="seta" size={18} /></>}
  </button>;
}

function Acao({children, nota}: {children: React.ReactNode; nota: string}) {
  return <div className="ex-acao">
    <span className="ex-acao__nota"><Icon name="cadeado" size={14} />{nota}</span>
    {children}
  </div>;
}

/* 1. Agenda ------------------------------------------------------------ */
const CONSULTAS = [
  {h: '08:00', n: 'Ana', p: 'Limpeza'},
  {h: '09:30', n: 'Marcos', p: 'Avaliação'},
  {h: '11:00', n: 'Pedro', p: 'Clareamento', livre: true},
  {h: '14:00', n: 'Carla', p: 'Revisão'},
  {h: '15:30', n: 'Tiago', p: 'Manutenção'},
];

export function DemoAgenda(p: DemoProps) {
  const d = useDemo(p, (tl, q) => {
    const linhas = q('.ex-linha');
    tl.from(q('.ex-sub'), {opacity: 0, y: 8, duration: 0.3})
      .from(linhas, {opacity: 0, y: 14, stagger: 0.07, duration: 0.4, ease: 'power2.out'}, '<0.1')
      .set(q('.ex-st--prep'), {opacity: 1, attr: {'aria-hidden': 'false'}}, 0)
      .set(q('.ex-st--fim'), {opacity: 0, scale: 0.7, attr: {'aria-hidden': 'true'}}, 0)
      .set(q('.ex-encaixe, .ex-acao'), {opacity: 0}, 0);
    linhas.forEach((li, i) => {
      const t = 0.9 + i * 0.55;
      // só o estado atual fica acessível ao leitor de tela
      tl.to(li.querySelector('.ex-st--prep'), {opacity: 0, duration: 0.2, attr: {'aria-hidden': 'true'}}, t)
        .to(li.querySelector('.ex-st--fim'), {opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)', attr: {'aria-hidden': 'false'}}, t + 0.1)
        .fromTo(li, {backgroundColor: 'rgba(255,45,120,.16)'}, {backgroundColor: 'rgba(255,45,120,0)', duration: 0.8}, t);
    });
    tl.fromTo(q('.ex-encaixe'), {opacity: 0, y: 16}, {opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform'}, '+=0.2')
      .fromTo(q('.ex-acao'), {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, clearProps: 'transform'}, '+=0.15');
  });
  return <div className="ex-demo ex-agenda" ref={d.ref}>
    <p className="ex-sub">Amanhã · 5 consultas · lembrete da véspera</p>
    <ul className="ex-lista">
      {CONSULTAS.map((c) => <li key={c.h} className={`ex-linha${c.livre ? ' is-livre' : ''}`}>
        <span className="ex-hora">{c.h}</span>
        <span className="ex-quem"><b>{c.n}</b><small>{c.p}</small></span>
        <span className="ex-status">
          <span className="ex-st ex-st--prep" aria-hidden="true">preparando</span>
          {c.livre
            ? <span className="ex-st ex-st--fim ex-st--livre">desmarcou</span>
            : <span className="ex-st ex-st--fim ex-st--ok"><Icon name="check" size={13} />lembrete pronto</span>}
        </span>
      </li>)}
    </ul>
    <div className="ex-encaixe">
      <span className="ex-encaixe__ic"><Icon name="volta" size={18} /></span>
      <p><b>Vaga das 11:00 foi para a lista de encaixe</b><span>Lia, Davi e Nina já têm mensagem pronta.</span></p>
    </div>
    <Acao nota="A IA preparou. Quem envia é a recepção.">
      <Enviar rotulo="Enviar 4 lembretes" feito="Enviados pela Júlia" enviado={d.enviado} toque={d.toque} onClick={d.enviar} />
    </Acao>
  </div>;
}

/* 2. Pacientes sumidos -------------------------------------------------- */
const SUMIDOS = {
  '6': [
    {n: 'Renata', p: 'limpeza', t: 'há 7 meses'},
    {n: 'Lucas', p: 'limpeza', t: 'há 6 meses'},
    {n: 'Bia', p: 'manutenção', t: 'há 8 meses'},
  ],
  '12': [
    {n: 'Bruno', p: 'revisão', t: 'há 13 meses'},
    {n: 'Sofia', p: 'revisão', t: 'há 12 meses'},
    {n: 'Caio', p: 'manutenção', t: 'há 14 meses'},
  ],
} as const;

export function DemoSumidos(p: DemoProps) {
  const [filtro, setFiltro] = useState<'6' | '12'>('6');
  const d = useDemo(p, (tl, q) => {
    tl.from(q('.ex-seg button'), {opacity: 0, y: 8, stagger: 0.08, duration: 0.3})
      .from(q('.ex-paciente'), {opacity: 0, x: -16, stagger: 0.12, duration: 0.45, ease: 'power2.out'}, '<0.15')
      .from(q('.ex-tag'), {opacity: 0, scale: 0.6, stagger: 0.15, duration: 0.35, ease: 'back.out(2.4)'}, '+=0.1')
      .from(q('.ex-msg'), {opacity: 0, y: 14, duration: 0.45, ease: 'power3.out'}, '+=0.1')
      .from(q('.ex-msg .ex-pal'), {opacity: 0, stagger: 0.045, duration: 0.15}, '<0.2')
      .from(q('.ex-acao'), {opacity: 0, y: 10, duration: 0.4}, '+=0.2');
  });
  const lista = SUMIDOS[filtro];
  const primeiro = lista[0];
  const msg = `Oi, ${primeiro.n}! Já faz um tempinho desde a sua última ${primeiro.p}. Quer que eu veja um horário para você esta semana?`;
  return <div className="ex-demo ex-sumidos" ref={d.ref}>
    <div className="ex-seg" role="group" aria-label="Pacientes que não vêm há">
      <span className="ex-seg__k" aria-hidden="true">Não vem</span>
      {(['6', '12'] as const).map((f) => <button key={f} type="button" aria-pressed={filtro === f}
        onClick={() => { setFiltro(f); d.setEnviado(false); }}>Há {f} meses</button>)}
    </div>
    <ul className="ex-lista">
      {lista.map((c) => <li key={c.n} className="ex-paciente">
        <span className="ex-avatar" aria-hidden="true">{c.n[0]}</span>
        <span className="ex-quem"><b>{c.n}</b><small>{c.p} · {c.t}</small></span>
        <span className="ex-tag"><Icon name="conversa" size={13} /><span className="ex-tag__m">mensagem </span>pronta</span>
      </li>)}
    </ul>
    <div className="ex-msg">
      <span className="ex-msg__tit">Mensagem pronta para {primeiro.n}</span>
      <p>{msg.split(' ').map((w, i) => <span key={i} className="ex-pal">{w} </span>)}</p>
    </div>
    <Acao nota="A recepção lê, ajusta se quiser e envia.">
      <Enviar rotulo={`Revisar e enviar (${lista.length})`} feito="Enviadas pela Júlia" enviado={d.enviado} toque={d.toque} onClick={d.enviar} />
    </Acao>
  </div>;
}

/* 3. Orçamentos --------------------------------------------------------- */
const ITENS_ORC = [
  {i: 'Limpeza e profilaxia', v: 'R$ 180'},
  {i: 'Restauração em resina (2 dentes)', v: 'R$ 520'},
  {i: 'Clareamento caseiro', v: 'R$ 850'},
];

export function DemoOrcamentos(p: DemoProps) {
  const d = useDemo(p, (tl, q) => {
    tl.from(q('.ex-nota'), {opacity: 0, y: 10, rotate: -2, duration: 0.4})
      .from(q('.ex-nota .ex-letra'), {opacity: 0, stagger: 0.018, duration: 0.05}, '<0.2')
      .from(q('.ex-orcamento'), {opacity: 0, y: 14, scale: 0.98, duration: 0.45, ease: 'power3.out'}, '+=0.2')
      .from(q('.ex-orcamento li'), {opacity: 0, x: 14, stagger: 0.18, duration: 0.35}, '<0.2')
      .from(q('.ex-total'), {opacity: 0, duration: 0.3}, '+=0.05')
      .from(q('.ex-follow'), {opacity: 0, y: 12, duration: 0.4, ease: 'power2.out'}, '+=0.45')
      .from(q('.ex-acao'), {opacity: 0, y: 10, duration: 0.4}, '+=0.15');
  });
  const nota = 'Marcos: limpeza + 2 restaur. resina (16 e 26) + claream. caseiro. Pode parcelar.';
  return <div className="ex-demo ex-orc" ref={d.ref}>
    <div className="ex-nota">
      <span className="ex-nota__tit">Anotação do doutor</span>
      <p className="ex-mao" aria-label={nota}>{nota.split('').map((c, i) => <span key={i} className="ex-letra" aria-hidden="true">{c}</span>)}</p>
    </div>
    <div className="ex-orcamento">
      <p className="ex-orcamento__tit"><b>Orçamento · Marcos</b><small>IA organizou em itens</small></p>
      <ul>{ITENS_ORC.map((x) => <li key={x.i}><span>{x.i}</span><span className="ex-val">{x.v}</span></li>)}</ul>
      <p className="ex-total"><span>Total · pode parcelar</span><b>R$ 1.550</b></p>
      <p className="ex-fict">Valores fictícios, só para mostrar o formato do orçamento.</p>
    </div>
    <div className="ex-follow">
      <span className="ex-avatar" aria-hidden="true">H</span>
      <p><b>Helena não respondeu há 3 dias</b><span>Acompanhamento pronto para enviar.</span></p>
    </div>
    <Acao nota="O doutor anota. A recepção confere e envia.">
      <Enviar rotulo="Revisar e enviar" feito="Enviado pela Júlia" enviado={d.enviado} toque={d.toque} onClick={d.enviar} />
    </Acao>
  </div>;
}

/* 4. Pós-consulta -------------------------------------------------------- */
const SEQ = [
  {q: 'Hoje, 18:00', t: 'Cuidados das primeiras 48 horas', m: 'Oi, Carla! Separei aqui os cuidados para hoje e amanhã.', ic: 'conversa' as const},
  {q: 'Em 2 dias', t: 'Pedido de avaliação no Google', m: 'Se puder, conta como foi no Google. Ajuda muito a clínica.', ic: 'estrela' as const},
  {q: 'Em 15 dias', t: 'Lembrete do retorno', m: 'Seu retorno está chegando. Confirmo terça às 14:00?', ic: 'agenda' as const},
];

export function DemoPos(p: DemoProps) {
  const d = useDemo(p, (tl, q) => {
    tl.from(q('.ex-sub'), {opacity: 0, y: 8, duration: 0.3})
      .from(q('.ex-seq__linha'), {scaleY: 0, transformOrigin: '50% 0%', duration: 1.6, ease: 'power1.inOut'}, '<0.2');
    q('.ex-passo').forEach((li, i) => {
      const t = 0.5 + i * 0.6;
      tl.from(li.querySelector('.ex-passo__ic'), {scale: 0, duration: 0.4, ease: 'back.out(2.4)'}, t)
        .from(li.querySelector('.ex-passo__txt'), {opacity: 0, x: 14, duration: 0.4, ease: 'power2.out'}, t + 0.08)
        .from(li.querySelector('.ex-pronto'), {opacity: 0, scale: 0.6, duration: 0.3, ease: 'back.out(2)'}, t + 0.4);
    });
    tl.from(q('.ex-acao'), {opacity: 0, y: 10, duration: 0.4}, '+=0.3');
  });
  return <div className="ex-demo ex-pos" ref={d.ref}>
    <p className="ex-sub">Carla · clareamento hoje às 14:00</p>
    <div className="ex-seq">
      <span className="ex-seq__linha" aria-hidden="true" />
      <ol>
      {SEQ.map((s) => <li key={s.q} className="ex-passo">
        <span className="ex-passo__ic" aria-hidden="true"><Icon name={s.ic} size={16} /></span>
        <div className="ex-passo__txt">
          <span className="ex-quando">{s.q}</span>
          <b>{s.t}</b>
          <span className="ex-prev">“{s.m}”</span>
        </div>
        <span className="ex-pronto"><Icon name="check" size={12} />pronto</span>
      </li>)}
      </ol>
    </div>
    <Acao nota="Cada envio passa pela recepção.">
      <Enviar rotulo="Enviar os cuidados" feito="Enviado pela Júlia" enviado={d.enviado} toque={d.toque} onClick={d.enviar} />
    </Acao>
  </div>;
}

/* 5. Respostas prontas --------------------------------------------------- */
const CHIPS = [
  {id: 'preco', r: 'Preço', t: 'A limpeza particular fica R$ 180.'},
  {id: 'convenio', r: 'Convênio', t: 'Atendemos vários convênios. Me diz qual é o seu que eu confirmo.'},
  {id: 'endereco', r: 'Endereço', t: 'Estamos na Rua das Acácias, 120, sala 4.'},
  {id: 'preparo', r: 'Preparo', t: 'Para a limpeza não precisa de preparo.'},
] as const;
type ChipId = (typeof CHIPS)[number]['id'];
const FINAL_CHIPS: ChipId[] = ['convenio', 'preco'];

export function DemoRespostas(p: DemoProps) {
  const [sel, setSel] = useState<ChipId[]>(p.rodar ? [] : FINAL_CHIPS);
  const d = useDemo(p, (tl, q) => {
    tl.from(q('.ex-bolha--in'), {opacity: 0, y: 14, scale: 0.96, transformOrigin: '0% 100%', duration: 0.45, ease: 'back.out(1.6)'})
      .from(q('.ex-chips button'), {opacity: 0, y: 10, stagger: 0.08, duration: 0.3}, '+=0.25')
      .from(q('.ex-compor'), {opacity: 0, y: 10, duration: 0.35}, '<0.1')
      .call(() => setSel(['convenio']), [], '+=0.7')
      .call(() => setSel(['convenio', 'preco']), [], '+=1.1')
      .from(q('.ex-acao'), {opacity: 0, y: 10, duration: 0.4}, '+=0.5');
  });
  const msg = sel.length ? `Oi, Bia! ${sel.map((s) => CHIPS.find((c) => c.id === s)!.t).join(' ')}` : '';
  const alternar = (id: ChipId) => {
    d.setEnviado(false);
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  return <div className="ex-demo ex-resp" ref={d.ref}>
    <div className="ex-chat">
      <div className="ex-bolha ex-bolha--in"><b>Bia</b>Oi! Vocês aceitam meu convênio? E quanto fica a limpeza?<time>09:12</time></div>
      {d.enviado && <div className="ex-bolha ex-bolha--out">{msg}<time><Icon name="check" size={12} />Enviado pela Júlia</time></div>}
    </div>
    <p className="ex-mini">Respostas prontas · toque para montar</p>
    <div className="ex-chips">
      {CHIPS.map((c) => <button key={c.id} type="button" aria-pressed={sel.includes(c.id)} onClick={() => alternar(c.id)}>{c.r}</button>)}
    </div>
    <div className="ex-compor" aria-live="polite">
      <span className="ex-compor__tag">IA preparou · você revisa</span>
      <p key={msg}>{msg || 'Escolha uma ou mais respostas prontas.'}</p>
    </div>
    <Acao nota="Um clique da recepcionista. Nada sai sozinho.">
      <Enviar rotulo="Enviar" feito="Enviado pela Júlia" enviado={d.enviado} toque={d.toque} onClick={d.enviar} desativado={!sel.length} />
    </Acao>
  </div>;
}

/* 6. Números da semana --------------------------------------------------- */
const KPIS = [
  {r: 'Consultas', v: 86},
  {r: 'Faltas', v: 7},
  {r: 'Orçamentos em aberto', v: 12},
  {r: 'Faturamento', v: 48300, rs: true},
];
const DIAS = [['Seg', 14], ['Ter', 18], ['Qua', 12], ['Qui', 17], ['Sex', 16], ['Sáb', 9]] as const;
const fmt = (v: number, rs?: boolean) => (rs ? 'R$ ' : '') + Math.round(v).toLocaleString('pt-BR');

export function DemoNumeros(p: DemoProps) {
  const d = useDemo(p, (tl, q) => {
    tl.from(q('.ex-sub'), {opacity: 0, y: 8, duration: 0.3})
      .from(q('.ex-kpi'), {opacity: 0, y: 14, stagger: 0.1, duration: 0.4, ease: 'power2.out'}, '<0.1');
    q('.ex-kpi__v').forEach((el, i) => {
      const k = KPIS[i];
      const o = {v: 0};
      tl.to(o, {v: k.v, duration: 1.3, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(o.v, k.rs); }}, 0.35 + i * 0.1);
    });
    tl.from(q('.ex-barra i'), {scaleY: 0, transformOrigin: '50% 100%', stagger: 0.09, duration: 0.6, ease: 'power3.out'}, 0.6)
      .from(q('.ex-barra b'), {opacity: 0, stagger: 0.09, duration: 0.3}, 1)
      .from(q('.ex-fict'), {opacity: 0, duration: 0.4}, '+=0.2')
      .to({}, {duration: 1.6});
  }, false);
  const max = Math.max(...DIAS.map((x) => x[1]));
  return <div className="ex-demo ex-num" ref={d.ref}>
    <p className="ex-sub">Resumo pronto na segunda às 8:00 · sem planilha</p>
    <dl className="ex-kpis">
      {KPIS.map((k) => <div key={k.r} className="ex-kpi"><dt>{k.r}</dt><dd className="ex-kpi__v">{fmt(k.v, k.rs)}</dd></div>)}
    </dl>
    <div className="ex-grafico" role="img" aria-label="Consultas por dia: segunda 14, terça 18, quarta 12, quinta 17, sexta 16, sábado 9">
      <span className="ex-grafico__tit" aria-hidden="true">Consultas por dia</span>
      <div className="ex-barras" aria-hidden="true">
        {DIAS.map(([dia, v]) => <div key={dia} className="ex-barra">
          <b>{v}</b>
          <span className="ex-trilho"><i style={{height: `${(v / max) * 100}%`}} /></span>
          <span>{dia}</span>
        </div>)}
      </div>
    </div>
    <p className="ex-fict">Valores fictícios, só para mostrar o formato do resumo.</p>
  </div>;
}
