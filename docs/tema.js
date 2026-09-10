/* Tema secimi butun sayfalarda gecerli olsun: ana sayfada ya da Ailecuk'te
   ne secildiyse burada da o uygulanir. Boyama baslamadan calisir. */
(function(){
  var t = null;
  try{ t = localStorage.getItem("lingo_masa_tema"); }catch(e){}
  if(t !== "gece" && t !== "gunduz"){
    try{
      t = (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches)
        ? "gunduz" : "gece";
    }catch(e){ t = "gece"; }
  }
  document.documentElement.setAttribute("data-tema", t);
  var m = document.querySelector('meta[name="theme-color"]');
  if(m) m.setAttribute("content", t === "gunduz" ? "#f5f6f8" : "#0f1720");
})();
