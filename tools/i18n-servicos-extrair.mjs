// Lista os textos traduzíveis das páginas de serviço (texto visível, atributos e JSON-LD).
// Uso: node tools/i18n-servicos-extrair.mjs  → mostra o que ainda falta no dicionário
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, collectStrings, loadDict } from './i18n-servicos-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dict = loadDict(root);
const missing = {};
let total = 0;
for (const p of PAGES) {
  const html = fs.readFileSync(path.join(root, p.pt), 'utf8');
  const list = collectStrings(html).filter((s) => !(s in dict));
  total += list.length;
  if (list.length) missing[p.pt] = list;
}
const out = process.argv[2];
if (out) fs.writeFileSync(out, JSON.stringify(missing, null, 1));
console.log(total ? `${total} texto(s) sem tradução` : 'tudo traduzido');
