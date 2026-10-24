const V = 'legenda-b723265312', FONTS = 'legenda-fonts';
const CORE = ['./', 'index.html', 'game.bin?v=b723265312', 'manifest.webmanifest', 'assets/icon-192.png', 'assets/apple-touch-icon.png', 'assets/archivo-latin.woff2', 'assets/archivo-latin-ext.woff2', 'assets/bigshoulders-latin.woff2', 'assets/bigshoulders-latin-ext.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open(FONTS).then(c => c.match(r).then(hit => hit || fetch(r).then(res => { c.put(r, res.clone()); return res; }))));
    return;
  }
  if (u.origin !== location.origin) return;
  // stránka: nejdřív síť (ať je vidět nová verze), bez signálu z mezipaměti
  if (r.mode === 'navigate') { e.respondWith(fetch(r.url, { cache: 'no-cache' }).then(res => { caches.open(V).then(c => c.put('index.html', res.clone())); return res; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) caches.open(V).then(c => c.put(r, res.clone())); return res; })));
});
