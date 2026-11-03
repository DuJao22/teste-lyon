import { createTimeline, type TimelineOptions, type SceneEngineTimeline } from './timeline.ts';
import { buildStandaloneHtml } from '../src/engine/motionEngine.ts';

/** Fachada de geração local. Não recebe chave e não executa chamadas externas. */
export function generateLocalShowreel(options: TimelineOptions): SceneEngineTimeline {
  return createTimeline(options);
}

/** Renderiza um HTML autônomo com animação Canvas e narração embutida quando disponível. */
export function renderLocalShowreelHtml(options: TimelineOptions): string {
  return buildStandaloneHtml(createTimeline(options));
}

