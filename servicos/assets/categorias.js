/* Progressive enhancement: native disclosures and static links work without JS. */
(function () {
  'use strict';
  var stages = document.querySelectorAll('.category-stage');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('is-in-view', entry.isIntersecting); });
    }, { threshold: .2 });
    stages.forEach(function (stage) { observer.observe(stage); });
  }
  function openAnchor() {
    if (!location.hash) return;
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
    var target = document.getElementById(id);
    if (target && target.classList.contains('catalog-item')) target.open = true;
  }
  openAnchor();
  window.addEventListener('hashchange', openAnchor);
  var previewLabel = document.querySelector('.category-preview-label');
  if (previewLabel) document.querySelectorAll('.hub-category-row').forEach(function (row) {
    row.addEventListener('pointerenter', function () { previewLabel.textContent = row.getAttribute('data-category-name'); });
  });
})();
