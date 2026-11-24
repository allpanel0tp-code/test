self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// সার্ভার থেকে পুশ এলে (অ্যাপ বন্ধ থাকলেও) নোটিফিকেশন দেখায়
self.addEventListener('push', e => {
  let d = {};
  try { const j = e.data.json(); d = j.data || j.notification || j; } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || 'নতুন পোস্ট', {
    body: d.body || '',
    icon: 'launchericon-192x192.png',
    badge: 'launchericon-96x96.png',
    tag: d.channelId || 'post',
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => l.length ? l[0].focus() : clients.openWindow(url)));
});
