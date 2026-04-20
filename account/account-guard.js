(function () {
  if (localStorage.getItem('bloom_user')) return;
  var page = (location.pathname.split('/').pop() || 'my-account.html').replace(/[^a-z0-9._-]/gi, '');
  if (!page.endsWith('.html')) page = 'my-account.html';
  window.location.replace('../login.html?return=' + encodeURIComponent('account/' + page));
})();
