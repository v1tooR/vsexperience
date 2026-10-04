/* VS · Home do ecossistema: idioma, portal, frentes, espécimes, processo, cases e avaliações. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (n, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, n)); };
  // cada quadro lê todas as caixas de uma vez, antes de qualquer escrita: um cálculo de layout por quadro, não vários
  var rects = new Map();
  function rect(el) { var r = rects.get(el); if (!r) { r = el.getBoundingClientRect(); rects.set(el, r); } return r; }
  // escritas que só tocam o DOM quando o valor muda (quadros parados ficam quase de graça)
  function setAttr(el, name, v) { var k = '_a' + name; if (el[k] !== v) { el[k] = v; el.setAttribute(name, v); } }
  function setVar(el, name, v) { var k = '_v' + name; if (el[k] !== v) { el[k] = v; el.style.setProperty(name, v); } }
  // nível de desempenho decidido no <head> (núcleos, memória, economia de dados)
  var perfLow = document.documentElement.classList.contains('perf-low');
  var smooth = function (a, b, n) { var t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wide = window.matchMedia('(min-width: 901px)');
  var WA = 'https://api.whatsapp.com/send?phone=5512991833641&text=';

  /* ---------------------------------------------------------------- idioma */
  var EN = {
    "meta.socialTitle": "Victor Santos · Experiences to validate, convert and scale",
    "meta.socialDesc": "I connect business thinking, design and development to build and improve digital experiences. Explore the work and let’s talk.",
    "hero.signature": "Clarity to decide. Care to build.",
    "fq.a8": "Yes. Through the Victor Santos consulting practice, I review the existing experience and help prioritise improvements. If you need design or development, we can scope a project with VS Experience. The right path depends on the diagnosis.",
    "fq.q8": "I already have a website. Can you help improve it?",
    "ps.s3": "Interface design",
    "svc.ds.desc": "A shared foundation for your product to grow consistently.",
    "svc.saas.desc": "Workflows that make sense for users and for your business.",
    "svc.ec.desc": "A purchase journey that is easy to follow, from discovery to payment.",
    "svc.inst.desc": "A presence that communicates your value and builds trust before the first meeting.",
    "svc.lp.desc": "A clear offer and a direct path to an enquiry or purchase.",
    'skip': 'Skip to content',
    'nav.fronts': "How I can help", 'nav.process': 'Process', 'nav.cases': "Work", 'nav.about': 'About',
    'nav.services': 'Services & pricing', 'nav.cta': 'Let’s talk', 'nav.menu': 'Menu', 'nav.open': 'Menu', 'nav.close': 'Close', 'nav.label': 'VS ecosystem', 'nav.wa': 'Chat on WhatsApp', 'lang.label': 'Language',
    'hero.title': "Creating distinctive experiences. Built to validate, convert and scale.",
    'hero.lede': "I bring strategy, UX/UI and development together to create websites and digital products that communicate your value, make decisions easier and support your business growth.",
    'hero.cta': "Let’s discuss my project", 'hero.cases': "Explore the work", 'hero.specName': 'Monogram', 'hero.scroll': "Explore how I can help",
    'after.title': "Your business shapes<br>where we start.",
    'after.lede': "An idea to bring to life or an experience to improve? Across both sides of the VS ecosystem, I connect what your business needs with what your customers expect.",
    'after.r1': 'Audits and consulting', 'after.r2': 'Websites, apps and design systems',
    'fronts.title': "How I can help your business",
    'fronts.a.role': 'Audits and consulting',
    'fronts.a.lede': "Your website or product is already live, but people get confused, enquiries fall through or your team is unsure where to start? I help identify barriers and decide what needs attention first.",
    'fronts.a.i1': "Experience and conversion journey reviews", 'fronts.a.i2': "Guidance on product and interface decisions", 'fronts.a.i3': "Priorities your team can understand and act on",
    'fronts.a.cta': "Let’s discuss consulting",
    'fronts.b.role': 'Websites, apps and design systems',
    'fronts.b.lede': "To turn an idea into an experience people can use. I handle strategy, design and development, with your business goal guiding every stage.",
    'fronts.b.cta': 'See services and pricing', 'fronts.b.cta2': "Let’s discuss my project",
    'svc.lp': "Landing page", 'svc.inst': "Company website", 'svc.saas': 'Systems & SaaS',
    'pr.title': "Design that builds trust. Experiences that move people forward.",
    'pr.lede': "When people understand your offer, find what they need and know what to do next, the experience works for your business. That is why I start with your goal, audience and message. Design and code bring that direction to life.",
    'pr.w1': 'Clarity', 'pr.d1': "Your customers understand what you offer and what to do next.",
    'pr.w2': 'Consistency', 'pr.d2': "Your brand carries the same quality across every screen and interaction.",
    'pr.w3': 'Results', 'pr.d3': "Every decision serves a goal: generating enquiries, selling or making the product easier to use.",
    'ps.title': "Clarity at every stage. Care in every delivery.",
    'ps.s1': 'Diagnosis', 'ps.s1b': "business, audience and goal",
    'ps.s1d': "I learn what you offer, who it is for and what needs to improve. We define the goal, priorities and scope before designing the solution.",
    'ps.s2': "Structure and narrative", 'ps.s2d': "I organise content, navigation and workflows so people can find the information and actions they need to move forward.",
    'ps.s3b': "identity and consistency", 'ps.s3d': "I translate your identity into clear screens and consistent components, with attention to reading, interaction and mobile use.",
    'ps.s4': "Development and refinement", 'ps.s4d': "I build the experience faithfully to the design, with attention to loading speed and the integrations agreed in the scope.",
    'ps.s5': "Validation and delivery", 'ps.s5d': "I review navigation, content and functionality before delivery. Real usage and feedback help guide future adjustments, within the agreed scope.",
    'ps.note': "This is the path for design and development projects. Audits and consulting focus on diagnosis and recommendations. In both, you follow each stage and understand the decisions being made.",
    'cs.title': "Strategy brought to life.",
    'cs.lede': "Websites, stores and digital products with different goals and the same care for the experience. Explore the work, including an in-house product currently in development.",
    'cs.c1': 'Company website · with Falcotec', 'cs.c2': 'Company website · high-end furniture', 'cs.c3': 'Landing page · with Voia Agency',
    'cs.c4': 'E-commerce · Banco Inter', 'cs.c5': 'E-commerce · plant-based cosmetics', 'cs.c6': 'B2B industrial · heavy machinery parts',
    'cs.c7': 'Landing page · disability tax exemptions', 'cs.c8': 'Company website · insurance', 'cs.c9': 'Company website · healthcare',
    'cs.c10': 'Landing page · equipment rental', 'cs.c11': 'Landing page · international client', 'cs.c12': 'Company website · digital marketing',
    'cs.c13': 'Own SaaS · coming soon',
    'rv.title': "Trust built through the work.", 'rv.tabs': 'Reviews', 'rv.src': "Google review · 5 stars",
    'ab.title': "Meet Victor Santos.",
    'ab.alt': 'Victor Santos smiling, wearing glasses and a dark blazer, rising out of the VS monogram',
    'ab.p1': "I’m a Product Designer and Design Engineer working on websites and apps, bringing together business thinking, user experience and development. My role is to understand what your project needs to achieve and turn that direction into a clear, consistent experience people can use.",
    'ab.p2': "At VS Experience, I work on projects from diagnosis through delivery. Through the Victor Santos consulting practice, I help businesses and teams with audits and guidance. You work directly with the person shaping the solution and understanding what it takes to build it.",
    'ab.c1a': '1st place in UI/UX Design', 'ab.c1b': 'SPSKILLS, with a banking app interface',
    'ab.c2a': 'G4 Educação and Banco Inter', 'ab.c2b': 'project experience with both companies',
    'ab.c3a': 'Technical stack',
    'fq.title': 'Frequently asked questions',
    'fq.q1': "Do you also develop the website or product?",
    'fq.a1': "Yes. At VS Experience, I handle diagnosis, user experience, interface design and development. You get continuity between what is planned, what is approved and what is delivered.",
    'fq.q2': 'How long does a project take?',
    'fq.a2': "The timeline depends on the project type, complexity, materials and approvals. <a href=\"servicos/\">Services &amp; pricing</a> lists reference timelines for each service. We agree the final schedule before starting.",
    'fq.q3': "Can I hire you for design only?",
    'fq.a3': "Yes. If you already have a development team, I deliver the design in Figma with components, styles and implementation guidance. The level of documentation is agreed in the scope.",
    'fq.q4': 'How does communication work during the project?',
    'fq.a4': "You follow progress at each stage, share feedback at agreed checkpoints and approve deliveries before we move on. Decisions stay clear throughout the project.",
    'fq.q5': 'How many revision rounds are included?',
    'fq.a5': "Each delivery includes one consolidated revision round, with requested changes gathered into a single set of feedback. New requests and revisions beyond scope are agreed separately before the work begins.",
    'fq.q6': 'Where can I see pricing?',
    'fq.a6': "Reference pricing for design and development is available in <a href=\"servicos/\">Services &amp; pricing</a>. The final quote reflects the diagnosis and scope. For audits and consulting, we first discuss your needs and the right format for the work.",
    'fq.q7': "How do we get started?",
    'fq.a7': "Tell me on WhatsApp what you offer, who it is for and what you want to achieve. If you already have a website or product, send the link. Our first conversation helps us understand whether the next step is to review, build or improve the experience.",
    'tr.title': 'From tangle to a clear path.',
    'tr.lede': 'Every project arrives with doubts, references and priorities mixed together. My job is to sort them out until they become an experience people understand at first glance.',
    'tr.m1': 'Diagnosis', 'tr.m2': 'Structure', 'tr.m3': 'Interface', 'tr.m4': 'Delivery',
    'cl.title': "What’s the next step<br>for your business?",
    'cl.lede': "Tell me what you offer, who it is for and what you want to achieve. I’ll help you understand where to start, whether you need to review an existing experience or build something new. The first conversation is commitment-free.",
    'cl.cta': "Let’s discuss my project",
    'ft.rights': 'All rights reserved.',
    'wa.general': "Hi Victor! I found your website and would like to understand how you can help my business.",
    'wa.project': "Hi Victor! I offer ___ to ___ and would like to ___. Can we discuss my project?",
    'wa.consult': "Hi Victor! I already have a website or product and would like to discuss an audit or consulting. The link is: ___",
    'wa.build': "Hi Victor! I would like to build or improve a project with VS Experience. I offer ___ to ___ and my goal is ___.",
    'wa.close': "Hi Victor! I offer ___ to ___ and would like to achieve ___. My current website or product is: ___",
    'meta.title': 'Victor Santos · VS Experience | UX/UI and development',
    'meta.desc': 'Strategy, UX/UI and development for websites and digital products. Audits and consulting with Victor Santos; design and development with VS Experience.'
  };
  // Each language has static HTML and its own canonical URL.
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

  /* ---------------------------------------------------------------- rolagem suave */
  var lenis = null;
  // no toque a rolagem nativa já é suave; o Lenis só custaria uma leitura de layout a cada evento
  if (window.Lenis && !reduce.matches && fine.matches) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  function goTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var target = id === '#topo' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    goTo(id === '#topo' ? 0 : target);
    if (id !== '#topo') history.replaceState(null, '', id);
  });

  /* ---------------------------------------------------------------- cabeçalho e menu */
  var top = $('[data-top]');
  var topRow = $('.top__row', top);
  var menuBtn = $('[data-menu-btn]');
  var nav = $('[data-nav]');
  var navPanel = $('[data-nav-panel]');
  var navOverlay = $('[data-nav-close]');
  var navLayers = $$('.nav__layer', nav);
  var navTexts = $$('.nav__text', nav);
  var navFades = $$('[data-nav-fade]', nav);
  var navShapes = $$('.nav__shape', nav);
  var navClip = [$('.nav__inner', nav), $('.nav__shapes', nav)];
  var EASE_MAIN = 'cubic-bezier(0.65, 0.01, 0.05, 0.99)';
  var EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  var navOpen = false, navAnims = [], navTimer = 0, activeShape = null;

  function run(el, frames, opts) { var a = el.animate(frames, Object.assign({ fill: 'both', easing: EASE_MAIN }, opts)); navAnims.push(a); return a; }
  function stopNav() { navAnims.forEach(function (a) { a.cancel(); }); navAnims = []; clearTimeout(navTimer); }

  // formas da marca no fundo do painel: entram com mola, uma peça de cada vez
  function showShape(n) {
    var next = navShapes.filter(function (s) { return s.dataset.shapeFor === String(n); })[0];
    if (!next || next === activeShape) return;
    if (activeShape) {
      var prev = activeShape;
      $$('.nav__el', prev).forEach(function (el) {
        el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.8)' }], { duration: reduce.matches ? 1 : 260, easing: 'ease-in', fill: 'both' })
          .onfinish = function () { if (activeShape !== prev) prev.classList.remove('is-active'); };
      });
    }
    activeShape = next;
    next.classList.add('is-active');
    $$('.nav__el', next).forEach(function (el, i) {
      el.animate(
        [{ opacity: 0, transform: 'scale(0.5) rotate(-10deg)' }, { opacity: 1, transform: 'none' }],
        { duration: reduce.matches ? 1 : 600, delay: reduce.matches ? 0 : i * 80, easing: EASE_BACK, fill: 'both' }
      );
    });
  }
  $$('.nav__list li', nav).forEach(function (li) {
    li.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') showShape(li.dataset.shape); });
    li.addEventListener('focusin', function () { showShape(li.dataset.shape); });
  });

  function setInert(on) {
    ['conteudo'].forEach(function (id) { var el = document.getElementById(id); if (el) el.inert = on; });
    var foot = $('.foot'); if (foot) foot.inert = on;
    $('.skip').inert = on;
  }

  function openMenu() {
    if (navOpen) return;
    navOpen = true;
    stopNav();
    nav.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('nav-open');
    setInert(true);
    if (lenis) lenis.stop();
    // o tom escuro entra antes das camadas, para o botão não piscar em Grafite sobre Grafite
    toneHeader();
    var rm = reduce.matches;
    run(navPanel, [{ transform: 'none' }, { transform: 'none' }], { duration: 1 });
    run(navOverlay, [{ opacity: 0 }, { opacity: 1 }], { duration: rm ? 1 : 700 });
    navLayers.forEach(function (el, i) {
      run(el, [{ transform: 'translateX(101%)' }, { transform: 'none' }], { duration: rm ? 1 : 575, delay: rm ? 0 : i * 120 });
    });
    // o conteúdo só aparece junto com a última camada, nunca antes dela
    navClip.forEach(function (el) {
      run(el, [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: rm ? 1 : 575, delay: rm ? 0 : 240 });
    });
    navTexts.forEach(function (el, i) {
      run(el, [{ transform: 'translateY(140%) rotate(10deg)' }, { transform: 'none' }], { duration: rm ? 1 : 700, delay: rm ? 0 : 350 + i * 50 });
    });
    navFades.forEach(function (el, i) {
      run(el, [{ opacity: 0, transform: 'translateY(50%)' }, { opacity: 1, transform: 'none' }], { duration: rm ? 1 : 700, delay: rm ? 0 : 550 + i * 40 });
    });
    activeShape = null;
    navShapes.forEach(function (s) { s.classList.remove('is-active'); });
    var current = $('.nav__link[aria-current="true"]', nav);
    navTimer = setTimeout(function () { showShape(current ? current.parentNode.dataset.shape : 4); }, rm ? 0 : 420);
    var first = $('.nav__link', nav);
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu(restoreFocus) {
    if (!navOpen) return;
    navOpen = false;
    stopNav();
    menuBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('nav-open');
    setInert(false);
    if (lenis) lenis.start();
    var rm = reduce.matches;
    run(navOverlay, [{ opacity: 1 }, { opacity: 0 }], { duration: rm ? 1 : 700 });
    run(navPanel, [{ transform: 'none' }, { transform: 'translateX(120%)' }], { duration: rm ? 1 : 700 })
      .onfinish = function () { if (!navOpen) { nav.hidden = true; stopNav(); } };
    toneHeader();
    if (restoreFocus) menuBtn.focus({ preventScroll: true });
  }

  menuBtn.addEventListener('click', function () { if (navOpen) closeMenu(); else openMenu(); });
  navOverlay.addEventListener('click', function () { closeMenu(true); });
  document.addEventListener('keydown', function (e) {
    if (!navOpen) return;
    if (e.key === 'Escape') { closeMenu(true); return; }
    // o foco circula entre o botão do menu e o painel
    if (e.key === 'Tab') {
      var items = [menuBtn].concat($$('a, button', navPanel));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  // links externos e de outra página também fecham o menu
  navPanel.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && !a.getAttribute('href').startsWith('#')) closeMenu(); });

  var navLinks = $$('.nav__link[href^="#"]', nav);
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      navLinks.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['frentes', 'processo', 'cases', 'sobre'].forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });

  // tom do vidro: escuro quando a faixa do cabeçalho passa sobre uma seção escura
  var darkZones = $$('.front, .process, .reviews, .close, .foot');
  var portalDark = false;
  function toneHeader() {
    var y = 8 + 29, dark = navOpen || portalDark;
    if (!dark) {
      for (var i = 0; i < darkZones.length; i++) {
        var r = rect(darkZones[i]);
        if (r.top <= y && r.bottom >= y) { dark = true; break; }
      }
    }
    top.classList.toggle('is-dark', dark);
    top.classList.toggle('is-solid', navOpen || window.scrollY > 8);
  }

  // brilho especular do vidro segue o cursor na horizontal
  top.addEventListener('pointermove', function (e) {
    var r = topRow.getBoundingClientRect();
    topRow.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
  });

  // refração real (deslocamento nas bordas do vidro) onde o navegador aplica filtros SVG no fundo
  (function refract() {
    var brands = navigator.userAgentData && navigator.userAgentData.brands;
    var chromium = brands && brands.some(function (b) { return /Chromium/.test(b.brand); });
    if (!chromium || reduce.matches || perfLow) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    svg.innerHTML = '<filter id="vs-glass" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feImage result="map" preserveAspectRatio="none"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.appendChild(svg);
    var img = svg.querySelector('feImage');
    // mapa de deslocamento: neutro no centro, inclinado nas bordas arredondadas, como uma lente
    function buildMap() {
      var w = Math.round(topRow.offsetWidth), h = 58, edge = 16;
      if (w < 10) return;
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var g = c.getContext('2d'), d = g.createImageData(w, h);
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var lx = x < edge ? 1 - x / edge : (x > w - 1 - edge ? -(1 - (w - 1 - x) / edge) : 0);
          var ly = y < edge ? 1 - y / edge : (y > h - 1 - edge ? -(1 - (h - 1 - y) / edge) : 0);
          var dx = lx * Math.abs(lx), dy = ly * Math.abs(ly);
          var k = (y * w + x) * 4;
          d.data[k] = 128 + dx * 127; d.data[k + 1] = 128 + dy * 127; d.data[k + 2] = 128; d.data[k + 3] = 255;
        }
      }
      g.putImageData(d, 0, 0);
      img.setAttribute('href', c.toDataURL());
      img.setAttribute('width', w); img.setAttribute('height', h);
    }
    buildMap();
    var mapW = innerWidth, mapT = 0;
    window.addEventListener('resize', function () {
      clearTimeout(mapT);
      mapT = setTimeout(function () { if (innerWidth !== mapW) { mapW = innerWidth; buildMap(); } }, 150);
    });
    document.documentElement.classList.add('has-refract');
  })();

  // magnetismo: o botão é puxado de leve na direção do cursor e volta com mola
  if (fine.matches) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        if (reduce.matches) return;
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.classList.add('is-pulled');
        el.style.setProperty('--mgx', (mx * 6).toFixed(2) + 'px');
        el.style.setProperty('--mgy', (my * 4).toFixed(2) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-pulled');
        el.style.setProperty('--mgx', '0px');
        el.style.setProperty('--mgy', '0px');
      });
    });
  }

  /* ---------------------------------------------------------------- gradientes */
  var heroCanvas = $('.portal__canvas');
  var closeCanvas = $('.close__canvas');
  var heroGrad = window.VSGradient ? window.VSGradient.create(heroCanvas, 'rasgo', { scale: 0.6, params: { blobCount: 5, blobSize: 0.3, spread: 1.25, posX: 0.04, posY: -0.3, density: 90 } }) : null;
  if (window.VSGradient && closeCanvas) {
    var closeIO = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      closeIO.disconnect();
      window.VSGradient.create(closeCanvas, 'cortina', { scale: 0.45, duration: 18 });
    }, { rootMargin: '100% 0px' });
    closeIO.observe(closeCanvas);
  }

  /* ---------------------------------------------------------------- portal */
  var portal = $('[data-portal]');
  var pin = $('[data-portal-pin]');
  var glyph = $('[data-portal-glyph]');
  var paper = $('[data-portal-paper]');
  var front = $('[data-portal-front]');
  var specXY = $('[data-spec-xy]');
  var MONO = { w: 514.7, h: 346.8, fx: 60, fy: 173, fr: 54 };
  var P = { W: 1, H: 1, s0: 1, s1: 1, x0: 0, y0: 0, travel: 1, live: false, glowY: -0.3 };
  var mouse = { x: 0, y: 0, sx: 0, sy: 0 };

  function portalLayout() {
    P.live = !reduce.matches;
    portal.classList.toggle('is-live', P.live);
    P.W = pin.clientWidth; P.H = pin.clientHeight;
    var gutter = parseFloat(getComputedStyle(front).paddingLeft) || 24;
    // o texto ocupa o topo; o monograma nasce logo abaixo, cortado pela borda da tela
    var frontBottom = front.offsetTop + front.offsetHeight;
    var gap = Math.max(28, P.H * 0.05);
    P.y0 = frontBottom + gap;
    var visible = Math.max(80, P.H - P.y0);
    var ratio = MONO.w / MONO.h;
    var monoW = Math.max(Math.min(P.W - gutter * 2, 1400), Math.min(visible * 1.2 * ratio, P.W * 1.18));
    P.s0 = monoW / MONO.w;
    P.x0 = (P.W - monoW) / 2;
    P.s1 = Math.hypot(P.W, P.H) / (2 * MONO.fr) * 1.08;
    P.travel = Math.max(1, portal.offsetHeight - P.H);
    // o brilho do shader se concentra na parte visível do monograma
    // a posição das manchas no shader é relativa à altura do quadro
    P.glowY = (P.H / 2 - (P.y0 + visible / 2)) / P.H;
  }

  var easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function portalPaint() {
    if (L.on) { loaderPaint(); return; }
    if (!portalNear) return;
    var pr = rect(portal);
    var p = P.live ? clamp(-pr.top / P.travel) : 0;
    var t = clamp(p / 0.78);
    var e = easeInOut(t);
    var s = Math.exp(Math.log(P.s0) + (Math.log(P.s1) - Math.log(P.s0)) * e);
    var blend = (1 / s - 1 / P.s0) / (1 / P.s1 - 1 / P.s0);
    var fx0 = P.x0 + MONO.fx * P.s0, fy0 = P.y0 + MONO.fy * P.s0;
    var cx = fx0 + (P.W / 2 - fx0) * blend;
    var cy = fy0 + (P.H / 2 - fy0) * blend;
    // leve paralaxe do monograma com o cursor, só antes de entrar
    var par = (1 - e) * (fine.matches ? 1 : 0);
    var tx = cx - MONO.fx * s + mouse.sx * 10 * par;
    var ty = cy - MONO.fy * s + mouse.sy * 6 * par;
    setAttr(glyph, 'transform', 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ') scale(' + s.toFixed(4) + ')');
    setVar(paper, 'visibility', t >= 1 ? 'hidden' : 'visible');
    if (heroGrad && heroGrad.ok) {
      // ao entrar, o brilho volta para a direita e deixa o lado do texto escuro
      heroGrad.p.posX = 0.04 + (0.42 - 0.04) * e;
      // no celular o texto ocupa a largura toda: o brilho desce para trás dos cartões, longe do parágrafo
      heroGrad.p.posY = P.glowY + ((P.W <= 700 ? -0.34 : 0.02) - P.glowY) * e;
    }
    var f = 1 - smooth(0, 0.11, p);
    var a = P.live ? smooth(0.8, 0.93, p) : 1;
    setVar(pin, '--front', f.toFixed(3));
    setVar(pin, '--front-hit', f > 0.6 ? 'auto' : 'none');
    setVar(pin, '--after', a.toFixed(3));
    setVar(pin, '--after-hit', a > 0.6 ? 'auto' : 'none');
    portalDark = P.live && t > 0.62 && pr.bottom > 40;
  }

  /* ---------------------------------------------------------------- carregamento
     O monograma da hero começa pequeno, em Grafite, e se enche de shader de baixo para cima;
     a linha do líquido inclina com o cursor. Ao completar, o mesmo monograma cresce até o horizonte. */
  var root = document.documentElement;
  var L = { on: root.classList.contains('is-loading'), prog: 0, ready: false, exit: 0, rot: 0, tilt: 0 };
  var loaderEl = $('[data-loader]');
  var loaderCount = $('[data-loader-count]');
  var loaderHint = $('[data-loader-hint]');
  var ink = $('[data-loader-ink]');
  var level = $('[data-loader-level]');
  if (L.on) {
    var seen = false;
    try { seen = sessionStorage.getItem('vs-intro') === '1'; } catch (e) { /* sem armazenamento */ }
    L.min = seen ? 450 : 1300;
    L.t0 = performance.now();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (lenis) lenis.stop();
    loaderEl.hidden = false;
    loaderHint.textContent = lang === 'en' ? (fine.matches ? 'Click to enter' : 'Tap to enter') : (fine.matches ? 'Clique para entrar' : 'Toque para entrar');
    var markReady = function () { L.ready = true; };
    // o que importa para a primeira tela são as fontes; imagens carregam depois
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(markReady);
    setTimeout(markReady, 2000);
    // pular: clique, toque, tecla ou rolagem completam o carregamento na hora
    var skip = function () { if (!L.on || L.exit) return; L.ready = true; L.min = 0; L.skip = true; };
    ['pointerdown', 'keydown', 'wheel', 'touchmove'].forEach(function (ev) { window.addEventListener(ev, skip, { passive: true }); });
  }

  function loaderPaint() {
    var now = performance.now();
    var el = now - L.t0;
    var target = L.ready ? Math.min(1, el / Math.max(1, L.min)) : 0.88 * (1 - Math.pow(1 - clamp(el / 1700), 3));
    // avanço medido em tempo, não em quadros, para não arrastar em aparelhos lentos
    var dt = L.last ? Math.min(250, now - L.last) : 16;
    L.last = now;
    L.prog += (target - L.prog) * (1 - Math.exp(-dt / (L.skip ? 50 : 130)));
    if (L.ready && L.prog > 0.995) L.prog = 1;

    // posição de carregamento: pequeno, no centro
    var lw = Math.min(P.W * 0.44, 380, P.H * 0.42 * (MONO.w / MONO.h));
    var ls = lw / MONO.w;
    var lx = (P.W - lw) / 2;
    var ly = P.H * 0.45 - (MONO.h * ls) / 2;

    // inclinação e giro acompanham o cursor; no toque, um balanço suave
    var aimT = fine.matches ? mouse.x * 130 : Math.sin(el / 420) * 40;
    var aimR = fine.matches ? mouse.x * 5 : Math.sin(el / 700) * 2.5;
    var ease = 1 - Math.exp(-dt / 160);
    L.tilt += (aimT - L.tilt) * ease;
    L.rot += (aimR - L.rot) * ease;

    var k = 0;
    if (L.prog >= 1 && !L.exit) {
      L.exit = now;
      root.classList.remove('is-loading');
      loaderEl.classList.add('is-leaving');
      try { sessionStorage.setItem('vs-intro', '1'); } catch (e) { /* sem armazenamento */ }
    }
    if (L.exit) k = easeInOut(clamp((now - L.exit) / 950));

    // do centro até o horizonte da hero
    var hx = P.x0 + mouse.sx * 10 * (fine.matches ? 1 : 0);
    var hy = P.y0 + mouse.sy * 6 * (fine.matches ? 1 : 0);
    var s = Math.exp(Math.log(ls) + (Math.log(P.s0) - Math.log(ls)) * k);
    var x = lx + (hx - lx) * k;
    var y = ly + (hy - ly) * k;
    var r = L.rot * (1 - k);
    var t = 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') scale(' + s.toFixed(4) + ') rotate(' + r.toFixed(2) + ' ' + (MONO.w / 2) + ' ' + (MONO.h / 2) + ')';
    glyph.setAttribute('transform', t);
    ink.setAttribute('transform', t);

    // nível do líquido, em unidades do monograma, com uma onda leve
    var lvl = MONO.h * (1 - L.prog);
    var amp = 3 + 7 * (1 - L.prog);
    var d = 'M-40 -80H560';
    for (var i = 12; i >= 0; i--) {
      var px = -40 + (600 / 12) * i;
      var py = lvl + L.tilt * ((px / MONO.w) - 0.5) + amp * Math.sin(px * 0.03 + el / 260);
      d += 'L' + px.toFixed(1) + ' ' + py.toFixed(1);
    }
    level.setAttribute('d', d + 'Z');

    // o brilho do shader acompanha o monograma
    if (heroGrad && heroGrad.ok) {
      var gy0 = (P.H / 2 - (ly + MONO.h * ls / 2)) / P.H;
      heroGrad.p.posX = 0.04 * k;
      heroGrad.p.posY = gy0 + (P.glowY - gy0) * k;
    }

    var n = Math.round(L.prog * 100);
    loaderCount.textContent = (n < 10 ? '00' : n < 100 ? '0' : '') + n;
    loaderCount.style.setProperty('--lw', (25 + 126 * L.prog).toFixed(1));
    loaderCount.style.setProperty('--lg', Math.round(300 + 500 * L.prog));
    pin.style.setProperty('--front', '1');
    pin.style.setProperty('--after', '0');
    root.classList.add('loader-on');

    if (k >= 1) {
      L.on = false;
      loaderEl.hidden = true;
      if (lenis) lenis.start();
    }
  }

  window.addEventListener('pointermove', function (e) {
    mouse.x = e.clientX / window.innerWidth * 2 - 1;
    mouse.y = e.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  /* ---------------------------------------------------------------- texto dividido */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    return $$('.w', el);
  }
  function splitLetters(el) {
    var word = el.textContent.trim();
    el.setAttribute('aria-label', word);
    el.innerHTML = '<span aria-hidden="true">' + Array.from(word).map(function (c) { return '<span class="l">' + c + '</span>'; }).join('') + '</span>';
    return $$('.l', el);
  }

  /* peso do manifesto acompanha a leitura */
  var statement = $('[data-weight-scroll]');
  var stWords = [];
  // posições medidas uma vez (o grade não muda larguras); por quadro, só uma leitura do bloco
  var stPos = [];
  function prepStatement() { if (!statement) return; stWords = splitWords(statement); measureStatement(); }
  function measureStatement() {
    var sr = statement.getBoundingClientRect();
    stPos = stWords.map(function (w) { var b = w.getBoundingClientRect(); return { top: b.top - sr.top, left: b.left }; });
  }
  function paintStatement() {
    if (!stWords.length) return;
    var vh = window.innerHeight, vw = window.innerWidth;
    var r = statement.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    stWords.forEach(function (w, i) {
      var p = stPos[i];
      var prog = (vh * 0.86 - (r.top + p.top)) / (vh * 0.42) - (p.left / vw) * 0.35;
      var k = reduce.matches ? 1 : smooth(0, 1, prog);
      if (w._k !== undefined && Math.abs(w._k - k) < 0.004) return;
      w._k = k;
      w.style.setProperty('--gr', Math.round(-200 + 350 * k));
      w.style.setProperty('--k', k.toFixed(3));
    });
  }

  /* espécimes: os eixos respondem ao cursor (ou à rolagem, no toque) */
  var specimens = $$('.specimen');
  var specs = [];
  function prepSpecimens() {
    specs = specimens.map(function (li) {
      return {
        li: li,
        letters: splitLetters($('[data-specimen]', li)),
        wdthOut: $('[data-axis-wdth]', li),
        wghtOut: $('[data-axis-wght]', li),
        px: null, cx: [], fs: 120, key: ''
      };
    });
    measureSpecimens();
  }
  // centro de cada letra em repouso, relativo à linha
  function measureSpecimens() {
    specs.forEach(function (sp) {
      var base = sp.li.getBoundingClientRect().left;
      sp.cx = sp.letters.map(function (l) { var b = l.getBoundingClientRect(); return b.left - base + b.width / 2; });
      sp.fs = parseFloat(getComputedStyle(sp.letters[0] || sp.li).fontSize) || 120;
    });
  }
  // amp (0 a 1) é a intensidade do efeito: o cursor a leva a 1 ao entrar e a 0 ao sair
  function shapeSpecimen(sp, x, left, amp) {
    var maxW = 100, maxG = 300;
    if (amp == null) amp = 1;
    var key = x == null || amp < 0.002 ? 'rest' : Math.round(x - left) + ':' + Math.round(amp * 100);
    if (key === sp.key) return;
    sp.key = key;
    sp.letters.forEach(function (l, i) {
      var f = 0;
      if (x != null) {
        var d = (left + sp.cx[i] - x) / (sp.fs * 0.85);
        f = Math.exp(-d * d) * amp;
      }
      // valores inteiros (largura) e em passos de 10 (peso): menos instâncias da fonte para montar,
      // e só as letras que mudaram são reescritas. A suavização é feita no laço, não em transição CSS:
      // com transição, cada atualização reiniciava dezenas de animações ao mesmo tempo
      var w = Math.round(100 + 51 * f), g = Math.round((300 + 600 * f) / 10) * 10;
      setVar(l, '--lw', w + '');
      setVar(l, '--lg', g + '');
      var hot = f > 0.72;
      if (l._hot !== hot) { l._hot = hot; l.classList.toggle('is-hot', hot); }
      if (w > maxW) { maxW = w; maxG = g; }
    });
    var wt = Math.round(maxW) + '', gt = Math.round(maxG) + '';
    if (sp.wdthOut._t !== wt) { sp.wdthOut._t = wt; sp.wdthOut.textContent = wt; }
    if (sp.wghtOut._t !== gt) { sp.wghtOut._t = gt; sp.wghtOut.textContent = gt; }
  }
  // o cursor só define o alvo; o laço único aproxima posição e intensidade quadro a quadro
  specimens.forEach(function (li, i) {
    li.addEventListener('pointermove', function (e) {
      if (!fine.matches || reduce.matches) return;
      var sp = specs[i];
      sp.tx = e.clientX; sp.ampT = 1; sp.live = true;
    });
    li.addEventListener('pointerleave', function () {
      if (!fine.matches) return;
      specs[i].ampT = 0;
    });
  });
  function stepSpecimens() {
    specs.forEach(function (sp) {
      if (!sp.live) return;
      var left = rect(sp.li).left;
      if (sp.tx != null) sp.xr = (sp.xr == null ? sp.tx - left : sp.xr + (sp.tx - left - sp.xr) * 0.2);
      sp.amp = (sp.amp || 0) + (sp.ampT - (sp.amp || 0)) * 0.12;
      if (sp.ampT === 0 && sp.amp < 0.002) { sp.amp = 0; sp.live = false; sp.xr = null; }
      shapeSpecimen(sp, sp.live ? left + sp.xr : null, left, sp.amp);
    });
  }
  function paintSpecimensByScroll() {
    if (fine.matches || reduce.matches) return;
    var vh = window.innerHeight;
    specs.forEach(function (sp) {
      var r = rect(sp.li);
      if (r.bottom < 0 || r.top > vh) return;
      var prog = clamp((vh - r.top) / (vh + r.height));
      shapeSpecimen(sp, r.left + r.width * (prog * 1.4 - 0.2), r.left);
    });
  }

  /* escadaria de palavras: cascata no hover (desktop) ou ao rolar até a seção (toque) */
  var layers = $('[data-layers]');
  var stack = $('[data-layers-stack]');
  var LAYER_WORDS = {
    pt: ['Design que', 'constrói', 'confiança.', 'Experiência', 'que faz', 'avançar.'],
    en: ['Design that', 'builds', 'trust.', 'Experiences', 'that move', 'people forward.']
  };
  function buildLayers() {
    if (!stack) return;
    var words = LAYER_WORDS[lang] || LAYER_WORDS.pt;
    var seq = ['\u00a0'].concat(words, ['\u00a0']);
    var mobile = window.matchMedia('(max-width: 900px)').matches;
    var step = mobile ? 20 : 35, center = Math.floor((seq.length - 1) / 2);
    var html = '';
    for (var i = 0; i < seq.length - 1; i++) {
      html += '<li style="--x:' + ((i - center) * step) + 'px"><p style="--i:' + i + '">' + seq[i] + '</p><p style="--i:' + i + '">' + seq[i + 1] + '</p></li>';
    }
    stack.innerHTML = html;
    fitLayers();
  }
  // a escada inclinada ocupa mais que a própria caixa: mede os degraus e escala para caber
  function fitLayers() {
    if (!stack) return;
    stack.style.setProperty('--fit', 1);
    var stage = stack.parentElement;
    var items = stack.children, minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      minX = Math.min(minX, r.left); maxX = Math.max(maxX, r.right);
      minY = Math.min(minY, r.top); maxY = Math.max(maxY, r.bottom);
    }
    var w = maxX - minX, hgt = maxY - minY;
    var k = Math.min(1, (stage.clientWidth * 0.98) / Math.max(1, w));
    stack.style.setProperty('--fit', k.toFixed(3));
    layers.style.setProperty('--stage-h', Math.ceil(hgt * k + 24) + 'px');
  }
  function setLayers(on) { if (layers) layers.classList.toggle('is-on', !!on); }
  if (layers) {
    layers.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') setLayers(true); });
    layers.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') setLayers(false); });
    layers.addEventListener('focusin', function () { setLayers(true); });
    layers.addEventListener('focusout', function (e) { if (!layers.contains(e.relatedTarget)) setLayers(false); });
  }
  function paintLayersByScroll() {
    if (!layers || fine.matches) return;
    var r = rect(layers);
    setLayers(r.top < window.innerHeight * 0.55 && r.bottom > window.innerHeight * 0.2);
  }

  /* traço: a ponta da linha acompanha uma linha imaginária a 62% da tela; no nó do começo,
     o avanço é distribuído pela altura do nó para ele se desenhar aos poucos. Os marcos acendem quando a linha chega neles */
  var trace = $('[data-trace]');
  var traceLine = $('[data-trace-line]');
  var traceMarks = $$('[data-trace-mark]');
  // tabela do traçado em unidades do viewBox (1278 × 2319), gerada uma vez a partir do próprio path:
  // L é o comprimento; V, a altura "virtual" monotônica de N + 1 pontos (no nó, distribuída pela altura do nó);
  // marks, [fração, x, y] de cada marco. Calcular isso no navegador custava mais de 1 s em aparelhos modestos.
  // Se o path mudar, gere a tabela de novo.
  var TRACE = {"L":10919,"N":400,"V":[0,2,5,7,10,12,14,17,19,21,24,26,29,31,33,36,38,40,43,45,48,50,52,55,57,59,62,64,67,69,71,74,76,79,81,83,86,88,90,93,95,98,100,102,105,107,109,112,114,117,119,121,124,126,128,131,133,136,138,140,143,145,147,150,152,155,157,159,162,164,167,169,171,174,176,178,181,183,186,188,190,193,195,197,200,202,205,207,209,212,214,216,219,221,224,226,228,231,233,236,238,240,243,245,247,250,252,255,257,259,262,264,266,269,271,274,276,278,281,283,285,288,290,293,295,297,300,302,304,307,309,312,314,316,319,321,324,326,328,331,333,335,338,340,343,345,347,350,352,354,357,359,362,364,366,369,371,373,376,378,381,383,385,388,390,393,395,397,400,402,404,407,409,412,414,416,419,421,423,426,428,431,433,435,438,440,442,445,447,450,452,454,457,459,461,464,466,469,471,473,476,478,481,483,485,488,490,492,495,497,500,502,504,507,509,511,514,516,519,521,523,526,528,530,533,535,538,543,571,598,625,651,677,703,728,754,779,804,830,856,882,909,936,964,991,1016,1041,1064,1085,1105,1123,1140,1155,1166,1173,1177,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1179,1180,1201,1224,1246,1270,1294,1318,1343,1368,1394,1420,1447,1473,1501,1528,1555,1582,1609,1635,1660,1684,1706,1726,1743,1759,1771,1782,1791,1799,1804,1809,1812,1813,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1814,1821,1840,1861,1884,1909,1935,1961,1988,2015,2042,2069,2095,2118,2138,2154,2166,2174,2181,2186,2190,2193,2195,2196,2197,2198,2199,2199,2200,2200,2201,2202,2203,2205,2207,2209,2213,2217,2223,2229,2237,2247,2258,2272,2288,2306,2327,2349,2374,2399,2426,2453,2480,2507,2534,2562,2589,2616,2642,2669],"marks":[[0.6,1049.3,882.3],[0.67,486,1121.2],[0.8,528.4,1804.1],[0.92,816.9,2199]]};
  var traceLen = 0, traceSvg = null, traceV = TRACE.V, traceStep = 0, trTarget = 0, trCur = 0, trShown = -1;
  var TRACE_N = TRACE.N;
  function layoutTrace() {
    if (!traceLine) return;
    traceSvg = traceLine.ownerSVGElement;
    traceLen = TRACE.L;
    traceStep = traceLen / TRACE_N;
    // pathLength normaliza o tracejado: o comprimento medido varia um pouco entre navegadores
    traceLine.setAttribute('pathLength', traceLen);
    traceLine.style.strokeDasharray = traceLen + ' ' + traceLen;
    var vb = traceSvg.viewBox.baseVal, vw = document.documentElement.clientWidth;
    traceMarks.forEach(function (li, i) {
      var m = TRACE.marks[i];
      li.len = traceLen * m[0];
      li.style.setProperty('--mx', (m[1] / vb.width * 100) + '%');
      li.style.setProperty('--my', (m[2] / vb.height * 100) + '%');
      li.lastElementChild.style.removeProperty('--nx');
    });
    // o rótulo nunca sai da tela: mede todos depois de posicionar, numa leitura só
    var nudges = traceMarks.map(function (li) {
      var r = li.lastElementChild.getBoundingClientRect();
      return r.left < 16 ? 16 - r.left : (r.right > vw - 16 ? vw - 16 - r.right : 0);
    });
    traceMarks.forEach(function (li, i) { if (nudges[i]) li.lastElementChild.style.setProperty('--nx', nudges[i].toFixed(0) + 'px'); });
    trShown = -1;
    dirty = true;
  }
  function aimTrace() {
    if (!traceLen) return;
    if (reduce.matches) { trTarget = trCur = traceLen; return; }
    var box = rect(traceSvg);
    var yT = (window.innerHeight * 0.62 - box.top) / (box.height / traceSvg.viewBox.baseVal.height);
    var lo = 0, hi = TRACE_N;
    if (yT < traceV[0]) { trTarget = 0; return; }
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (traceV[mid] <= yT) lo = mid; else hi = mid - 1; }
    trTarget = lo * traceStep;
  }
  function drawTrace() {
    if (!traceLen) return;
    if (Math.abs(trTarget - trCur) < 0.5 && trShown === trCur) return;
    trCur = Math.abs(trTarget - trCur) < 0.5 ? trTarget : trCur + (trTarget - trCur) * 0.16;
    trShown = trCur;
    traceLine.style.strokeDashoffset = (traceLen - trCur).toFixed(1);
    traceMarks.forEach(function (li) { li.classList.toggle('is-on', trCur >= li.len - 1); });
  }

  /* ---------------------------------------------------------------- processo */
  var steps = $$('[data-step]');
  var procNum = $('[data-process-num]');
  var procBar = $('[data-process-bar]');
  var procIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var i = steps.indexOf(en.target);
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      var label = String(i + 1).padStart(2, '0');
      if (procNum.textContent !== label) {
        procNum.textContent = label;
        procNum.classList.remove('tick');
        void procNum.offsetWidth;
        procNum.classList.add('tick');
      }
      procBar.parentElement.style.setProperty('--prog', ((i + 1) / steps.length).toFixed(2));
      procBar.style.setProperty('--prog', ((i + 1) / steps.length).toFixed(2));
    });
  }, { rootMargin: '-42% 0px -48% 0px' });
  steps.forEach(function (s) { procIO.observe(s); });

  /* ---------------------------------------------------------------- cases: prévia que segue o cursor */
  var casesList = $('.cases__list');
  var peek = $('[data-case-peek]');
  var peekImg = $('[data-case-peek-img]');
  var pk = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, on: false, raf: 0 };
  function peekLoop() {
    var nx = pk.x + (pk.tx - pk.x) * 0.16;
    var ny = pk.y + (pk.ty - pk.y) * 0.16;
    pk.vx = nx - pk.x;
    pk.x = nx; pk.y = ny;
    var rot = clamp(pk.vx * 0.35, -7, 7);
    peek.style.transform = 'translate3d(' + (pk.x + 36).toFixed(1) + 'px,' + (pk.y - peek.offsetHeight / 2).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
    if (pk.on || Math.abs(pk.vx) > 0.1) pk.raf = requestAnimationFrame(peekLoop);
    else pk.raf = 0;
  }
  casesList.addEventListener('pointermove', function (e) {
    if (!fine.matches) return;
    pk.tx = e.clientX; pk.ty = e.clientY;
    if (!pk.raf) { if (!pk.on) { pk.x = pk.tx; pk.y = pk.ty; } pk.raf = requestAnimationFrame(peekLoop); }
  });
  $$('[data-case-img]', casesList).forEach(function (row) {
    row.addEventListener('pointerenter', function () {
      if (!fine.matches) return;
      var src = row.dataset.caseImg;
      if (peekImg.getAttribute('src') !== src) peekImg.setAttribute('src', src);
      pk.on = true;
      peek.classList.add('is-on');
    });
  });
  casesList.addEventListener('pointerleave', function () { pk.on = false; peek.classList.remove('is-on'); });
  // pré-carrega as prévias quando o navegador estiver livre
  if (fine.matches) {
    var peekIO = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      peekIO.disconnect();
      (window.requestIdleCallback || setTimeout)(function () {
        $$('[data-case-img]').forEach(function (r) { var i = new Image(); i.decoding = 'async'; i.src = r.dataset.caseImg; });
      });
    }, { rootMargin: '100% 0px' });
    peekIO.observe(casesList);
  }

  /* ---------------------------------------------------------------- sobre: o retrato sai de dentro do monograma */
  var about = $('[data-about]');
  var aboutMonos = $$('[data-about-mono]');
  var aboutSky = $('[data-about-sky]');
  var aboutPerson = $('[data-about-person]');
  var AB = { x: 40, y: 472, s: 1.088, px: -7, py: 0, mx: 0, my: 0, neck: 520 };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 4); };
  function paintAbout() {
    if (!about || !aboutNear) return;
    var vh = window.innerHeight;
    var r = rect(about);
    if (r.bottom < -50 || r.top > vh + 50) return;
    // o progresso conta a partir da borda do monograma, não do topo da imagem
    var monoTop = r.top + r.height * (AB.y / 860);
    var p = reduce.matches ? 1 : clamp((vh - monoTop) / (vh * 0.6));
    // o monograma assenta primeiro; o retrato sobe através dele logo depois
    var m = easeOut(smooth(0, 0.4, p));
    var u = easeOut(smooth(0.22, 1, p));
    var hover = fine.matches && !reduce.matches;
    AB.mx += ((hover ? mouse.sx : 0) - AB.mx) * 0.08;
    AB.my += ((hover ? mouse.sy : 0) - AB.my) * 0.08;
    var my = AB.y + (1 - m) * 90 + AB.my * 4;
    var mx = AB.x - AB.mx * 6;
    var ms = AB.s * (0.94 + 0.06 * m);
    // escala a partir do centro do monograma
    var cx = mx + (514.7 * (AB.s - ms)) / 2;
    var t = 'translate(' + cx.toFixed(2) + ' ' + my.toFixed(2) + ') scale(' + ms.toFixed(4) + ')';
    aboutMonos.forEach(function (el) { setAttr(el, 'transform', t); });
    var py = AB.py + (1 - u) * 540 + AB.my * 8;
    // quando o retrato termina de subir, a área livre desce até o pescoço,
    // para o queixo não ser cortado no vão do V; durante a subida a borda é a do monograma
    var neck = py + AB.neck;
    var k = smooth(my + 110, my + 70, neck);
    var sky = my + Math.max(0, neck - my) * k;
    setAttr(aboutSky, 'height', (sky + 600 + 1).toFixed(1));
    setAttr(aboutPerson, 'x', (AB.px + AB.mx * 14).toFixed(1));
    setAttr(aboutPerson, 'y', py.toFixed(1));
  }

  /* ---------------------------------------------------------------- avaliações */
  var tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      panel.classList.toggle('is-in', on);
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      else if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === 'Home') n = tabs[0];
      else if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------------------------------------------------------------- laço único */
  var dirty = true;
  function frame() {
    requestAnimationFrame(frame);
    mouse.sx += (mouse.x - mouse.sx) * 0.08;
    mouse.sy += (mouse.y - mouse.sy) * 0.08;
    if (heroGrad && heroGrad.ok) {
      heroGrad.pointer(mouse.sx, mouse.sy, fine.matches ? 1 : 0);
      if (specXY) {
        var gx = heroGrad.p.posX + heroGrad.offset.x, gy = heroGrad.p.posY + heroGrad.offset.y;
        var f2 = function (v) { return (Math.abs(v) < 0.005 ? 0 : v).toFixed(2); };
        var xy = f2(gx) + ' / ' + f2(gy);
        if (specXY._t !== xy) { specXY._t = xy; specXY.textContent = xy; }
      }
    }
    // leituras primeiro: tudo o que o quadro vai medir, num único cálculo de layout
    rects.clear();
    var wasDirty = dirty;
    if (portalNear) rect(portal);
    if (aboutNear) rect(about);
    specs.forEach(function (sp) { if (sp.live) rect(sp.li); });
    if (wasDirty) {
      darkZones.forEach(rect);
      if (traceSvg && traceNear) rect(traceSvg);
      if (layers && !fine.matches) rect(layers);
      if (!fine.matches) specs.forEach(function (sp) { rect(sp.li); });
    }
    // depois as escritas: o portal acompanha a rolagem e o cursor; o resto, só a rolagem
    portalPaint();
    paintAbout();
    drawTrace();
    stepSpecimens();
    if (wasDirty) {
      dirty = false;
      toneHeader();
      paintStatement();
      paintLayersByScroll();
      paintSpecimensByScroll();
      if (traceNear) aimTrace();
    }
  }
  // quem está perto da tela: o resto do quadro nem é medido
  var portalNear = true, aboutNear = false, traceNear = false;
  var nearIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.target === portal) portalNear = en.isIntersecting;
      else if (en.target === about) aboutNear = en.isIntersecting;
      else if (en.target === trace) traceNear = en.isIntersecting;
    });
    dirty = true;
  }, { rootMargin: '25% 0px' });
  [portal, about, trace].forEach(function (el) { if (el) nearIO.observe(el); });
  window.addEventListener('scroll', function () { dirty = true; }, { passive: true });

  var lastW = 0, resizeT = 0;
  function relayout(force) {
    var w = window.innerWidth;
    portalLayout();
    if (force === true || w !== lastW) {
      lastW = w;
      if (stWords.length) measureStatement();
      buildLayers();
      measureSpecimens();
      layoutTrace();
    }
    dirty = true;
  }
  function relayoutAll() { relayout(true); }
  function prepText() { prepStatement(); prepSpecimens(); buildLayers(); dirty = true; }
  document.addEventListener('vs:lang', function () { prepText(); relayout(true); });
  window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(relayout, 120); });
  reduce.addEventListener('change', relayoutAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayoutAll);

  prepText();
  relayout();
  requestAnimationFrame(frame);
})();
