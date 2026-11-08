// Serve o protótipo decifrado (guardado no Cache Storage pela tela de senha) nos endereços app/...
// Sem a senha, não há nada no cache: qualquer endereço app/ volta para a tela de senha.
const CACHE = 'mp-protegido';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const base = new URL('./app/', self.registration.scope);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
  e.respondWith((async () => {
    let caminho = url.pathname.slice(base.pathname.length);
    if (!caminho || caminho.endsWith('/')) caminho += 'index.html';
    const cache = await caches.open(CACHE);
    const r = await cache.match(new URL(caminho, base).href);
    if (r) return r;
    return Response.redirect(self.registration.scope, 302);
  })());
});
