/* VS Experience · Páginas de serviço
   Comportamento compartilhado: rolagem suave, cabeçalho, progresso de leitura,
   scrollspy, revelações, linha do processo, nome do serviço como espécime
   tipográfico, abas dos mockups com reprodução automática e cursor de
   demonstração, shader do fechamento, WhatsApp e cópia de link. */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var WHATSAPP = '5512991833641';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (n, a, b) { return Math.min(b, Math.max(a, n)); };

  /* WhatsApp: o href estático já abre a conversa; aqui entra a mensagem do serviço. */
  $$('[data-whatsapp]').forEach(function (link) {
    var message = link.getAttribute('data-whatsapp') || body.getAttribute('data-whatsapp') || '';
    link.href = 'https://wa.me/' + WHATSAPP + (message ? '?text=' + encodeURIComponent(message) : '');
  });

  /* Rolagem suave */
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -8, duration: 1.3 });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  }

  /* Shaders da marca (fechamento) */
  if (window.VSGradient) {
    $$('canvas[data-gradient]').forEach(function (c) {
      var params = null;
      try { params = JSON.parse(c.getAttribute('data-gradient-params') || 'null'); } catch (e) { params = null; }
      var grad = window.VSGradient.create(c, c.getAttribute('data-gradient'), { scale: 0.45, duration: 18, params: params || undefined });
      // cortina: faixa vermelha de altura fixa no topo, escuro onde fica o texto, em qualquer proporção de tela
      var band = parseFloat(c.getAttribute('data-curtain'));
      if (band && grad && grad.ok) {
        var fitCurtain = function () {
          var r = c.getBoundingClientRect();
          if (!r.height) return;
          var m = Math.min(r.width, r.height);
          var h = -(r.height / 2 - Math.min(band, r.height * 0.3, r.width * 0.6)) / m;
          grad.set({ horizPos: h, gradPos: h - 0.12 });
        };
        fitCurtain();
        window.addEventListener('resize', fitCurtain);
      }
    });
  }

  /* Cabeçalho, barra de leitura e linha do processo */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('readProgress');
  var processList = document.querySelector('.process-list');
  var steps = processList ? $$('.process-step', processList) : [];
  var ticking = false;

  function updateScroll() {
    var y = window.scrollY;
    var total = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (total > 0 ? Math.min(1, y / total) : 0) + ')';
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (processList) {
      var anchor = window.innerHeight * 0.62;
      var rect = processList.getBoundingClientRect();
      var ratio = clamp((anchor - rect.top) / rect.height, 0, 1);
      processList.style.setProperty('--process-progress', ratio.toFixed(3));
      steps.forEach(function (step) {
        step.classList.toggle('is-reached', step.getBoundingClientRect().top + 20 < anchor);
      });
    }
    paintWordByScroll();
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateScroll); }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);

  /* Scrollspy: seções com data-spy acendem o link correspondente */
  var spyLinks = $$('[data-spy-link]');
  var spySections = $$('[data-spy]');
  if ('IntersectionObserver' in window && spyLinks.length && spySections.length) {
    var visible = new Set();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
      });
      var current = spySections.filter(function (s) { return visible.has(s); })[0];
      var key = current ? current.getAttribute('data-spy') : null;
      spyLinks.forEach(function (link) {
        var on = link.getAttribute('data-spy-link') === key;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach(function (section) { spy.observe(section); });
  }

  /* Revelações no scroll: o conteúdo já nasce visível, o movimento só realça */
  var revealTargets = $$('.reveal, .range, .compose');
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------------- nome do serviço como espécime
     Cada letra ganha peso e largura conforme a proximidade do cursor, como na home. */
  var word = document.querySelector('[data-svc-word]');
  var letters = [];
  function fitWord() {
    if (!word) return;
    word.style.removeProperty('--fit');
    var box = word.parentElement.clientWidth;
    var fs = parseFloat(getComputedStyle(word).fontSize);
    var w = word.offsetWidth;
    var max = 12 * 16;
    if (w > 0) word.style.setProperty('--fit', Math.min(max, fs * (box * 0.93) / w).toFixed(1) + 'px');
  }
  function shapeWord(x) {
    if (!letters.length) return;
    var fs = parseFloat(getComputedStyle(word).fontSize) || 120;
    letters.forEach(function (l) {
      var f = 0;
      if (x != null) {
        var b = l.getBoundingClientRect();
        var d = (b.left + b.width / 2 - x) / (fs * 0.8);
        f = Math.exp(-d * d);
      }
      // a largura cresce menos que o peso para a palavra não estourar a linha
      l.style.setProperty('--lw', (100 + 38 * f).toFixed(1));
      l.style.setProperty('--lg', Math.round(300 + 600 * f));
      l.classList.toggle('is-hot', f > 0.72);
    });
  }
  function paintWordByScroll() {
    if (!word || finePointer || reduceMotion) return;
    var r = word.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var p = clamp(window.scrollY / Math.max(1, window.innerHeight * 0.6), 0, 1);
    shapeWord(r.left + r.width * (0.15 + p * 0.8));
  }
  if (word) {
    var text = word.textContent.trim();
    word.setAttribute('aria-hidden', 'true');
    word.innerHTML = Array.from(text).map(function (c) {
      return c === ' ' ? '<span class="l">&nbsp;</span>' : '<span class="l">' + c + '</span>';
    }).join('');
    letters = $$('.l', word);
    fitWord();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitWord(); requestScroll(); });
    window.addEventListener('resize', fitWord);
    if (!reduceMotion) {
      // entrada: uma onda de peso atravessa a palavra uma vez
      var t0 = null;
      var intro = function (t) {
        if (t0 === null) t0 = t;
        var k = (t - t0) / 1500;
        var r = word.getBoundingClientRect();
        if (k <= 1) { shapeWord(r.left - r.width * 0.1 + r.width * 1.2 * k); requestAnimationFrame(intro); }
        else if (finePointer) shapeWord(null);
        else paintWordByScroll();
      };
      setTimeout(function () { requestAnimationFrame(intro); }, 500);
      if (finePointer) {
        var hero = word.closest('.hero') || word;
        hero.addEventListener('pointermove', function (e) { shapeWord(e.clientX); });
        hero.addEventListener('pointerleave', function () { shapeWord(null); });
      }
    }
  }

  /* ---------------------------------------------------------------- abas dos mockups
     Padrão WAI-ARIA (setas, Home e End). Com o palco visível, as abas avançam
     sozinhas; um cursor de demonstração vai até o botão principal e clica. */
  var CURSOR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.5v17.2l4.6-4.3 3 6.6 3-1.4-3-6.4h6.3z" fill="#212121" stroke="#fafafa" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    var stage = list.closest('.stage');
    var api = { onUser: null };
    function activate(tab, focus) {
      tabs.forEach(function (item) {
        var on = item === tab;
        item.setAttribute('aria-selected', on ? 'true' : 'false');
        item.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, index) {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', function () { activate(tab, false); if (api.onUser) api.onUser(); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); activate(next, true); if (api.onUser) api.onUser(); }
      });
    });

    if (!stage || reduceMotion || !('IntersectionObserver' in window)) return;
    var inner = stage.querySelector('.stage-inner') || stage;
    var card = stage.querySelector('.float-card');
    var cursor = document.createElement('span');
    cursor.className = 'demo-cursor';
    cursor.innerHTML = CURSOR_SVG;
    inner.appendChild(cursor);
    var TAB_MS = 5200;
    stage.style.setProperty('--tab-ms', TAB_MS + 'ms');
    var timers = [];
    var inView = false;
    var paused = false;

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function current() { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; }
    function place(x, y) { cursor.style.setProperty('--cx', x.toFixed(1) + 'px'); cursor.style.setProperty('--cy', y.toFixed(1) + 'px'); }
    function restartBar() { stage.classList.remove('is-auto'); void stage.offsetWidth; stage.classList.add('is-auto'); }
    function targetIn(panel) {
      if (!panel) return null;
      var btns = $$('.m-btn', panel).filter(function (b) { return b.offsetParent !== null; });
      return btns.filter(function (b) { return !b.classList.contains('is-ghost'); })[0] || btns[0] || null;
    }
    function cycle() {
      clearTimers();
      if (!inView || paused) return;
      restartBar();
      var tab = current();
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      var target = targetIn(panel);
      var ib = inner.getBoundingClientRect();
      if (!cursor.classList.contains('is-on')) place(ib.width * 0.92, ib.height * 0.92);
      timers.push(setTimeout(function () {
        if (!target) return;
        var b = target.getBoundingClientRect();
        var ib2 = inner.getBoundingClientRect();
        cursor.classList.add('is-on');
        place(b.left - ib2.left + b.width * 0.62, b.top - ib2.top + b.height * 0.6);
      }, 650));
      timers.push(setTimeout(function () {
        if (!target) return;
        cursor.classList.remove('is-click'); void cursor.offsetWidth; cursor.classList.add('is-click');
        target.classList.add('is-pressed');
        setTimeout(function () { target.classList.remove('is-pressed'); }, 260);
        if (card) { card.classList.remove('is-pop'); void card.offsetWidth; card.classList.add('is-pop'); }
      }, 1850));
      timers.push(setTimeout(function () {
        var i = tabs.indexOf(current());
        activate(tabs[(i + 1) % tabs.length], false);
        cycle();
      }, TAB_MS));
    }
    function pause() { paused = true; clearTimers(); stage.classList.add('is-paused'); cursor.classList.remove('is-on'); }
    function resume() { paused = false; stage.classList.remove('is-paused'); cycle(); }
    api.onUser = function () { if (!paused) cycle(); };

    stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') pause(); });
    stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') resume(); });
    list.addEventListener('focusin', pause);
    list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) resume(); });
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) { setTimeout(cycle, 1200); } else { clearTimers(); stage.classList.remove('is-auto'); cursor.classList.remove('is-on'); }
    }, { threshold: 0.35 }).observe(stage);
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimers(); else cycle(); });
  });

  /* Copiar link */
  var toast = document.getElementById('toast');
  var copyButton = document.getElementById('copyLink');
  var toastTimer;
  if (copyButton && toast) {
    copyButton.addEventListener('click', function () {
      var url = window.location.href;
      var fallback = function () {
        var area = document.createElement('textarea');
        area.value = url; area.setAttribute('readonly', '');
        area.style.position = 'fixed'; area.style.opacity = '0';
        body.appendChild(area); area.select();
        try { document.execCommand('copy'); } catch (e) { /* sem suporte */ }
        area.remove();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).catch(fallback);
      else fallback();
      clearTimeout(toastTimer);
      toast.classList.add('show');
      toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
    });
  }

  updateScroll();
  if (!finePointer || reduceMotion) return;

  /* Inclinação leve do palco com o cursor */
  var heroEl = document.querySelector('.hero');
  var stageInner = document.querySelector('.stage-inner');
  if (heroEl && stageInner) {
    heroEl.addEventListener('pointermove', function (event) {
      var rect = heroEl.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      stageInner.style.setProperty('--tilt-y', (x * 6).toFixed(2) + 'deg');
      stageInner.style.setProperty('--tilt-x', (-y * 4).toFixed(2) + 'deg');
    });
    heroEl.addEventListener('pointerleave', function () {
      stageInner.style.setProperty('--tilt-y', '0deg');
      stageInner.style.setProperty('--tilt-x', '0deg');
    });
  }

  /* Brilho que acompanha o ponteiro nos planos e nas linhas de serviço */
  $$('.plan, [data-glow]').forEach(function (el) {
    el.addEventListener('pointermove', function (event) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', (event.clientX - rect.left).toFixed(0) + 'px');
      el.style.setProperty('--my', (event.clientY - rect.top).toFixed(0) + 'px');
    });
  });
})();
