/* Ust cubuktaki uc nokta menusu: gece/gunduz, ses ve ana sayfa tek yerde.
   Dar telefonlarda cubugu kalabalik etmesin diye tek tusa toplandi. */
(function(){
  function kur(){
    var kap = document.getElementById("bar") || document.querySelector("header");
    if(!kap || document.getElementById("mnk")) return;

    /* eski ses ve tema tuslari menuye tasindi */
    ["sesd", "temad"].forEach(function(id){
      var e = document.getElementById(id);
      if(e){ e.dataset.eski = "1"; e.style.display = "none"; }
    });

    var t = document.createElement("button");
    t.id = "mnk"; t.className = "mnk"; t.type = "button";
    t.setAttribute("aria-label", "Menü"); t.innerHTML = "⋯";

    var sag = kap.querySelector(".sag") || kap.querySelector(".hb") || kap;
    sag.appendChild(t);

    var p = document.createElement("div");
    p.id = "mnl"; p.className = "mnl";
    p.innerHTML =
      '<button type="button" data-is="tema"><i>🌙</i><b>Gece modu</b></button>' +
      '<button type="button" data-is="ses"><i>🔊</i><b>Ses</b></button>' +
      '<a href="index.html"><i>🏠</i><b>Ana sayfa</b></a>';
    document.body.appendChild(p);

    var ort = document.createElement("div");
    ort.id = "mnf"; ort.className = "mnf";
    document.body.appendChild(ort);

    function tema(){
      try{ return localStorage.getItem("lingo_masa_tema") === "gunduz"
             ? "gunduz" : (document.documentElement.getAttribute("data-tema") || "gece"); }
      catch(e){ return document.documentElement.getAttribute("data-tema") || "gece"; }
    }
    function yaz(){
      var g = tema() === "gunduz";
      p.querySelector('[data-is="tema"] i').textContent = g ? "🌙" : "☀️";
      p.querySelector('[data-is="tema"] b').textContent = g ? "Gece moduna geç"
                                                            : "Gündüz moduna geç";
      var acik = (typeof LG_sesAcik === "function") ? LG_sesAcik() : true;
      p.querySelector('[data-is="ses"] i').textContent = acik ? "🔊" : "🔇";
      p.querySelector('[data-is="ses"] b').textContent = acik ? "Sesi kapat" : "Sesi aç";
    }
    function ac(a){
      p.classList.toggle("acik", a); ort.classList.toggle("acik", a);
      if(a) yaz();
    }
    t.onclick = function(e){ e.stopPropagation(); ac(!p.classList.contains("acik")); };
    ort.onclick = function(){ ac(false); };

    p.querySelector('[data-is="tema"]').onclick = function(){
      if(typeof temaCevir === "function"){ temaCevir(); }
      else {
        var y = tema() === "gunduz" ? "gece" : "gunduz";
        document.documentElement.setAttribute("data-tema", y);
        try{ localStorage.setItem("lingo_masa_tema", y); }catch(e){}
        var m = document.querySelector('meta[name="theme-color"]');
        if(m) m.setAttribute("content", y === "gunduz" ? "#f5f6f8" : "#0f1720");
      }
      yaz();
    };
    p.querySelector('[data-is="ses"]').onclick = function(){
      if(typeof LG_sesDegis === "function"){
        LG_sesDegis();
        var e = document.getElementById("sesd");
        if(e && typeof LG_sesDugme === "function") LG_sesDugme(e);
      }
      yaz();
    };
    yaz();
  }
  if(document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", kur);
  else kur();
})();
