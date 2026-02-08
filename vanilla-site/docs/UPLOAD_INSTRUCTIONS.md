# VS Experience - Guia de Upload para Servidor

## 📋 Checklist Antes de Subir

### 1. **Arquivos Necessários**
- [ ] `index.html` - Página principal
- [ ] `styles.css` - Estilos
- [ ] `script.js` - JavaScript
- [ ] `robots.txt` - Para buscadores
- [ ] `sitemap.xml` - Mapa do site
- [ ] `.htaccess` - Configurações Apache
- [ ] `config.json` - Metadados
- [ ] Todas as imagens `.webp`

### 2. **Imagens Obrigatórias**
```
├── vslogo.webp              (favicon + logo)
├── g4.webp                  (case 1)
├── costaflores.webp         (case 2)
├── ocasafloresta.webp       (case 3)
├── victor2.webp             (fotos do Victor)
├── vs-victor-1.webp         (hero image)
├── victorsemfundo.webp      (hero image)
└── vslanding.webp           (complementar)
```

### 3. **Passos para Upload**

#### Via SFTP (Recomendado)
```bash
# 1. Conectar ao servidor
sftp usuario@seu-dominio.com

# 2. Navegar para a pasta pública
cd public_html  # ou www, htdocs, conforme servidor

# 3. Fazer upload dos arquivos
put index.html
put styles.css
put script.js
put robots.txt
put sitemap.xml
put .htaccess
put config.json
put *.webp
```

#### Via cPanel File Manager
1. Acessar cPanel → File Manager
2. Navegar para `public_html`
3. Upload dos arquivos via drag & drop
4. Verificar permissões (644 para arquivos, 755 para pastas)

#### Via Git (se servidor suportar)
```bash
git clone seu-repo.git /home/usuario/public_html
cd /home/usuario/public_html/vanilla-site
cp -r * ../
```

### 4. **Verificações Pós-Upload**

#### Estrutura
```bash
# SSH acesso
ssh usuario@seu-dominio.com

# Verificar arquivos
ls -la public_html/

# Verificar permissões
chmod 644 public_html/*.html
chmod 644 public_html/*.css
chmod 644 public_html/*.js
chmod 644 public_html/*.webp
chmod 644 public_html/*.json
chmod 644 public_html/*.xml
chmod 644 public_html/.htaccess
```

#### Testes no Navegador
1. **Homepage**
   ```
   https://seu-dominio.com
   ```
   Verificar:
   - [ ] Página carrega completamente
   - [ ] Logo aparece corretamente
   - [ ] Estilos aplicados
   - [ ] Animações funcionam

2. **Meta Tags e SEO**
   ```
   Inspecionar → head
   Verificar:
   - [ ] Title correto
   - [ ] Meta description
   - [ ] Favicon carregado
   - [ ] OG tags presentes
   ```

3. **Responsividade**
   - [ ] Mobile: 375px
   - [ ] Tablet: 768px
   - [ ] Desktop: 1024px+

4. **Recursos Estáticos**
   - [ ] Images carregam (Network tab)
   - [ ] CSS aplicado sem erros
   - [ ] JavaScript executa

5. **Links Internos**
   - [ ] Navegação funciona
   - [ ] Anchors (#sections) funcionam
   - [ ] Links WhatsApp abrem corretamente

### 5. **Configurações Importantes**

#### Se servidor NÃO usa Apache
Se usar Nginx ou outro, você precisa:
1. Converter `.htaccess` para `nginx.conf`
2. Contatar suporte do hosting

#### Certificado SSL
- [ ] Certificado Let's Encrypt ativo
- [ ] HTTPS redirecionando HTTP
- [ ] Sem warnings de segurança

#### DNS
- [ ] A record apontando para servidor
- [ ] MX records configurados
- [ ] TXT records (SPF, DKIM) configurados

### 6. **Testes SEO**

```bash
# Verificar robots.txt
https://seu-dominio.com/robots.txt

# Verificar sitemap
https://seu-dominio.com/sitemap.xml

# Google Mobile-Friendly Test
https://search.google.com/test/mobile-friendly

# PageSpeed Insights
https://pagespeed.web.dev/
```

### 7. **Google Search Console**

1. Acessar: https://search.google.com/search-console
2. Adicionar propriedade com seu domínio
3. Verifica propriedade (DNS ou arquivo HTML)
4. Submeter sitemap:
   ```
   https://seu-dominio.com/sitemap.xml
   ```
5. Acompanhar indexação

### 8. **Troubleshooting**

**Erro 500 - .htaccess inválido**
```bash
# Mover .htaccess e testar
mv .htaccess .htaccess.bak
```

**Imagens não carregam**
```bash
# Verificar permissões
chmod 644 *.webp

# Verificar MIME type
file vslogo.webp
```

**Cursor não aparece**
- Desktop only (verificar media query em styles.css)
- Testar em Chrome/Firefox

**CSS/JS não carregam**
- Verificar console (F12)
- Testar com hard refresh (Ctrl+Shift+R)
- Verificar caminho dos arquivos

### 9. **Monitoramento Contínuo**

**Ferramentas recomendadas:**
- [Uptime Robot](https://uptimerobot.com) - Monitorar disponibilidade
- [Google Analytics](https://analytics.google.com) - Tráfego
- [Google Search Console](https://search.google.com/search-console) - SEO
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Performance

### 10. **Contatos Úteis**

Se tiver problemas com o servidor:
1. Suporte do hosting (geralmente via ticket)
2. Documentação do servidor
3. Logs de erro: `/logs/error_log` ou `/logs/error.log`

---

**✅ Website estará ao vivo após conclusão desses passos!**

Dúvidas? Consulte DEPLOY.md ou PRE_DEPLOY_CHECKLIST.json
