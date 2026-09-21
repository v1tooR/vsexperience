/* VS Experience · Páginas de serviço
   Comportamento compartilhado: cabeçalho, progresso de leitura, scrollspy,
   revelações no scroll, linha do processo, abas dos mockups, cursor,
   inclinação do mockup, brilho dos planos, WhatsApp e cópia de link. */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var WHATSAPP = '5512991833641';

  /* WhatsApp: o href estático já abre a conversa; aqui entra a mensagem do serviço. */
  document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
    var message = link.getAttribute('data-whatsapp') || body.getAttribute('data-whatsapp') || '';
    link.href = 'https://wa.me/' + WHATSAPP + (message ? '?text=' + encodeURIComponent(message) : '');
  });

  /* Cabeçalho, barra de leitura e linha do processo */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('readProgress');
  var processList = document.querySelector('.process-list');
  var steps = processList ? Array.prototype.slice.call(processList.querySelectorAll('.process-step')) : [];
  var ticking = false;

  function updateScroll() {
    var y = window.scrollY;
    var total = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (total > 0 ? Math.min(1, y / total) : 0) + ')';
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (processList) {
      var anchor = window.innerHeight * 0.62;
      var rect = processList.getBoundingClientRect();
      var ratio = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      processList.style.setProperty('--process-progress', ratio.toFixed(3));
      steps.forEach(function (step) {
        step.classList.toggle('is-reached', step.getBoundingClientRect().top + 20 < anchor);
      });
    }
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateScroll); }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  updateScroll();

  /* Scrollspy: seções com data-spy acendem o link correspondente */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('[data-spy-link]'));
  var spySections = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
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
  var revealTargets = document.querySelectorAll('.reveal, .range, .compose');
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

  /* Abas dos mockups (padrão WAI-ARIA com setas, Home e End) */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
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
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); activate(next, true); }
      });
    });
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

  if (!finePointer || reduceMotion) return;

  /* Inclinação do mockup e deslocamento do brilho do hero */
  var hero = document.querySelector('.hero');
  var stageInner = document.querySelector('.stage-inner');
  if (hero) {
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--gx', (x * 70).toFixed(1) + 'px');
      hero.style.setProperty('--gy', (y * 56).toFixed(1) + 'px');
      if (stageInner) {
        stageInner.style.setProperty('--tilt-y', (x * 7).toFixed(2) + 'deg');
        stageInner.style.setProperty('--tilt-x', (-y * 5).toFixed(2) + 'deg');
      }
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--gx', '0px');
      hero.style.setProperty('--gy', '0px');
      if (stageInner) {
        stageInner.style.setProperty('--tilt-y', '0deg');
        stageInner.style.setProperty('--tilt-x', '0deg');
      }
    });
  }

  /* Brilho que acompanha o ponteiro nos planos e nas linhas de serviço */
  document.querySelectorAll('.plan, [data-glow]').forEach(function (el) {
    el.addEventListener('pointermove', function (event) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', (event.clientX - rect.left).toFixed(0) + 'px');
      el.style.setProperty('--my', (event.clientY - rect.top).toFixed(0) + 'px');
    });
  });

  /* Cursor do site principal: segue com atraso e se deforma com a velocidade */
  var cursor = document.createElement('div');
  cursor.className = 'cursor is-hidden';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<div class="cursor-squeeze"><div class="cursor-circle"></div></div>';
  body.appendChild(cursor);
  var squeezeEl = cursor.firstChild;
  var mouse = { x: -100, y: -100 };
  var pos = { x: -100, y: -100 };
  var frame = null;
  var INTERACTIVE = 'a, button, summary, [role="tab"], label, input, select, textarea';

  function renderCursor() {
    var dx = mouse.x - pos.x;
    var dy = mouse.y - pos.y;
    pos.x += dx * 0.35;
    pos.y += dy * 0.35;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var squeeze = Math.min(distance / 1500, 0.15);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    cursor.style.transform = 'translate3d(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px,0)';
    squeezeEl.style.transform = 'rotate(' + angle.toFixed(1) + 'deg) scale(' + (1 + squeeze).toFixed(3) + ',' + (1 - squeeze).toFixed(3) + ')';
    frame = (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) ? window.requestAnimationFrame(renderCursor) : null;
  }

  window.addEventListener('pointermove', function (event) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    if (cursor.classList.contains('is-hidden')) {
      pos.x = mouse.x; pos.y = mouse.y;
      cursor.classList.remove('is-hidden');
    }
    var target = event.target && event.target.closest ? event.target.closest(INTERACTIVE) : null;
    cursor.classList.toggle('is-active', !!target);
    if (!frame) frame = window.requestAnimationFrame(renderCursor);
  }, { passive: true });
  document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
  window.addEventListener('blur', function () { cursor.classList.add('is-hidden'); });
  window.addEventListener('pointerdown', function () { cursor.classList.add('is-pressed'); });
  window.addEventListener('pointerup', function () { cursor.classList.remove('is-pressed'); });
})();
