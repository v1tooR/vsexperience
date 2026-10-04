// Validate indexable HTML, canonical relationships, social cards and locale routing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { origin, pages } = require('./pages.cjs');
const { chromium } = require(process.env.VS_PLAYWRIGHT_MODULE || 'C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.VS_SEO_BASE || 'http://127.0.0.1:5173';
const root = path.resolve(__dirname, '../..');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = [];
  try {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const tab = await context.newPage();
    const checked = new Set();
    const titles = new Set(), descriptions = new Set();
    for (const p of pages) {
      const response = await tab.goto(base + p.path);
      assert.equal(response.status(), 200, p.path);
      const d = await tab.evaluate(() => {
        const meta = selector => document.querySelector(selector)?.content;
        return { title: document.title, description: meta('meta[name="description"]'), language: document.documentElement.lang,
          canonical: document.querySelector('link[rel="canonical"]')?.href, ogURL: meta('meta[property="og:url"]'),
          image: meta('meta[property="og:image"]'), imageAlt: meta('meta[property="og:image:alt"]'), imageType: meta('meta[property="og:image:type"]'),
          width: meta('meta[property="og:image:width"]'), height: meta('meta[property="og:image:height"]'), twitter: meta('meta[name="twitter:image"]'),
          robots: meta('meta[name="robots"]'), h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim()),
          schemas: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(el => JSON.parse(el.textContent)),
          alternates: Array.from(document.querySelectorAll('link[hreflang]')).map(el => [el.hreflang, el.href]),
          localAssets: Array.from(document.querySelectorAll('img[src],script[src],link[href]')).flatMap(el => [el.getAttribute('src') || el.getAttribute('href')]).filter(Boolean),
          anchors: Array.from(document.querySelectorAll('a[href]')).map(el => el.getAttribute('href')).filter(v => v && !/^(?:[a-z]+:|\/\/)/i.test(v)),
          faqs: Array.from(document.querySelectorAll('details')).map(el => ({ question: el.querySelector('summary')?.textContent.trim(), answer: el.querySelector('p')?.textContent.trim() })).filter(q => q.question && q.answer)
        };
      });
      assert.equal(d.title, p.title); assert.equal(d.description, p.description);
      assert(!titles.has(d.title)); titles.add(d.title); assert(!descriptions.has(d.description)); descriptions.add(d.description);
      assert.equal(d.canonical, p.url); assert.equal(d.ogURL, p.url); assert.equal(d.image, p.image); assert.equal(d.twitter, p.image);
      assert.equal(d.language, p.lang || 'pt-BR'); assert.equal(d.imageType, 'image/jpeg'); assert(d.imageAlt); assert.equal(d.width, '1200'); assert.equal(d.height, '630');
      assert(d.robots.includes('index') && !d.robots.includes('noindex')); assert.equal(d.h1.length, 1, 'One H1: ' + p.path);
      const graph = d.schemas.flatMap(s => s['@graph'] || [s]);
      assert(graph.some(s => ['WebPage', 'CollectionPage', 'ProfilePage'].includes(s['@type']) && s.url === p.url));
      for (const faq of graph.filter(s => s['@type'] === 'FAQPage')) {
        for (const q of faq.mainEntity) {
          const visible = d.faqs.find(f => f.question === q.name);
          assert(visible, 'FAQ question absent from page ' + p.path + ': ' + q.name);
          assert.equal(visible.answer.replace(/\s+/g, ' '), q.acceptedAnswer.text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), 'FAQ answer: ' + p.path);
        }
      }
      if (p.key.startsWith('home')) assert.deepEqual(d.alternates, [['pt-BR', origin + '/'], ['en', origin + '/en/'], ['x-default', origin + '/']]);
      for (const asset of [...d.localAssets, p.image]) {
        const url = new URL(asset, base + p.path);
        if (![new URL(base).origin, origin].includes(url.origin)) continue;
        const local = base + url.pathname + url.search;
        if (checked.has(local)) continue;
        checked.add(local);
        const res = await context.request.get(local);
        assert.equal(res.status(), 200, 'Asset missing: ' + local);
      }
      for (const href of d.anchors) {
        const url = new URL(href, base + p.path);
        if (url.origin !== new URL(base).origin) continue;
        const local = base + url.pathname;
        if (url.pathname === p.path && url.hash) {
          assert(await tab.evaluate(id => !!document.getElementById(id), decodeURIComponent(url.hash.slice(1))), 'Broken anchor: ' + p.path + href);
        } else if (!checked.has(local)) {
          checked.add(local); const res = await context.request.get(local); assert.equal(res.status(), 200, 'Broken internal link: ' + local);
        }
      }
      const dims = await tab.evaluate(async imageURL => { const img = new Image(); img.src = imageURL; await img.decode(); return [img.naturalWidth, img.naturalHeight]; }, base + new URL(p.image).pathname);
      assert.deepEqual(dims, [1200, 630]);
      report.push({ path: p.path, status: 'pass', noJavaScript: true, socialImage: p.image, h1: d.h1[0] });
      console.log('PASS ' + p.path + ' — metadata, schema, links, assets and sharing image');
    }
    const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length);
    for (const p of pages) assert(sitemap.includes('<loc>' + p.url + '</loc>'));
    for (const file of ['robots.txt', 'sitemap.xml', '.htaccess']) assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), fs.readFileSync(path.join(root, 'config', file), 'utf8'), 'Config mirror: ' + file);
    assert.equal((await context.request.get(base + '/seo-route-that-does-not-exist')).status(), 404);
    await context.close();
    const live = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await live.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await live.addInitScript(() => localStorage.setItem('vs-lang', 'en'));
    await page.goto(base + '/#faq');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR', 'Stored preferences must not override canonical locale');
    await page.locator('[data-lang="en"]').first().click();
    await page.waitForURL('**/en/#faq');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.title(), pages.find(p => p.lang).title);
    await page.locator('[data-lang="pt"]').first().click();
    await page.waitForURL(base + '/#faq');
    await page.goto(base + '/?lang=en#cases');
    await page.waitForURL('**/en/#cases');
    assert.deepEqual(errors, [], 'Home JavaScript errors');
    console.log('PASS language navigation, legacy query fallback, sitemap, mirrors and 404');
    fs.writeFileSync(path.join(root, 'docs/seo-validation.json'), JSON.stringify({ checkedAt: new Date().toISOString(), environment: 'local Python HTTP server; Apache rules require production verification', pages: report, distinctResourcesChecked: checked.size, runtimeErrors: errors, languageNavigation: 'pass', sitemap: 'pass', unknownRoute: 404 }, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
