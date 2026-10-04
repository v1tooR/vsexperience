// Versiona CSS e JS locais pelo conteúdo: home.css vira home.css?v=1a2b3c4d.
// Cada mudança gera um endereço novo, então nenhum cache (navegador ou CDN da Hostinger) serve arquivo velho.
// Rode antes de publicar:  node tools/versionar-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'servicos/index.html',
  ...['design-system', 'e-commerce', 'landing-page', 'sistemas-saas', 'site-institucional'].map((s) => `servicos/${s}/index.html`),
];

const hash = (file) => crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
let total = 0;

for (const page of pages) {
  const pagePath = path.join(root, page);
  if (!fs.existsSync(pagePath)) continue;
  let html = fs.readFileSync(pagePath, 'utf8');
  let count = 0;
  // href="…​.css" e src="…​.js" relativos (ignora http, https e //)
  html = html.replace(/(href|src)="(?!https?:|\/\/)([^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (m, attr, ref) => {
    const file = path.join(path.dirname(pagePath), ref);
    if (!fs.existsSync(file)) return m;
    count++;
    return `${attr}="${ref}?v=${hash(file)}"`;
  });
  fs.writeFileSync(pagePath, html);
  total += count;
  console.log(`${page}: ${count} arquivo(s) versionado(s)`);
}
console.log(`pronto: ${total} referência(s)`);
