const scheduled=new Map();
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).catch(()=>new Response('Hors ligne',{headers:{'Content-Type':'text/plain'}})));});
function cancelR(id){if(scheduled.has(id)){clearTimeout(scheduled.get(id));scheduled.delete(id);}}
function schedR(rem){
  cancelR(rem.id);
  const delay=rem.fireAt-Date.now();
  if(delay>0&&delay<8*24*3600*1000){
    const tid=setTimeout(()=>{
      self.registration.showNotification(rem.title,{
        body:rem.body||'',icon:'./favicon.ico',badge:'./favicon.ico',
        vibrate:rem.vibrate?[200,100,200,100,200]:[],
        silent:!rem.vibrate,tag:rem.id,requireInteraction:false
      });
      scheduled.delete(rem.id);
    },delay);
    scheduled.set(rem.id,tid);
  }
}
self.addEventListener('message',ev=>{
  const d=ev.data;if(!d||!d.type)return;
  if(d.type==='SCHEDULE'){schedR(d);}
  else if(d.type==='CANCEL'){cancelR(d.id);}
  else if(d.type==='RESCHEDULE_ALL'){
    scheduled.forEach((_,id)=>cancelR(id));
    (d.reminders||[]).forEach(r=>schedR(r));
  }
});
