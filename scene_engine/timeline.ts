import type { ShowreelData, SceneSpec } from '../src/types/showreel.ts';
import type { SpeechAnalysis } from './analyzer.ts';
import { SCENE_ENGINE_DEFAULTS, type AspectRatio } from './config.ts';
import { parseScript } from './parser.ts';
import { analyzeSpeeches } from './analyzer.ts';
import { directScenes } from './director.ts';
import { CYBER_PREMIUM } from './themes.ts';

export interface TimelineOptions {
  script: string;
  duration?: number;
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  title?: string;
}

export interface TimelineScene extends SceneSpec {
  estimatedSpeechSeconds: number;
  estimatedAudioSeconds: number;
  template: string;
  analysis: SpeechAnalysis;
}

export interface SceneEngineTimeline extends Omit<ShowreelData, 'scenes'> {
  mode: 'local';
  scenes: TimelineScene[];
  fallbackSpeech: boolean;
}

/** Planeja cena e pausa por fala; duração respeita o áudio já conhecido. */
export function recalculateTimeline(scenes: SceneSpec[], actualAudioDurations: Array<number | null>, pause = SCENE_ENGINE_DEFAULTS.scenePauseSeconds): SceneSpec[] {
  let cursor = 0;
  return scenes.map((scene, index) => {
    const actual = actualAudioDurations[index];
    const duration = Math.max(scene.dur, actual && Number.isFinite(actual) ? actual + pause : 0);
    const next = { ...scene, dur: Math.round(duration * 100) / 100, start: Math.round(cursor * 100) / 100 };
    cursor += duration;
    return next;
  });
}

export function createTimeline(options: TimelineOptions): SceneEngineTimeline {
  const speeches = parseScript(options.script);
  if (!speeches.length) throw new Error('Digite ou cole um roteiro para criar as cenas locais.');
  const analyses = analyzeSpeeches(speeches);
  if (!analyses[analyses.length - 1].isCallToAction) {
    const closing = 'Comece agora e transforme sua ideia em realidade.';
    analyses.push({ text: closing, intent: 'cta', keywords: ['comece', 'agora'], numbers: [], emotion: 'urgency', wordCount: closing.split(/\s+/).length, isQuestion: false, isCallToAction: true });
  }
  const targetDuration = Math.max(10, Number(options.duration) || SCENE_ENGINE_DEFAULTS.duration);
  const aspect = options.aspectRatio || '9:16';
  const width = Math.max(320, Number(options.width) || (aspect === '16:9' ? 1280 : SCENE_ENGINE_DEFAULTS.width));
  const height = Math.max(320, Number(options.height) || (aspect === '16:9' ? 720 : SCENE_ENGINE_DEFAULTS.height));
  const base = {
    W: width, H: height,
    dna: {
      structure: 'crescendo' as const, transition: 'zoom' as const,
      estilo: 'Cyber Tech Premium — direção local',
      estilo_desc: 'Tipografia cinética, dashboards, diagramas e luz azul elétrica/violeta.',
      client_intent: 'Gerado pelo Scene Engine local, sem API de IA.',
      narrative_thread: 'Uma cena visual sincronizada para cada fala do roteiro.',
      visual_motifs: ['grade animada', 'cards de interface', 'linhas elétricas', 'tipografia expressiva'],
      voice_name: 'Kore' as const, pal: CYBER_PREMIUM, bpm: 118, energy: 4, hue: 0.56,
    },
  };
  const directed = directScenes(analyses, base);
  const totalWords = directed.reduce((sum, item) => sum + item.analysis.wordCount, 0);
  const targetWpm = totalWords * 60 / targetDuration;
  // Ajusta a cadência apenas dentro de uma faixa humana; nunca cria longos trechos mudos.
  const effectiveWpm = Math.min(165, Math.max(125, targetWpm || SCENE_ENGINE_DEFAULTS.speechWordsPerMinute));
  const speechDurations = directed.map(({ analysis }) => analysis.wordCount / (effectiveWpm / 60));
  const minimums = speechDurations.map((seconds) => Math.max(1.7, seconds + SCENE_ENGINE_DEFAULTS.sceneLeadSeconds + SCENE_ENGINE_DEFAULTS.scenePauseSeconds));
  let cursor = 0;
  const scenes = directed.map(({ analysis, template, scene }, index) => {
    const duration = Math.round(minimums[index] * 100) / 100;
    const result: TimelineScene = {
      ...scene, dur: duration, start: Math.round(cursor * 100) / 100,
      estimatedSpeechSeconds: Math.round(speechDurations[index] * 100) / 100,
      estimatedAudioSeconds: Math.round(speechDurations[index] * 1.08 * 100) / 100,
      template, analysis,
    };
    cursor += duration;
    return result;
  });
  return {
    mode: 'local',
    title: (options.title || 'Showreel — Scene Engine').slice(0, 80),
    prompt: options.script, W: width, H: height, duration: Math.round(cursor * 100) / 100,
    dna: base.dna, scenes, fallbackSpeech: true,
  };
}

