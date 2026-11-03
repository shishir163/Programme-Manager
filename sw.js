// অফলাইনে খোলার জন্য অ্যাপের ফাইলগুলো জমা রাখে। নতুন সংস্করণ দিলে VERSION বদলান।
const VERSION = 'pm-v1.8.0';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'db.js', 'i18n.js', 'firebase-config.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'fonts/SolaimanLipi-Regular.woff2', 'fonts/SolaimanLipi-Bold.woff2', 'fonts/Kalpurush.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Firebase data always goes to the network (Firestore keeps its own offline copy).
  if (/googleapis\.com$|firebaseio\.com$/.test(url.hostname) && !url.hostname.startsWith('fonts.')) return;
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || url.hostname === 'www.gstatic.com' || url.hostname === 'cdnjs.cloudflare.com';
  if (!sameOrigin && !isFont) return;
  if (sameOrigin) {
    // App files: always try the network first (so every file comes from the same version), and fall back to the saved copy when offline.
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
