/* Contentsquare Main Tracking Tag — Tag ID 79826ca565262 */
(function () {
  window._uxa = window._uxa || [];
  if (typeof CS_CONF === 'undefined') {
    window._uxa.push([
      'setPath',
      window.location.pathname + window.location.hash.replace('#', '?__'),
    ]);
    var mt = document.createElement('script');
    mt.type = 'text/javascript';
    mt.async = true;
    mt.src = '//t.contentsquare.net/uxa/79826ca565262.js';
    document.getElementsByTagName('head')[0].appendChild(mt);
  } else {
    window._uxa.push([
      'trackPageview',
      window.location.pathname + window.location.hash.replace('#', '?__'),
    ]);
  }
})();
