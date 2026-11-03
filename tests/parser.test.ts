import test from 'node:test';
import assert from 'node:assert/strict';
import { parseScript } from '../scene_engine/parser.ts';

test('parser separates labeled scenes and strips visual directions', () => {
  const result = parseScript('Cena 1: Você tem uma ideia? Visual: code glow\nCena 2: Publique seu app.');
  assert.equal(result.length, 2);
  assert.equal(result[0].text, 'Você tem uma ideia?');
  assert.equal(result[1].text, 'Publique seu app.');
});

test('parser returns no speech for empty scripts', () => {
  assert.deepEqual(parseScript('  \n '), []);
});

