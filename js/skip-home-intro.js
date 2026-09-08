/** Mark home intro as already seen before navigating back to index. */
(function () {
  const KEY = 'cc-intro-played';
  function mark() {
    try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (
      href === 'index.html' ||
      href.startsWith('index.html#') ||
      href === './' ||
      href === '/' ||
      a.classList.contains('nav-home') ||
      a.classList.contains('nav-logo')
    ) {
      mark();
    }
  }, true);
})();
