import type { ParsedSpeech } from './parser.ts';

export type SceneIntent =
  | 'cta' | 'question' | 'metric' | 'comparison' | 'process' | 'benefits'
  | 'dashboard' | 'code' | 'architecture' | 'impact' | 'generic';

export interface SpeechAnalysis {
  text: string;
  intent: SceneIntent;
  keywords: string[];
  numbers: string[];
  emotion: 'curiosity' | 'urgency' | 'confidence' | 'growth' | 'neutral';
  wordCount: number;
  isQuestion: boolean;
  isCallToAction: boolean;
}

const rules: Array<{ intent: SceneIntent; re: RegExp; keywords: RegExp }> = [
  { intent: 'cta', re: /\b(chame|compre|assine|acesse|comece|experimente|baixe|inscreva|fale conosco|saiba mais|clique|transforme sua ideia)\b/i, keywords: /\b(agora|comece|acesse|assine|compre|inscreva)\b/gi },
  { intent: 'question', re: /\?|\b(j[aá] pensou|cansad[oa]|dif[ií]cil|problema|perde|dor|preocupad[oa])\b/i, keywords: /\b(ideia|problema|dif[ií]cil|tempo|custo)\b/gi },
  { intent: 'metric', re: /(?:\d+(?:[.,]\d+)?\s*%|R\$\s?[\d.,]+|\b\d+(?:[.,]\d+)?\s*(?:milh[oõ]es?|mil|x|usu[aá]rios?|dias?|horas?)\b)/i, keywords: /\b(crescimento|receita|m[eé]trica|resultado|aumento)\b/gi },
  { intent: 'comparison', re: /\b(antes e depois|de .* para|transforma[cç][aã]o|agora|antes|depois)\b/i, keywords: /\b(antes|depois|mudan[cç]a|transforma[cç][aã]o)\b/gi },
  { intent: 'process', re: /\b(primeiro|passo|etapa|jornada|fluxo|processo|depois|por fim|deploy)\b/i, keywords: /\b(passos?|etapas?|fluxo|deploy|publicar)\b/gi },
  { intent: 'benefits', re: /\b(benef[ií]cios?|recursos?|inclui|al[eé]m disso|tamb[eé]m|autentica[cç][aã]o|banco de dados)\b/i, keywords: /\b(benef[ií]cios?|recursos?|automa[cç][aã]o|seguran[cç]a|escala)\b/gi },
  { intent: 'dashboard', re: /\b(dashboard|painel|plataforma|produto|clientes|vendas|gest[aã]o)\b/i, keywords: /\b(dashboard|painel|plataforma|clientes|vendas)\b/gi },
  { intent: 'code', re: /\b(c[oó]digo|python|javascript|programa[cç][aã]o|intelig[eê]ncia artificial|\bia\b|api|software|desenvolv)\b/i, keywords: /\b(c[oó]digo|python|javascript|ia|api|software|programa[cç][aã]o)\b/gi },
  { intent: 'architecture', re: /\b(arquitetura|integra[cç][aã]o|sistema|servidor|banco de dados|conect)\b/i, keywords: /\b(arquitetura|integra[cç][aã]o|sistema|servidor|sqlite|banco de dados)\b/gi },
  { intent: 'impact', re: /\b(revoluciona|incr[ií]vel|poderoso|novo|futuro|elite|descubra|conhe[cç]a)\b/i, keywords: /\b(futuro|novo|elite|incr[ií]vel|poderoso)\b/gi },
];

export function analyzeSpeech(speech: ParsedSpeech | string): SpeechAnalysis {
  const text = typeof speech === 'string' ? speech : speech.text;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const match = rules.find((rule) => rule.re.test(text));
  const intent = match?.intent || 'generic';
  const numbers = text.match(/(?:R\$\s?[\d.,]+|\d+(?:[.,]\d+)?\s*%?|\b\d+(?:[.,]\d+)?\s*(?:milh[oõ]es?|mil|x|usu[aá]rios?|dias?|horas?)\b)/gi) || [];
  const keywords = [...new Set([...(text.match(match?.keywords || /\b(?!)\b/g) || []), ...numbers])];
  let emotion: SpeechAnalysis['emotion'] = 'neutral';
  if (intent === 'question') emotion = 'curiosity';
  else if (intent === 'cta') emotion = 'urgency';
  else if (intent === 'metric') emotion = 'growth';
  else if (['impact', 'code', 'architecture'].includes(intent)) emotion = 'confidence';

  return { text, intent, keywords, numbers, emotion, wordCount, isQuestion: /\?/.test(text), isCallToAction: intent === 'cta' };
}

export function analyzeSpeeches(speeches: ParsedSpeech[]): SpeechAnalysis[] {
  return speeches.map(analyzeSpeech);
}

