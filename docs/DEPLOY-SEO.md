# Publicação do ajuste de SEO

Domínio canônico: `https://vsexperience.com.br/`. Atualizado em 4 de outubro de 2026.

Publicar na raiz do domínio, preservando demais páginas existentes:

- `index.html`, `bio.html` e `en/index.html`;
- os seis `index.html` de `servicos/` e dos cinco serviços;
- `assets/js/home.js` e os recursos locais referenciados pelo HTML;
- `assets/images/og/` e os arquivos de marca em `assets/images/brand/`;
- `robots.txt`, `sitemap.xml` e `.htaccess` **da raiz do projeto**.

`docs/`, `config/`, `scripts/`, `tools/`, `tmp/`, `.git/` e diretórios de agentes/revisão/perfis de navegador não fazem parte do site público. Os arquivos em `config/` são espelhos; não publicar essa pasta como páginas.

Em Apache ou LiteSpeed compatível, copiar para `public_html` com o `.htaccess`. As regras usam sintaxe Apache 2.4 e dependem de rewrite/headers na hospedagem. A instalação deve ser na raiz do domínio. Confirmar HTTPS e aplicação das regras no servidor real. Limpar cache de HTML na hospedagem/CDN após publicar; CSS/JS estão versionados por conteúdo e as capas têm nomes novos.

Netlify, Vercel e Nginx não aplicam `.htaccess` automaticamente. Nesses casos, traduzir redirects e cabeçalhos para a configuração da plataforma. Este ajuste não criou configurações para essas plataformas.

Seguir verificações de produção e submissão do sitemap em [SEO.md](SEO.md). Testes locais e limites: [seo-validation.json](seo-validation.json). A publicação não confirma automaticamente indexação no Google.
