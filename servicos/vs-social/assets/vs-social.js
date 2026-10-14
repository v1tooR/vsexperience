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
