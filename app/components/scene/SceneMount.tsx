/**
 * Portão de entrada do WebGL.
 *
 * O TanStack Start renderiza no servidor, então a cena precisa de três
 * proteções: só monta no cliente, só carrega o bundle do three depois
 * disso (import dinâmico), e nunca aparece em tela estreita nem sob
 * `prefers-reduced-motion`. Nesses casos entra o pôster, que é CSS puro
 * e desenha o mesmo enquadramento — reservatório, mancha, vinheta.
 */

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { SceneState } from "./state";
import { isCompact, prefersReducedMotion } from "~/lib/motion";

const Reservoir = lazy(() => import("./Reservoir"));

export function ScenePoster({ intensity = 1 }: { intensity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-abyss"
      style={{ opacity: intensity }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 62% at 46% 52%, #0d2c34 0%, #082027 55%, #05161b 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(22% 26% at 62% 48%, rgba(255,107,61,0.55) 0%, rgba(255,107,61,0.18) 42%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(34% 38% at 62% 48%, rgba(63,208,201,0.20) 0%, transparent 70%)",
        }}
      />
      <div className="grid-field absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 78% at 50% 50%, transparent 30%, rgba(5,22,27,0.86) 100%)",
        }}
      />
    </div>
  );
}

export default function SceneMount({
  stateRef,
  fade = 1,
}: {
  stateRef: React.MutableRefObject<SceneState>;
  fade?: number;
}) {
  const [mode, setMode] = useState<"pending" | "webgl" | "poster">("pending");
  const [active, setActive] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Interruptor de diagnóstico: abrir com ?poster=1 força a versão sem
    // WebGL. Serve para comparar a sensação de scroll numa máquina real
    // sem precisar mexer em código.
    if (new URLSearchParams(window.location.search).has("poster")) {
      setMode("poster");
      return;
    }
    if (prefersReducedMotion() || isCompact()) {
      setMode("poster");
      return;
    }
    // Máquina fraca não recebe shader de tela cheia: o site trava mais
    // do que impressiona. Dois núcleos ou menos, ou menos de 4 GB, cai
    // direto no pôster.
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) < 4) {
      setMode("poster");
      return;
    }
    // Se o navegador não abre um contexto WebGL, nem tenta.
    try {
      const probe = document.createElement("canvas");
      const ok = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
      setMode(ok ? "webgl" : "poster");
    } catch {
      setMode("poster");
    }
  }, []);

  /**
   * Liga e desliga o loop conforme a cena entra e sai da viewport.
   *
   * Sem isto o canvas da hero continua desenhando um shader de tela
   * cheia a página inteira abaixo, disputando GPU com o scroll — que é
   * exatamente a sensação de travamento.
   */
  useEffect(() => {
    if (mode !== "webgl") return;
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    const onVisibility = () => setActive(document.visibilityState === "visible" && !document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode]);

  if (mode !== "webgl") return <ScenePoster intensity={fade} />;

  return (
    <div ref={host} className="absolute inset-0">
      <Suspense fallback={<ScenePoster intensity={fade} />}>
        <Reservoir stateRef={stateRef} fade={fade} active={active} />
      </Suspense>
    </div>
  );
}
