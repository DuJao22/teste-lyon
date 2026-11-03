# Scene Engine local

## Uso

O motor é TypeScript puro e determinístico. Em desenvolvimento e produção, chame `POST /api/scene-engine/generate` com JSON:

```json
{"script":"Cena 1: Sua ideia pode virar um produto.\nCena 2: Publique e comece agora.","duration":30,"width":720,"height":1280,"aspectRatio":"9:16"}
```

A resposta contém um `showreel` no contrato do player existente. A rota não recebe chaves e não chama serviços de IA. Falas marcadas com `Cena 1:` ou listas numeradas viram cenas individuais; texto livre é separado por parágrafos/frases. Se o roteiro não terminar com CTA, o motor acrescenta uma fala curta de encerramento para garantir um final narrado.

## Fluxo

1. `parser.ts` preserva e limpa falas, removendo notas `Visual:`.
2. `analyzer.ts` classifica CTA, pergunta, métrica, comparação, processo, lista, dashboard, código, arquitetura, impacto e texto genérico.
3. `director.ts` seleciona templates e varia cenas adjacentes.
4. `timeline.ts` estima a fala, ajusta a cadência dentro de 125–165 palavras/minuto e acrescenta 0,42 s de pausa. Não estica cenas com silêncio para preencher a duração pedida; `recalculateTimeline()` estende cenas para cobrir o áudio medido mais essa pausa.
5. `templates/index.ts` gera os corpos Canvas para 13 visuais animados e um fundo ambiente comum. O player existente monta HTML autônomo; o `MediaRecorder` grava WebM quando o navegador suportar, com HTML como fallback.

## Voz e sincronização

Depois da geração local, a interface opcionalmente sintetiza cada fala via Gemini TTS, usando uma chave do pool por fala. O áudio é decodificado no navegador para medir duração. Sem chave ou em falha, a narração fica sinalizada e o player usa uma voz `pt-BR` disponível via Web Speech API. Voz do navegador, velocidade e tom ficam nas configurações. A síntese de voz é a única chamada externa permitida pelo modo local.

## Templates

Cada template recebe frase, resumo, análise, paleta, seed e índice, e retorna código Canvas. Os desenhos usam `W` e `H` relativos, para suportar 9:16 e 16:9. Para incluir novos templates, adicione o tipo e desenho em `templates/index.ts`, inclua o item no catálogo e mapeie a intenção em `director.ts`. Evite acesso a `window`/DOM, rede, dependências e loops custosos no código que roda por frame.

## Validação

`npm test` executa testes de parser, analyzer e timeline com `node:test` via `tsx`. `examples/roteiro_exemplo.txt` é um roteiro pronto para geração manual ou teste da rota.
