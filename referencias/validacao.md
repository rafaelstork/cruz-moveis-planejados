# Validação técnica — Hero Lite Cruz Móveis

Data: 22 de setembro de 2026.

## Comandos executados

```text
npm install
npm run lint
npm test
npm run build
npm run dev -- --host 127.0.0.1
curl.exe -I http://127.0.0.1:5173/
npm ls --depth=0
```

Resultados finais:

- instalação concluída sem vulnerabilidades reportadas;
- ESLint concluído sem erros;
- 5 testes de regressão passaram;
- build Vite concluído sem erros ou alertas de tamanho;
- HTML entregue por HTTP com status `200 OK`;
- pacote inicial de aplicação: 77,79 kB (30,53 kB gzip);
- Three.js separado e carregado sob demanda: 472,17 kB (118,78 kB gzip).

## Cenários verificados no navegador

### Recursos e runtime

- Rota direta `http://127.0.0.1:5173/` aberta com sucesso.
- Console do navegador sem avisos ou erros.
- Nenhum recurso local falhou.
- Avatar oficial: 150 × 150 px, carregado.
- Fotografia oficial: 3072 × 4096 px, carregada.
- Crédito Rafael Stork: SVG carregado.
- Canvas Three.js criado uma única vez, com dimensões atualizadas junto ao viewport.
- Entrada GSAP chegou ao estado final e a classe de preparação foi removida.
- CTA principal permanece visível e acionável desde o início da timeline por regra explícita de estado.
- Recarregamento durante o fluxo não deixou estado de entrada residual.

### Viewports obrigatórios

Foram aplicados overrides reais de viewport no navegador e inspecionado o layout calculado, sem captura para avaliação estética.

| Viewport | Overflow horizontal | Conteúdo/controles | Resultado |
| --- | --- | --- | --- |
| 360 × 800 | não | rolagem vertical nativa; todos os controles ≥ 44 px | passou após correção da marca de 43 para 44 px |
| 390 × 844 | não | rolagem vertical nativa; todos os controles ≥ 44 px | passou |
| 768 × 1024 | não | hero dentro de 1024 px; controles acessíveis | passou |
| 1366 × 768 | não | composição completa; controles acessíveis | passou |
| 1920 × 1080 | não | composição completa; controles acessíveis | passou |
| 2560 × 1440 | não | composição completa; controles acessíveis | passou |

### Teclado e controles

Ordem de foco confirmada:

1. marca/início;
2. Instagram;
3. WhatsApp do cabeçalho;
4. CTA “Solicitar meu projeto”;
5. crédito Rafael Stork Design.

Todos os controles possuem nome acessível, foco visível em CSS e área mínima de 44 × 44 px. Os destinos foram validados no DOM e também protegidos por testes automatizados.

### GSAP, Three.js e fallback

- GSAP é o único responsável pela timeline de entrada e pela resposta das setas.
- CSS fornece estado completo antes do JavaScript.
- Preferência `prefers-reduced-motion` possui caminho explícito em JavaScript e CSS: a timeline entrega o estado final e o canvas não é criado.
- Three.js limita `devicePixelRatio` a 1,5; usa uma geometria, um material e nenhum texture/render target.
- `IntersectionObserver` pausa a cena fora da viewport e `visibilitychange` pausa com a aba oculta.
- Resize é tratado por `ResizeObserver`.
- Perda de contexto adiciona fallback CSS e interrompe o loop.
- `pagehide` remove listeners, observadores, frame, geometria, material e renderer.
- Falha de importação, criação do renderer ou suporte reduzido mantém o fallback estático.
- ScrollTrigger, Lenis e Swup não existem no projeto.

## Limitações reais do teste

- O navegador interno ignorou o atalho de zoom, então o zoom visual de 200% não pôde ser acionado diretamente pela automação. O comportamento equivalente de reflow foi exercitado nos dois menores viewports, sem altura fixa, corte impeditivo ou overflow horizontal.
- A preferência reduzida e a perda de contexto foram validadas pelos caminhos de código, CSS e testes de regressão; o navegador interno não expôs emulação de mídia nem comando de perda de contexto para disparo manual.
- A fotografia é oficial e pública, mas a autorização comercial formal deve ser confirmada com o cliente antes da publicação definitiva.
- A marca disponível é o avatar raster de 150 px do Instagram. Para produção, o cliente deve fornecer a versão vetorial oficial.

## Estado da entrega

- Prévia: `http://127.0.0.1:5173/`.
- Funcionamento técnico concluído.
- A Hero Lite não realizou crítica estética nem refinamento visual autônomo após a implementação.
- O design aguarda revisão do usuário.
