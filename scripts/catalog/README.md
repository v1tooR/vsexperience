# Catálogo de categorias

O site continua sendo HTML estático, sem dependência de um servidor de aplicação em produção.

## Fonte e geração

- `categories.cjs`: conteúdo em português e inglês das sete categorias e das suas especialidades.
- `build.cjs`: gera seis páginas novas por idioma e amplia a página existente de Design System. Atualiza também os dois índices, os links de categorias nas duas homes e o sitemap.
- `servicos/assets/categorias.css` e `categorias.js`: extensão do design system das páginas de serviço.
- `servicos/assets/servicos.js`: comportamento compartilhado, incluindo abas acessíveis e controle opcional de pausa.

Execute na raiz do projeto:

```sh
node scripts/catalog/build.cjs
```

A geração é idempotente. O conteúdo das seis categorias novas é gerado; edite sua fonte, não as cópias HTML. A página de Design System conserva o HTML existente de mockup, processo e preços; o gerador substitui apenas o catálogo, a navegação relacionada e seus metadados de catálogo.

Os geradores antigos `scripts/seo/build.cjs` e `tools/build-en-servicos.mjs` chamam o gerador de categorias ao final para preservar o conteúdo e a navegação em PT/EN.

## Escopo comercial

O catálogo contém os 64 serviços de Produtos-Variados.md, mais E-commerce e Sistemas e SaaS já existentes. VS Social continua relacionada a Branding e Educação. Os preços do Markdown são referências para avaliação e não foram publicados. As páginas individuais existentes mantêm seus valores.

Não há páginas individuais novas para as outras especialidades nesta etapa. Cada especialidade tem uma âncora estável, descrição e contato contextual pelo WhatsApp. As que já possuem página usam a propriedade `href`; ao criar páginas futuras, registre a rota em ambos os idiomas antes de adicionar o link.

Os exemplos de Branding, IA, Consultoria e Educação são demonstrações declaradas. As imagens de Sites e Design Digital vêm do portfólio existente. Fácil Organização permanece identificado como produto próprio em desenvolvimento.

## Verificação

Com o projeto servido localmente em `http://127.0.0.1:5173`:

```sh
node scripts/seo/check.cjs
```

O verificador cobre as 27 rotas registradas, seus links e arquivos, metadados, dados estruturados, navegação de idioma e sitemap. A configuração de Playwright existente pode ser indicada por `VS_PLAYWRIGHT_MODULE`; a URL pode ser indicada por `VS_SEO_BASE`.

As evidências da implementação ficam em `.impeccable/review/categories/`: capturas em desktop e celular, relatório funcional e revisão independente. Capturas completas precisam aguardar a decodificação de todas as imagens, inclusive as carregadas sob demanda.
