/* Papatya Çayı'nda kazanılanların diğer oyunlarda kullanılması.
   Tek yerde tutulur: lingo_odul_<kişi>. Papatya kazandırır, Likya Yolu ve
   Ailecük harcar. */
(function(){
  function ad(){
    try{ const a = localStorage.getItem("lingo_kisi");
         return (a && a !== "__kayitsiz__") ? a : null; }catch(e){ return null; }
  }
  function anahtar(k){ return "lingo_odul_" + (k || ad() || "?"); }
  function bos(){ return {akce:0, akceHarcanan:0, kupon:0, kuponHarcanan:0}; }
  function oku(k){
    try{ const v = JSON.parse(localStorage.getItem(anahtar(k)) || "null");
         return Object.assign(bos(), (v && typeof v === "object") ? v : {}); }
    catch(e){ return bos(); }
  }
  function yaz(d, k){
    try{ localStorage.setItem(anahtar(k), JSON.stringify(d)); }catch(e){}
    return d;
  }
  function papatyaMeta(k){
    try{ const v = JSON.parse(localStorage.getItem("lingo_papatya_meta_" + (k || ad() || "?")) || "null");
         return (v && typeof v === "object") ? v : {}; }catch(e){ return {}; }
  }
  window.LG_Odul = {
    /* kullanilabilir bakiye */
    durum(k){
      const d = oku(k), P = papatyaMeta(k);
      const kelime = P.kelime || 0;
      const ind = Math.min(20, Math.floor(kelime / 100) * 5);   /* %0 ile %20 arasi */
      return {
        akce: Math.max(0, (d.akce || 0) - (d.akceHarcanan || 0)),
        kupon: Math.max(0, (d.kupon || 0) - (d.kuponHarcanan || 0)),
        indirim: ind, kelime: kelime, seri: P.gunSeri || 0, sonGun: P.sonGun || null
      };
    },
    kazan(n, kupon, k){
      const d = oku(k);
      d.akce = (d.akce || 0) + (n || 0);
      if(kupon) d.kupon = (d.kupon || 0) + kupon;
      yaz(d, k);
    },
    akceHarca(n, k){
      const d = oku(k), kalan = (d.akce || 0) - (d.akceHarcanan || 0);
      if(n > kalan) return 0;
      d.akceHarcanan = (d.akceHarcanan || 0) + n; yaz(d, k);
      return n;
    },
    kuponHarca(k){
      const d = oku(k), kalan = (d.kupon || 0) - (d.kuponHarcanan || 0);
      if(kalan <= 0) return false;
      d.kuponHarcanan = (d.kuponHarcanan || 0) + 1; yaz(d, k);
      return true;
    },
    /* gunun papatyasi bugun cozuldu mu */
    bugun(k){
      const P = papatyaMeta(k);
      const b = new Date();
      const g = b.getFullYear() + "-" + String(b.getMonth()+1).padStart(2,"0") +
                "-" + String(b.getDate()).padStart(2,"0");
      return {cozuldu: P.sonGun === g, seri: P.gunSeri || 0, gun: g};
    }
  };
})();
