/**
 * Estados da cena — deliberadamente SEM importar three.
 *
 * Hero e Sensoriamento precisam destes valores para dirigir o scroll,
 * mas não podem tocar no motor 3D: qualquer import de valor vindo de
 * `Reservoir.tsx` puxaria three + R3F para o bundle inicial e mataria
 * o carregamento sob demanda. Este arquivo é a fronteira.
 */

export type SceneState = {
  /** Grosseria do pixel: alto = visão ampla, baixo = os 3 m de operação. */
  pixel: number;
  /** Quanto do índice já subiu acima do limiar operacional. */
  bloom: number;
  /** Posição da banda de nuvem cruzando a cena. */
  cloud: number;
  /** Reconstrução do Gap Filling dentro da nuvem. */
  gap: number;
  /** Anel do alerta preditivo da janela de 14 dias. */
  predict: number;
};

/** Estado de repouso da hero. */
export const AMBIENT: SceneState = { pixel: 0.13, bloom: 0.55, cloud: 0.0, gap: 0.0, predict: 0.35 };

/** As quatro paradas do bloco 03, na ordem em que o scroll as percorre. */
export const BEATS: SceneState[] = [
  { pixel: 0.26, bloom: 0.5, cloud: 0.0, gap: 0.0, predict: 0.0 }, // visão ampla
  { pixel: 0.03, bloom: 0.72, cloud: 0.0, gap: 0.0, predict: 0.0 }, // 3 m por pixel
  { pixel: 0.05, bloom: 0.72, cloud: 0.62, gap: 1.0, predict: 0.0 }, // Gap Filling
  { pixel: 0.05, bloom: 0.92, cloud: 1.0, gap: 1.0, predict: 1.0 }, // Preditivo
];
