---
name: Proposta E-commerce B2C + Portal B2B
description: Sistema visual VS Experience para propostas comerciais digitais.
colors:
  rose: "oklch(0.54 0.12 25)"
  rose-strong: "oklch(0.63 0.15 25)"
  rose-soft: "oklch(0.76 0.08 25)"
  wine: "oklch(0.24 0.07 25)"
  wine-deep: "oklch(0.16 0.035 25)"
  background: "oklch(0.13 0.012 25)"
  background-elevated: "oklch(0.165 0.014 25)"
  surface: "oklch(0.22 0.018 25)"
  text: "oklch(0.96 0.006 25)"
  text-soft: "oklch(0.78 0.012 25)"
  text-muted: "oklch(0.63 0.012 25)"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.2vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "clamp(84px, 10vw, 136px)"
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "50px"
  panel:
    backgroundColor: "{colors.background-elevated}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Propostas VS Experience

## 1. Overview

**Creative North Star: “Sala de decisão digital”**

Uma proposta executiva que se comporta como produto: narrativa escaneável, artefatos visuais úteis, contraste alto e informação comercial sem ambiguidades. O sistema preserva o fundo vinho quase preto, o acento rosé e a tipografia Space Grotesk observados nos orçamentos Seven, SeaAds e Jeff.

O resultado deve ser comercial e preciso, nunca parecer um PDF jurídico convertido em página nem um template SaaS genérico.

**Características-chave:** hero editorial de alta densidade; mockups de produto construídos em HTML/CSS; superfícies tonais; cantos contidos; progresso de leitura; abas acessíveis; CTA de aprovação persistente.

## 2. Colors

A paleta é monocromática no eixo vinho/rosé, com o acento reservado para decisões, estados ativos e valores-chave.

### Primary

- **Rosé de decisão** (`oklch(0.54 0.12 25)`): CTAs, indicadores ativos e destaques.
- **Rosé luminoso** (`oklch(0.76 0.08 25)`): ênfase tipográfica e estados de alto contraste.

### Neutral

- **Vinho de fundo** (`oklch(0.13 0.012 25)`): canvas principal.
- **Vinho elevado** (`oklch(0.165 0.014 25)`): seções e mockups.
- **Texto principal** (`oklch(0.96 0.006 25)`): títulos e informação essencial.
- **Texto de apoio** (`oklch(0.78 0.012 25)`): parágrafos e descrições.

**Regra do acento funcional.** Rosé indica ação, estado ou prioridade; não deve virar decoração difusa.

## 3. Typography

**Display Font:** Space Grotesk (system-ui)
**Body Font:** Space Grotesk (system-ui)

**Character:** geométrica, direta e contemporânea. A personalidade surge da escala e do ritmo, não de múltiplas famílias.

### Hierarchy

- **Display** (700, `clamp(48px, 7.2vw, 88px)`, 0.99): somente a tese principal.
- **Headline** (700, `clamp(34px, 5vw, 60px)`, 1.04): aberturas de seção.
- **Title** (600–700, 18–26px): componentes e blocos de decisão.
- **Body** (400, 16–20px, 1.6): leitura limitada a 68ch.
- **Label** (700, 10–12px, 0.08em): contexto curto, sem repetir o padrão em todas as subseções.

**Regra do título compacto.** Letter-spacing de displays nunca ultrapassa `-0.04em`.

## 4. Elevation

Profundidade vem de camadas tonais e divisórias discretas. Sombras são raras e estruturais; o cabeçalho usa blur apenas para manter legibilidade durante a rolagem.

**Regra plana por padrão.** Painéis permanecem planos em repouso e não combinam borda decorativa com sombra ampla.

## 5. Components

### Buttons

- **Shape:** raio de 8px e altura mínima de 50px.
- **Primary:** fundo rosé, texto branco e padding horizontal de 22px.
- **Hover / Focus:** deslocamento vertical de 2px, mudança tonal e foco visível.
- **Secondary:** superfície tonal com borda de baixo contraste.

### Chips

- **Style:** pílulas compactas para filtros, estados e agrupamentos; selecionado em rosé/vinho.
- **State:** seleção sempre comunicada por cor e texto, nunca apenas por brilho.

### Cards / Containers

- **Corner Style:** 12–16px.
- **Background:** fundos elevados derivados do vinho.
- **Shadow Strategy:** sem sombra por padrão.
- **Border:** divisórias de 1px somente quando ajudam a organizar a informação.
- **Internal Padding:** 20–32px.

### Inputs / Fields

- **Style:** superfície escura, borda discreta e raio de 8px.
- **Focus:** mudança de borda para rosé e outline visível.
- **Error / Disabled:** texto explícito; não depender apenas da cor.

### Navigation

Cabeçalho fixo, compacto, com links de seção, progresso de leitura e CTA de aprovação. Em telas estreitas, links secundários são ocultos e o CTA mantém o ícone.

### Mockup operacional

Moldura de navegador com produto simulado em HTML/CSS. Deve comunicar fluxo real — catálogo, login B2B, preços comerciais e pedidos unificados — sem imagens genéricas.

## 6. Do's and Don'ts

### Do:

- **Do** preservar os tokens e o ritmo dos orçamentos Seven, SeaAds e Jeff.
- **Do** usar artefatos visuais para explicar a diferença entre B2C e B2B.
- **Do** manter contraste WCAG AA, foco por teclado e redução de movimento.
- **Do** testar em desktop, tablet e celular.

### Don't:

- **Don't** parecer um PDF jurídico convertido em página, uma tabela de preços genérica ou um template SaaS azul.
- **Don't** usar gradiente em texto, glassmorphism decorativo ou sombras largas sobre bordas de 1px.
- **Don't** repetir grades de cartões idênticos como estrutura principal.
- **Don't** esconder conteúdo até uma animação disparar.
- **Don't** ultrapassar 16px de raio em cartões e painéis.
