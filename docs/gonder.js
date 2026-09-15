/* Fiko'nun defteri: zorlanilan kelimeleri Ramiz'in tablosuna tasir.
   Kisi "evet" demedikce hicbir sey gonderilmez. Oyun sayfalarina dokunmaz:
   defter localStorage'a yazilirken araya girer, yeni satirlari kuyruga alir,
   internet varken toplu yollar. Gonderilen: zaman, kisi, tur, sayfa, kelime, hak, detay. */
(function(){
  var URL_ = "https://script.google.com/macros/s/AKfycbxzJs95sQsFsdx17EUPjgp4qRRAekBhgm_wXAFNy75D82TZ3FRrvY-Mmxo0FlXZqhTvrg/exec";
  var KAYITSIZ = "__kayitsiz__", K_KUYRUK = "lingo_gonder_kuyruk", K_YOLDA = "lingo_gonder_yolda", K_SON = "lingo_gonder_son_",
      K_IZIN = "lingo_fiko_defter_", SAYFA = (location.pathname.split("/").pop() || "index.html").replace(".html","");

  function oku(k, v){ try{ var s = localStorage.getItem(k); return s === null ? v : s; }catch(e){ return v; } }
  function yaz(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function kisi(){ var k = oku("lingo_kisi", null); return (k && k !== KAYITSIZ) ? k : null; }
  function izin(ad){ return oku(K_IZIN + ad, ""); }          /* "evet" | "hayir" | "" */
  function acik(){ var k = kisi(); return !!k && izin(k) === "evet"; }

  /* ---- kuyruk ---- */
  function kuyruk(){ try{ var d = JSON.parse(oku(K_KUYRUK, "[]")); return Array.isArray(d) ? d : []; }catch(e){ return []; } }
  function ekle(o){
    if(!acik()) return;
    var d = kuyruk(); d.push(o); while(d.length > 500) d.shift();
    yaz(K_KUYRUK, JSON.stringify(d)); planla();
  }
  var zam = null, ugras = false;
  function planla(){ clearTimeout(zam); zam = setTimeout(gonder, 1500); }
  function dus(n){ var k = kuyruk().slice(n); yaz(K_KUYRUK, JSON.stringify(k)); }
  /* yolda: fetch cevabi gelmeden sayfa kapanirsa (keepalive yine teslim eder) bir sonraki
     acilista ayni kayitlar tekrar gitmesin diye kac kaydin yolda oldugu not edilir */
  function gonder(){
    if(ugras || !navigator.onLine) return;
    var d = kuyruk(); if(!d.length) return;
    ugras = true; yaz(K_YOLDA, String(d.length));
    fetch(URL_, {method:"POST", mode:"no-cors", keepalive:true,
                 headers:{"Content-Type":"text/plain"}, body: JSON.stringify(d)})
      .then(function(){ dus(d.length); return true; })
      .catch(function(){ return false; })
      .then(function(ok){ try{ localStorage.removeItem(K_YOLDA); }catch(e){}
                          ugras = false;   /* bu arada birikenler hemen, hata varsa 30 sn sonra */
                          if(kuyruk().length) setTimeout(gonder, ok ? 1000 : 30000); });
  }
  /* sayfa kapanirken kalanlari beacon ile at; fetch zaten yoldaysa ona birakilir (keepalive) */
  function kapanis(){
    if(ugras) return;
    var d = kuyruk(); if(!d.length || !navigator.sendBeacon) return;
    try{
      if(navigator.sendBeacon(URL_, new Blob([JSON.stringify(d)], {type:"text/plain"})))
        yaz(K_KUYRUK, "[]");
    }catch(e){}
  }
  (function(){ var n = +oku(K_YOLDA, "0"); if(n > 0){ dus(n); } try{ localStorage.removeItem(K_YOLDA); }catch(e){} })();
  window.addEventListener("online", gonder);
  window.addEventListener("pagehide", kapanis);
  document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "hidden") kapanis(); });

  /* ---- defter yazimini yakala: oyun kodu degismeden yeni kelimeler alinir ---- */
  function defterFarki(ad, eskiJson, yeniJson){
    var eski = [], yeni = [];
    try{ eski = JSON.parse(eskiJson || "[]"); }catch(e){}
    try{ yeni = JSON.parse(yeniJson || "[]"); }catch(e){}
    if(!Array.isArray(yeni)) return;
    var son = +oku(K_SON + ad, "0"), enSon = son;
    /* ilk acilista eski kayitlar gitmesin: son isaret yoksa mevcut defterin sonundan basla */
    if(!son && Array.isArray(eski) && eski.length){
      for(var j = 0; j < eski.length; j++) if(eski[j] && eski[j].t > son) son = eski[j].t;
      enSon = son;
    }
    for(var i = 0; i < yeni.length; i++){
      var s = yeni[i]; if(!s || !s.w || !(s.t > son)) continue;
      ekle({t: new Date(s.t).toISOString(), kisi: ad, tur: "kelime", sayfa: SAYFA,
            kelime: s.w, hak: s.k, detay: ""});
      if(s.t > enSon) enSon = s.t;
    }
    if(enSon !== son) yaz(K_SON + ad, String(enSon));
  }
  try{
    var asil = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k, v){
      var defter = typeof k === "string" && k.indexOf("lingo_defter_") === 0, eski = null;
      if(defter){ try{ eski = this.getItem(k); }catch(e){} }
      var r = asil.apply(this, arguments);
      if(defter) try{ defterFarki(k.slice(13), eski, v); }catch(e){}
      return r;
    };
  }catch(e){}

  /* ---- acilis ve hata ---- */
  function cihaz(){
    var ua = navigator.userAgent || "", m = ua.match(/\(([^)]+)\)/);
    return (m ? m[1] : ua).slice(0, 80) + " | " + screen.width + "x" + screen.height +
           (window.matchMedia && matchMedia("(display-mode: standalone)").matches ? " | pwa" : " | tarayici");
  }
  var hamle = [];
  document.addEventListener("click", function(e){
    var el = e.target && e.target.closest ? e.target.closest("button,a,[onclick],.tus,.harf") : null;
    if(!el) return;
    var ad = (el.textContent || el.getAttribute("aria-label") || el.id || el.className || "?").trim().slice(0, 16);
    hamle.push(ad); if(hamle.length > 15) hamle.shift();
  }, true);
  function hata(m){
    var k = kisi(); if(!k) return;
    ekle({t: new Date().toISOString(), kisi: k, tur: "hata", sayfa: SAYFA, kelime: "", hak: "",
          detay: (m + " || son: " + hamle.join(" > ")).slice(0, 900)});
  }
  window.addEventListener("error", function(e){
    hata((e.message || "hata") + " @" + ((e.filename || "").split("/").pop()) + ":" + (e.lineno || "?"));
  });
  window.addEventListener("unhandledrejection", function(e){
    var r = e.reason; hata("promise: " + (r && r.message ? r.message : String(r)).slice(0, 200));
  });
  function acilis(){
    var k = kisi(); if(!k) return;
    ekle({t: new Date().toISOString(), kisi: k, tur: "acilis", sayfa: SAYFA, kelime: "", hak: "",
          detay: cihaz() + " | " + (window.LG_SURUM || "")});
  }

  /* ---- soru ve menu ---- */
  var CSS = ".fkd{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:18px}" +
    ".fkd .kutu{background:#18222d;color:#eef2f6;border:1px solid #2b3846;border-radius:18px;padding:22px 20px;max-width:380px;width:100%;box-shadow:0 18px 50px rgba(0,0,0,.5);font-family:inherit}" +
    ":root[data-tema=gunduz] .fkd .kutu{background:#fff;color:#0f1720;border-color:#dde2e8}" +
    ".fkd img{width:64px;height:64px;border-radius:16px;display:block;margin:0 auto 12px}" +
    ".fkd h3{margin:0 0 10px;font-size:21px;line-height:1.3;text-align:center}" +
    ".fkd p{margin:0 0 18px;font-size:15px;line-height:1.5;opacity:.8;text-align:center}" +
    ".fkd .d{display:flex;gap:10px}.fkd button{flex:1;padding:15px 8px;border-radius:12px;border:0;font:inherit;font-size:18px;font-weight:700;cursor:pointer}" +
    ".fkd .e{background:#2e9e5b;color:#fff}.fkd .h{background:transparent;color:inherit;border:1px solid #5f6b78}";
  function sor(ad){
    if(document.getElementById("fkd")) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var d = document.createElement("div"); d.id = "fkd"; d.className = "fkd";
    d.innerHTML = '<div class="kutu"><img src="fiko-192.png" alt="">' +
      '<h3>Fiko zorlanılan kelimeleri yeni föye eklesin mi?</h3>' +
      '<p>Evet dersen bu kelimeler Ramiz\'e gider, föyü ona göre hazırlar.</p>' +
      '<div class="d"><button type="button" class="h">Hayır</button><button type="button" class="e">Evet</button></div></div>';
    document.body.appendChild(d);
    function sec(c){ yaz(K_IZIN + ad, c); d.remove(); menuYaz(); if(c === "evet") acilis(); }
    d.querySelector(".e").onclick = function(){ sec("evet"); };
    d.querySelector(".h").onclick = function(){ sec("hayir"); yaz(K_KUYRUK, "[]"); };
  }
  var mb = null;
  function menuYaz(){
    if(!mb) return;
    var k = kisi(), a = k && izin(k) === "evet";
    mb.style.display = k ? "" : "none";
    mb.querySelector("i").textContent = a ? "📒" : "📕";
    mb.querySelector("b").textContent = "Fiko'nun defteri: " + (a ? "açık" : "kapalı");
  }
  function menuKur(){
    var p = document.getElementById("mnl"); if(!p || mb) return true;
    mb = document.createElement("button"); mb.type = "button"; mb.setAttribute("data-is", "fiko");
    mb.innerHTML = "<i></i><b></b>";
    mb.onclick = function(){
      var k = kisi(); if(!k) return;
      var y = izin(k) === "evet" ? "hayir" : "evet";
      yaz(K_IZIN + k, y); if(y === "hayir") yaz(K_KUYRUK, "[]"); else acilis();
      menuYaz();
    };
    p.insertBefore(mb, p.querySelector("a"));
    menuYaz(); return true;
  }
  function kur(){
    var dene = 0, t = setInterval(function(){ if(menuKur() || ++dene > 20) clearInterval(t); }, 100);
    var k = kisi();
    if(k && !izin(k) && SAYFA !== "kur") setTimeout(function(){ sor(k); }, 600);
    else if(acik()) acilis();
    gonder();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();

  window.LG_Gonder = {acik: acik, sor: function(){ var k = kisi(); if(k) sor(k); }, gonder: gonder, kuyruk: kuyruk};
})();
