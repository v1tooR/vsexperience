const fs = require('node:fs');
const file = 'assets/js/home.js';
let source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('  var PT = {};');
const end = source.indexOf('  /* ---------------------------------------------------------------- rolagem suave */');
if (start < 0 || end < start) throw Error('Language routing block not found');
source = source.slice(0, start) + `  // Each language has static HTML and its own canonical URL.
  var lang = document.documentElement.lang === 'en' ? 'en' : 'pt';
  function setLang(next) {
    var destination = next === 'en' ? '/en/' : '/';
    if (next !== lang) location.assign(destination + location.hash);
  }
  $$('[data-lang]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });
  (function initialLang() {
    // Compatibility with old shared links; the server also issues a 301.
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' && lang !== 'en') location.replace('/en/' + location.hash);
    else if (q === 'pt' && lang !== 'pt') location.replace('/' + location.hash);
  })();

` + source.slice(end);
fs.writeFileSync(file, source, 'utf8');
console.log('Language buttons now navigate to static canonical pages.');
