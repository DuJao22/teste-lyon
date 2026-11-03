import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTimeline, recalculateTimeline } from '../scene_engine/timeline.ts';
import { analyzeSpeech } from '../scene_engine/analyzer.ts';
import { CYBER_PREMIUM } from '../scene_engine/themes.ts';
import { renderCanvasTemplate, TEMPLATE_CATALOG } from '../scene_engine/templates/index.ts';
import { compileSceneCode } from '../src/engine/motionEngine.ts';
import { renderLocalShowreelHtml } from '../scene_engine/renderer.ts';

test('timeline creates a visual for every speech and guarantees a closing CTA', () => {
  const result = createTimeline({ script: 'Cena 1: Python acelera seu projeto.\nCena 2: Publique na internet.', duration: 20 });
  assert.equal(result.scenes.length, 3);
  assert.ok(result.scenes.every((scene) => Boolean(scene.code) && Boolean(scene.narration)));
  result.scenes.forEach((scene) => assert.doesNotThrow(() => compileSceneCode(scene.code)));
  assert.equal(result.scenes.at(-1)?.role, 'closing');
  assert.equal(result.scenes.at(-1)?.template, 'cta');
  assert.ok(result.scenes[1].start >= result.scenes[0].start + result.scenes[0].dur);
});

test('timeline stretches scenes to cover measured TTS audio plus breathing room', () => {
  const scenes = createTimeline({ script: 'Cena 1: Uma fala curta.\nCena 2: Outra fala.', duration: 12 }).scenes;
  const adjusted = recalculateTimeline(scenes, [4.25, null]);
  assert.ok(adjusted[0].dur >= 4.67);
  assert.equal(adjusted[1].start, adjusted[0].dur);
});

test('sample script generates complete visual and speech scenes', () => {
  const script = readFileSync('examples/roteiro_exemplo.txt', 'utf8');
  const result = createTimeline({ script, duration: 30 });
  assert.ok(result.scenes.length >= 5);
  assert.equal(result.scenes.at(-1)?.template, 'cta');
  assert.ok(result.scenes.every((scene) => scene.narration?.trim() && scene.code?.trim()));
  const html = renderLocalShowreelHtml({ script, duration: 30 });
  assert.match(html, /function startVoice\(i\)/);
  assert.match(html, /speechSynthesis/);
  const inlineScript = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1] || '';
  assert.doesNotThrow(() => new Function(inlineScript));
});

test('all catalogued templates generate valid Canvas functions', () => {
  assert.ok(TEMPLATE_CATALOG.length >= 14);
  const analysis = analyzeSpeech('Uma frase de demonstração.');
  for (const { kind } of TEMPLATE_CATALOG) {
    const code = renderCanvasTemplate(kind, { text: 'FRASE DE TESTE', sub: 'Resumo visual', analysis, theme: CYBER_PREMIUM, seed: 42, index: 0 });
    assert.doesNotThrow(() => compileSceneCode(code), `template ${kind}`);
  }
});

