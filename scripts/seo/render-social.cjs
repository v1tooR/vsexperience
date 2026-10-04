// Branded sharing cards rendered from the site's own logo, fonts and gradient.
const fs = require('node:fs');
const path = require('node:path');
const { pages } = require('./pages.cjs');
const { chromium } = require(process.env.VS_PLAYWRIGHT_MODULE || 'C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '../..');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  fs.mkdirSync(path.join(root, 'assets/images/og'), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    // Serve only the repository files in-memory: reproducible without a local web server.
    await page.route('https://vs-seo.local/**', async route => {
      const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
      const file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
      const type = { '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.js': 'application/javascript' }[path.extname(file)] || 'text/plain';
      await route.fulfill({ contentType: type, body: fs.readFileSync(file) });
    });
    for (const p of pages) {
      await page.setContent(`<!DOCTYPE html><html lang="${p.lang || 'pt-BR'}"><head><base href="https://vs-seo.local/"><style>
      @font-face{font-family:Display;src:url('/assets/fonts/roboto-flex-latin.woff2');font-weight:100 1000;font-stretch:25% 151%}
      @font-face{font-family:Body;src:url('/assets/fonts/plus-jakarta-sans-latin.woff2');font-weight:400 700}
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#efefef;color:#212121;overflow:hidden;font-family:Body,sans-serif}
      .visual{position:absolute;top:0;right:0;width:380px;height:630px;background:#aa1f23;overflow:hidden}canvas{width:100%;height:100%}
      .mono{position:absolute;width:205px;top:218px;right:88px;filter:drop-shadow(0 3px 22px #21212133)}
      main{position:relative;width:820px;height:630px;padding:54px 56px;display:flex;flex-direction:column}
      .brand{display:flex;align-items:center;gap:18px;font-size:17px;font-weight:600;letter-spacing:-.4px}.brand img{width:56px;height:43px;object-fit:contain}
      .label{margin-top:65px;display:flex;align-items:center;gap:12px;font-size:15px;font-weight:600}.label:before{content:'';display:block;width:23px;height:3px;background:#ee2324}
      h1{margin:19px 0 21px;font-family:Display,sans-serif;font-size:66px;font-weight:650;line-height:1.06;letter-spacing:-2.4px;font-variation-settings:'wdth' 94,'opsz' 66}
      .sub{font-size:18px;color:#454545;line-height:1.6}.bottom{margin-top:auto;padding-top:28px;border-top:1px solid #21212130;display:flex;align-items:center;justify-content:space-between;font-size:14px}.arrow{color:#ee2324;font-size:27px}
      </style></head><body><div class="visual"><canvas id="gradient"></canvas><img class="mono" src="/assets/images/brand/monograma-linho.svg" alt=""></div>
      <main><div class="brand"><img src="/assets/images/brand/monograma-cadmio.svg" alt="VS">Victor Santos · VS Experience</div><div class="label">${esc(p.label)}</div><h1>${esc(p.heading).replace(/\n/g, '<br>')}</h1><div class="sub">${esc(p.sub)}</div><div class="bottom"><span>vsexperience.com.br${p.lang ? '/en/' : ''}</span><span class="arrow">↗</span></div></main>
      <script src="/assets/js/vs-gradient.js"></script></body></html>`, { waitUntil: 'load' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images).map(img => img.decode()));
        const gradient = VSGradient.create(document.querySelector('canvas'), 'rasgo', { scale: 1, speed: 0 });
        gradient.pause(); gradient.draw(0);
      });
      const overflow = await page.locator('h1').evaluate(el => el.scrollWidth > el.clientWidth || el.getBoundingClientRect().bottom > 475);
      if (overflow) throw Error('Sharing card text overflow: ' + p.key);
      await page.screenshot({ path: path.join(root, 'assets/images/og', p.key + '-vs.jpg'), type: 'jpeg', quality: 91 });
      console.log('Rendered ' + p.key + '-vs.jpg (1200x630)');
    }
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
