const CACHE='planning-v1';
const ASSETS=['./'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./'))));
});
self.addEventListener('push',e=>{
  const d=e.data?e.data.json():{title:'Rappel',body:'Tâche imminente'};
  e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:'./icon.png',badge:'./icon.png',vibrate:[200,100,200]}));
});
