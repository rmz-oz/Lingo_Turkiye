/* Lingo — ortak ünvan ve rozet motoru. Tüm sayfalar bunu kullanır. */
const LG_KAYITSIZ = "__kayitsiz__";
function LG_kisi(){ try{ return localStorage.getItem("lingo_kisi"); }catch(e){ return null; } }
function LG_defter(ad){
  try{ const d = JSON.parse(localStorage.getItem("lingo_defter_"+ad)||"[]");
       return Array.isArray(d) ? d : []; }catch(e){ return []; }
}
function LG_plan(ad){
  try{ return JSON.parse(localStorage.getItem("lingo_plan_"+ad)||"{}"); }catch(e){ return {}; }
}
const LG_UNVAN = [
  {n:0,   ad:"Çaylak"},          {n:15,  ad:"Acemi"},
  {n:30,  ad:"Heveskâr"},        {n:60,  ad:"Kelime Meraklısı"},
  {n:100, ad:"Kelime Avcısı"},   {n:150, ad:"Harf Ustası"},
  {n:220, ad:"Sözlük Dostu"},    {n:300, ad:"Lingo Kurdu"},
  {n:420, ad:"Lingo Ustası"},    {n:600, ad:"Lingo Şampiyonu"},
  {n:850, ad:"Efsane"}
];
function LG_unvan(say){
  const simdi = LG_UNVAN.slice().reverse().find(u => say >= u.n) || LG_UNVAN[0];
  const sonraki = LG_UNVAN.find(u => u.n > say) || null;
  const oran = sonraki ? Math.round(100*(say-simdi.n)/(sonraki.n-simdi.n)) : 100;
  return {simdi, sonraki, oran, kalan: sonraki ? sonraki.n - say : 0};
}
const LG_GOREVSAY = 16;   /* plandaki toplam gorev */
function LG_rozet(d, p){
  p = p || {};
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
   {e:"🗓",a:"Programlı",      s:"planın tüm görevleri",   v:yapilan>=LG_GOREVSAY}
  ];
}
function LG_acik(ad){ return LG_rozet(LG_defter(ad), LG_plan(ad)).filter(r=>r.v); }
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
  return LG_rozet(LG_defter(ad), LG_plan(ad)).filter(r => yeniAd.indexOf(r.a) >= 0);
}
/* kucuk rozet seridi html'i */
function LG_serit(ad, max){
  const a = LG_acik(ad);
  if(!a.length) return "";
  const g = max ? a.slice(-max) : a;
  return g.map(r=>`<span class="lgroz" title="${r.a}">${r.e}</span>`).join("");
}
