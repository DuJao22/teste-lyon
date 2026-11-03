# Motion Reel Studio

Studio web para planejar, animar, narrar e exportar showreels verticais. O backend e os motores são TypeScript/Express; não é necessário Python nem ffmpeg.

## Início rápido

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`. No Windows, execute `./start.ps1`; em Termux, execute `sh start.sh`. Os scripts instalam dependências ausentes e iniciam o servidor. Para validar localmente: `npm test`, `npm run lint` e `npm run build`.

## Modos de geração

- **Cenas locais** é o padrão. Cole um roteiro ou texto no campo principal. O Scene Engine analisa cada fala, escolhe um visual Canvas e monta a timeline sem usar API de IA.
- **Modo Gemini** preserva o pipeline legado de planejamento, criação e revisão por Gemini.
- A voz Gemini TTS é opcional nos dois modos e usa o rodízio local de chaves somente na síntese de voz. Sem chave ou quando a síntese falhar, o player usa Web Speech API em português do Brasil e calcula a duração pela fala. Voz, velocidade e tom podem ser ajustados nas configurações.
- Exporte HTML autônomo pelo botão **HTML**. O app grava WebM somente quando `MediaRecorder` oferece suporte; sem esse suporte, o botão de gravação baixa o HTML animado com narração. Não há tentativa de MP4 nem dependência de ffmpeg.

## Scene Engine

`scene_engine/parser.ts` separa falas; `analyzer.ts` detecta intenção, palavras-chave e métricas; `director.ts` escolhe e alterna templates; `timeline.ts` estima a fala e alinha as cenas ao áudio medido; `templates/index.ts` contém visuais Canvas parametrizados; `renderer.ts` expõe a fachada local. A rota `POST /api/scene-engine/generate` recebe `script`, `duration`, `width`, `height` e `aspectRatio` e devolve `showreel` + logs. Ela não recebe chaves nem chama IA.

Os templates recebem texto, resumo, análise, paleta, seed e índice. Para adicionar um, inclua um novo `TemplateKind`, seu desenho Canvas em `renderCanvasTemplate`, uma entrada em `TEMPLATE_CATALOG` e uma regra em `director.ts`. Use coordenadas relativas a `W`/`H`, não faça chamadas de rede no código de cena e mantenha títulos curtos para legibilidade em 9:16 e 16:9.

Veja `docs/ANALISE_INICIAL.md`, `docs/DECISOES.md`, `docs/SCENE_ENGINE.md` e `examples/roteiro_exemplo.txt`.
