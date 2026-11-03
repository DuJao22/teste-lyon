# Decisões de implementação

1. **Usar TypeScript, não Python.** O aplicativo e o backend são React/TypeScript e Express; adicionar Python/Flask aumentaria instalação e criaria uma segunda pilha desnecessária, contrariando o requisito de uso leve em celular.
2. **Preservar o contrato existente de cena.** O motor local produzirá `ShowreelData`/`SceneSpec` e funções de Canvas; assim o player, o editor, a revisão e o HTML autônomo existentes continuam utilizáveis.
3. **Separar local de legado.** A direção e o código visual locais não fazem chamadas de IA. O modo Gemini continua disponível como alternativa. A opção de TTS Gemini usa o fluxo de voz existente e pode ser desligada/usar voz do navegador.
4. **Sincronizar em duas passagens.** As durações iniciais são estimadas pelo texto e cadência humana; quando o TTS retorna, o áudio é decodificado e a timeline é recalculada para cobrir duração real mais uma pequena pausa. Não se cria espera silenciosa longa para atingir exatamente a duração alvo.
5. **Fallback de vídeo portátil.** O navegador grava WebM quando `MediaRecorder` suporta o formato. O app não tenta MP4 sem ffmpeg; quando não há gravação disponível, baixa o HTML autônomo com animação e narração, sem dependência nativa pesada.
6. **Testes leves.** Usar `node:test` com `tsx` já listado no projeto, sem instalar framework adicional, para parser, analyzer e timeline.
7. **Layout.** O Canvas mantém a resolução 9:16 existente por padrão; o motor aceitará 16:9 por configuração e dimensionará seus desenhos relativos ao canvas.
