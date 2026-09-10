/* Fiko: uygulama kabugunu kaydeder, yeni surum gelince sessizce yeniler.
   Acilis hizi degismez: sayfa her zaman once telefondaki kopyadan acilir,
   guncelleme arka planda inip hazir olunca uygulanir. */
(function(){
  if(!("serviceWorker" in navigator)) return;
  var vardi = !!navigator.serviceWorker.controller, yenilendi = false;

  navigator.serviceWorker.addEventListener("controllerchange", function(){
    if(!vardi || yenilendi) return;          /* ilk kurulumda yenilemeye gerek yok */
    yenilendi = true;
    location.reload();
  });

  window.addEventListener("load", function(){
    navigator.serviceWorker.register("sw.js").then(function(reg){
      if(!reg) return;
      try{ reg.update(); }catch(e){}
      /* uygulamaya her donusunde yeni surum var mi diye bak */
      document.addEventListener("visibilitychange", function(){
        if(document.visibilityState === "visible"){ try{ reg.update(); }catch(e){} }
      });
    }).catch(function(){});
  });
})();
