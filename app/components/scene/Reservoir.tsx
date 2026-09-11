/**
 * A cena do AlgEye.
 *
 * É um único quad em tela cheia com um fragment shader que carrega a
 * narrativa inteira do produto em cinco uniforms:
 *
 *   uPixel   grosseria do pixel — visão ampla → 3 m de operação
 *   uBloom   quanto do índice já subiu acima do limiar
 *   uCloud   posição da banda de nuvem atravessando a cena
 *   uGap     reconstrução do Gap Filling dentro da nuvem
 *   uPredict anel do alerta preditivo (janela de 14 dias)
 *
 * A hero anima esses valores devagar, em loop. O bloco 03 amarra os
 * mesmos valores ao scroll, e é por isso que a explicação técnica e o
 * plano de fundo da hero são literalmente a mesma coisa: o visitante
 * reconhece a cena quando ela é explicada.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "~/lib/motion";
import type { SceneState } from "./state";

export type { SceneState };


const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform float uPixel;
  uniform float uBloom;
  uniform float uCloud;
  uniform float uGap;
  uniform float uPredict;
  uniform float uFade;

  const vec3 ABYSS = vec3(0.020, 0.086, 0.106);
  const vec3 WATER = vec3(0.040, 0.150, 0.180);
  const vec3 CYAN  = vec3(0.247, 0.816, 0.788);
  const vec3 FLARE = vec3(1.000, 0.420, 0.240);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.15;

    // ── contorno do reservatório ─────────────────────────────
    float warp = fbm(p * 1.25 + 3.1);
    float d = length(p * vec2(0.74, 1.18) + vec2(0.02, 0.04)) + (warp - 0.5) * 0.78;
    float lake = smoothstep(0.88, 0.80, d);
    float shore = smoothstep(0.014, 0.0, abs(d - 0.84));

    // ── quantização pelo pixel do sensor ─────────────────────
    float px = max(uPixel, 0.0025);
    vec2 q = floor(p / px) * px + px * 0.5;

    // ── mancha acima do limiar ───────────────────────────────
    vec2 drift = vec2(uTime * 0.014, -uTime * 0.009);
    float field = fbm(q * 2.3 + drift + 11.0);
    float focus = smoothstep(1.05, 0.10, length(q - vec2(0.30, 0.04)));
    float bloom = smoothstep(0.50, 0.78, field + uBloom * 0.40 - 0.16) * focus * lake * uBloom;

    // ── banda de nuvem ───────────────────────────────────────
    float cx = mix(-2.1, 2.1, uCloud);
    float band = smoothstep(0.70, 0.02, abs(p.x - cx) - 0.16);
    float puff = smoothstep(0.30, 0.72, fbm(p * 1.7 + vec2(uTime * 0.03, 0.0)));
    float cloud = band * puff * step(0.001, uCloud) * step(uCloud, 0.999);

    // ── reconstrução do Gap Filling ──────────────────────────
    float hatch = step(0.5, fract((p.x + p.y) * 24.0 + uTime * 0.30));
    float rebuilt = cloud * uGap * hatch;

    // ── composição ───────────────────────────────────────────
    vec3 col = ABYSS;
    col = mix(col, WATER, lake);

    // malha do sensor: só aparece enquanto o pixel é grosso
    float gridAmt = smoothstep(0.02, 0.11, px);
    vec2 g = fract(p / px);
    float gline = (1.0 - smoothstep(0.0, 0.045, min(g.x, g.y)));
    col += CYAN * gline * gridAmt * lake * 0.10;

    // a leitura: cyan enquanto é sinal, flare quando vira floração
    vec3 signalCol = mix(CYAN, FLARE, smoothstep(0.25, 0.85, uBloom));
    col = mix(col, signalCol, clamp(bloom * 0.85, 0.0, 1.0));

    // nuvem por cima de tudo, e a reconstrução por cima da nuvem
    col = mix(col, vec3(0.62, 0.70, 0.72), cloud * 0.55);
    col += CYAN * rebuilt * 0.30;

    // margem
    col += CYAN * shore * 0.35;

    // anel do alerta preditivo
    float r = length(p - vec2(0.30, 0.04));
    float ring = smoothstep(0.010, 0.0, abs(r - (0.40 + sin(uTime * 0.8) * 0.012)));
    col += FLARE * ring * uPredict * 0.9;

    // vinheta
    float vig = smoothstep(1.85, 0.35, length(p * vec2(0.72, 1.0)));
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col * uFade, 1.0);
  }
`;

function Quad({ stateRef, fade }: { stateRef: React.MutableRefObject<SceneState>; fade: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const live = useRef<SceneState>({ ...stateRef.current });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPixel: { value: stateRef.current.pixel },
      uBloom: { value: stateRef.current.bloom },
      uCloud: { value: stateRef.current.cloud },
      uGap: { value: stateRef.current.gap },
      uPredict: { value: stateRef.current.predict },
      uFade: { value: fade },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const target = stateRef.current;
    const l = live.current;

    l.pixel = damp(l.pixel, target.pixel, 5, dt);
    l.bloom = damp(l.bloom, target.bloom, 5, dt);
    l.cloud = damp(l.cloud, target.cloud, 6, dt);
    l.gap = damp(l.gap, target.gap, 6, dt);
    l.predict = damp(l.predict, target.predict, 5, dt);

    m.uniforms.uTime.value += dt;
    m.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    m.uniforms.uPixel.value = l.pixel;
    m.uniforms.uBloom.value = l.bloom;
    m.uniforms.uCloud.value = l.cloud;
    m.uniforms.uGap.value = l.gap;
    m.uniforms.uPredict.value = l.predict;
    m.uniforms.uFade.value = fade;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

export default function Reservoir({
  stateRef,
  fade = 1,
  active = true,
}: {
  stateRef: React.MutableRefObject<SceneState>;
  fade?: number;
  /** Fora da viewport o loop para por completo — o contexto WebGL fica
      vivo (sem flash ao voltar) mas não consome nem GPU nem bateria. */
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.25]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#05161b"]} />
      <Quad stateRef={stateRef} fade={fade} />
    </Canvas>
  );
}
