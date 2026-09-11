/* Fiko: cevrimdisi calisma katmani. Otomatik uretildi, elle duzenleme.
   Uretim: 2026-09-11 12:07 */
const SURUM = "fiko-4a4b719b56";
const DOSYALAR = [
  "./",
  "4harf.html",
  "5harf.html",
  "6harf.html",
  "7harf.html",
  "alistirma4.html",
  "alistirma5.html",
  "alistirma6.html",
  "alistirma7.html",
  "fiko-180.png",
  "fiko-192.png",
  "fiko-32.png",
  "fiko-512.png",
  "fiko-maskable.png",
  "final.html",
  "index.html",
  "kervan-veri.json",
  "kervan.html",
  "kur.html",
  "manifest.webmanifest",
  "masa.html",
  "menu.js",
  "odul.js",
  "oyun-tanim.json",
  "oyun-veri.json",
  "oyun.html",
  "papatya-veri.json",
  "papatya.html",
  "plan.html",
  "pwa.js",
  "rapor.html",
  "rozet.js",
  "sertifika.html",
  "ses.js",
  "ses_yaz.js",
  "tema.js",
  "yaris.html",
  "yarisma.html",
  "yarisma.json",
  "assets/imza.png"
];
/* internetten gelen ama cevrimdisi de lazim olanlar */
const DISARI = [
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const k = await caches.open(SURUM);
    await k.addAll(DOSYALAR.map(u => new Request(u, {cache: "reload"})));
    await Promise.all(DISARI.map(u =>
      fetch(new Request(u, {mode: "no-cors", cache: "reload"}))
        .then(r => k.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const adlar = await caches.keys();
    await Promise.all(adlar.filter(a => a !== SURUM).map(a => caches.delete(a)));
    await self.clients.claim();
  })());
});

/* Once ondbellek, arkada guncelleme: cevrimdisi hep acilir,
   internet varken de bir sonraki acilis icin taze kopya iner. */
self.addEventListener("fetch", e => {
  const istek = e.request;
  if (istek.method !== "GET") return;
  const u = new URL(istek.url);
  const bizim = u.origin === location.origin;
  const dis = DISARI.some(x => istek.url.startsWith(x.split("?")[0]));
  if (!bizim && !dis) return;                   /* peerjs sunucusu vs. aga gitsin */
  e.respondWith((async () => {
    const k = await caches.open(SURUM);
    const kopya = await k.match(istek, {ignoreSearch: true});
    const ag = fetch(istek).then(r => {
      if (r && (r.ok || r.type === "opaque")) k.put(istek, r.clone()).catch(() => {});
      return r;
    }).catch(() => null);
    if (kopya) { e.waitUntil(ag); return kopya; }
    const r = await ag;
    if (r) return r;
    if (istek.mode === "navigate") return (await k.match("index.html")) || Response.error();
    return Response.error();
  })());
});
