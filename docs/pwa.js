/* Fiko: uygulama kabugunu kaydeder, yeni surum gelince sessizce yeniler. */
(function(){
  if(!("serviceWorker" in navigator)) return;
  var vardi = !!navigator.serviceWorker.controller, yenilendi = false;
  navigator.serviceWorker.addEventListener("controllerchange", function(){
    if(!vardi || yenilendi) return;          /* ilk kurulumda yenilemeye gerek yok */
    yenilendi = true;
    location.reload();
  });
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  });
})();
