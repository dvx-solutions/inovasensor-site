import { useRef, useState, type KeyboardEvent } from "react";
import { methodSteps } from "./data";
import "./metodo.css";

type Props = { onApply: () => void };

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProcessDrawing({ index }: { index: number }) {
  const step = methodSteps[index];
  const positions = [[94, 80], [320, 80], [94, 248], [320, 248]];
  const visualOrder = [0, 1, 3, 2];
  return (
    <svg className="metodo-process-drawing" viewBox="0 0 414 340" fill="none">
      <defs>
        <pattern id={`metodo-grid-${index}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="currentColor" /></pattern>
        <marker id={`metodo-arrow-${index}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m2 1 5 4-5 4" stroke="currentColor" strokeWidth="1.5" /></marker>
      </defs>
      <rect x="1" y="1" width="412" height="338" rx="8" fill={`url(#metodo-grid-${index})`} opacity=".14" />
      <path d="M137 80H275M320 124v76M275 248H137" stroke="currentColor" strokeWidth="1.5" markerEnd={`url(#metodo-arrow-${index})`} />
      <path d="M94 204v-74" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" opacity=".5" markerEnd={`url(#metodo-arrow-${index})`} />
      <path d="M173 164h69" stroke="currentColor" strokeWidth="1" opacity=".3" />
      <text x="207" y="158" textAnchor="middle" className="metodo-drawing-center">PROCESSO</text>
      <text x="207" y="180" textAnchor="middle" className="metodo-drawing-center">PRIORITÁRIO</text>
      {positions.map(([x, y], position) => {
        const nodeIndex = visualOrder[position];
        const active = nodeIndex === step.activeNode;
        return (
          <g key={position} className={active ? "metodo-drawing-node is-active" : "metodo-drawing-node"}>
            <circle cx={x} cy={y} r="43" className="metodo-node-halo" />
            <circle cx={x} cy={y} r="32" className="metodo-node-circle" />
            <g transform={`translate(${x - 13} ${y - 13})`} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {nodeIndex === 0 && <><path d="M6 2h10l5 5v17H6z" /><path d="M16 2v6h5M10 13h7m-7 5h7" /></>}
              {nodeIndex === 1 && <><rect x="5" y="5" width="16" height="16" rx="3" /><path d="M9 1v4m8-4v4M9 21v4m8-4v4M1 9h4m-4 8h4m16-8h4m-4 8h4" /><path d="m13 8-4 6h4l-1 4 5-6h-4z" /></>}
              {nodeIndex === 2 && <><path d="M1 13s5-8 12-8 12 8 12 8-5 8-12 8S1 13 1 13z" /><circle cx="13" cy="13" r="3" /></>}
              {nodeIndex === 3 && <><rect x="3" y="3" width="20" height="20" rx="5" /><path d="m8 13 4 4 7-8" /></>}
            </g>
            <text x={x} y={y + 61} textAnchor="middle" className="metodo-drawing-label">{step.nodes[nodeIndex]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Metodo({ onApply }: Props) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % methodSteps.length;
    else if (event.key === "ArrowLeft") next = (index + methodSteps.length - 1) % methodSteps.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = methodSteps.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="metodo" className="sec--metodo" aria-labelledby="metodo-title">
      <div className="wrap">


        <div className="metodo-method">
          <div className="metodo-method-heading">
            <p className="eyebrow"><span className="metodo-dot" /> O método de implementação</p>
            <div>
              <h2 className="section-title" id="metodo-title">Como a mentoria entra<br /><span>na sua operação.</span></h2>
              <p>Diagnóstico, implementação e adoção, com entregas e responsabilidades definidas. A equipe aprende usando a própria rotina.</p>
            </div>
          </div>

          <div className="metodo-tabs" role="tablist" aria-label="Etapas da mentoria">
            {methodSteps.map((step, index) => (
              <button
                key={step.id}
                id={`metodo-tab-${step.id}`}
                type="button"
                role="tab"
                aria-selected={selected === index}
                aria-controls={`metodo-panel-${step.id}`}
                tabIndex={selected === index ? 0 : -1}
                ref={(el) => { tabRefs.current[index] = el; }}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => onTabKey(event, index)}
              >
                <span className="metodo-tab-index">0{index + 1}</span>
                <span className="metodo-tab-text"><strong>{step.label}</strong><small>{step.short}</small></span>
                <Arrow />
              </button>
            ))}
          </div>

          {methodSteps.map((step, index) => (
            <div
              key={step.id}
              id={`metodo-panel-${step.id}`}
              role="tabpanel"
              aria-labelledby={`metodo-tab-${step.id}`}
              hidden={index !== selected}
              tabIndex={0}
              className={`metodo-panel metodo-panel--${step.id}`}
            >
              <div className="metodo-panel-copy">
                <h3>{step.title}</h3>
                <p className="metodo-body">{step.description}</p>
                <div className="metodo-output">
                  <span>O QUE FICA NA SUA EMPRESA</span>
                  <strong>{step.output}</strong>
                </div>
                <dl className="metodo-responsibilities">
                  <div><dt>Na mentoria</dt><dd>{step.mentor}</dd></div>
                  <div><dt>Na empresa</dt><dd>{step.company}</dd></div>
                </dl>
              </div>
              <div className="metodo-diagram" aria-hidden="true">
                <div className="metodo-diagram-top"><span>Aplicação na operação</span><span>0{index + 1} / 03</span></div>
                <div className="metodo-diagram-title">{step.visualTitle}</div>
                <ProcessDrawing index={index} />
                <div className="metodo-diagram-note"><span />{step.visualNote}</div>
                <span className="metodo-illustration">Ilustração do método · escopo definido no diagnóstico</span>
              </div>
            </div>
          ))}

          <div className="metodo-mentor">
            <div className="metodo-mentor-name"><img className="metodo-mentor-photo" src="/mentoria-assets/brand/gustavo.webp" alt="Gustavo Bilonia" width="96" height="120" loading="lazy" /><p><span>Responsável pela mentoria</span><strong>Gustavo Bilonia</strong><small>Diagnóstico, aplicação e treinamento.</small></p></div>
            <p className="metodo-commitment">O trabalho é conduzido pessoalmente, do diagnóstico ao acompanhamento da adoção. Você ou um gestor participa das decisões e apoia a aplicação pelo time.<br /><br />Reserve cerca de <strong>1h por semana</strong> para acompanhar e decidir, além da aplicação pela equipe. A cadência dos encontros muda ao longo do programa.</p>
            <button type="button" className="button button--primary" data-cta="avaliacao" onClick={onApply}>Avaliar minha empresa <Arrow /></button>
          </div>
        </div>

        <article className="metodo-proof" id="resultados" aria-labelledby="metodo-proof-title">
          <div className="metodo-proof-intro">
            <p className="eyebrow"><span className="metodo-dot" /> Uma experiência de aplicação</p>
            <h2 id="metodo-proof-title">Na Devex, da demanda<br /><span>à entrega em menos tempo.</span></h2>
            <p className="metodo-body">
              O uso de IA acompanhado de ajustes de processo fez parte da mudança
              observada no prazo entre a criação e a conclusão dos cards.
            </p>
            <a className="metodo-case-link" href="https://devexsolucoes.com.br" target="_blank" rel="noopener noreferrer">Conheça a Devex <Arrow /></a>
          </div>

          <div className="metodo-proof-data">
            <div className="metodo-data-header">
              <span className="metodo-data-kicker">PRAZO MÉDIO DE CONCLUSÃO</span>
              <span className="metodo-data-context">Criação → conclusão do card</span>
            </div>
            <div className="metodo-comparison-chart" role="img" aria-label="Prazo médio de 27 dias antes e 14 dias depois">
              <div className="metodo-chart-row" aria-hidden="true"><span>Antes</span><div className="metodo-chart-track"><div className="metodo-chart-bar"><strong>27<small>dias</small></strong></div></div></div>
              <div className="metodo-chart-row" aria-hidden="true"><span>Depois</span><div className="metodo-chart-track"><div className="metodo-chart-bar metodo-chart-bar--after"><strong>14<small>dias</small></strong></div></div></div>
            </div>
            <div className="metodo-reduction"><span>−48<span className="metodo-percent">%</span></span><p>no prazo médio<br /><small>Percentual arredondado.</small></p></div>
            <div className="metodo-median">
              <span>Mediana, uma medida diferente da média</span>
              <strong>Mais de 3 dias <Arrow /> menos de 8h</strong>
            </div>
          </div>
          <p className="metodo-evidence-note">
            Experiência interna relatada por Gustavo Bilonia na Devex, com IA e ajustes de processo.
            Resultados variam conforme operação e adoção. Período e amostra ainda não documentados.
            Os números não representam uma garantia para a sua empresa.
          </p>
        </article>
      </div>
    </section>
  );
}

