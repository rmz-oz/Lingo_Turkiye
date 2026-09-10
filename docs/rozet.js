/* Lingo, ortak ünvan ve rozet motoru. Tüm sayfalar bunu kullanır. */
const LG_KAYITSIZ = "__kayitsiz__";
function LG_kisi(){ try{ return localStorage.getItem("lingo_kisi"); }catch(e){ return null; } }
function LG_defter(ad){
  try{ const d = JSON.parse(localStorage.getItem("lingo_defter_"+ad)||"[]");
       return Array.isArray(d) ? d : []; }catch(e){ return []; }
}
function LG_plan(ad){
  try{ return JSON.parse(localStorage.getItem("lingo_plan_"+ad)||"{}"); }catch(e){ return {}; }
}
/* --- kisi listesi: eski isimleri kaydi yoksa temizler --- */
const LG_ESKI = ["Yusuf","Ramiz","Misafir"];
function LG_kisiler(varsayilan){
  let kayitli = null;
  try{ const k = JSON.parse(localStorage.getItem("lingo_kisiler")||"null");
       if(Array.isArray(k)) kayitli = k; }catch(e){}
  const liste = varsayilan.slice();
  for(const a of (kayitli || [])){
    if(liste.indexOf(a) >= 0) continue;
    if(LG_ESKI.indexOf(a) >= 0 && LG_defter(a).length === 0) continue;  /* eski, kaydi yok */
    liste.push(a);
  }
  try{
    for(let i=0;i<localStorage.length;i++){
      const key = localStorage.key(i);
      if(key && key.indexOf("lingo_defter_") === 0){
        const a = key.slice(13);
        if(a && liste.indexOf(a) < 0) liste.push(a);
      }
    }
  }catch(e){}
  if(!kayitli || kayitli.join("|") !== liste.join("|")){
    try{ localStorage.setItem("lingo_kisiler", JSON.stringify(liste)); }catch(e){}
  }
  return liste;
}
/* gecerli kisi silinmisse temizle */
function LG_kisiDogrula(liste){
  let k = null;
  try{ k = localStorage.getItem("lingo_kisi"); }catch(e){}
  if(k === LG_KAYITSIZ) return k;
  if(k && liste.indexOf(k) < 0){
    try{ localStorage.removeItem("lingo_kisi"); }catch(e){}
    return null;
  }
  return k;
}
/* --- sifirlama --- */
function LG_listeSifirla(varsayilan){
  try{ localStorage.setItem("lingo_kisiler", JSON.stringify(varsayilan.slice())); }catch(e){}
}
function LG_hepsiniSil(){
  try{
    const sil = [];
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k && k.indexOf("lingo_") === 0) sil.push(k);
    }
    for(const k of sil) localStorage.removeItem(k);
  }catch(e){}
}
const LG_UNVAN = [
  {n:0,    ad:"Çaylak"},              {n:5,    ad:"İlk Kıvılcım"},
  {n:12,   ad:"Acemi"},               {n:25,   ad:"Heveskar"},
  {n:40,   ad:"Kelime Meraklısı"},    {n:60,   ad:"Harf Toplayıcı"},
  {n:85,   ad:"Tahta Yoldaşı"},       {n:115,  ad:"Kelime Avcısı"},
  {n:150,  ad:"Harf Ustası"},         {n:195,  ad:"Sözlük Dostu"},
  {n:250,  ad:"Kelime Cambazı"},      {n:315,  ad:"Lingo Kurdu"},
  {n:390,  ad:"Alfabe Hakimi"},       {n:480,  ad:"Lingo Ustası"},
  {n:590,  ad:"Süper Lingo Adayı"},   {n:720,  ad:"Lingo Şampiyonu"},
  {n:880,  ad:"Efsane"},              {n:1080, ad:"Ölümsüz"},
  {n:1350, ad:"Sözlük Ejderi"},       {n:1700, ad:"Alfabenin Efendisi"}
];
function LG_unvan(say){
  const simdi = LG_UNVAN.slice().reverse().find(u => say >= u.n) || LG_UNVAN[0];
  const sonraki = LG_UNVAN.find(u => u.n > say) || null;
  const oran = sonraki ? Math.round(100*(say-simdi.n)/(sonraki.n-simdi.n)) : 100;
  return {simdi, sonraki, oran, kalan: sonraki ? sonraki.n - say : 0};
}
const LG_GOREVSAY = 16;   /* plandaki toplam gorev */
/* --- Bir Harf Kalmisti meta durumu (kalici ilerleme) --- */
function LG_kervanMeta(ad){
  try{ const v = JSON.parse(localStorage.getItem("lingo_kervan_meta_"+ad) || "null");
       return v && typeof v === "object" ? v : {}; }catch(e){ return {}; }
}
/* --- Papatya Cayi meta durumu (kalici ilerleme) --- */
function LG_papatyaMeta(ad){
  try{ const v = JSON.parse(localStorage.getItem("lingo_papatya_meta_"+ad) || "null");
       return v && typeof v === "object" ? v : {}; }catch(e){ return {}; }
}
/* --- Final alistirmasi meta durumu --- */
function LG_finalMeta(ad){
  try{ const v = JSON.parse(localStorage.getItem("lingo_final_"+ad) || "null");
       return v && typeof v === "object" ? v : {}; }catch(e){ return {}; }
}
function LG_rozet(d, p, kv, pv){
  p = p || {}; const K = kv || {}, P = pv || {};
  const bil = d.filter(r=>r.k>0), ilk = bil.filter(r=>r.k===1).length;
  const sonhak = bil.filter(r=>r.k>=5).length;
  let seri = 0, enSeri = 0;
  for(const r of d){ if(r.k>0){ seri++; enSeri = Math.max(enSeri, seri); } else seri = 0; }
  const son10 = d.slice(-10);
  const kusursuz = son10.length===10 && son10.every(r=>r.k>0);
  const gun = {};
  for(const r of d){ const g = new Date(r.t).toDateString(); gun[g] = (gun[g]||0)+1; }
  const enYogun = Math.max(0, ...Object.values(gun)), gunler = Object.keys(gun).length;
  const saatVar = (a,b)=>d.some(r=>{ const h=new Date(r.t).getHours();
    return a<=b ? (h>=a&&h<b) : (h>=a||h<b); });
  const durum = {}; let ikinci = false;
  for(const r of d){ if(r.k===0) durum[r.w]=true; else if(durum[r.w]) ikinci=true; }
  const grup = f => { const g=d.filter(f), b=g.filter(r=>r.k>0).length;
    return {t:g.length, o:g.length?Math.round(100*b/g.length):0}; };
  const g4=grup(r=>r.n===4), g5=grup(r=>r.n===5), g6=grup(r=>r.n===6), g7=grup(r=>r.n===7);
  const gk=grup(r=>r.h==="k"), gs=grup(r=>r.h==="s"), ga=grup(r=>r.h==="a");
  const ZOR = "aeikmsty".split("");
  const zorSay = d.filter(r=>ZOR.indexOf(r.h)>=0).length;
  const ort = bil.length ? bil.reduce((t,r)=>t+r.k,0)/bil.length : 9;
  const yapilan = Object.values(p).filter(Boolean).length;
  const gc=grup(r=>r.h==="ç"), gt=grup(r=>r.h==="t"), gb=grup(r=>r.h==="b");
  /* harf cesitliligi */
  const hSay = {};
  for(const r of d) hSay[r.h] = (hSay[r.h]||0)+1;
  const harfCesit = Object.keys(hSay).length;
  const besHarf = Object.values(hSay).filter(x=>x>=5).length;
  /* gun bazli */
  const gunHarf = {};
  for(const r of d){ const g=new Date(r.t).toDateString();
    (gunHarf[g] = gunHarf[g] || new Set()).add(r.h); }
  const cokYonlu = Object.values(gunHarf).some(x=>x.size>=4);
  /* ust uste 3 gun */
  const gunList = Object.keys(gun).map(g=>new Date(g).setHours(0,0,0,0)).sort((a,b)=>a-b);
  let ard=1, enArd=1;
  for(let i=1;i<gunList.length;i++){
    ard = (gunList[i]-gunList[i-1] === 86400000) ? ard+1 : 1;
    enArd = Math.max(enArd, ard);
  }
  /* yukselis: son 20 vs onceki 20 */
  /* ust uste ilk tahmin serisi */
  let ilkSeri=0, enIlkSeri=0;
  for(const r of d){ if(r.k===1){ ilkSeri++; enIlkSeri=Math.max(enIlkSeri,ilkSeri);} else ilkSeri=0; }
  /* geri donus: 5 hata sonrasi 5 dogru */
  let hataSeri=0, geriDonus=false, hataOldu=false;
  for(const r of d){
    if(r.k===0){ hataSeri++; if(hataSeri>=5) hataOldu=true; seri=0; }
    else { hataSeri=0; }
  }
  { let h=0,dg=0;
    for(const r of d){ if(r.k===0){ h++; dg=0; } else { dg++; if(h>=5&&dg>=5) geriDonus=true; } } }
  /* gun bazli uzunluk cesitliligi ve hata sayisi */
  const gunUz = {}, gunHata = {};
  for(const r of d){ const g=new Date(r.t).toDateString();
    (gunUz[g]=gunUz[g]||new Set()).add(r.n);
    if(r.k===0) gunHata[g]=(gunHata[g]||0)+1; }
  const ucUzunluk = Object.values(gunUz).some(x=>x.size>=3);
  const zorGun = Math.max(0,...Object.values(gunHata)) >= 10;
  /* saat cesitliligi */
  const sabahGun = new Set(), geceGun = new Set();
  for(const r of d){ const t=new Date(r.t), h=t.getHours();
    if(h>=5&&h<9) sabahGun.add(t.toDateString());
    if(h>=22||h<4) geceGun.add(t.toDateString()); }
  /* harf basari cesitliligi */
  const hB={};
  for(const r of d){ (hB[r.h]=hB[r.h]||{t:0,b:0}).t++; if(r.k>0) hB[r.h].b++; }
  const iyiHarf = Object.values(hB).filter(x=>x.t>=5 && x.b/x.t>=0.7).length;
  const tumAlfabe = Object.keys(hB).length >= 28;
  const tumUzunlukIyi = [4,5,6,7].every(n=>{ const g=grup(r=>r.n===n);
    return g.t>=10 && g.o>=70; });
  /* takildiktan sonra bilinen kelime sayisi */
  const dur2={}; let ikinciSay=0;
  for(const r of d){ if(r.k===0) dur2[r.w]=true; else if(dur2[r.w]){ ikinciSay++; dur2[r.w]=false; } }
  let yukselis = false;
  if(d.length >= 40){
    const s20=d.slice(-20), o20=d.slice(-40,-20);
    yukselis = s20.filter(r=>r.k>0).length > o20.filter(r=>r.k>0).length;
  }
  return [
   {e:"🌱",a:"İlk Adım",       s:"10 kelime",              v:d.length>=10},
   {e:"🔟",a:"Elli",           s:"50 kelime",              v:d.length>=50},
   {e:"💯",a:"Yüzler",         s:"100 kelime",             v:d.length>=100},
   {e:"🥇",a:"Üç Yüz",         s:"300 kelime",             v:d.length>=300},
   {e:"🎯",a:"Keskin Nişancı", s:"10 kelime ilk tahminde", v:ilk>=10},
   {e:"🏹",a:"Usta Nişancı",   s:"30 kelime ilk tahminde", v:ilk>=30},
   {e:"🔥",a:"Seri",           s:"5 kelime üst üste",      v:enSeri>=5},
   {e:"⚡",a:"Uzun Seri",      s:"10 kelime üst üste",     v:enSeri>=10},
   {e:"🌟",a:"Efsane Seri",    s:"20 kelime üst üste",     v:enSeri>=20},
   {e:"💎",a:"Kusursuz",       s:"son 10 kelimenin hepsi", v:kusursuz},
   {e:"👑",a:"K Fatihi",       s:"K'de 8 kelime, %70+",    v:gk.t>=8 && gk.o>=70},
   {e:"🛡",a:"S Fatihi",       s:"S'de 8 kelime, %70+",    v:gs.t>=8 && gs.o>=70},
   {e:"🗝",a:"A Fatihi",       s:"A'da 8 kelime, %70+",    v:ga.t>=8 && ga.o>=70},
   {e:"4️⃣",a:"Dörtlü Ustası",  s:"4 harflide 30, %80+",    v:g4.t>=30&&g4.o>=80},
   {e:"5️⃣",a:"Beşli Ustası",   s:"5 harflide 30, %70+",    v:g5.t>=30&&g5.o>=70},
   {e:"6️⃣",a:"Altılı Cesareti",s:"6 harflide 15 kelime",   v:g6.t>=15},
   {e:"7️⃣",a:"Süper Lingo",    s:"7 harflide 5 kelime",    v:g7.t>=5},
   {e:"📚",a:"Dört Uzunluk",   s:"her uzunluktan 5 kelime",
     v:g4.t>=5&&g5.t>=5&&g6.t>=5&&g7.t>=5},
   {e:"🎖",a:"Zor Harfler",    s:"A E İ K M S T Y'den 40", v:zorSay>=40},
   {e:"🚀",a:"Hızlı",          s:"ortalama 2 tahmin altı", v:d.length>=20 && ort<=2},
   {e:"⏳",a:"Sabırlı",        s:"son hakta 5 kelime",     v:sonhak>=5},
   {e:"♻️",a:"İkinci Şans",    s:"takıldığın kelimeyi bilmek", v:ikinci},
   {e:"🎓",a:"Tam Ders",       s:"bir günde 30 kelime",    v:enYogun>=30},
   {e:"🏃",a:"Maraton",        s:"bir günde 50 kelime",    v:enYogun>=50},
   {e:"🌙",a:"Gece Kuşu",      s:"gece 22-04 arası",       v:saatVar(22,4)},
   {e:"🌅",a:"Sabahçı",        s:"sabah 05-09 arası",      v:saatVar(5,9)},
   {e:"📅",a:"Azimli",         s:"4 ayrı günde çalışma",   v:gunler>=4},
   {e:"🗓",a:"Programlı",      s:"planın tüm görevleri",   v:yapilan>=LG_GOREVSAY},
   {e:"🌗",a:"Ç Fatihi",       s:"Ç'de 8 kelime, %70+",    v:gc.t>=8 && gc.o>=70},
   {e:"🐝",a:"T Fatihi",       s:"T'de 8 kelime, %70+",    v:gt.t>=8 && gt.o>=70},
   {e:"🦅",a:"B Fatihi",       s:"B'de 8 kelime, %70+",    v:gb.t>=8 && gb.o>=70},
   {e:"🧭",a:"On Harf",        s:"10 harften 5'er kelime", v:besHarf>=10},
   {e:"🗺",a:"Alfabe Gezgini", s:"20 farklı harf",         v:harfCesit>=20},
   {e:"🏔",a:"Beş Yüz",        s:"500 kelime",             v:d.length>=500},
   {e:"🌊",a:"Bin",            s:"1000 kelime",            v:d.length>=1000},
   {e:"🎬",a:"Yoğun Gün",      s:"bir günde 100 kelime",   v:enYogun>=100},
   {e:"🧨",a:"Hız Rekoru",     s:"ortalama 1,5 tahmin altı", v:d.length>=20 && ort<=1.5},
   {e:"🧱",a:"Duvar Ustası",   s:"6 harflide 40 kelime",   v:g6.t>=40},
   {e:"🏛",a:"Yedi Sütun",     s:"7 harflide 15 kelime",   v:g7.t>=15},
   {e:"🌇",a:"Akşamcı",        s:"akşam 18-22 arası",      v:saatVar(18,22)},
   {e:"☕",a:"Öğle Arası",     s:"öğlen 12-14 arası",      v:saatVar(12,14)},
   {e:"📈",a:"Yükseliş",       s:"son 20, önceki 20'den iyi", v:yukselis},
   {e:"🧗",a:"İstikrar",       s:"3 gün üst üste",         v:enArd>=3},
   {e:"🧪",a:"Çok Yönlü",      s:"bir günde 4 farklı harf", v:cokYonlu},
   {e:"🥁",a:"Kararlı",        s:"7 ayrı günde çalışma",   v:gunler>=7},
   {e:"🗿",a:"Sarsılmaz",      s:"7 gün üst üste",         v:enArd>=7},
   {e:"🎪",a:"Üçlü Gün",       s:"bir günde 3 farklı uzunluk", v:ucUzunluk},
   {e:"🧯",a:"Zor Gün",        s:"bir günde 10 kez takılıp devam", v:zorGun},
   {e:"🪄",a:"Sihirbaz",       s:"5 kelime üst üste ilk tahminde", v:enIlkSeri>=5},
   {e:"🎢",a:"Geri Dönüş",     s:"5 hatadan sonra 5 doğru", v:geriDonus},
   {e:"🧩",a:"Yapboz",         s:"6 ve 7 harflide 50 kelime", v:(g6.t+g7.t)>=50},
   {e:"🐎",a:"Koşucu",         s:"bir günde 200 kelime",   v:enYogun>=200},
   {e:"🕰",a:"Sabah Sporu",    s:"3 ayrı sabah çalışma",   v:sabahGun.size>=3},
   {e:"🌛",a:"Gece Nöbeti",    s:"3 ayrı gece çalışma",    v:geceGun.size>=3},
   {e:"🎓",a:"Mezun",          s:"tüm görevler + 400 kelime",
     v:yapilan>=LG_GOREVSAY && d.length>=400},
   {e:"🏅",a:"Dokuz Harf",     s:"9 harfte %70+ başarı",   v:iyiHarf>=9},
   {e:"🧠",a:"Hafıza Ustası",  s:"takıldığın 10 kelimeyi bilmek", v:ikinciSay>=10},
   {e:"🔮",a:"Kahin",          s:"50 kelime ilk tahminde", v:ilk>=50},
   {e:"🏆",a:"Kupa",           s:"dört uzunlukta da %70+", v:tumUzunlukIyi},
   {e:"🌍",a:"Tam Alfabe",     s:"28 harfin hepsinden kelime", v:tumAlfabe},
   /* --- Bir Harf Kalmisti --- */
   {e:"🥾",a:"Yol Yürüyeni",   s:"bir Likya rotasını bitir",     v:(K.bitirilen||0)>=1},
   {e:"🗿",a:"Yazıtı Okuyan",  s:"son yazıtı çöz",               v:(K.sonKapi||0)>=1},
   {e:"💧",a:"Son Damla",      s:"yolu tek matarayla bitir",     v:!!K.tekKalp},
   {e:"🎒",a:"Ağır Çanta",     s:"bir konakta 4 ürün al",        v:!!K.dortUrun},
   {e:"👣",a:"Yalın Ayak",     s:"yolu hiç ürün almadan bitir",  v:!!K.urunsuz},
   /* --- Papatya Cayi --- */
   {e:"🌼",a:"Tam Papatya",    s:"yedi harfin hepsini kullan",    v:(P.tam||0)>=1},
   {e:"🫖",a:"Demlik",         s:"bir papatyanın 12 saksısını doldur", v:(P.demlik||0)>=1},
   {e:"🌱",a:"Filizsiz",       s:"hiç yardım almadan 12/12",      v:!!P.yardimsiz},
   {e:"📅",a:"Yedi Gün",       s:"yedi gün üst üste günün papatyası", v:(P.enSeri||0)>=7},
   {e:"🌾",a:"Bahçıvan",       s:"papatyalarda 500 kelime",       v:(P.kelime||0)>=500}
  ];
}
function LG_acik(ad){
  return LG_rozet(LG_defter(ad), LG_plan(ad), LG_kervanMeta(ad),
                  LG_papatyaMeta(ad)).filter(r=>r.v); }
/* yeni acilan rozetleri dondur; ilk cagrida sessizce isaretler */
function LG_yeni(ad){
  if(!ad || ad === LG_KAYITSIZ) return [];
  const acik = LG_acik(ad).map(r=>r.a);
  let bilinen = null;
  try{ const x = localStorage.getItem("lingo_rozet_"+ad);
       if(x !== null) bilinen = JSON.parse(x); }catch(e){}
  try{ localStorage.setItem("lingo_rozet_"+ad, JSON.stringify(acik)); }catch(e){}
  if(bilinen === null) return [];                     /* ilk kurulum: duyurma */
  const yeniAd = acik.filter(a => bilinen.indexOf(a) < 0);
  return LG_rozet(LG_defter(ad), LG_plan(ad), LG_kervanMeta(ad), LG_papatyaMeta(ad))
    .filter(r => yeniAd.indexOf(r.a) >= 0);
}
/* --- rozet vitrini: en fazla 3 favori --- */
function LG_vitrin(ad){
  try{ const v = JSON.parse(localStorage.getItem("lingo_vitrin_"+ad)||"[]");
       return Array.isArray(v) ? v : []; }catch(e){ return []; }
}
function LG_vitrinDegis(ad, rozAd){
  let v = LG_vitrin(ad);
  const i = v.indexOf(rozAd);
  if(i >= 0) v.splice(i,1);
  else { v.push(rozAd); if(v.length > 3) v.shift(); }
  try{ localStorage.setItem("lingo_vitrin_"+ad, JSON.stringify(v)); }catch(e){}
  return v;
}
/* kucuk rozet seridi: vitrin varsa onu, yoksa son kazanilanlari gosterir */
function LG_serit(ad, max){
  const a = LG_acik(ad);
  if(!a.length) return "";
  const v = LG_vitrin(ad);
  let g = v.length ? a.filter(r => v.indexOf(r.a) >= 0) : [];
  if(!g.length) g = max ? a.slice(-max) : a;
  return g.map(r=>`<span class="lgroz" title="${r.a}">${r.e}</span>`).join("");
}
/* --- unvan atlama --- */
function LG_unvanYeni(ad){
  if(!ad || ad === LG_KAYITSIZ) return null;
  const u = LG_unvan(LG_defter(ad).length).simdi.ad;
  let eski = null;
  try{ eski = localStorage.getItem("lingo_unvan_"+ad); }catch(e){}
  try{ localStorage.setItem("lingo_unvan_"+ad, u); }catch(e){}
  if(eski === null) return null;
  return (eski !== u) ? {eski: eski, yeni: u} : null;
}
