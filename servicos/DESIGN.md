# Páginas de serviço · Ecossistema VS

## Direction

Mesma identidade da home do ecossistema VS (vsexperience.com.br): Linho como página, Grafite como tinta, Carmim e Cádmio em campos inteiros, shader de listras da marca e Roboto Flex como voz tipográfica. Cada página de serviço abre com o nome do serviço como espécime tipográfico gigante e mostra o serviço funcionando num mockup de cliente fictício. As cores de cada cliente fictício ficam restritas aos mockups (`--c-*`), para o produto demonstrado não concorrer com a marca VS.

## Files

- `assets/servicos.css`: tokens e contextos, cabeçalho, hero, palco do mockup, seções, investimento, fechamento com shader, movimento, responsivo, impressão.
- `assets/servicos.js`: Lenis, WhatsApp, progresso de leitura, scrollspy, revelações, linha do processo, nome do serviço como espécime, abas dos mockups com reprodução automática e cursor de demonstração, cortina do shader, cópia de link.
- `../assets/js/vs-gradient.js`: shader da marca (compartilhado com a home).
- Cada página traz apenas o CSS do próprio mockup e da própria anatomia, em um `<style>` local.

## Color

Hex da marca, preservados como na identidade:

- Linho `#efefef` (página), Grafite `#212121` (tinta e faixas escuras), Carmim `#aa1f23` (campos e acento sobre claro), Cádmio `#ee2324` (acento sobre escuro, números grandes, barras de progresso), Branco `#fafafa`.
- Texto sobre Linho: `#212121`, suave `#484848` (8.0:1), apagado `#606060` (5.6:1).
- Texto sobre Grafite: `#efefef`, suave `#c4c4c4` (9.6:1), apagado `#9a9a9a` (5.7:1), acento `#ff7a7b` (6.4:1).
- Texto sobre Carmim: `#efefef`, suave `#f6d3d4` (5.2:1).
- Texto pequeno nunca vai sobre Cádmio.

### Contextos

Os tokens antigos continuam como aliases e mudam por contexto, para os mockups e anatomias locais se adaptarem sozinhos:

- Claro (padrão): `--bg` Linho, `--text` Grafite, `--rose`/`--rose-soft` Carmim, `--dark-line` Grafite 14%.
- Escuro (`.is-dark`, `.anatomy`, `.spec-band`, `.closing`, `.plan.is-common`, `.care-block.is-accent`): `--bg` Grafite, `--text` Linho, `--rose` Cádmio, `--rose-soft` `#ff7a7b`.
- Carmim (`.is-carmim`, `.avg-panel`, `.fit-col:not(.is-alt)`): `--bg` Carmim, `--text` Linho, `--rose` Linho.

## Typography

- Roboto Flex (variável: `opsz`, `wdth` 25–151, `wght` 100–1000) em títulos, números, nomes e preços; largura acima de 100 dá a voz da marca.
- Plus Jakarta Sans em texto, rótulos e botões.
- Nome do serviço no hero: Roboto Flex 300, até 12rem, ajustado à largura do container; cada letra ganha peso e largura conforme a proximidade do cursor (no toque, conforme a rolagem).
- Títulos de seção: Roboto Flex 760, `wdth` 112, até 4.25rem. Números de destaque (média, prazo total): Roboto Flex até 900, `wdth` 25 ou 125.

## Components

- Cabeçalho igual ao da home: logotipo, trilha "Serviços · Nome", links com sublinhado que cresce, botão Grafite. Sólido em Linho com fio ao rolar; barra de leitura em Cádmio.
- Hero: espécime do serviço, título com destaque em Carmim, palco com navegador Grafite (pontos quadrados, o primeiro em Cádmio), selo de prazo em Carmim, cartão flutuante do cliente fictício e abas em Grafite.
- Ficha técnica em faixa Grafite; "O que é" em linhas com fio; anatomia em faixa Grafite.
- "Faz sentido quando" em campo Carmim ao lado de "Outro formato" com fio.
- Processo com trilho que se preenche em Cádmio e marcos quadrados; prazo total em número condensado Cádmio.
- Investimento: painel Carmim com a média e os pontos de cada projeto real, acoplado a três planos com fios; o plano mais comum em Grafite com selo Linho.
- Case com fatos em linhas; pós-entrega em bloco Linho e bloco Grafite; perguntas frequentes em `<details>` com abertura animada.
- Fechamento sobre o shader Cortina, com a faixa vermelha limitada ao topo (`data-curtain`) e o texto sempre sobre o escuro; outros serviços em colunas com fio; assinatura com o logotipo Linho.
- Índice: retrato saindo do monograma Carmim (mesmo componente da home), lista de serviços com nomes como espécimes e prévia do case que segue o cursor, método com linha que se acende em sequência.

## Motion

- Entrada: cabeçalho desce, o espécime do serviço sobe com recorte e uma onda de peso o atravessa uma vez; texto e palco entram com desfoque.
- Palco: com a seção visível, as abas avançam a cada 5,2 s com barra de progresso; um cursor de demonstração vai até o botão principal do mockup, clica e dispara o cartão flutuante. Pausa com o mouse sobre o palco ou foco nas abas; o palco inclina levemente com o cursor.
- Revelações no scroll partem de conteúdo já visível; pontos da média e o marcador animam ao entrar; o método acende os marcos em sequência.
- Rolagem suave com Lenis. Tudo desligado em `prefers-reduced-motion`; cursor de demonstração e cartões somem no celular.
