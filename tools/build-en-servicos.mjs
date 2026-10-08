// Gera a versão em inglês das páginas de serviço (/en/services/…) a partir das páginas em português.
// Textos: tools/i18n/servicos-en-*.json · valores em dólar: USD em tools/i18n-servicos-lib.mjs
// Uso: node tools/build-en-servicos.mjs   (depois: node tools/versionar-assets.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITE, loadDict, translatePage, toEnPath } from './i18n-servicos-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dict = loadDict(root);

// seletor de idioma no cabeçalho, igual nas duas versões, com o idioma atual marcado
const langSwitch = (p, current) => `<div class="lang-switch" role="group" aria-label="${current === 'en' ? 'Language' : 'Idioma'}"><a href="${p.ptUrl}" lang="pt-BR" hreflang="pt-BR"${current === 'pt' ? ' aria-current="true"' : ''}>PT</a><a href="${p.enUrl}" lang="en" hreflang="en"${current === 'en' ? ' aria-current="true"' : ''}>EN</a></div>\n      `;
const alternates = (p) => `\n  <link rel="alternate" hreflang="pt-BR" href="${SITE}${p.ptUrl}">\n  <link rel="alternate" hreflang="en" href="${SITE}${p.enUrl}">\n  <link rel="alternate" hreflang="x-default" href="${SITE}${p.ptUrl}">`;
const stripI18n = (html) => html
  .replace(/\n\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+">/g, '')
  .replace(/<div class="lang-switch"[\s\S]*?<\/div>\n\s*/, '');
const addI18n = (html, p, current) => {
  const canon = html.match(/<link rel="canonical" href="[^"]+">/);
  if (!canon) throw new Error('canonical nao encontrado');
  html = html.replace(canon[0], () => canon[0] + alternates(p));
  if (!html.includes('<nav class="nav-links"')) throw new Error('nav-links nao encontrado');
  return html.replace('<nav class="nav-links"', () => langSwitch(p, current) + '<nav class="nav-links"');
};

const missing = new Set();
for (const p of PAGES) {
  const ptFile = path.join(root, p.pt);
  const base = stripI18n(fs.readFileSync(ptFile, 'utf8'));
  // português: só garante o seletor e os links entre as versões
  fs.writeFileSync(ptFile, addI18n(base, p, 'pt'));
  // inglês: traduz, converte valores e aponta links para as versões em inglês
  const en = addI18n(translatePage(base, p, dict, missing), p, 'en');
  const enFile = path.join(root, p.en);
  fs.mkdirSync(path.dirname(enFile), { recursive: true });
  fs.writeFileSync(enFile, en);
  console.log('ok', p.en);
}

// a home em inglês passa a apontar para os serviços em inglês
const enHome = path.join(root, 'en/index.html');
if (fs.existsSync(enHome)) {
  let h = fs.readFileSync(enHome, 'utf8');
  h = h.replace(/(href=")(\/servicos\/[^"#]*)/g, (m, a, u) => a + toEnPath(u));
  h = h.replace(/("(?:url|@id)":\s*")https:\/\/vsexperience\.com\.br(\/servicos\/[^"#]*)/g, (m, a, u) => a + SITE + toEnPath(u));
  fs.writeFileSync(enHome, h);
  console.log('ok en/index.html (links de serviços)');
}

if (missing.size) {
  console.log(`\n${missing.size} texto(s) sem tradução (ficaram em português):`);
  [...missing].slice(0, 30).forEach((s) => console.log(' -', s.slice(0, 100)));
}
