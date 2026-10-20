import { useEffect, useRef, useState } from "react";
import type { SceneController } from "./scene";
import "./hero.css";

type Props = { onApply: () => void };
const Arrow = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function StaticFlow() {
  return <div className="hero-fallback" aria-hidden="true"><svg viewBox="0 0 800 700" fill="none">
    <defs><linearGradient id="hero-glass" x1="120" y1="150" x2="650" y2="590" gradientUnits="userSpaceOnUse"><stop stopColor="#DA3C6D" stopOpacity=".2"/><stop offset=".5" stopColor="#F7F7F8" stopOpacity=".07"/><stop offset="1" stopColor="#DA3C6D" stopOpacity=".02"/></linearGradient><linearGradient id="hero-edge" x1="140" y1="100" x2="680" y2="620" gradientUnits="userSpaceOnUse"><stop stopColor="#F26B92"/><stop offset=".55" stopColor="#f7f7f8" stopOpacity=".6"/><stop offset="1" stopColor="#DA3C6D" stopOpacity=".15"/></linearGradient></defs>
    <g transform="translate(140 110) rotate(-9 250 250)" fill="url(#hero-glass)" stroke="url(#hero-edge)">
      <path d="M35 111 207 30q13-6 13 10v398q0 14-13 20L35 539q-13 6-13-10V132q0-15 13-21Z"/>
      <path d="m133 83 172-81q13-6 13 10v398q0 14-13 20l-172 81q-13 6-13-10V104q0-15 13-21Z"/>
      <path d="m231 55 172-81q13-6 13 10v398q0 14-13 20l-172 81q-13 6-13-10V76q0-15 13-21Z"/>
      <path d="m329 27 172-81q13-6 13 10v398q0 14-13 20l-172 81q-13 6-13-10V48q0-15 13-21Z"/>
    </g>
    <g stroke="#F26B92" strokeWidth="1.2"><path d="M20 560C130 585 180 400 310 385s150 60 260-100S690 140 790 150"/><path d="M0 580C150 630 180 420 320 405s130 50 260-100S700 180 800 170" opacity=".24"/></g>
    <g fill="#F26B92"><circle cx="300" cy="386" r="4"/><circle cx="550" cy="310" r="4"/><circle cx="695" cy="155" r="4"/></g>
  </svg></div>;
}

export default function Hero({ onApply }: Props) {
  const [enabled, setEnabled] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneHost = useRef<HTMLDivElement>(null);
  const controller = useRef<SceneController | null>(null);
  const modeRef = useRef(true);
  const pauseRef = useRef(false);
  const scrollRef = useRef(0);
  useEffect(() => {
    const section = sectionRef.current;
    const host = sceneHost.current;
    if (!section || !host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dataSaver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let frame = 0;
    let disposed = false;
    let entrancePlayed = false;
    const entrances: Animation[] = [];
    const update = () => {
      frame = 0;
      section.dataset.staticMotion = String(reduced.matches || Boolean(dataSaver));
      if (disposed || reduced.matches || dataSaver) {
        section.style.setProperty("--hero-scroll", "0");
        return;
      }
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const mobile = innerWidth <= 800;
      const art = host.getBoundingClientRect();
      const progress = mobile
        ? (innerHeight * .76 - art.top) / Math.max(1, Math.min(innerHeight * .65, art.height * .9))
        : (88 - bounds.top) / Math.max(1, Math.min(bounds.height * .75, innerHeight * .8));
      scrollRef.current = Math.max(0, Math.min(1, progress));
      controller.current?.setScrollProgress(scrollRef.current);
      if (!pauseRef.current) {
        section.style.setProperty("--hero-scroll", String(scrollRef.current));
        host.dataset.scrollProgress = scrollRef.current.toFixed(3);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const entranceObserver = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || entrancePlayed || reduced.matches || dataSaver) return;
      entrancePlayed = true;
      await document.fonts.ready;
      if (disposed || reduced.matches || dataSaver) return;
      section.querySelectorAll<HTMLElement>(".hero-title-words").forEach((line, index) => {
        entrances.push(line.animate(
          [{ transform: "translate3d(0,115%,0) rotate(2deg)" }, { transform: "translate3d(0,0,0) rotate(0)" }],
          { duration: 1000, delay: index * 140, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
        ));
      });
    }, { threshold: .1 });
    entranceObserver.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const motionChange = () => {
      if (reduced.matches) entrances.forEach(animation => animation.cancel());
      schedule();
    };
    reduced.addEventListener("change", motionChange);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      entrances.forEach(animation => animation.cancel());
      entranceObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", motionChange);
    };
  }, []);
  useEffect(() => {
    const host = sceneHost.current;
    if (!host) return;
    let disposed = false;
    let started = false;
    let inViewport = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dataSaver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const observer = new IntersectionObserver(async ([entry]) => {
      inViewport = entry.isIntersecting;
      controller.current?.setVisible(entry.isIntersecting);
      if (!entry.isIntersecting || started || reduced.matches || dataSaver) return;
      started = true;
      try {
        const { createScene } = await import("./scene");
        if (disposed || reduced.matches || dataSaver) return;
        const scene = await createScene(host);
        if (disposed || reduced.matches || dataSaver) { scene.dispose(); return; }
        controller.current = scene;
        scene.setVisible(inViewport);
        scene.setMode(modeRef.current);
        scene.setPaused(pauseRef.current);
        scene.setScrollProgress(scrollRef.current);
        setSceneReady(true);
      } catch { /* The complete static illustration stays visible. */ }
    }, { threshold: 0 });
    observer.observe(host);
    const onMotionChange = () => {
      if (reduced.matches) {
        controller.current?.dispose(); controller.current = null; setSceneReady(false);
      }
    };
    reduced.addEventListener("change", onMotionChange);
    return () => { disposed = true; observer.disconnect(); reduced.removeEventListener("change", onMotionChange); controller.current?.dispose(); controller.current = null; };
  }, []);
  const changeMode = (value: boolean) => { modeRef.current = value; setEnabled(value); controller.current?.setMode(value); };
  const toggleAnimation = () => {
    const next = !paused;
    pauseRef.current = next;
    setPaused(next);
    controller.current?.setPaused(next);
    if (!next) {
      controller.current?.setScrollProgress(scrollRef.current);
      sectionRef.current?.style.setProperty("--hero-scroll", String(scrollRef.current));
    }
  };
  return <section ref={sectionRef} id="inicio" className={`sec sec--hero ${enabled ? "is-connected" : "is-manual"}`} aria-labelledby="hero-title" data-theme="dark">
    <div className={`hero-scene ${sceneReady ? "is-ready" : ""}`} ref={sceneHost} aria-hidden="true"><span className="hero-mobile-art-label">Fluxo operacional / ilustração</span><StaticFlow /></div>
    <div className="hero-atmosphere" aria-hidden="true"/>
    <div className="wrap hero-content">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span/> Mentoria individual de IA para empresas</p>
        <h1 id="hero-title" aria-label="IA na operação. Mais espaço para você liderar."><span className="hero-title-line"><span className="hero-title-words">IA na operação.</span></span><span className="hero-title-line"><span className="hero-title-words">Mais espaço para</span></span><span className="hero-title-line"><em className="hero-title-words">você liderar.</em></span></h1>
        <p className="hero-description">Uma mentoria individual de seis meses que combina implementação em um processo prioritário, treinamento da equipe e acompanhamento da evolução na sua operação.</p>
        <div className="hero-actions"><button type="button" className="button button--primary hero-cta" data-cta="avaliacao" onClick={onApply}>Avaliar minha empresa <Arrow/></button><a className="hero-method-link" href="#metodo">Conhecer o método <span aria-hidden="true">↓</span></a></div>
        <p className="hero-action-note">Avaliação gratuita. Sem contratação automática.</p>
        <div className="hero-positioning"><span aria-hidden="true">01 — 06</span><p>Implementação, treinamento e acompanhamento.<br/><strong>Para a IA fazer parte da rotina da sua empresa.</strong></p></div>
      </div>
      <div className="hero-art-caption"><span className="hero-small-dot"/> FLUXO OPERACIONAL <span className="hero-art-divider">/</span> ILUSTRAÇÃO<span className="hero-scroll-cue">Role para explorar <span aria-hidden="true">↓</span></span></div>
    </div>
    <div className="wrap hero-deck">
      <div className="hero-process" aria-label="Etapas ilustradas do processo"><span>Demanda</span><i aria-hidden="true">↗</i><span>IA aplicada</span><i aria-hidden="true">↗</i><span>Conferência</span><i aria-hidden="true">↗</i><span>Entrega</span></div>
      <div className="hero-control-row">
        <div className="hero-scene-description" aria-live="polite" aria-atomic="true"><span className="hero-status-dot" aria-hidden="true"/><p>{enabled ? <>A IA apoia a execução.<br/><strong>As pessoas mantêm o comando.</strong></> : <>Pedidos dispersos. Decisões concentradas.<br/><strong>O dono vira o ponto de espera.</strong></>}</p></div>
        <div className="hero-controls">
          <div className="hero-toggle" role="group" aria-label="Explore duas formas de organizar o trabalho"><button type="button" aria-pressed={!enabled} onClick={()=>changeMode(false)}>Rotina atual</button><button type="button" aria-pressed={enabled} onClick={()=>changeMode(true)}>Com processo + IA <span aria-hidden="true">↗</span></button></div>
          {sceneReady && <button className="hero-pause" type="button" onClick={toggleAnimation} aria-label={paused ? "Retomar animação 3D" : "Pausar animação 3D"} title={paused ? "Retomar animação" : "Pausar animação"}>{paused ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5Z" fill="currentColor"/></svg> : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2"/></svg>}</button>}
        </div>
      </div>
    </div>
    <div className="hero-scroll-progress" aria-hidden="true"/>
  </section>;
}
