/* Plano Personalizado: soma os data-price escolhidos e sugere um pacote quando ele sai mais em conta. */
(function () {
  'use strict';
  var form = document.querySelector('[data-custom-plan]');
  if (!form) return;
  var card = form.closest('.plan');
  var totalEl = card.querySelector('[data-custom-total]');
  var summaryEl = card.querySelector('[data-custom-summary]');
  var suggestionEl = card.querySelector('[data-custom-suggestion]');
  var cta = card.querySelector('[data-custom-cta]');
  var chips = form.querySelector('.custom-chips');
  var nets = Array.prototype.slice.call(form.querySelectorAll('input[name="rede"]'));
  var qtys = Array.prototype.slice.call(form.querySelectorAll('.stepper input'));
  var extras = Array.prototype.slice.call(form.querySelectorAll('input[name="extra"]'));
  var base = Number(form.getAttribute('data-base')) || 0;
  var netPrice = Number(chips.getAttribute('data-net-price')) || 0;
  var mirrorPrice = Number(chips.getAttribute('data-mirror-price')) || 0;
  var plans = Array.prototype.slice.call(document.querySelectorAll('[data-package]'));
  var names = { videos: 'vídeos/Reels', artes: 'artes estáticas', carrosseis: 'carrosséis', stories: 'stories' };
  var single = { videos: 'vídeo/Reel', artes: 'arte estática', carrosseis: 'carrossel', stories: 'story' };

  function money(n) { return 'R$ ' + n.toLocaleString('pt-BR'); }
  function list(items) { return items.length > 1 ? items.slice(0, -1).join(', ') + ' e ' + items[items.length - 1] : items.join(''); }
  function clampInput(input) {
    var max = Number(input.max);
    var v = Math.round(Number(input.value));
    if (!isFinite(v) || v < 0) v = 0;
    if (v > max) v = max;
    input.value = v;
    return v;
  }

  // Preços exibidos vêm dos mesmos data-price usados no cálculo.
  qtys.forEach(function (input) {
    var label = form.querySelector('[data-unit="' + input.id + '"]');
    if (label) label.textContent = money(Number(input.getAttribute('data-price')));
  });
  form.querySelector('[data-net-price]').textContent = '+ ' + money(netPrice);
  form.querySelector('[data-mirror-price]').textContent = '+ ' + money(mirrorPrice);
  extras.forEach(function (input) { input.parentElement.querySelector('b').textContent = '+ ' + money(Number(input.getAttribute('data-price'))); });

  function state() {
    var s = { redes: [], extras: [], total: base, content: 0 };
    var hasInstagram = false;
    nets.forEach(function (input) {
      if (!input.checked) return;
      // A primeira rede marcada está inclusa na base.
      if (s.redes.length) s.total += input.value === 'Facebook' && hasInstagram ? mirrorPrice : netPrice;
      if (input.value === 'Instagram') hasInstagram = true;
      s.redes.push(input.value);
    });
    qtys.forEach(function (input) {
      var v = clampInput(input);
      s[input.name] = v;
      s.content += v;
      s.total += v * Number(input.getAttribute('data-price'));
      input.previousElementSibling.disabled = v <= 0;
      input.nextElementSibling.disabled = v >= Number(input.max);
    });
    extras.forEach(function (input) {
      if (!input.checked) return;
      s.extras.push(input.value);
      s.total += Number(input.getAttribute('data-price'));
    });
    return s;
  }
  function covers(pkg, s) {
    return s.redes.every(function (r) { return pkg.redes.indexOf(r) > -1; }) &&
      s.extras.every(function (e) { return pkg.extras.indexOf(e) > -1; }) &&
      ['videos', 'artes', 'carrosseis', 'stories'].every(function (k) { return s[k] <= pkg[k]; });
  }
  function contentText(s) {
    return ['videos', 'artes', 'carrosseis', 'stories'].filter(function (k) { return s[k] > 0; })
      .map(function (k) { return s[k] + ' ' + (s[k] === 1 ? single[k] : names[k]); });
  }
  function render() {
    var s = state();
    var items = contentText(s);
    var extraText = extras.filter(function (i) { return i.checked; }).map(function (i) { return i.parentElement.querySelector('span').textContent.toLowerCase(); });
    totalEl.textContent = money(s.total);
    summaryEl.textContent = s.content
      ? list(s.redes) + ' · ' + list(items) + ' por mês' + (extraText.length ? ' · ' + list(extraText) : '') + '.'
      : 'Escolha ao menos um conteúdo para montar seu plano.';

    var best = null;
    plans.forEach(function (plan) {
      var pkg = JSON.parse(plan.getAttribute('data-package'));
      if (pkg.price <= s.total && covers(pkg, s) && (!best || pkg.price < best.pkg.price)) best = { plan: plan, pkg: pkg };
    });
    suggestionEl.hidden = !best || !s.content;
    if (best && s.content) {
      var name = best.plan.querySelector('h3').textContent;
      suggestionEl.textContent = 'O plano ' + name + ' cobre essa seleção por ' + money(best.pkg.price) + '/mês. ';
      var go = document.createElement('button');
      go.type = 'button';
      go.textContent = 'Ver plano ' + name;
      go.addEventListener('click', function () {
        var index = Array.prototype.indexOf.call(best.plan.parentElement.children, best.plan);
        var choice = document.querySelector('.plan-slider-controls:not([hidden]) [data-plan-target="' + index + '"]');
        if (choice) choice.click();
        else best.plan.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      suggestionEl.appendChild(go);
    }

    var message = 'Olá, Victor! Montei um plano VS Social personalizado: ' + list(s.redes) + '; ' + list(items) + ' por mês' +
      (extraText.length ? '; ' + list(extraText) : '') + '. Estimativa: ' + money(s.total) + '/mês. Podemos conversar?';
    cta.setAttribute('data-whatsapp', message);
    cta.href = 'https://wa.me/5512991833641?text=' + encodeURIComponent(message);
    cta.classList.toggle('is-disabled', !s.content);
    cta.setAttribute('aria-disabled', String(!s.content));
    if (s.content) cta.removeAttribute('tabindex'); else cta.tabIndex = -1;
  }

  form.addEventListener('submit', function (event) { event.preventDefault(); });
  nets.forEach(function (input) {
    input.addEventListener('change', function () {
      // Pelo menos uma rede precisa continuar marcada.
      if (!nets.some(function (i) { return i.checked; })) input.checked = true;
    });
  });
  form.addEventListener('click', function (event) {
    var button = event.target.closest('[data-step]');
    if (!button) return;
    var input = document.getElementById(button.getAttribute('aria-controls'));
    input.value = Number(input.value) + Number(button.getAttribute('data-step'));
    render();
  });
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  render();
})();

/* Planos: rolagem nativa e comparação por slider nas telas menores. */
(function () {
  'use strict';
  var track = document.getElementById('plan-slider-track');
  var controls = document.querySelector('.plan-slider-controls');
  if (!track || !controls) return;
  var cards = Array.prototype.slice.call(track.querySelectorAll(':scope > .plan'));
  var choices = Array.prototype.slice.call(controls.querySelectorAll('[data-plan-target]'));
  var previous = controls.querySelector('[data-plan-prev]');
  var next = controls.querySelector('[data-plan-next]');
  var status = controls.querySelector('[data-plan-status]');
  var mobile = window.matchMedia('(max-width: 1080px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = 0;
  var scrollTimer;

  function position(index) { return cards[index].offsetLeft - cards[0].offsetLeft; }
  function fitHeight() {
    if (!mobile.matches) return;
    var height = Math.ceil(cards[current].getBoundingClientRect().height) + 'px';
    if (track.style.height !== height) track.style.height = height;
  }
  function select(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    choices.forEach(function (button, i) { button.setAttribute('aria-pressed', String(i === current)); });
    previous.disabled = current === 0;
    next.disabled = current === cards.length - 1;
    var label = cards[current].querySelector('h3').textContent + ' · ' + (current + 1) + ' de ' + cards.length;
    if (status.textContent !== label) status.textContent = label;
    cards.forEach(function (card, i) {
      card.inert = mobile.matches && i !== current;
      if (mobile.matches) card.setAttribute('aria-hidden', String(i !== current));
      else card.removeAttribute('aria-hidden');
    });
    fitHeight();
  }
  function go(index) {
    if (!mobile.matches) return;
    select(index);
    track.scrollTo({ left: position(current), behavior: reduced.matches ? 'auto' : 'smooth' });
  }
  function settled() {
    clearTimeout(scrollTimer);
    if (!mobile.matches) return;
    var closest = 0;
    cards.forEach(function (card, i) {
      if (Math.abs(position(i) - track.scrollLeft) < Math.abs(position(closest) - track.scrollLeft)) closest = i;
    });
    select(closest);
  }
  function layout() {
    clearTimeout(scrollTimer);
    controls.hidden = !mobile.matches;
    if (mobile.matches) {
      track.setAttribute('role', 'region');
      track.setAttribute('aria-roledescription', 'carrossel');
      track.setAttribute('aria-label', 'Planos VS Social');
      track.tabIndex = 0;
      cards.forEach(function (card, i) {
        card.setAttribute('role', 'group');
        card.setAttribute('aria-roledescription', 'slide');
        card.setAttribute('aria-label', (i + 1) + ' de ' + cards.length + ': ' + card.querySelector('h3').textContent);
      });
      select(current);
      requestAnimationFrame(function () { track.scrollTo({ left: position(current), behavior: 'auto' }); fitHeight(); });
    } else {
      track.style.removeProperty('height');
      track.removeAttribute('role');
      track.removeAttribute('aria-roledescription');
      track.removeAttribute('aria-label');
      track.removeAttribute('tabindex');
      cards.forEach(function (card) {
        card.inert = false;
        ['role', 'aria-roledescription', 'aria-label', 'aria-hidden'].forEach(function (attribute) { card.removeAttribute(attribute); });
      });
    }
  }
  choices.forEach(function (button) { button.addEventListener('click', function () { go(Number(button.getAttribute('data-plan-target'))); }); });
  previous.addEventListener('click', function () { go(current - 1); });
  next.addEventListener('click', function () { go(current + 1); });
  track.addEventListener('scroll', function () { clearTimeout(scrollTimer); scrollTimer = setTimeout(settled, 140); }, { passive: true });
  track.addEventListener('scrollend', settled);
  track.addEventListener('keydown', function (event) {
    if (!mobile.matches || event.target !== track) return;
    var target = current;
    if (event.key === 'ArrowRight') target++;
    else if (event.key === 'ArrowLeft') target--;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = cards.length - 1;
    else return;
    event.preventDefault();
    go(target);
  });
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(fitHeight);
    cards.forEach(function (card) { observer.observe(card); });
  }
  mobile.addEventListener('change', layout);
  window.addEventListener('resize', layout);
  layout();
})();
