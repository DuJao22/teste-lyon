# Análise inicial do Motion Reel Studio

## Estrutura e tecnologias encontradas

- Interface: React 19 + TypeScript + Vite; entrada em `src/main.tsx`, aplicação em `src/App.tsx` e estilos globais em `src/index.css`.
- Servidor: Node.js + Express em `server.ts`; em desenvolvimento, Vite é montado como middleware. Em produção, o Express serve `dist/`.
- Modelo de dados: `src/types/showreel.ts` define `ShowreelData`, `SceneSpec`, DNA, transições e o showreel inicial.
- Renderização: `src/engine/motionEngine.ts` compila funções de desenho para Canvas, inclui templates/fallbacks existentes, inspeção de quadros e `buildStandaloneHtml`. `src/components/ShowreelCanvasStage.tsx` é a versão extraída do player; a tela atual também gerencia o Canvas diretamente em `src/App.tsx`.
- Áudio: `src/engine/audioSynth.ts` toca PCM/WAV do Gemini via Web Audio e usa Web Speech API como fallback; também gera batidas e transições sonoras.
- Interface auxiliar: `src/components/SceneInspectorPanel.tsx` edita cenas; `src/components/RenderDeployView.tsx` documenta render e deploy.

## Fluxo atual de geração e exportação

1. O roteiro/prompt é editado em `src/App.tsx` e guardado no estado `promptText`.
2. `runAgentWithKeys()` cria o pool de chaves, solicita um plano via `gerarPlanoLocal()` (`/api/agent/plan`) e gera cada código de cena via `pedirCenaLocal()` (`/api/agent/scene`). Revisão usa `/api/agent/review-scene`.
3. `server.ts` implementa essas rotas e chama Gemini por REST. A rota `/api/agent/tts` faz síntese neural. O fluxo atual de áudio no cliente chama `sintetizarVozCenaLocal()` diretamente para Gemini e alterna as chaves via `createKeyPool()`/`pool.getKey(sceneIdx)`.
4. `ShowreelAudioSynth` mede a duração do áudio decodificado; a cena recebe no mínimo duração do áudio mais 0,8 s. Sem áudio neural, usa Web Speech API e uma estimativa por palavras.
5. O player do `App.tsx` desenha `data.scenes` no Canvas e sincroniza narração, transições e batidas. `buildStandaloneHtml(data)` embute os dados/código para exportar um HTML único. A gravação usa `MediaRecorder`; não há integração com ffmpeg.

## Configuração e dependências

- Dependências principais: React, Vite, Express, TypeScript, `tsx`, `@google/genai` (há chamadas REST próprias), Motion e Tailwind 4.
- As chaves Gemini são inseridas na interface, limpas e mantidas no `localStorage` por `src/keys.ts`; não devem ser transferidas para logs. `.env.example` só contém `PORT` e informa que as chaves não são necessárias no deploy.
- O rodízio é mantido pelo pool de chaves do cliente (`src/keys.ts`); o servidor também aceita cabeçalhos/campos de chaves para rotas antigas.
- Não há `requirements.txt`, README, dependência de ffmpeg nem suíte de testes configurada. O script `lint` roda `tsc --noEmit`; `build` executa `vite build`.

## Encaixe proposto

Criar `scene_engine/` em TypeScript, compatível com Node/Express e sem dependências de IA: análise de falas, classificação de intenção, direção de template, timeline e geração de funções Canvas compatíveis com `SceneSpec`. Uma rota Express local recebe roteiro/configuração e devolve o showreel pronto. A interface oferece modo local padrão e modo Gemini legado. O TTS Gemini permanece opcional, com chaves alternadas apenas para voz; sem chave/falha, o player usa Web Speech API e exibe o aviso correspondente. O exportador HTML existente continua como caminho portátil e o MP4 continua condicionado ao suporte do navegador.
