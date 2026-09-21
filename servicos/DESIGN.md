# Páginas de serviço · VS Experience Design System

## Direction

As mesmas superfícies escuras em vinho, o acento rosa e o motion deliberado da proposta Varejão Tintas, agora num sistema compartilhado por seis páginas. As cores de cada cliente fictício aparecem apenas dentro dos mockups, para que o produto demonstrado não concorra com a identidade da VS Experience.

## Files

- `assets/servicos.css`: tokens, cabeçalho, hero, mockups, seções, investimento, cursor, motion, responsivo, print.
- `assets/servicos.js`: WhatsApp, progresso de leitura, scrollspy, reveal, linha do processo, abas, cópia de link, inclinação do mockup, brilho dos planos e cursor.
- Cada página traz apenas o CSS do próprio mockup e da própria anatomia, em um `<style>` local.

## Color

- Fundo `oklch(0.13 0.012 25)`, elevado `oklch(0.165 0.014 25)`, superfície `oklch(0.22 0.018 25)`
- Rosa `oklch(0.54 0.12 25)`, rosa suave `oklch(0.76 0.08 25)`, vinho profundo `oklch(0.16 0.035 25)`
- Texto `oklch(0.96 0.006 25)`, suave `oklch(0.8 0.012 25)`, apagado `oklch(0.67 0.012 25)`
- Mockups: laranja solar (landing), azul engenharia (institucional), verde botânico (e-commerce), teal (sistemas), violeta (design system), sempre em `--c-*` dentro de `.screen`

## Typography

Space Grotesk, família única da marca VS Experience (site e propostas), em pesos 400 a 700. Mantida por preservação de identidade.

## Components

- Cabeçalho fixo com vidro, progresso rosa e scrollspy (`data-spy` nas seções, `data-spy-link` nos links)
- Palco do hero: navegador inclinado, abas WAI-ARIA, selo de prazo e card flutuante
- Faixa de ficha técnica, lista de resultados, seção de anatomia específica por serviço
- "Faz sentido quando / Outro formato serve melhor", com links cruzados entre serviços
- Processo com linha que se preenche no scroll
- Painel de média com pontos por projeto real, três faixas com a "Faixa mais comum" destacada
- Case real, cuidados pós-entrega, FAQ em `<details>`, fechamento com metadados e outros serviços

## Motion

Entrada do cabeçalho e do hero em sequência; mockup entra com blur; card flutuante com leve oscilação; reveal no scroll partindo de conteúdo já visível; pontos da média e barras de horas animam ao entrar na tela; mockup inclina e o brilho do hero segue o ponteiro; cursor do site principal (círculo com atraso, deformado pela velocidade, ampliado sobre elementos interativos). Tudo desligado em `prefers-reduced-motion` e em ponteiros de toque.
