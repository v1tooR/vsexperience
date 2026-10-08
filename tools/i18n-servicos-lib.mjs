// Base da versão em inglês das páginas de serviço: textos, valores em dólar e links.
import fs from 'node:fs';
import path from 'node:path';

export const SITE = 'https://vsexperience.com.br';

// páginas em português e o endereço equivalente em inglês
export const PAGES = [
  { pt: 'servicos/index.html', en: 'en/services/index.html', ptUrl: '/servicos/', enUrl: '/en/services/' },
  { pt: 'servicos/landing-page/index.html', en: 'en/services/landing-page/index.html', ptUrl: '/servicos/landing-page/', enUrl: '/en/services/landing-page/' },
  { pt: 'servicos/site-institucional/index.html', en: 'en/services/institutional-website/index.html', ptUrl: '/servicos/site-institucional/', enUrl: '/en/services/institutional-website/' },
  { pt: 'servicos/e-commerce/index.html', en: 'en/services/e-commerce/index.html', ptUrl: '/servicos/e-commerce/', enUrl: '/en/services/e-commerce/' },
  { pt: 'servicos/sistemas-saas/index.html', en: 'en/services/saas-systems/index.html', ptUrl: '/servicos/sistemas-saas/', enUrl: '/en/services/saas-systems/' },
  { pt: 'servicos/design-system/index.html', en: 'en/services/design-system/index.html', ptUrl: '/servicos/design-system/', enUrl: '/en/services/design-system/' },
];
const URL_MAP = new Map([['/', '/en/'], ...PAGES.map((p) => [p.ptUrl, p.enUrl])]);
export const toEnPath = (p) => URL_MAP.get(p) || URL_MAP.get(p.replace(/index\.html$/, '')) || p;

/* ---------------------------------------------------------------- valores
   Clientes de fora pagam em dólar: conversão pela cotação de referência, com um desconto
   para ficar um pouco abaixo da conversão direta. Ajuste aqui e gere de novo. */
export const USD = { rate: 5.0, discount: 0.10 }; // US$ 1 = R$ 5,00 (08/10/2026); 10% abaixo da conversão
export function brlToUsd(brl, hasCents) {
  const v = (brl / USD.rate) * (1 - USD.discount);
  if (hasCents) return Math.floor(v) + 0.9; // preços de vitrine nos mockups: 23,90
  if (v >= 1000) return Math.round(v / 50) * 50;
  if (v >= 100) return Math.round(v / 10) * 10;
  return Math.max(1, Math.round(v));
}
const fmt = (n) => (Number.isInteger(n) ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
// "R$ 1.260", "R$ 129,90", "R$ 64,2 mil" → "$230", "$23.90", "$11.6k"
export function convertPrices(text) {
  // símbolo e número em elementos separados (campo de valor nos mockups): <span>R$</span>480
  text = text.replace(/R\$(<\/span>)(\d{1,3}(?:\.\d{3})*)/g, (m, tag, n) => '$' + tag + fmt(brlToUsd(parseFloat(n.replace(/\./g, '')), false)));
  // preço dos planos: "R$ 750 <em>a</em> 1.090", o segundo número vem sem o símbolo
  const num = (n) => fmt(brlToUsd(parseFloat(n.replace(/\./g, '')), false));
  text = text.replace(/R\$\s?(\d{1,3}(?:\.\d{3})*)(\s*<em>)a(<\/em>\s*)(\d{1,3}(?:\.\d{3})*)/g, (m, a, o, c, b) => '$' + num(a) + o + 'to' + c + num(b));
  text = text.replace(/R\$\s?(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d+))?(\s?mil\b)?/g, (m, int, dec, mil) => {
    const n = parseFloat(int.replace(/\./g, '') + (dec ? '.' + dec : ''));
    if (mil) {
      const k = (n * 1000 / USD.rate) * (1 - USD.discount) / 1000;
      return '$' + k.toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return '$' + fmt(brlToUsd(n, !!dec && dec !== '00'));
  });
  // faixas que ficaram sem palavra para traduzir: "$140 a $320" → "$140 to $320"
  return text.replace(/(\$[\d,.]+k?) a (\$)/g, '$1 to $2');
}

/* ---------------------------------------------------------------- dicionário */
// um arquivo por página em tools/i18n/ (servicos-en-*.json), todos somados num dicionário só
export function loadDict(root) {
  const dir = path.join(root, 'tools/i18n');
  const dict = {};
  if (!fs.existsSync(dir)) return dict;
  for (const f of fs.readdirSync(dir).filter((f) => /^servicos-en.*.json$/.test(f)).sort()) Object.assign(dict, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  return dict;
}

/* ---------------------------------------------------------------- leitura do HTML
   Percorre o documento em pedaços: blocos de script/estilo/comentário, tags e texto. */
const TOKEN = /(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>|[^<]+)/g;
const TEXT_ATTRS = ['alt', 'aria-label', 'title', 'placeholder', 'data-whatsapp', 'data-label', 'data-title'];
const META_TEXT = /^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)$/;
const hasWords = (s) => /[A-Za-zÀ-ÿ]{2,}/.test(s);

function metaKey(tag) {
  const m = tag.match(/\s(?:name|property)="([^"]+)"/);
  return m ? m[1] : '';
}
function jsonStrings(node, out) {
  if (typeof node === 'string') { if (hasWords(node) && !/^https?:|^@|^[A-Z][a-zA-Z]+$/.test(node) && /\s/.test(node)) out.push(node); return; }
  if (Array.isArray(node)) { node.forEach((n) => jsonStrings(n, out)); return; }
  if (node && typeof node === 'object') for (const k of Object.keys(node)) if (!['@type', '@id', '@context', 'url', 'priceCurrency', 'inLanguage'].includes(k)) jsonStrings(node[k], out);
}

export function collectStrings(html) {
  const out = [];
  for (const [tok] of html.matchAll(TOKEN)) {
    if (tok.startsWith('<script')) {
      if (/application\/ld\+json/.test(tok)) jsonStrings(JSON.parse(tok.replace(/^<script[^>]*>|<\/script>$/g, '')), out);
      continue;
    }
    if (tok.startsWith('<style') || tok.startsWith('<!--')) continue;
    if (tok.startsWith('<')) {
      for (const a of TEXT_ATTRS) { const m = tok.match(new RegExp('\\s' + a + '="([^"]*)"')); if (m && hasWords(m[1])) out.push(m[1]); }
      if (/^<meta\b/.test(tok) && META_TEXT.test(metaKey(tok))) { const m = tok.match(/\scontent="([^"]*)"/); if (m && hasWords(m[1])) out.push(m[1]); }
      continue;
    }
    const t = tok.trim();
    if (t && hasWords(t)) out.push(t);
  }
  return [...new Set(out)];
}

/* ---------------------------------------------------------------- tradução de uma página */
export function translatePage(html, page, dict, missing) {
  const tr = (s) => {
    if (s in dict) return dict[s];
    missing.add(s);
    return s;
  };
  const mapUrl = (ref) => {
    if (!ref || /^(#|mailto:|tel:|data:|javascript:)/.test(ref)) return ref;
    if (/^https?:\/\//.test(ref)) {
      if (!ref.startsWith(SITE)) return ref;
      const u = new URL(ref);
      return SITE + toEnPath(u.pathname) + u.search + u.hash;
    }
    const u = new URL(ref, SITE + page.ptUrl);
    return toEnPath(u.pathname) + u.search + u.hash;
  };
  const mapJsonUrls = (node) => {
    if (typeof node === 'string') return /^https?:\/\//.test(node) ? mapUrl(node) : node;
    if (Array.isArray(node)) return node.map(mapJsonUrls);
    if (node && typeof node === 'object') {
      const o = {};
      for (const [k, v] of Object.entries(node)) {
        if (k === 'priceCurrency' && v === 'BRL') o[k] = 'USD';
        else if (['price', 'minPrice', 'maxPrice', 'lowPrice', 'highPrice'].includes(k) && typeof v === 'number') o[k] = brlToUsd(v, false);
        else if (k === 'inLanguage') o[k] = 'en';
        else o[k] = mapJsonUrls(v);
      }
      return o;
    }
    return node;
  };
  const trJson = (node) => {
    if (typeof node === 'string') { const tmp = []; jsonStrings(node, tmp); return tmp.length ? tr(node) : node; }
    if (Array.isArray(node)) return node.map(trJson);
    if (node && typeof node === 'object') {
      const o = {};
      for (const [k, v] of Object.entries(node)) o[k] = ['@type', '@id', '@context', 'url', 'priceCurrency', 'inLanguage'].includes(k) ? v : trJson(v);
      return o;
    }
    return node;
  };

  let out = html.replace(TOKEN, (tok) => {
    if (tok.startsWith('<script')) {
      if (!/application\/ld\+json/.test(tok)) return tok.replace(/(\ssrc=")([^"]+)(")/, (m, a, v, b) => a + mapUrl(v) + b);
      const open = tok.match(/^<script[^>]*>/)[0];
      const data = mapJsonUrls(trJson(JSON.parse(tok.slice(open.length, -'</script>'.length))));
      return open + '\n' + JSON.stringify(data, null, 2).replace(/^/gm, '  ') + '\n  </script>';
    }
    if (tok.startsWith('<style') || tok.startsWith('<!--')) return tok;
    if (tok.startsWith('<')) {
      let t = tok;
      for (const a of TEXT_ATTRS) t = t.replace(new RegExp('(\\s' + a + '=")([^"]*)(")'), (m, x, v, y) => (hasWords(v) ? x + tr(v) + y : m));
      if (/^<meta\b/.test(t) && META_TEXT.test(metaKey(t))) t = t.replace(/(\scontent=")([^"]*)(")/, (m, x, v, y) => (hasWords(v) ? x + tr(v) + y : m));
      // links e arquivos: endereços absolutos a partir da raiz; páginas de serviço e home apontam para a versão em inglês
      t = t.replace(/(\s(?:href|src|data-preview)=")([^"]*)(")/g, (m, x, v, y) => x + mapUrl(v) + y);
      if (/^<meta\b/.test(t) && /property="og:url"/.test(t)) t = t.replace(/(\scontent=")([^"]*)(")/, (m, x, v, y) => x + mapUrl(v) + y);
      return t;
    }
    const s = tok.trim();
    // faixas numéricas curtas, como "10 a 15", não têm palavra para o dicionário
    if (s && /^\d+(?:[.,]\d+)? a \d+(?:[.,]\d+)?$/.test(s)) return tok.replace(s, () => s.replace(' a ', ' to '));
    if (!s || !hasWords(s)) return tok;
    return tok.replace(s, () => tr(s));
  });

  out = out.replace('<html lang="pt-BR">', '<html lang="en">');
  out = out.replace(/<meta property="og:locale" content="pt_BR">/, '<meta property="og:locale" content="en_US">');
  return convertPrices(out);
}
