(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var video = document.getElementById("scrub-video");
  var hotspotLayer = document.getElementById("hotspot-layer");
  var hotspots = Array.prototype.slice.call(document.querySelectorAll(".hotspot"));
  var scrollHint = document.getElementById("scroll-hint");

  var rootStyle = getComputedStyle(document.documentElement);
  var scrubVh = parseFloat(rootStyle.getPropertyValue("--scrub-vh")) || 380;

  var clamp = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  };

  // Fait correspondre le calque des boutons au rectangle réellement
  // visible de la vidéo (object-fit: contain crée des bandes noires
  // quand le ratio de l'écran ne correspond pas à celui de la vidéo).
  // Les pourcentages top/left des hotspots restent ainsi calés sur
  // l'image, à n'importe quelle taille d'écran.
  function layoutHotspots() {
    var vw = video.videoWidth;
    var vh = video.videoHeight;
    if (!vw || !vh) return;

    var stageW = stage.clientWidth;
    var stageH = stage.clientHeight;
    var scale = Math.min(stageW / vw, stageH / vh);
    var renderW = vw * scale;
    var renderH = vh * scale;
    var offsetX = (stageW - renderW) / 2;
    var offsetY = (stageH - renderH) / 2;

    hotspotLayer.style.left = offsetX + "px";
    hotspotLayer.style.top = offsetY + "px";
    hotspotLayer.style.width = renderW + "px";
    hotspotLayer.style.height = renderH + "px";
  }

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  function update() {
    var scrubPx = window.innerHeight * (scrubVh / 100);
    var progress = clamp(window.scrollY / scrubPx, 0, 1);

    if (video.duration && !isNaN(video.duration)) {
      var target = progress * video.duration;
      if (Math.abs(video.currentTime - target) > 0.008) {
        video.currentTime = target;
      }
    }

    // Les boutons apparaissent progressivement sur les derniers 15%
    // du scrub, et ne deviennent cliquables qu'une fois la porte
    // entièrement ouverte (fin de vidéo).
    var fadeStart = 0.85;
    var fadeAmount = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
    var interactive = progress >= 0.999;

    hotspots.forEach(function (hotspot) {
      hotspot.style.opacity = fadeAmount;
      hotspot.style.pointerEvents = interactive ? "auto" : "none";
      // Empêche aussi l'activation clavier (Tab + Entrée) avant que
      // la porte ne soit entièrement ouverte.
      hotspot.tabIndex = interactive ? 0 : -1;
      if (interactive) {
        hotspot.removeAttribute("aria-hidden");
      } else {
        hotspot.setAttribute("aria-hidden", "true");
      }
    });

    scrollHint.style.opacity = 1 - clamp(progress * 14, 0, 1);
  }

  video.addEventListener("loadedmetadata", function () {
    video.currentTime = 0.001;
    layoutHotspots();
    update();
  });

  // Certains navigateurs (Safari notamment) ont déjà les métadonnées
  // en cache au moment où le script s'exécute.
  if (video.readyState >= 1) {
    layoutHotspots();
  }

  window.addEventListener("resize", layoutHotspots);
  window.addEventListener("scroll", onScroll, { passive: true });

  update();
})();
