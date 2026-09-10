/* Sesle kelime yazma: mikrofona soylenen kelimeyi o turdaki gecerli kelimelere
   esler ve tahtaya yazar. final.html'deki mantigin ortak surumu. */
(function(){
  var SRC = window.SpeechRecognition || window.webkitSpeechRecognition;
  var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var ICTARAYICI = /\bwv\b|FBAN|FBAV|Instagram|Line\/|GSA\//.test(navigator.userAgent)
    && /Android/.test(navigator.userAgent);

  var SBIR = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  var SON10 = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş",
               "seksen", "doksan"];
  function sayiYazi(n){
    if(!isFinite(n) || n < 0) return "";
    if(n === 0) return "sıfır";
    var y = "";
    if(n >= 1000000){ var m = Math.floor(n/1000000);
      y += (m === 1 ? "bir" : sayiYazi(m)) + "milyon"; n %= 1000000; }
    if(n >= 1000){ var b = Math.floor(n/1000);
      y += (b === 1 ? "" : sayiYazi(b)) + "bin"; n %= 1000; }
    if(n >= 100){ var c = Math.floor(n/100);
      y += (c === 1 ? "" : SBIR[c]) + "yüz"; n %= 100; }
    return y + SON10[Math.floor(n/10)] + SBIR[n % 10];
  }
  function temiz(t){
    return String(t).replace(/\d+/g, function(m){ return sayiYazi(parseInt(m, 10)); })
      .toLocaleLowerCase("tr")
      .replace(/[âÂ]/g, "a").replace(/[îÎ]/g, "i").replace(/[ûÛ]/g, "u")
      .replace(/[^a-zçğıöşü]/g, "");
  }
  function mesafe(a, b){
    var m = a.length, n = b.length;
    if(Math.abs(m - n) > 3) return 99;
    var onc = new Array(n + 1), sim = new Array(n + 1), i, j, c, t;
    for(j = 0; j <= n; j++) onc[j] = j;
    for(i = 1; i <= m; i++){
      sim[0] = i;
      for(j = 1; j <= n; j++){
        c = a[i-1] === b[j-1] ? 0 : 1;
        sim[j] = Math.min(sim[j-1] + 1, onc[j] + 1, onc[j-1] + c);
      }
      t = onc; onc = sim; sim = t;
    }
    return onc[n];
  }

  var tanir = null, dinliyor = false, sonAra = "", sonuc = false, hata = false,
      araZaman = null, A = null, havuz = null, tus = null, satir = null;

  function durum(dinle, metin){
    if(tus){ tus.classList.toggle("dinle", !!dinle);
             tus.innerHTML = dinle ? "🎙 DİNLİYOR" : "🎙 SÖYLE"; }
    if(satir && metin !== undefined) satir.innerHTML = metin;
  }
  function esle(secenek){
    if(!havuz) havuz = A.havuz.filter(function(w){ return w[0] === A.ilk; });
    var iyi = null, i, k, c, w, d;
    for(i = 0; i < secenek.length; i++){
      c = temiz(secenek[i]);
      if(!c) continue;
      if(c.length === A.n && c[0] === A.ilk && A.gecerli(c)) return {w: c, ham: c, d: 0};
      for(k = 0; k < havuz.length; k++){
        w = havuz[k]; d = mesafe(c, w);
        if(!iyi || d < iyi.d) iyi = {w: w, ham: c, d: d};
        if(d === 0) break;
      }
    }
    return iyi;
  }
  function TRU(s){ return s.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase(); }
  function isle(secenek){
    if(sonuc) return;
    sonuc = true;
    var e = esle(secenek), duyulan = temiz(secenek[0] || "");
    if(!e || e.d > 2)
      return durum(false, 'duydum: <b>' + (duyulan ? TRU(duyulan) : "?") +
                   '</b> <s>bu uzunlukta karşılığı yok</s>');
    A.uygula(e.w);
    if(e.d === 0) durum(false, 'duydum: <b>' + TRU(e.w) + '</b> · yazdım');
    else durum(false, 'duydum: <b>' + TRU(duyulan) + '</b> · en yakını <b>' +
               TRU(e.w) + '</b>, yanlışsa SİL ile düzeltin');
  }
  function kurTanir(){
    var r = new SRC();
    r.lang = "tr-TR"; r.continuous = false; r.interimResults = true; r.maxAlternatives = 6;
    r.onstart = function(){ sonuc = false; hata = false; sonAra = "";
      clearTimeout(araZaman); durum(true, "şimdi söyleyin"); };
    r.onresult = function(ev){
      var ara = "", son = null, i, res, sec = [];
      for(i = ev.resultIndex; i < ev.results.length; i++){
        res = ev.results[i];
        if(res.isFinal) son = res; else ara += res[0].transcript;
      }
      if(!son){ if(ara.trim()){ sonAra = ara.trim();
        durum(true, 'duyuluyor: <b>' + sonAra + '</b>'); } return; }
      for(i = 0; i < son.length; i++) sec.push(son[i].transcript);
      isle(sec);
    };
    r.onspeechend = function(){
      clearTimeout(araZaman);
      araZaman = setTimeout(function(){ if(!sonuc && sonAra) isle([sonAra]); }, 900);
    };
    r.onerror = function(ev){
      hata = true; dinliyor = false;
      if(ev.error === "aborted") return;
      var izin = ev.error === "not-allowed" || ev.error === "service-not-allowed";
      var m = ({"no-speech": "ses gelmedi, tekrar deneyin",
                "audio-capture": "mikrofon başka uygulamada",
                "network": "internet gerekiyor"})[ev.error] || ev.error;
      durum(false, izin
        ? '<s>mikrofon izni kapalı</s> · kilit simgesi, İzinler, Mikrofon, İzin ver'
        : '<s>' + m + '</s>');
    };
    r.onend = function(){
      dinliyor = false;
      if(tus){ tus.classList.remove("dinle"); tus.innerHTML = "🎙 SÖYLE"; }
      if(!sonuc && sonAra) return isle([sonAra]);
      if(!sonuc && !hata) durum(false, "<s>ses alınamadı</s> · tekrar deneyin");
    };
    return r;
  }
  function bas(){
    if(!SRC) return;
    if(dinliyor){ dur(); return; }
    if(!tanir) tanir = kurTanir();
    try{ tanir.start(); dinliyor = true; durum(true, "hazırlanıyor"); }
    catch(e){ try{ tanir.abort(); }catch(e2){} dinliyor = false; }
  }
  function dur(){
    dinliyor = false; clearTimeout(araZaman); sonAra = ""; sonuc = true;
    if(tanir){ try{ tanir.abort(); }catch(e){} }
  }

  window.LG_Ses = {
    destek: function(){ return !!SRC; },
    ios: IOS, ictarayici: ICTARAYICI,
    /* ayar: {kap, n, ilk, havuz:[], gecerli:fn, uygula:fn} */
    kur: function(ayar){
      dur();
      A = ayar; havuz = null;
      if(!SRC) return null;
      /* kayan mod: klavyenin hemen ustunde duran tek tus */
      if(ayar.kayan){
        var eski = document.getElementById("seskayan");
        if(eski) eski.remove();
        var kutu = document.createElement("div");
        kutu.id = "seskayan"; kutu.className = "seskayan";
        tus = document.createElement("button");
        tus.type = "button"; tus.className = "sesbtn"; tus.innerHTML = "🎙 SÖYLE";
        tus.onclick = bas;
        satir = document.createElement("div"); satir.className = "sesdurum";
        kutu.appendChild(satir); kutu.appendChild(tus);
        document.body.appendChild(kutu);
        var k = document.getElementById("klavye");
        var h = k && !k.classList.contains("gizli")
          ? Math.round(k.getBoundingClientRect().height) : 0;
        kutu.style.bottom = (h + 8) + "px";
        return kutu;
      }
      if(!ayar.kap) return null;
      var sar = document.createElement("div");
      sar.className = "sesyaz";
      tus = document.createElement("button");
      tus.type = "button"; tus.className = "sesbtn"; tus.innerHTML = "🎙 SÖYLE";
      tus.onclick = bas;
      satir = document.createElement("div"); satir.className = "sesdurum";
      sar.appendChild(tus); ayar.kap.appendChild(sar); ayar.kap.appendChild(satir);
      return sar;
    },
    kapat: function(){
      dur();
      var e = document.getElementById("seskayan");
      if(e) e.remove();
      tus = null; satir = null;
    },
    dur: dur
  };
})();
