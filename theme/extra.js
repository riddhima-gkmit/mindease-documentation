// Keyboard shortcut: press "t" to toggle dark/light palette
(function () {
  document.addEventListener('keydown', function (e) {
    // Ignore inside inputs
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key.toLowerCase() === 't') {
      const btn = document.querySelector('[data-md-toggle="palette"]');
      if (btn) btn.click();
    }
    // Arrow navigation for prev/next
    if (e.key === 'ArrowRight') {
      const next = document.querySelector('a.md-footer__link--next');
      if (next) next.click();
    }
    if (e.key === 'ArrowLeft') {
      const prev = document.querySelector('a.md-footer__link--prev');
      if (prev) prev.click();
    }
  });
})();
