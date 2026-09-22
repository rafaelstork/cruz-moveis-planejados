# Direção da Hero — Cruz Móveis

## Comparação de três rotas

Não havia histórico de heroes no workspace. Foram comparadas três propostas criadas a partir da marca, da marcenaria publicada e da linguagem de modulação de móveis.

### Rota A — Elevação de marcenaria (escolhida)

- **Composição:** plano modular de portas e gavetas em toda a dobra; fotografia vertical ocupa um vão deslocado; título largo avança até o limite desse vão; provas ficam em uma coluna estreita.
- **Geometria:** linhas de elevação, módulos verticais e corte chanfrado no canto da imagem.
- **Paleta:** preto e grafite da marca, dourado do monograma, marfim e o Beige Matt da fotografia.
- **Tipografia:** sans grotesca compacta, grande e direta, sem teatralidade de serifada editorial.
- **Fotografia:** cozinha clara em recorte alto, preservada em HTML e sem deformação.
- **Movimento:** as linhas são traçadas como uma elevação; a imagem abre como uma porta de correr; o título entra por dentro de máscaras horizontais.

### Rota B — Bancada de projeto

- **Composição:** uma faixa horizontal baixa sustentaria a foto panorâmica, com título no alto e anotações técnicas inclinadas ao redor.
- **Geometria:** cotas, esquadro e eixo diagonal de bancada.
- **Paleta:** off-white, grafite e azul acinzentado da janela da obra.
- **Tipografia:** sans condensada com pequenos metadados monoespaçados.
- **Fotografia:** recorte horizontal de cozinha ou ilha.
- **Movimento:** cotas se medem do centro para as bordas e o ponteiro desloca o esquadro.
- **Por que não foi escolhida:** a fotografia oficial selecionada é vertical; forçar uma faixa panorâmica perderia os armários e reduziria a honestidade do acervo.

### Rota C — Mostruário de materiais

- **Composição:** três lâminas verticais sobrepostas simulando amostras de MDF, com a fotografia aparecendo apenas na lâmina central.
- **Geometria:** leque de chapas e raios pequenos de borda.
- **Paleta:** Beige Matt, branco, preto e dourado.
- **Tipografia:** título vertical parcial e apoio pequeno na base.
- **Fotografia:** detalhe de portas, puxadores e tamponamentos.
- **Movimento:** as lâminas se abrem com parallax de profundidade e luz especular Three.js.
- **Por que não foi escolhida:** depende de detalhes de material mais fechados do que o acervo confirmado oferece e poderia parecer um catálogo de MDF, não uma entrega completa.

## Escolha e tese visual

Rota escolhida: **Elevação de marcenaria**.

Tese em uma frase: **a hero transforma a própria tela em uma elevação de armário, fazendo cada bloco parecer medido, encaixado e concluído para aquele espaço.**

Ela é a mais fiel porque combina a identidade preta e dourada observada na marca com o benefício de aproveitamento sob medida, sem esconder que a fotografia disponível é de uma obra real e cotidiana.

## Cinco soluções a não repetir

1. Hero convencional 50/50 com texto isolado à esquerda e imagem retangular à direita.
2. Título centralizado sobre fotografia full bleed.
3. Paleta creme + serifada + terracota usada como atalho de “sofisticação”.
4. Ícone genérico de casa ou linhas decorativas sem relação com marcenaria.
5. Sequência de cartões de métricas ou prévia de seções futuras.

## Primeira dobra exata

- Cabeçalho com avatar oficial, assinatura tipográfica, Instagram e CTA de WhatsApp.
- Eyebrow “Móveis sob medida · Campinas”.
- Título “Seu espaço, sem sobras.”.
- Apoio sobre 100% MDF e 12 anos de garantia.
- CTA principal real para o WhatsApp.
- Fotografia oficial da cozinha Beige Matt em vão vertical chanfrado, com legenda curta.
- Duas provas discretas: 12 anos e 100% MDF.
- Localização/ano e crédito Rafael Stork Design integrados à base.
- Nenhuma seção, navegação ou link para conteúdo inexistente.

## Assinatura de movimento

| Elemento | Gatilho | Propriedade | Responsável | Inicial | Final | Interrupção / limpeza | Movimento reduzido |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Linhas da elevação | carregamento | `scaleX/scaleY` | GSAP | recolhidas | traçadas | timeline morta em `pagehide` | estado final imediato |
| Vão fotográfico | carregamento | `clip-path` | GSAP | faixa vertical | moldura completa | classe de preparação removida por conclusão ou timeout | moldura completa |
| Fotografia | carregamento | `scale` | GSAP | 1.08 | 1 | `clearProps` após animação | escala 1 |
| Título | carregamento | `xPercent` dentro da máscara | GSAP | fora do módulo | posição final | timeline revertida | posição final |
| Setas dos CTAs | hover/foco | `translateX` | GSAP | 0 | 4 px | volta em blur/leave | sem movimento |
| Malha material | contínuo + ponteiro | shader / uniforms | Three.js | repouso central | deslocamento sutil | pausa fora da viewport/aba oculta e descarte em `pagehide` | canvas ausente |

O Three.js cria uma malha muito sutil de linhas modulares e veios luminosos, ligada a painéis e chapas. O canvas é decorativo, transparente e não substitui conteúdo.

## Risco honesto

A fotografia oficial tem linguagem documental, não produção publicitária. A direção usa essa honestidade como contraste com a precisão gráfica; se o cliente fornecer fotos profissionais, o mesmo sistema pode ganhar maior impacto sem mudar sua estrutura.

## Fallback e mobile

- Sem WebGL ou em contexto perdido: uma malha CSS estática mantém a leitura modular.
- Sem JavaScript: todos os textos, links, imagem e layout aparecem completos; nenhuma informação depende da animação.
- Movimento reduzido: a timeline não desloca conteúdo e o canvas não é criado.
- Mobile: conteúdo assume ordem linear de leitura; CTA precede a fotografia; provas ficam abaixo da imagem; o recorte continua assimétrico e a página usa rolagem nativa quando necessário.
