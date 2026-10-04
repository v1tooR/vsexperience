// Rebuild SEO and the static English homepage from the Portuguese source.
// Run from the repository root: node scripts/seo/build.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { origin, pages } = require('./pages.cjs');
const root = path.resolve(__dirname, '../..');
const playwright = require(process.env.VS_PLAYWRIGHT_MODULE || 'C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const date = '2026-10-04'; // Change only when these pages are materially updated.
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), s, 'utf8'); };
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function head(html, p) {
  let h = html.slice(0, html.indexOf('</head>'));
  const tail = html.slice(html.indexOf('</head>'));
  h = h.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(p.title) + '</title>');
  function tag(selector, value, markup) {
    if (selector.test(h)) h = h.replace(selector, markup(value));
    else h += '\n  ' + markup(value) + '\n';
  }
  function meta(attr, name, value) { tag(new RegExp('<meta\\s+[^>]*' + attr + '="' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>', 'g'), value, v => '<meta ' + attr + '="' + name + '" content="' + esc(v) + '">'); }
  function link(rel, href) { tag(new RegExp('<link\\s+[^>]*rel="' + rel + '"[^>]*>', 'g'), href, v => '<link rel="' + rel + '" href="' + v + '">'); }
  meta('name', 'description', p.description);
  meta('name', 'author', 'Victor Santos');
  meta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  meta('name', 'theme-color', '#efefef');
  link('canonical', p.url);
  for (const [name, value] of Object.entries({ type: 'website', site_name: 'VS Experience', url: p.url, title: p.title, description: p.description, image: p.image, 'image:secure_url': p.image, 'image:type': 'image/jpeg', 'image:width': '1200', 'image:height': '630', 'image:alt': p.alt, locale: p.lang === 'en' ? 'en_US' : 'pt_BR' })) meta('property', 'og:' + name, value);
  for (const [name, value] of Object.entries({ card: 'summary_large_image', title: p.title, description: p.description, image: p.image, 'image:alt': p.alt })) meta('name', 'twitter:' + name, value);
  if (p.key === 'home' || p.key === 'home-en') {
    h = h.replace(/<link\s+[^>]*rel="alternate"[^>]*>\s*/g, '');
    h += '\n  <link rel="alternate" hreflang="pt-BR" href="' + origin + '/">\n  <link rel="alternate" hreflang="en" href="' + origin + '/en/">\n  <link rel="alternate" hreflang="x-default" href="' + origin + '/">\n';
    meta('property', 'og:locale:alternate', p.lang === 'en' ? 'pt_BR' : 'en_US');
  }
  if (p.key === 'bio') {
    link('icon', '/assets/images/brand/favicon.svg');
    link('apple-touch-icon', '/assets/images/brand/apple-touch-icon.png');
  }
  h = h.replace(/^[ \t]+(?=\r?$)/gm, '').replace(/\n(?:[ \t]*\r?\n){2,}/g, '\n\n').trimEnd() + '\n';
  return (h + tail).replace(/(href|src)="(?!https?:|\/\/)([^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (match, attr, ref) => {
    const asset = ref.startsWith('/') ? path.join(root, ref.slice(1)) : path.resolve(root, path.dirname(p.file), ref);
    if (!fs.existsSync(asset)) return match;
    const version = crypto.createHash('md5').update(fs.readFileSync(asset)).digest('hex').slice(0, 8);
    return attr + '="' + ref + '?v=' + version + '"';
  });
}
function schema(html, p) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
  const match = html.match(re);
  const data = match ? JSON.parse(match[1]) : { '@context': 'https://schema.org', '@graph': [] };
  const graph = data['@graph'];
  function walk(obj) {
    if (!obj || typeof obj !== 'object') return;
    // ProfessionalService was deprecated; the studio is an Organization.
    if (obj['@type'] === 'ProfessionalService') obj['@type'] = 'Organization';
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && /(?:capaseo\.webp|servicos\/assets\/og\/[^/]+\.jpg)$/.test(v)) obj[k] = p.image;
      else if (k === 'dateModified') obj[k] = date;
      else walk(v);
    }
    // The top plan is open-ended; an AggregateOffer highPrice would imply a cap.
    if (obj['@type'] === 'Service' && obj.offers?.['@type'] === 'AggregateOffer') delete obj.offers;
  }
  walk(data);
  let page = graph.find(n => ['WebPage', 'CollectionPage', 'ProfilePage'].includes(n['@type']));
  if (!page) {
    page = { '@type': p.key === 'bio' ? 'ProfilePage' : 'WebPage', '@id': p.url + '#webpage', url: p.url, isPartOf: { '@id': origin + '/#website' }, mainEntity: { '@id': origin + '/#person' }, author: { '@id': origin + '/#person' }, publisher: { '@id': origin + '/#service' } };
    graph.unshift(page);
  }
  Object.assign(page, { name: p.title, description: p.description, inLanguage: p.lang === 'en' ? 'en' : 'pt-BR', dateModified: date, primaryImageOfPage: { '@type': 'ImageObject', url: p.image, width: 1200, height: 630 } });
  const service = graph.find(n => n['@type'] === 'Service');
  if (service) service.description = p.description;
  if (p.key === 'home') {
    graph.find(n => n['@type'] === 'WebSite').description = p.description;
    graph.find(n => n['@type'] === 'WebSite').publisher = { '@id': origin + '/#service' };
    const organization = graph.find(n => n['@type'] === 'Organization');
    organization.logo = { '@type': 'ImageObject', url: origin + '/assets/images/brand/apple-touch-icon.png', width: 180, height: 180 };
    organization.telephone = '+5512991833641';
    organization.contactPoint = { '@type': 'ContactPoint', contactType: 'customer service', url: 'https://api.whatsapp.com/send?phone=5512991833641', availableLanguage: ['Portuguese', 'English'] };
  }
  if (p.key === 'bio') {
    const home = JSON.parse(read('index.html').match(re)[1]);
    const person = home['@graph'].find(n => n['@type'] === 'Person');
    const current = graph.findIndex(n => n['@type'] === 'Person');
    if (current >= 0) graph[current] = person;
    else graph.push(person);
  }
  const script = '<script type="application/ld+json">\n' + JSON.stringify(data, null, 2) + '\n  </script>';
  return match ? html.replace(re, script) : html.replace('</head>', script + '\n</head>');
}
(async () => {
  for (const p of pages.filter(p => !p.lang)) write(p.file, schema(head(read(p.file), p), p));
  const js = read('assets/js/home.js');
  const EN = vm.runInNewContext('(' + js.match(/var EN = (\{[\s\S]*?\n  \});/)[1] + ')');
  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const tab = await browser.newPage();
    let en = await tab.evaluate(({ source, EN, origin }) => {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      const missing = [];
      doc.documentElement.lang = 'en';
      doc.querySelectorAll('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if (EN[key] != null) el.innerHTML = EN[key]; else if (!['svc.ec', 'svc.ds'].includes(key)) missing.push(key); });
      if (missing.length) throw Error('Missing translations: ' + missing.join(', '));
      doc.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => { const [attr, key] = pair.split(':'); if (EN[key] != null) el.setAttribute(attr, EN[key]); }));
      doc.querySelectorAll('[data-wa]').forEach(el => { if (EN[el.dataset.wa]) el.href = 'https://api.whatsapp.com/send?phone=5512991833641&text=' + encodeURIComponent(EN[el.dataset.wa]); });
      doc.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.lang === 'en')));
      doc.querySelectorAll('blockquote').forEach(el => el.lang = 'pt-BR'); // Preserve original client quotations.
      doc.querySelectorAll('[href], [src], [srcset]').forEach(el => ['href', 'src'].forEach(attr => { const v = el.getAttribute(attr); if (v && !/^(?:[a-z]+:|\/|#)/i.test(v)) el.setAttribute(attr, '/' + v); }));
      doc.querySelectorAll('style').forEach(el => el.textContent = el.textContent.replace(/url\(assets\//g, 'url(/assets/'));
      const schema = doc.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(schema.textContent);
      const page = data['@graph'].find(n => n['@type'] === 'WebPage');
      page['@id'] = origin + '/en/#webpage'; page.url = origin + '/en/';
      const faq = data['@graph'].find(n => n['@type'] === 'FAQPage');
      faq['@id'] = origin + '/en/#faq'; faq.inLanguage = 'en';
      const plain = text => { const el = doc.createElement('div'); el.innerHTML = text; return el.textContent; };
      faq.mainEntity = Array.from({ length: 8 }, (_, i) => ({ '@type': 'Question', name: plain(EN['fq.q' + (i + 1)]), acceptedAnswer: { '@type': 'Answer', text: plain(EN['fq.a' + (i + 1)]) } }));
      schema.textContent = JSON.stringify(data, null, 2);
      return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML + '\n';
    }, { source: read('index.html'), EN, origin });
    const p = pages.find(p => p.lang);
    en = schema(head(en, p), p);
    // The global brand's social image is the Portuguese one; this page uses its localized card.
    en = en.replaceAll(pages[0].image, p.image);
    write(p.file, en);
  } finally { await browser.close(); }
  const alternates = '<xhtml:link rel="alternate" hreflang="pt-BR" href="' + origin + '/"/><xhtml:link rel="alternate" hreflang="en" href="' + origin + '/en/"/><xhtml:link rel="alternate" hreflang="x-default" href="' + origin + '/"/>';
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + pages.map(p => '  <url><loc>' + p.url + '</loc><lastmod>' + date + '</lastmod>' + (p.key.startsWith('home') ? alternates : '') + '</url>').join('\n') + '\n</urlset>\n';
  write('sitemap.xml', sitemap); write('config/sitemap.xml', sitemap);
  const robots = '# VS Experience\nUser-agent: *\nAllow: /\n\n# Internal files. Proposals remain crawlable so their noindex header can be read.\n' + ['/config/', '/docs/', '/scripts/', '/tools/', '/tmp/', '/.git/', '/.agents/', '/.codex/', '/.claude/', '/.cursor/', '/.gemini/', '/.impeccable/', '/*.md$'].map(p => 'Disallow: ' + p).join('\n') + '\n\nSitemap: ' + origin + '/sitemap.xml\n';
  write('robots.txt', robots); write('config/robots.txt', robots);
  const config = JSON.parse(read('config/config.json'));
  Object.assign(config.site, { url: origin + '/', description: pages[0].description, 'theme-color': '#efefef' });
  config.seo.canonical = origin + '/';
  Object.assign(config.social, { 'og:image': pages[0].image, 'og:image:type': 'image/jpeg' });
  config.build.lastUpdated = date;
  write('config/config.json', JSON.stringify(config, null, 2) + '\n');
  console.log('Built SEO for ' + pages.length + ' canonical pages, including static /en/.');
})().catch(err => { console.error(err); process.exitCode = 1; });
