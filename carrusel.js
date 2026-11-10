(function () {
  var INTERVALO = 3500; // ms entre movimientos

  var hero  = document.getElementById("hc");
  var track = document.getElementById("hcTrack");
  var originales = Array.prototype.slice.call(track.children);
  var N = originales.length;

  // clonar las primeras 3 al final (loop infinito)
  originales.slice(0, 3).forEach(function (el) {
    track.appendChild(el.cloneNode(true));
  });

  var i = 0, timer, ocupado = false;

  function visibles() {
    return parseInt(getComputedStyle(hero).getPropertyValue("--visibles")) || 3;
  }
  function mover() {
    track.style.transform = "translateX(" + (-i * (100 / visibles())) + "%)";
  }
  function saltar(n) {
    track.classList.add("sin-anim");
    i = n;
    mover();
    track.offsetHeight;
    track.classList.remove("sin-anim");
  }
  function siguiente() {
    if (ocupado) return;
    ocupado = true;
    i++;
    mover();
  }
  function anterior() {
    if (ocupado) return;
    ocupado = true;
    if (i === 0) saltar(N);
    i--;
    mover();
  }

  track.addEventListener("transitionend", function () {
    if (i >= N) saltar(i - N);
    ocupado = false;
  });

  function iniciar()   { timer = setInterval(siguiente, INTERVALO); }
  function reiniciar() { clearInterval(timer); iniciar(); }

  hero.querySelector(".hc-next").addEventListener("click", function () { siguiente(); reiniciar(); });
  hero.querySelector(".hc-prev").addEventListener("click", function () { anterior();  reiniciar(); });

  hero.addEventListener("mouseenter", function () { clearInterval(timer); });
  hero.addEventListener("mouseleave", iniciar);

  var x0 = null;
  hero.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { dx < 0 ? siguiente() : anterior(); reiniciar(); }
    x0 = null;
  });

  window.addEventListener("resize", function () { saltar(i % N); });

  mover();
  iniciar();
})();