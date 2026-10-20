import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./contexto.css";

type Props = { onApply: () => void };
type Connection = { saveData?: boolean; addEventListener?: (event: string, fn: () => void) => void; removeEventListener?: (event: string, fn: () => void) => void };
const stages = [
  { label: "Demanda", title: "O trabalho chega por vários caminhos.", copy: "Mensagens, prazos e decisões disputam a atenção da equipe.", card: "Solicitação do cliente", status: "Contexto disperso", details: ["Reunir as informações", "Entender o próximo passo"] },
  { label: "Apoio da IA", title: "A IA ajuda a organizar o contexto.", copy: "Informações reunidas e um rascunho para a equipe conferir.", card: "Contexto organizado", status: "Rascunho para revisão", details: ["Informações reunidas", "Encaminhamento sugerido"] },
  { label: "Revisão", title: "A decisão continua com as pessoas.", copy: "Quem conhece a operação confere as informações e valida o próximo passo.", card: "Revisão da equipe", status: "Validação humana", details: ["Conferir informações", "Confirmar o responsável"] },
  { label: "Entrega", title: "A demanda segue com direção.", copy: "Contexto, responsável e encaminhamento claros para a execução.", card: "Pronto para encaminhar", status: "Próximo passo definido", details: ["Contexto validado", "Responsável definido"] },
];
const fragments = [
  { label: "Prazo combinado", content: "Está naquela conversa…", icon: "clock" },
  { label: "Dados do serviço", content: "Onde está o documento?", icon: "document" },
  { label: "Responsável", content: "Quem acompanha?", icon: "person" },
];

function SceneIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {kind === "document" && <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 12h6m-6 4h6" /></>}
    {kind === "clock" && <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>}
    {kind === "person" && <><circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>}
    {kind === "ai" && <><path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z" /><path d="m19 2 .9 2.1L22 5l-2.1.9L19 8l-.9-2.1L16 5l2.1-.9z" /></>}
    {kind === "eye" && <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>}
    {kind === "check" && <><rect x="4" y="4" width="16" height="16" rx="5" /><path d="m8 12 3 3 5-6" /></>}
  </svg>;
}

export default function Contexto({ onApply }: Props) {
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const manualStage = useRef(false);
  const current = stages[active];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const sync = () => {
      const reduced = media.matches || Boolean(connection?.saveData);
      setStaticMode(reduced);
      if (reduced) { setActive(3); sceneRef.current?.style.setProperty("--story-progress", "1"); }
    };
    sync();
    media.addEventListener("change", sync);
    connection?.addEventListener?.("change", sync);
    return () => { media.removeEventListener("change", sync); connection?.removeEventListener?.("change", sync); };
  }, []);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (staticMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
      const track = trackRef.current;
      const scene = sceneRef.current;
      if (!track || !scene) return;
      if (manualStage.current) return;
      const box = track.getBoundingClientRect();
      const offset = window.innerWidth <= 760 ? 78 : 102;
      const distance = Math.max(1, box.height - scene.offsetHeight);
      const progress = Math.max(0, Math.min(1, (offset - box.top) / distance));
      scene.style.setProperty("--story-progress", progress.toFixed(4));
      setActive(Math.min(3, Math.floor(progress * 4)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    // Focus and hash restoration can scroll Safari after a click. Preserve an
    // explicit stage until the visitor actually starts scrolling again.
    const resume = () => { if (manualStage.current) { manualStage.current = false; schedule(); } };
    const onKeyScroll = (event: globalThis.KeyboardEvent) => {
      if ((event.target as Element | null)?.closest?.('[role="tablist"],input,textarea,select,[role="dialog"]')) return;
      if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) resume();
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener('wheel', resume, { passive: true });
    window.addEventListener('touchmove', resume, { passive: true });
    window.addEventListener('keydown', onKeyScroll);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); window.removeEventListener('wheel', resume); window.removeEventListener('touchmove', resume); window.removeEventListener('keydown', onKeyScroll); cancelAnimationFrame(frame); };
  }, [staticMode]);

  function selectStage(index: number, focus = false) {
    manualStage.current = true;
    setActive(index);
    sceneRef.current?.style.setProperty("--story-progress", String(index / 3));
    if (focus) tabRefs.current[index]?.focus();
  }
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: (index + 1) % 4, ArrowLeft: (index + 3) % 4, Home: 0, End: 3 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    selectStage(keys[event.key], true);
  }

  return (
    <section id="contexto" className="sec sec--contexto" data-theme="light" data-static={staticMode} aria-labelledby="contexto-title" data-scene-root>
      <div className="wrap contexto-heading">
        <div><p className="eyebrow">Da ferramenta ao trabalho de verdade</p><h2 className="section-title" id="contexto-title">Da demanda dispersa<br /><em>a um fluxo de trabalho.</em></h2></div>
        <p>Veja como contexto, apoio da IA e decisão humana podem se conectar na operação.</p>
      </div>

      <div className="contexto-story-track" ref={trackRef}>
        <div className="contexto-sticky wrap" ref={sceneRef} data-stage={active} style={{ "--story-progress": 0 } as CSSProperties}>
          <div className="contexto-demo">
            <div className="contexto-scene-heading"><span><i />Demonstração ilustrativa</span><span className="contexto-scene-counter">0{active + 1}<b> / 04</b></span></div>
            <div className="contexto-scene" aria-hidden="true">
              <div className="contexto-space-grid" />
              <div className="contexto-beam" />
              <div className="contexto-orbit contexto-orbit--one" /><div className="contexto-orbit contexto-orbit--two" />
              <svg className="contexto-circuit" viewBox="0 0 1100 440" preserveAspectRatio="none" fill="none">
                <path className="contexto-circuit-track" d="M92 332H1008" />
                <path className="contexto-circuit-progress" d="M92 332H1008" pathLength="1" />
                <path className="contexto-circuit-feeder" d="M220 98v84q0 30 30 30h150q30 0 30 30v90M740 95v105q0 25-25 25h-25q-25 0-25 25v82" />
              </svg>
              {fragments.map((fragment, index) => <div key={fragment.label} className={`contexto-fragment contexto-fragment--${index}`}><SceneIcon kind={fragment.icon} /><div><strong>{fragment.label}</strong><span>{active === 0 ? fragment.content : "Informação reunida"}</span></div><i /></div>)}
              <div className="contexto-work-card">
                <div className="contexto-work-top"><span className="contexto-work-symbol"><SceneIcon kind={active === 0 ? "document" : active === 1 ? "ai" : active === 2 ? "eye" : "check"} /></span><span>Demanda de exemplo</span><b>↗</b></div>
                <strong className="contexto-work-title">{current.card}</strong>
                <div className="contexto-work-lines">{current.details.map((detail) => <div key={detail}><i>{active === 3 ? "✓" : ""}</i><span>{detail}</span></div>)}</div>
                <div className="contexto-work-status"><i />{current.status}</div>
              </div>
              <div className="contexto-stations">{stages.map((stage, index) => <div className={`contexto-station ${index <= active ? "is-passed" : ""} ${index === active ? "is-current" : ""}`} key={stage.label}><div><SceneIcon kind={["document", "ai", "eye", "check"][index]} /></div><span>{stage.label}</span></div>)}</div>
              <div className="contexto-visual-caption"><span>{active === 0 ? "Informações espalhadas" : active === 1 ? "Contexto + instruções" : active === 2 ? "Conferência + decisão" : "Clareza para executar"}</span><i /><span>As pessoas mantêm o comando.</span></div>
            </div>
            <div className="contexto-stage-controls" role="tablist" aria-label="Etapas da demonstração operacional">{stages.map((stage, index) => <button key={stage.label} ref={(el) => { tabRefs.current[index] = el; }} type="button" role="tab" id={`contexto-stage-${index}`} aria-selected={active === index} aria-controls="contexto-stage-panel" tabIndex={active === index ? 0 : -1} onClick={() => selectStage(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>0{index + 1}</span><strong>{stage.label}</strong><i /></button>)}</div>
            <div className="contexto-stage-copy" id="contexto-stage-panel" role="tabpanel" aria-labelledby={`contexto-stage-${active}`} tabIndex={0}><h3>{current.title}</h3><p>{current.copy}</p></div>
            <div className="contexto-progress-meter" aria-hidden="true"><i /></div>
          </div>
          <div className="contexto-demo-note"><span>{staticMode ? "Explore as etapas pelos controles." : "Role para acompanhar ou escolha uma etapa."}</span><span>O diagnóstico define a aplicação e as integrações.</span></div>
        </div>
      </div>

      <div className="wrap contexto-bridge"><p>A mentoria conecta <strong>processo, implementação e equipe.</strong><br />Para que o uso de IA faça parte da rotina.</p><button type="button" className="button button--primary" data-cta="avaliacao" onClick={onApply}>Avaliar minha empresa <span aria-hidden="true">↗</span></button></div>
    </section>
  );
}
