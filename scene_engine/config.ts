export const SCENE_ENGINE_DEFAULTS = {
  width: 720,
  height: 1280,
  duration: 30,
  speechWordsPerMinute: 148,
  sceneLeadSeconds: 0.18,
  scenePauseSeconds: 0.42,
  maxScenes: 24,
} as const;

export type AspectRatio = '9:16' | '16:9';

