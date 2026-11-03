import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSpeech } from '../scene_engine/analyzer.ts';

test('analyzer detects CTAs, questions, and numeric metrics', () => {
  assert.equal(analyzeSpeech('Comece agora e publique seu SaaS').intent, 'cta');
  assert.equal(analyzeSpeech('Quer aumentar suas vendas?').intent, 'question');
  const metric = analyzeSpeech('Aumente sua receita em 35%');
  assert.equal(metric.intent, 'metric');
  assert.deepEqual(metric.numbers, ['35%']);
});

