import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Icon} from './icons';
import {envioSchema, ordemPerguntas, perguntas, type Pergunta} from './model';
import {CTA} from './Secoes';

type Respostas = Record<Pergunta, string>;
type Contato = {nome: string; whatsapp: string; cidade: string; clinica: string};
type Estado = 'preenchendo' | 'enviando' | 'enviado' | 'erro';

const passos: {titulo: string; apoio: string; campos: Pergunta[]}[] = [
  {titulo: 'Sua clínica', apoio: 'Com isso a avaliação já chega focada na rotina da sua recepção.', campos: ['tipo_clinica', 'papel', 'profissionais', 'recepcao']},
  {titulo: 'Sua prioridade', apoio: 'Começamos pelo que mais pesa. Você não paga nada para descobrir.', campos: ['dor', 'quando']},
];
const TOTAL = passos.length + 1;
const vazio = Object.fromEntries(ordemPerguntas.map(k => [k, ''])) as Respostas;
const contatoVazio: Contato = {nome: '', whatsapp: '', cidade: '', clinica: ''};
const rotulos: Record<keyof Contato, [string, string, string]> = {
  nome: ['Seu nome', 'name', 'text'],
  whatsapp: ['WhatsApp com DDD', 'tel', 'tel'],
  cidade: ['Cidade', 'address-level2', 'text'],
  clinica: ['Nome da clínica', 'organization', 'text'],
};
const maximo: Record<keyof Contato, number> = {nome: 100, whatsapp: 22, cidade: 80, clinica: 120};
const limpar = (k: keyof Contato, v: string) => (k === 'whatsapp' ? v.replace(/\./g, ' ') : v).trim();
const RASCUNHO = 'cl-avaliacao';
const falhaEnvio = 'Não conseguimos enviar agora. Suas respostas continuam aqui: confira a internet e tente de novo.';
class ErroServidor extends Error {}

const erroContato: Record<keyof Contato, string> = {
  nome: 'Escreva seu nome.',
  whatsapp: 'Confira o número com DDD, só com números.',
  cidade: 'Escreva a cidade da clínica.',
  clinica: 'Escreva o nome da clínica.',
};

function lerOrigem() {
  const origem: Record<string, string> = {};
  const p = new URLSearchParams(location.search);
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']) {
    const v = p.get(k);
    if (v) origem[k] = v.slice(0, 160);
  }
  if (document.referrer) {
    try { origem.referrer = new URL(document.referrer).host.slice(0, 160); } catch { /* ignora */ }
  }
  return origem;
}

export default function Avaliacao() {
  const [passo, setPasso] = useState(0);
  const [resp, setResp] = useState<Respostas>(vazio);
  const [contato, setContato] = useState<Contato>(contatoVazio);
  const [aceite, setAceite] = useState(false);
  const [mostrarErros, setMostrarErros] = useState(false);
  const [estado, setEstado] = useState<Estado>('preenchendo');
  const [mensagem, setMensagem] = useState('');
  const id = useRef('');
  const origem = useRef<Record<string, string>>({});
  const titulo = useRef<HTMLHeadingElement>(null);
  const armadilha = useRef<HTMLInputElement>(null);
  const primeiraVez = useRef(true);
  // Depois de trocar de passo, ignora toques por um instante: o segundo toque de um
  // toque duplo não pode cair na opção ou na caixa que acabou de aparecer embaixo do dedo.
  const [travado, setTravado] = useState(false);
  const travaAte = useRef(0);
  const irPara = (n: number) => { travaAte.current = Date.now() + 450; setPasso(n); };

  const [montado, setMontado] = useState(false);

  // Rascunho só com as escolhas (sem nome nem WhatsApp, como diz a política de privacidade):
  // o navegador do Instagram costuma recarregar a página quando a pessoa volta do WhatsApp.
  useEffect(() => {
    id.current = crypto.randomUUID();
    origem.current = lerOrigem();
    try {
      const r = JSON.parse(sessionStorage.getItem(RASCUNHO) || 'null');
      if (r && typeof r.id === 'string') {
        id.current = r.id;
        setResp({...vazio, ...r.resp});
        if (Number.isInteger(r.passo) && r.passo > 0 && r.passo < TOTAL) setPasso(r.passo);
      }
    } catch { /* sem rascunho */ }
    setMontado(true);
  }, []);
  useEffect(() => {
    if (!montado) return;
    try {
      if (estado === 'enviado') sessionStorage.removeItem(RASCUNHO);
      else sessionStorage.setItem(RASCUNHO, JSON.stringify({id: id.current, passo, resp}));
    } catch { /* armazenamento bloqueado */ }
  }, [montado, passo, resp, estado]);
  useEffect(() => {
    if (primeiraVez.current) { primeiraVez.current = false; return; }
    setTravado(true);
    const t = setTimeout(() => setTravado(false), 450);
    titulo.current?.focus({preventScroll: true});
    titulo.current?.closest('.cl-form')?.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    return () => clearTimeout(t);
  }, [passo, estado === 'enviado']);

  const faltando = (campos: Pergunta[]) => campos.filter(c => !resp[c]);
  const contatoInvalido = (k: keyof Contato) => !envioSchema.shape[k].safeParse(limpar(k, contato[k])).success;
  const focarErro = () => requestAnimationFrame(() =>
    document.querySelector<HTMLInputElement>('.cl-form .cl-campo--erro input, .cl-form .cl-aceite.cl-campo--erro input')?.focus());

  function avancar() {
    if (faltando(passos[passo].campos).length) { setMostrarErros(true); focarErro(); return; }
    setMostrarErros(false);
    irPara(passo + 1);
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (travado || Date.now() < travaAte.current) return;
    if (passo < passos.length) { avancar(); return; }
    if (estado === 'enviando') return;
    const corpo = {id: id.current, ...resp,
      ...Object.fromEntries((Object.keys(contato) as (keyof Contato)[]).map(k => [k, limpar(k, contato[k])])),
      consentimento: aceite, website: armadilha.current?.value || '', origem: origem.current};
    if (!aceite || !envioSchema.safeParse(corpo).success) {
      setMostrarErros(true);
      const algumCampo = !aceite || (Object.keys(contato) as (keyof Contato)[]).some(contatoInvalido);
      if (!algumCampo) { setEstado('erro'); setMensagem('Revise as respostas e tente de novo.'); }
      focarErro();
      return;
    }
    setEstado('enviando');
    setMensagem('');
    try {
      const r = await fetch('/api/leads', {method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(corpo), signal: AbortSignal.timeout(15_000)});
      const dados = await r.json().catch(() => ({}));
      if (!r.ok) throw new ErroServidor(typeof dados.error === 'string' ? dados.error : falhaEnvio);
      setEstado('enviado');
      (window as Window & {fbq?: (...a: unknown[]) => void}).fbq?.('track', 'Lead');
    } catch (erro) {
      setEstado('erro');
      setMensagem(erro instanceof ErroServidor ? erro.message : falhaEnvio);
    }
  }

  if (estado === 'enviado') {
    return <div className="cl-form cl-form--ok" role="status">
      <span className="cl-form__ok-icone"><Icon name="check" size={28} /></span>
      <h3 ref={titulo} tabIndex={-1}>Recebido, {contato.nome.trim().split(' ')[0]}.</h3>
      <p>Vamos chamar você no WhatsApp {contato.whatsapp.trim()} para marcar a avaliação da {contato.clinica.trim()}.</p>
      <button type="button" className="cl-btn cl-btn--ghost cl-form__corrigir"
        onClick={() => { id.current = crypto.randomUUID(); setEstado('preenchendo'); irPara(TOTAL - 1); }}>Corrigir meus dados</button>
    </div>;
  }

  const etapa = passo < passos.length ? passos[passo] : null;
  return <form className={`cl-form${travado ? ' is-travado' : ''}`} onSubmit={enviar} noValidate
    onClickCapture={e => { if (Date.now() < travaAte.current) { e.preventDefault(); e.stopPropagation(); } }}>
    <p className="cl-form__passo">Passo {passo + 1} de {TOTAL}</p>
    <h3 ref={titulo} tabIndex={-1}>{etapa ? etapa.titulo : 'Para onde a gente responde'}</h3>
    <p className="cl-form__apoio">{etapa ? etapa.apoio : 'A gente chama você no WhatsApp para marcar um horário.'}</p>

    {etapa && etapa.campos.map(c => {
      const erro = mostrarErros && !resp[c];
      return <fieldset key={c} className={`cl-campo${erro ? ' cl-campo--erro' : ''}`} aria-describedby={erro ? `${c}-erro` : undefined}>
        <legend>{perguntas[c].titulo}</legend>
        <div className="cl-opcoes">
          {perguntas[c].opcoes.map(([valor, texto]) => <label key={valor} className="cl-opcao">
            <input type="radio" name={c} value={valor} checked={resp[c] === valor} aria-invalid={erro || undefined}
              onChange={() => setResp(r => ({...r, [c]: valor}))} />
            <span>{texto}</span>
          </label>)}
        </div>
        {erro && <p id={`${c}-erro`} className="cl-erro" role="alert">Escolha uma opção.</p>}
      </fieldset>;
    })}

    {!etapa && <>
      {(Object.keys(rotulos) as (keyof Contato)[]).map(k => {
        const [rotulo, auto, tipo] = rotulos[k];
        const erro = mostrarErros && contatoInvalido(k);
        return <div key={k} className={`cl-campo${erro ? ' cl-campo--erro' : ''}`}>
          <label htmlFor={`cl-${k}`}>{rotulo}</label>
          <input id={`cl-${k}`} name={k} type={tipo} autoComplete={auto} inputMode={k === 'whatsapp' ? 'tel' : undefined}
            maxLength={maximo[k]} value={contato[k]} aria-invalid={erro || undefined}
            aria-describedby={erro ? `cl-${k}-erro` : undefined}
            onChange={e => { const v = e.target.value; setContato(c => ({...c, [k]: v})); }} />
          {erro && <p id={`cl-${k}-erro`} className="cl-erro" role="alert">{erroContato[k]}</p>}
        </div>;
      })}
      <div className="cl-armadilha" aria-hidden="true">
        <label htmlFor="cl-website">Site</label>
        <input id="cl-website" ref={armadilha} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className={`cl-aceite${mostrarErros && !aceite ? ' cl-campo--erro' : ''}`}>
        <input type="checkbox" checked={aceite} onChange={e => setAceite(e.target.checked)} />
        <span>Concordo que a InovaSensor use estes dados para falar comigo sobre a avaliação, como explica a <a href="/privacidade" target="_blank" rel="noopener">política de privacidade</a>.</span>
      </label>
      {mostrarErros && !aceite && <p className="cl-erro" role="alert">Marque a concordância para enviar.</p>}
    </>}

    {estado === 'erro' && <p className="cl-erro cl-erro--geral" role="alert">{mensagem}</p>}

    <div className="cl-form__acoes">
      {passo > 0 && <button type="button" className="cl-btn cl-btn--ghost" onClick={() => { setMostrarErros(false); irPara(passo - 1); }}>Voltar</button>}
      {etapa
        ? <button type="submit" className="cl-btn cl-btn--primary" disabled={!montado}>Continuar<Icon name="seta" size={18} /></button>
        : <button type="submit" className="cl-btn cl-btn--primary" disabled={!montado || estado === 'enviando'} data-cta="avaliacao" data-cta-pos="envio">
            {estado === 'enviando' ? 'Enviando…' : CTA}
          </button>}
    </div>
    <p className="cl-form__nota"><Icon name="cadeado" size={14} />Não pedimos dados de pacientes.</p>
  </form>;
}
