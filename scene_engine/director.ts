import type { SceneRole, ShowreelData, SceneSpec } from '../src/types/showreel.ts';
import type { SpeechAnalysis, SceneIntent } from './analyzer.ts';
import { CYBER_PREMIUM } from './themes.ts';
import { renderCanvasTemplate, type TemplateKind } from './templates/index.ts';

const intentTemplate: Record<SceneIntent, TemplateKind> = {
  cta: 'cta', question: 'question', metric: 'metric', comparison: 'beforeAfter',
  process: 'timeline', benefits: 'benefits', dashboard: 'dashboard', code: 'terminal',
  architecture: 'architecture', impact: 'kinetic', generic: 'ambient',
};

const variedAlternates: TemplateKind[] = ['nodeflow', 'bars', 'line', 'dashboard', 'benefits', 'terminal', 'architecture'];

function headline(text: string, max = 50): string {
  const words = text.replace(/[.!?]+$/g, '').trim().split(/\s+/);
  const selected: string[] = [];
  for (const word of words) {
    const candidate = [...selected, word].join(' ');
    if (candidate.length > max && selected.length) break;
    selected.push(word.slice(0, max));
    if (candidate.length > max) break;
  }
  return selected.join(' ').toLocaleUpperCase('pt-BR');
}

export interface DirectedScene {
  analysis: SpeechAnalysis;
  template: TemplateKind;
  scene: SceneSpec;
}

export function directScenes(analyses: SpeechAnalysis[], showreel: Pick<ShowreelData, 'W' | 'H' | 'dna'>): DirectedScene[] {
  return analyses.map((analysis, index) => {
    let template = intentTemplate[analysis.intent];
    if (index === 0 && template === 'ambient') template = 'kinetic';
    if (index > 0) {
      const previous = intentTemplate[analyses[index - 1].intent];
      if (template === previous || template === 'ambient') template = variedAlternates[index % variedAlternates.length];
    }
    const last = index === analyses.length - 1;
    const role: SceneRole = last ? 'closing' : index === 0 ? 'hook' : analysis.intent === 'metric' || analysis.intent === 'impact' ? 'climax' : 'body';
    const text = headline(analysis.text);
    const sub = analysis.text.split(/\s+/).slice(text.split(/\s+/).length).join(' ').trim().replace(/^[-–—:,. ]+/, '').slice(0, 115);
    const scene: SceneSpec = {
      role, text, sub: sub === text ? '' : sub, narration: analysis.text,
      idea: `Template ${template} para ${analysis.intent}; palavras-chave: ${analysis.keywords.join(', ') || 'frase principal'}`,
      layout_mode: template, camera_motion: 'push_in_suave',
      visual_bridge: `Transição de ${template} para a próxima fala`,
      dur: 2, seed: 701 + index * 97 + analysis.wordCount * 13,
      fb: template === 'cta' ? 'closing' : template === 'nodeflow' || template === 'architecture' ? 'cube' : template === 'bars' || template === 'dashboard' ? 'grid' : template === 'metric' ? 'burst' : 'kinetic',
      code: renderCanvasTemplate(template, { text, sub: sub === text ? '' : sub, analysis, theme: showreel.dna.pal || CYBER_PREMIUM, seed: 701 + index * 97, index }),
      origem: 'custom', status: 'ready', fileName: `cena_${String(index + 1).padStart(2, '0')}_${template}.js`,
      transition_out: index % 2 ? 'wipe_h' : 'zoom', weight: Math.max(0.7, analysis.wordCount / 12),
    };
    return { analysis, template, scene };
  });
}

