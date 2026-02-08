# VS Experience - Production Build

## 📁 Estrutura de Pastas

```
vanilla-site/
├── index.html              # Página principal com SEO avançado
├── styles.css              # Estilos compilados (minificado em produção)
├── script.js               # JavaScript compilado (minificado em produção)
├── robots.txt              # Configuração para crawlers
├── sitemap.xml             # Mapa do site para SEO
├── .htaccess               # Configurações do servidor Apache
├── config.json             # Metadados do site
├── vslogo.webp             # Logo do site (usado como favicon)
├── g4.webp                 # Imagem do case G4 Business
├── costaflores.webp        # Imagem do case Costa Flores
├── ocasafloresta.webp      # Imagem do case Casa Floresta
├── victor2.webp            # Fotos do Victor
├── vs-victor-1.webp        # Foto do Victor (seção hero)
├── victorsemfundo.webp     # Foto do Victor (sem fundo)
└── vslanding.webp          # Imagem de landing
```

## 🚀 Como Fazer Deploy

### Opção 1: Hosting Compartilhado (Apache)
1. Faça upload de todos os arquivos para a pasta `public_html`
2. O arquivo `.htaccess` será automaticamente aplicado
3. Atualize o domínio no DNS
4. Teste o acesso em `https://vsexperience.com`

### Opção 2: Vercel / Netlify
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=vanilla-site
```

### Opção 3: VPS / Servidor Dedicado
```bash
# Via SFTP ou Git
git clone <repo> /var/www/vsexperience
chmod 755 /var/www/vsexperience
chmod 644 /var/www/vsexperience/*
```

## 🔒 Configurações de Segurança

✅ **Implementadas:**
- X-Frame-Options: Previne clickjacking
- X-Content-Type-Options: Bloqueia MIME-sniffing
- X-XSS-Protection: Proteção contra XSS
- Referrer Policy: Controla informação de referência
- Permissions Policy: Restringe APIs perigosas

## ⚡ Performance

✅ **Otimizações Ativas:**
- GZIP compression para HTML, CSS, JS
- Cache browser para imagens (1 ano)
- Cache browser para CSS/JS (1 mês)
- Cache browser para HTML (1 dia)
- WebP para todas as imagens
- Preconnect para Google Fonts

## 📊 SEO

✅ **Meta Tags Configuradas:**
- Title e description otimizados
- Keywords relevantes
- Open Graph tags (compartilhamento social)
- Twitter Card tags
- Canonical URL
- Robots meta tag
- Sitemap.xml para crawlers
- Favicon (.webp)

## 🎯 Verificações Pré-Launch

- [ ] Testar HTTPS em `https://vsexperience.com`
- [ ] Verificar Mobile Responsiveness
- [ ] Testar com PageSpeed Insights
- [ ] Verificar robots.txt em `/robots.txt`
- [ ] Verificar sitemap em `/sitemap.xml`
- [ ] Verificar favicon carregando
- [ ] Testar links WhatsApp em mobile
- [ ] Testar cursor em desktop
- [ ] Verificar efeitos de luz em desktop
- [ ] Submeter sitemap ao Google Search Console
- [ ] Testar compartilhamento social

## 📈 Monitoramento Pós-Launch

1. **Google Search Console**: Submeter sitemap
2. **Google Analytics**: Configurar rastreamento
3. **Uptime Monitor**: Monitorar disponibilidade
4. **Core Web Vitals**: Acompanhar performance

## 🛠️ Manutenção

- Atualizar `sitemap.xml` se adicionar novas seções
- Revisar `config.json` conforme necessário
- Manter `.htaccess` atualizado para novas rules
- Backup regular dos arquivos

---

**Última atualização:** 7 de Fevereiro de 2026  
**Versão:** 1.0.0
