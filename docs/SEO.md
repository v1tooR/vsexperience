# SEO — VS Experience

Atualizado em 4 de outubro de 2026. Escopo: SEO e compartilhamento. Este ajuste preserva layout, mockups, animações e conteúdo visível das páginas em português.

## Implementado

- Títulos e descrições exclusivos para home, seis destinos de serviços, bio e home em inglês. Cada serviço tem intenção própria: criação de landing page, site institucional, loja virtual, sistemas web/SaaS e design system.
- Canonical, Open Graph e Twitter Cards com URLs HTTPS absolutas em `vsexperience.com.br`. Inclui formato, dimensões e descrição das imagens.
- Nove capas JPEG de 1200 × 630 px em `assets/images/og/`, com monograma, Roboto Flex, Plus Jakarta Sans, Linho, Grafite, Cádmio e o gradiente da identidade atual. Os nomes novos evitam reutilizar as capas antigas em cache.
- Home inglesa estática em `/en/`, com conteúdo, metadados, WhatsApp e FAQ próprios. O seletor navega entre URLs; preferências salvas não alteram o idioma da URL. Depoimentos preservam o idioma original, identificado no HTML.
- Hreflang recíproco `pt-BR`, `en` e `x-default` na home e sitemap. Serviços não anunciam traduções inexistentes. Referência: [versões localizadas no Google](https://developers.google.com/search/docs/specialty/international/localized-versions).
- Dados estruturados de WebSite, WebPage/CollectionPage/ProfilePage, Person, Organization, Service, BreadcrumbList, ItemList e FAQPage conforme cada página. ProfessionalService foi substituído por Organization, pois está [descontinuado no Schema.org](https://schema.org/ProfessionalService).
- FAQs estruturadas correspondem ao texto visível. Faixas de investimento permanecem no catálogo; AggregateOffer foi removido para não tratar o preço inicial do plano superior como teto. Sem avaliações agregadas, endereços ou resultados comerciais inventados.
- Sitemap com nove URLs canônicas e data deste ajuste. Robots libera conteúdo e recursos públicos e exclui diretórios de desenvolvimento. Configurações em `config/` espelham a raiz.
- `.htaccess` para Apache 2.4: HTTP → HTTPS, www → domínio principal, `/index.html` → pasta e `/?lang=en` → `/en/`. Compressão e cache existentes preservados. Referências CSS/JS recebem hash de conteúdo.
- Cabeçalho `X-Robots-Tag: noindex, follow` em propostas, Praado, QR generator, remove-paragraph e teste de mockup. Esses caminhos continuam rastreáveis para leitura do cabeçalho, conforme a [documentação de noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Isso não controla acesso aos arquivos.

## Validação realizada

`scripts/seo/check.cjs` validou nove páginas em servidor local com JavaScript desativado: HTTP 200, títulos/descrições exclusivos, canonical, idioma, hreflang, JSON-LD, FAQs, um H1 por página, links e recursos locais e imagens decodificadas em 1200 × 630 px. Verificou troca de idioma, âncoras, `?lang=en`, ausência de erros JavaScript na home, espelhos de configuração e HTTP 404 em rota inexistente.

Detalhes: [seo-validation.json](seo-validation.json). As capas foram inspecionadas visualmente. O servidor Python local não executa `.htaccess`, e não há Apache disponível neste ambiente: redirects, HTTPS e noindex precisam ser confirmados na hospedagem. Não houve publicação ou submissão ao Search Console.

## Após publicar

1. Publicar os arquivos de [DEPLOY-SEO.md](DEPLOY-SEO.md), incluindo `en/`, capas e `.htaccess` da raiz. Limpar cache de HTML da hospedagem/CDN.
2. Conferir 301 e destino em HTTP, www, `/index.html`, `/servicos/index.html` e `/?lang=en`. Confirmar 404 em rota inexistente, noindex numa proposta e ausência desse cabeçalho nas páginas comerciais.
3. Conferir `/robots.txt`, `/sitemap.xml`, `/en/` e as novas imagens públicas.
4. Na propriedade verificada do Google Search Console, enviar `https://vsexperience.com.br/sitemap.xml`. Inspecionar home, inglês e serviços para conferir acesso, canonical selecionado e conteúdo renderizado. Referência: [Inspeção de URL](https://support.google.com/webmasters/answer/9012289).
5. Validar URLs públicas no [Rich Results Test](https://search.google.com/test/rich-results) e [Schema Markup Validator](https://validator.schema.org/). Tipos sem resultado enriquecido próprio podem não aparecer no primeiro teste. FAQPage não representa promessa de destaque nas buscas.
6. Conferir prévias no [Sharing Debugger da Meta](https://developers.facebook.com/tools/debug/) e num compartilhamento novo no WhatsApp/LinkedIn. Pedir nova leitura quando o serviço oferecer a opção.
7. Medir mobile no [PageSpeed Insights](https://pagespeed.web.dev/) e acompanhar Core Web Vitals reais no Search Console. Desempenho da hospedagem e dados reais de usuários não foram medidos localmente.

## Manutenção e crescimento orgânico

Metadados e capas são definidos em `scripts/seo/pages.cjs`. A home inglesa é gerada do dicionário existente em `assets/js/home.js`; não editar `en/index.html` manualmente.

```powershell
node scripts/seo/build.cjs
node scripts/seo/render-social.cjs
uv run python -m http.server 5173 --bind 127.0.0.1
# Em outro terminal:
node scripts/seo/check.cjs
```

Os scripts usam Playwright do runtime local. Em outro computador, configurar `VS_PLAYWRIGHT_MODULE` com o caminho do pacote instalado e instalar seu Chromium. Atualizar a data em `build.cjs` somente quando conteúdo ou metadados mudarem. `route-languages.cjs` é a migração já aplicada; não precisa rodar novamente. `tools/versionar-assets.mjs` também cobre `/en/`.

Após indexar, acompanhar consultas, impressões, cliques e páginas que geram contatos. Usar esses dados para priorizar conteúdo útil e cases com decisões e resultados verificáveis. Esta entrega prepara a base técnica; posicionamento e volume de contatos dependem também de conteúdo, concorrência, reputação e acompanhamento.
