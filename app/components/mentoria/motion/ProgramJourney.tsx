import { useEffect, useRef, useState, type KeyboardEvent, type CSSProperties } from 'react';
import { programStages } from '../sections/programa/data';
import './motion.css';

const points = [[80,200],[270,145],[460,178],[650,107],[840,142],[1030,62]];
const labels = ['Diagnosticar + aplicar','Adoção','Acompanhar','Ajustar','Consolidar','Próximo ciclo'];
const curve = 'M80 200 C160 200 190 145 270 145 S380 178 460 178 S570 107 650 107 S760 142 840 142 S950 62 1030 62';
const stageIndex = (month: number) => month === 0 ? 0 : month < 4 ? 1 : 2;

export default function ProgramJourney() {
  const host = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [month, setMonth] = useState(0);
  const lastMonth = useRef(0);
  const manual = useRef(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData;
    const preference = () => { element.dataset.static = String(reduced.matches || !!saveData); request(); };
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible || manual.current || reduced.matches || saveData) return;
      const rect = element.getBoundingClientRect();
      const start = innerHeight * .72;
      const distance = Math.max(360, rect.height - innerHeight * .08);
      const progress = Math.max(0, Math.min(1, (start - rect.top) / distance));
      // On a small screen the reader sees one stage at a time. Keep the first
      // stage available until a deliberate choice; only the route draws on scroll.
      const next = innerWidth <= 760 ? 0 : Math.min(5, Math.floor(progress * 6));
      element.style.setProperty('--journey-progress', String(progress));
      if (lastMonth.current !== next) { lastMonth.current = next; setMonth(next); }
    };
    const request = () => { if (!frame && visible) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; if (visible) request();}, {rootMargin: '30px'});
    observer.observe(element);
    addEventListener('scroll', request, {passive: true});
    addEventListener('resize', request);
    reduced.addEventListener('change', preference);
    preference();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener('scroll', request); removeEventListener('resize', request); reduced.removeEventListener('change', preference); };
  }, []);
  const choose = (next: number, focus = false) => {
    manual.current = true;
    setMonth(next); lastMonth.current = next;
    host.current?.style.setProperty('--journey-progress', String(next / 5));
    if (focus) buttons.current[next]?.focus();
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % 6 : event.key === 'ArrowLeft' ? (index + 5) % 6 : event.key === 'Home' ? 0 : event.key === 'End' ? 5 : -1;
    if (next >= 0) {event.preventDefault(); choose(next, true);}
  };
  const current = stageIndex(month);
  return <div className="motion-journey" ref={host} data-month={month + 1} style={{'--journey-focus':month / 5} as CSSProperties}>
    <div className="journey-topline"><span>DO DIAGNÓSTICO À CONTINUIDADE</span><span>Explore os meses <i aria-hidden="true">↘</i></span></div>
    <div className="journey-art" aria-hidden="true">
      <svg viewBox="0 0 1110 290" fill="none">
        <defs>
          <linearGradient id="journey-line"><stop stopColor="#f26b92"/><stop offset="1" stopColor="#da3c6d"/></linearGradient>
          <pattern id="journey-grid" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#ffffff" opacity=".17"/></pattern>
        </defs>
        <rect width="1110" height="290" fill="url(#journey-grid)"/>
        <path d={curve} stroke="#ffffff22" strokeWidth="2"/>
        <path ref={path} className="journey-trace" d={curve} pathLength="1" stroke="url(#journey-line)" strokeWidth="3"/>
        {points.map(([x,y], i) => <g key={i} className={'journey-node '+(month >= i ? 'is-reached' : '')}>
          <circle cx={x} cy={y} r="26" fill="#202026" stroke="currentColor"/>
          <circle className="journey-node-core" cx={x} cy={y} r={month === i ? 8 : 4} fill="currentColor"/>
          {month === i && <circle className="journey-halo" cx={x} cy={y} r="36" stroke="#f26b92" opacity=".5"/>}
          <text x={x} y={y + 53} textAnchor="middle">{labels[i]}</text>
          <text className="journey-month-number" x={x} y={y - 42} textAnchor="middle">0{i + 1}</text>
        </g>)}
      </svg>
    </div>
    <div className="journey-months" role="tablist" aria-label="Explore os seis meses da mentoria">
      {points.map((_, i) => <button key={i} id={`journey-tab-${i}`} type="button" role="tab" ref={el => {buttons.current[i] = el;}} tabIndex={month === i ? 0 : -1} aria-selected={month === i} aria-controls="journey-detail" onClick={() => choose(i)} onKeyDown={e => keyboard(e,i)}><small>MÊS</small><strong>0{i+1}</strong><span aria-hidden="true">↗</span></button>)}
    </div>
    <div id="journey-detail" className="journey-details" role="tabpanel" aria-labelledby={`journey-tab-${month}`} tabIndex={0}>
      {programStages.map((stage, i) => <article key={stage.period} className={'journey-stage '+(current === i ? 'is-current' : '')}>
        <div className="journey-stage-top"><span>{stage.period}</span><span aria-hidden="true">0{i+1}</span></div>
        <h3>{stage.title}</h3><p>{stage.description}</p>
        <div className="journey-cadence"><span className="journey-meetings" aria-hidden="true">{Array.from({length:i === 0 ? 4 : i === 1 ? 2 : 1}, (_, k) => <i key={k}/>)}</span><strong>{stage.cadence}</strong><small>{stage.detail}</small></div>
      </article>)}
    </div>
    <p className="journey-note">Encontros de 1 hora. O acompanhamento evolui conforme a etapa; aplicação e decisões acontecem com a equipe.</p>
  </div>;
}
