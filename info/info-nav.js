(function () {
  var INFO_PAGES = [
    'about-us.html',
    'our-story.html',
    'careers.html',
    'contact-us.html',
    'delivery-info.html',
    'privacy-policy.html',
    'terms-conditions.html'
  ];

  function validFrom(v) {
    if (!v || typeof v !== 'string') return false;
    if (/\.\.|^\/|\/\//.test(v)) return false;
    if (!/\.html$/i.test(v)) return false;
    return /^[a-z0-9/._-]+$/i.test(v);
  }

  function isInfoPageHref(href) {
    if (!href || href.startsWith('#') || href.startsWith('http')) return false;
    var file = href.split('?')[0].split('/').pop();
    return INFO_PAGES.indexOf(file) !== -1;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var from = params.get('from');
    if (!validFrom(from)) return;

    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!isInfoPageHref(href)) return;
      if (href.indexOf('from=') !== -1) return;
      a.setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + 'from=' + encodeURIComponent(from));
    });

    var wrap = document.getElementById('info-product-back-wrap');
    var back = document.getElementById('info-product-back');
    if (wrap && back) {
      back.setAttribute('href', '../' + from);
      wrap.removeAttribute('hidden');
    }
  });
})();
