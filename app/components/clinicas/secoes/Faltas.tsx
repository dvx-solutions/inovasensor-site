import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {CTA} from '../cta';
import {Icon} from '../icons';
import {calcular, EVENTOS, guardarCalculo, medir, reais} from '../medir';
import {gsap, reduzido} from '../motion';
import './faltas.css';

// Valores de partida da conta. São só um ponto de partida: o visitante ajusta para a clínica dele.
const PARTIDA = {consultas: 20, faltas: 15, ticket: 200, dias: 22};
const CADEIRAS = 20;
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

export default function Faltas() {
  const [consultas, setConsultas] = useState(PARTIDA.consultas);
  const [faltas, setFaltas] = useState(PARTIDA.faltas);
  const [ticket, setTicket] = useState(String(PARTIDA.ticket));
  const [dias, setDias] = useState(String(PARTIDA.dias));
  const [mexeu, setMexeu] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const mostrado = useRef(0);

  const conta = calcular(consultas, faltas, limitar(Number(ticket), 0, 100_000), limitar(Math.round(Number(dias)), 1, 31));
  const vazias = Math.round(CADEIRAS * faltas / 100);
  const porDia = Math.round(conta.perda_mes / conta.dias);

  // O número rola até o valor novo (sem animação com movimento reduzido).
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const alvo = conta.perda_mes;
    try {
      if (reduzido()) { el.textContent = reais(alvo); mostrado.current = alvo; return; }
      const obj = {v: mostrado.current};
      const tw = gsap.to(obj, {v: alvo, duration: .6, ease: 'power3.out',
        onUpdate: () => { el.textContent = reais(Math.round(obj.v)); }, onComplete: () => { mostrado.current = alvo; }});
      return () => { mostrado.current = Math.round(obj.v); tw.kill(); };
    } catch { el.textContent = reais(alvo); }
  }, [conta.perda_mes]);

  // Só depois que a pessoa mexe: a conta vai para o formulário e o pixel registra o uso.
  useEffect(() => {
    if (!mexeu) return;
    guardarCalculo(conta);
    const t = setTimeout(() => medir(EVENTOS.calculadora, {value: conta.perda_mes, currency: 'BRL'}), 900);
    return () => clearTimeout(t);
  }, [mexeu, conta.perda_mes, conta.resumo]);

  const mudar = <T,>(f: (v: T) => void) => (v: T) => { setMexeu(true); f(v); };

  return <section id="faltas" className="s-faltas" data-tema="escuro" aria-labelledby="faltas-titulo">
    <div className="cl-wrap s-faltas__grade">
      <header className="s-faltas__cab">
        <p className="cl-kicker">Calculadora de faltas</p>
        <h2 id="faltas-titulo" className="cl-h2">Quanto a cadeira vazia <em>custa por mês?</em></h2>
        <p className="cl-lead">Coloque os números da sua clínica. A conta é simples: consultas por dia × faltas × valor médio da consulta × dias de atendimento.</p>
      </header>

      <div className="s-faltas__painel">
        <div className="s-faltas__campos">
          <label className="s-faltas__campo">
            <span className="s-faltas__rot">Consultas por dia <b>{consultas}</b></span>
            <input type="range" min={1} max={100} step={1} value={consultas} style={{'--p': `${(consultas - 1) / 99 * 100}%`} as CSSProperties}
              onChange={e => mudar(setConsultas)(Number(e.target.value))} />
          </label>
          <label className="s-faltas__campo">
            <span className="s-faltas__rot">Faltas e desmarcações em cima da hora <b>{faltas}%</b></span>
            <input type="range" min={0} max={50} step={1} value={faltas} style={{'--p': `${faltas / 50 * 100}%`} as CSSProperties}
              onChange={e => mudar(setFaltas)(Number(e.target.value))} />
          </label>
          <div className="s-faltas__dupla">
            <label className="s-faltas__campo">
              <span className="s-faltas__rot">Valor médio da consulta</span>
              <span className="s-faltas__num"><i>R$</i><input type="text" inputMode="numeric" maxLength={6} value={ticket}
                onChange={e => mudar(setTicket)(e.target.value.replace(/\D/g, ''))} /></span>
            </label>
            <label className="s-faltas__campo">
              <span className="s-faltas__rot">Dias de atendimento no mês</span>
              <span className="s-faltas__num"><input type="text" inputMode="numeric" maxLength={2} value={dias}
                onChange={e => mudar(setDias)(e.target.value.replace(/\D/g, ''))} /><i>dias</i></span>
            </label>
          </div>
          <p className="s-faltas__aviso">Os números iniciais são só um exemplo. Troque pelos da sua clínica.</p>
        </div>

        <div className="s-faltas__resultado">
          <div className="s-faltas__cadeiras" aria-hidden="true">
            {Array.from({length: CADEIRAS}, (_, i) => <span key={i} className={`s-faltas__cadeira${i < vazias ? ' is-vazia' : ''}`} style={{'--i': i} as CSSProperties} />)}
          </div>
          <p className="s-faltas__legenda" aria-hidden="true">A cada 20 horários, {vazias} {vazias === 1 ? 'fica vazio' : 'ficam vazios'}</p>
          <p className="s-faltas__rotulo">Deixa de entrar por mês</p>
          <p className="s-faltas__valor"><span className="cl-sr" aria-live="polite">{reais(conta.perda_mes)} por mês</span><span ref={numRef} aria-hidden="true">{reais(conta.perda_mes)}</span></p>
          <p className="s-faltas__dia">{reais(porDia)} por dia de atendimento</p>
          <a className="cl-btn s-faltas__cta" href="#avaliacao" data-cta="avaliacao" data-cta-pos="calculadora">
            {CTA}<Icon name="seta" size={18} />
          </a>
          <p className="s-faltas__nota"><Icon name="check" size={14} />{mexeu ? 'Essa conta vai junto no pedido da avaliação.' : 'Mexa nos números: a sua conta vai junto no pedido da avaliação.'}</p>
        </div>
      </div>
    </div>
  </section>;
}
