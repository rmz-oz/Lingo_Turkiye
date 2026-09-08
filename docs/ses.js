/* Lingo — ses ve titreşim. Dosya yok, tonlar kodla üretilir. */
let LG_AC = null, LG_ACILDI = false;
function LG_sesAcik(){
  try{ return localStorage.getItem("lingo_ses") !== "0"; }catch(e){ return true; }
}
function LG_sesDegis(){
  const y = !LG_sesAcik();
  try{ localStorage.setItem("lingo_ses", y ? "1" : "0"); }catch(e){}
  if(y) LG_kilitAc(), LG_ses("dogru");
  return y;
}
/* iOS ve Chrome: ilk dokunustan once ses calamaz */
function LG_kilitAc(){
  try{
    if(!LG_AC){
      const C = window.AudioContext || window.webkitAudioContext;
      if(!C) return; LG_AC = new C();
    }
    if(LG_AC.state === "suspended") LG_AC.resume();
    LG_ACILDI = true;
  }catch(e){}
}
document.addEventListener("pointerdown", function ilk(){
  LG_kilitAc();
  document.removeEventListener("pointerdown", ilk);
}, {once:true, passive:true});
document.addEventListener("keydown", function ilkK(){
  LG_kilitAc();
  document.removeEventListener("keydown", ilkK);
}, {once:true});

function LG_nota(hz, bas, sure, ses, tip){
  if(!LG_AC) return;
  const o = LG_AC.createOscillator(), g = LG_AC.createGain();
  o.type = tip || "triangle"; o.frequency.value = hz;
  const t = LG_AC.currentTime + bas;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(ses, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
  o.connect(g); g.connect(LG_AC.destination);
  o.start(t); o.stop(t + sure + 0.02);
}
const LG_TITRE = {
  dogru:[25], yanlis:[80], gecersiz:[20,40,20], sure:[15],
  rozet:[25,45,25,45,60], unvan:[35,55,35,55,110], bitti:[60,80,60]
};
function LG_titre(tip){
  try{ if(LG_sesAcik() && navigator.vibrate && LG_TITRE[tip])
         navigator.vibrate(LG_TITRE[tip]); }catch(e){}
}
function LG_ses(tip){
  LG_titre(tip);
  if(!LG_sesAcik()) return;
  if(!LG_AC) LG_kilitAc();
  if(!LG_AC) return;
  switch(tip){
    case "dogru":   LG_nota(659,0,.09,.12); LG_nota(988,.07,.13,.12); break;
    case "yanlis":  LG_nota(196,0,.16,.09,"square"); break;
    case "gecersiz":LG_nota(330,0,.05,.08,"square"); LG_nota(262,.06,.07,.08,"square"); break;
    case "sure":    LG_nota(1180,0,.035,.05,"sine"); break;
    case "rozet":   LG_nota(659,0,.09,.11); LG_nota(880,.08,.09,.11);
                    LG_nota(1319,.16,.20,.12); break;
    case "unvan":   LG_nota(523,0,.10,.11); LG_nota(659,.09,.10,.11);
                    LG_nota(784,.18,.10,.11); LG_nota(1047,.27,.30,.13); break;
    case "bitti":   LG_nota(494,0,.12,.10); LG_nota(392,.11,.12,.10);
                    LG_nota(294,.22,.24,.10); break;
  }
}
/* ust cubuk dugmesi icin */
function LG_sesDugme(el){
  if(!el) return;
  el.textContent = LG_sesAcik() ? "🔊" : "🔇";
  el.classList.toggle("kapali", !LG_sesAcik());
}
