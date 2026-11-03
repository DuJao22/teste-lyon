import { SCENE_ENGINE_DEFAULTS } from './config.ts';

export interface ParsedSpeech {
  text: string;
  sourceIndex: number;
  label?: string;
}

const sceneMarker = /(?:^|\n)\s*(?:cena\s*(?:\d+|final|encerramento|cta)\s*[:.-]|\d+[.)]\s+)/gim;

function cleanBlock(block: string): string {
  return block
    .replace(/^\s*(?:roteiro|narra[cç][aã]o)\s*:\s*/i, '')
    .replace(/\s*(?:\|\s*)?visual\s*:\s*[\s\S]*$/i, '')
    .replace(/^\s*[-*•]+\s*/, '')
    .replace(/[\t ]+/g, ' ')
    .trim()
    .replace(/^['“”"]|['“”"]$/g, '')
    .trim();
}

/** Divide roteiro estruturado por cenas e texto livre por blocos de fala. */
export function parseScript(script: string): ParsedSpeech[] {
  const input = String(script || '').replace(/\r/g, '').trim();
  if (!input) return [];

  const markers = [...input.matchAll(sceneMarker)];
  let blocks: string[];
  if (markers.length) {
    blocks = markers.map((marker, index) => {
      const start = (marker.index ?? 0) + marker[0].length;
      const end = markers[index + 1]?.index ?? input.length;
      return input.slice(start, end);
    });
  } else {
    blocks = input.split(/\n\s*\n+/).filter(Boolean);
    if (blocks.length === 1) {
      // Quebra textos longos em falas legíveis, agrupando até 22 palavras.
      const sentences = blocks[0].match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [blocks[0]];
      blocks = [];
      let current = '';
      for (const sentence of sentences) {
        const next = `${current} ${sentence}`.trim();
        if (current && next.split(/\s+/).length > 22) {
          blocks.push(current);
          current = sentence.trim();
        } else current = next;
      }
      if (current) blocks.push(current);
    }
  }

  const speeches = blocks
    .map((block, sourceIndex) => ({ text: cleanBlock(block), sourceIndex }))
    .filter((speech) => speech.text.length > 0)
    .slice(0, SCENE_ENGINE_DEFAULTS.maxScenes);

  return speeches;
}

