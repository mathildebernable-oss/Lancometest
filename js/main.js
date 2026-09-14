(function () {
  "use strict";

  var translations = {
    fr: {
      hero: { top: "BIENVENUE DANS LE", title: "STAR SCULPT PORTAL", bottom: "DÉCOUVREZ LE NOUVEAU MASCARA TUBING" },
      scrollHint: "SCROLL POUR ENTRER",
      chooseRoom: "CHOISISSEZ VOTRE SALLE",
      back: "RETOUR",
      nav: {
        lab: { title: "LE LABO", subtitle: "TECH & FORMULE" },
        vault: { title: "LE COFFRE", subtitle: "FORMATS & PACKAGING" },
        studio: { title: "LE STUDIO", subtitle: "LOOKS & INSPIRATIONS" },
        ritual: { title: "LE RITUEL", subtitle: "RETRAIT" },
      },
    },
    en: {
      hero: { top: "WELCOME TO THE", title: "STAR SCULPT PORTAL", bottom: "DISCOVER THE NEW TUBING MASCARA" },
      scrollHint: "SCROLL TO ENTER",
      chooseRoom: "CHOOSE YOUR ROOM",
      back: "BACK",
      nav: {
        lab: { title: "THE LAB", subtitle: "TECH & FORMULA" },
        vault: { title: "THE VAULT", subtitle: "FORMATS & PACKAGES" },
        studio: { title: "THE STUDIO", subtitle: "LOOKS & INSPIRATIONS" },
        ritual: { title: "THE RITUAL", subtitle: "REMOVAL" },
      },
    },
    it: {
      hero: { top: "BENVENUTA NEL", title: "STAR SCULPT PORTAL", bottom: "SCOPRI IL NUOVO MASCARA TUBING" },
      scrollHint: "SCORRI PER ENTRARE",
      chooseRoom: "SCEGLI LA TUA STANZA",
      back: "INDIETRO",
      nav: {
        lab: { title: "IL LAB", subtitle: "TECNOLOGIA & FORMULA" },
        vault: { title: "IL VAULT", subtitle: "FORMATI & CONFEZIONI" },
        studio: { title: "LO STUDIO", subtitle: "LOOK & ISPIRAZIONI" },
        ritual: { title: "IL RITUALE", subtitle: "RIMOZIONE" },
      },
    },
    pl: {
      hero: { top: "WITAMY W", title: "STAR SCULPT PORTAL", bottom: "ODKRYJ NOWY TUSZ TUBING" },
      scrollHint: "PRZEWIŃ, ABY WEJŚĆ",
      chooseRoom: "WYBIERZ POKÓJ",
      back: "WSTECZ",
      nav: {
        lab: { title: "LABORATORIUM", subtitle: "TECHNOLOGIA I FORMUŁA" },
        vault: { title: "SKARBIEC", subtitle: "FORMATY I OPAKOWANIA" },
        studio: { title: "STUDIO", subtitle: "STYLIZACJE I INSPIRACJE" },
        ritual: { title: "RYTUAŁ", subtitle: "ZDEJMOWANIE" },
      },
    },
    zh: {
      hero: { top: "欢迎来到", title: "STAR SCULPT PORTAL", bottom: "探索全新管状睫毛膏" },
      scrollHint: "滚动进入",
      chooseRoom: "选择您的房间",
      back: "返回",
      nav: {
        lab: { title: "实验室", subtitle: "科技与配方" },
        vault: { title: "宝库", subtitle: "规格与包装" },
        studio: { title: "工作室", subtitle: "妆容与灵感" },
        ritual: { title: "仪式", subtitle: "卸除方法" },
      },
    },
    ja: {
      hero: { top: "ようこそ", title: "STAR SCULPT PORTAL", bottom: "新しいチュービングマスカラを発見" },
      scrollHint: "スクロールして入る",
      chooseRoom: "部屋を選んでください",
      back: "戻る",
      nav: {
        lab: { title: "ラボ", subtitle: "技術と処方" },
        vault: { title: "ヴォールト", subtitle: "フォーマットとパッケージ" },
        studio: { title: "スタジオ", subtitle: "ルックとインスピレーション" },
        ritual: { title: "リチュアル", subtitle: "取り外し方" },
      },
    },
  };

  var fontsByLang = {
    fr: "'Orbitron', sans-serif",
    en: "'Orbitron', sans-serif",
    it: "'Orbitron', sans-serif",
    pl: "'Orbitron', sans-serif",
    zh: "'Noto Sans SC', sans-serif",
    ja: "'Noto Sans JP', sans-serif",
  };

  var stage = document.getElementById("stage");
  var video = document.getElementById("scrub-video");
  var hotspotLayer = document.getElementById("hotspot-layer");
  var hotspots = Array.prototype.slice.call(document.querySelectorAll(".hotspot"));
  var scrollHint = document.getElementById("scroll-hint");
  var scrollHintText = document.getElementById("scroll-hint-text");
  var roomHint = document.getElementById("room-hint");
  var roomHintText = document.getElementById("room-hint-text");
  var heroCard = document.getElementById("hero-card");
  var heroTop = document.getElementById("hero-top");
  var heroTitleText = document.getElementById("hero-title-text");
  var heroBottom = document.getElementById("hero-bottom");
  var langSelect = document.getElementById("lang-select");
  var deviceButtons = Array.prototype.slice.call(document.querySelectorAll(".toolbar-device"));
  var pageFrame = document.getElementById("page-frame");
  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var detailViews = Array.prototype.slice.call(document.querySelectorAll(".detail-view"));

  var rootStyle = getComputedStyle(document.documentElement);
  var scrubVh = parseFloat(rootStyle.getPropertyValue("--scrub-vh")) || 380;

  var clamp = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  };

  function get(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  // -------------------------------------------------------------
  // Langue
  // -------------------------------------------------------------
  function applyLanguage(lang) {
    var t = translations[lang] || translations.fr;
    heroTop.textContent = t.hero.top;
    heroTitleText.textContent = t.hero.title;
    heroBottom.textContent = t.hero.bottom;
    scrollHintText.textContent = t.scrollHint;
    roomHintText.textContent = t.chooseRoom;
    i18nEls.forEach(function (el) {
      var value = get(t, el.getAttribute("data-i18n"));
      if (value !== null) el.textContent = value;
    });
    document.documentElement.style.setProperty("--font", fontsByLang[lang] || fontsByLang.fr);
  }

  langSelect.addEventListener("change", function () {
    applyLanguage(langSelect.value);
  });

  // -------------------------------------------------------------
  // Format d'aperçu (desktop / tablette / mobile)
  // -------------------------------------------------------------
  deviceButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      deviceButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      pageFrame.setAttribute("data-device", btn.getAttribute("data-device"));
      layoutHotspots();
    });
  });

  // Le changement de largeur du cadre simulé est animé en CSS
  // (transition sur max-width) : il faut recalculer une fois la
  // transition terminée, sinon le calque des boutons reste calé sur
  // l'ancienne largeur.
  pageFrame.addEventListener("transitionend", function (e) {
    if (e.propertyName === "max-width") layoutHotspots();
  });

  // -------------------------------------------------------------
  // Letterboxing adaptatif : cover en paysage (vidéo plein écran,
  // bord à bord) ; contain en portrait, pour ne jamais recadrer les
  // boutons hors champ sur un format mobile étroit.
  // -------------------------------------------------------------
  function layoutHotspots() {
    var vw = video.videoWidth;
    var vh = video.videoHeight;
    if (!vw || !vh) return;

    var stageW = stage.clientWidth;
    var stageH = stage.clientHeight;
    var stageAspect = stageW / stageH;
    var useCover = stageAspect >= 1;

    video.style.objectFit = useCover ? "cover" : "contain";

    var scale = useCover ? Math.max(stageW / vw, stageH / vh) : Math.min(stageW / vw, stageH / vh);
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
    var duration = video.duration;

    if (duration && !isNaN(duration)) {
      var target = progress * duration;
      if (Math.abs(video.currentTime - target) > 0.008) {
        video.currentTime = target;
      }
    }

    // Encart "Bienvenue" : apparaît à la 3e seconde de vidéo, reste
    // affiché pendant l'ouverture de la porte, puis s'efface pour
    // laisser place aux boutons une fois la vidéo terminée.
    var d = duration && !isNaN(duration) ? duration : 5;
    var titleInStart = clamp(3 / d, 0, 0.95);
    var titleInEnd = clamp(titleInStart + 0.4 / d, titleInStart + 0.001, 0.98);
    var titleOutStart = 0.88;
    var titleOutEnd = 1;

    var heroOpacity;
    if (progress < titleInStart) heroOpacity = 0;
    else if (progress < titleInEnd) heroOpacity = (progress - titleInStart) / (titleInEnd - titleInStart);
    else if (progress < titleOutStart) heroOpacity = 1;
    else heroOpacity = 1 - clamp((progress - titleOutStart) / (titleOutEnd - titleOutStart), 0, 1);
    heroCard.style.opacity = heroOpacity;

    // Boutons du couloir : entrent en fondu pendant que l'encart
    // sort, ne deviennent cliquables (souris + clavier) qu'une fois
    // la vidéo entièrement terminée.
    var fadeStart = 0.88;
    var fadeAmount = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
    var interactive = progress >= 0.999;

    hotspots.forEach(function (hotspot) {
      hotspot.style.opacity = fadeAmount;
      hotspot.style.pointerEvents = interactive ? "auto" : "none";
      hotspot.tabIndex = interactive ? 0 : -1;
      if (interactive) hotspot.removeAttribute("aria-hidden");
      else hotspot.setAttribute("aria-hidden", "true");
    });

    scrollHint.style.opacity = 1 - clamp(progress * 14, 0, 1);
    roomHint.style.opacity = fadeAmount;
  }

  video.addEventListener("loadedmetadata", function () {
    video.currentTime = 0.001;
    layoutHotspots();
    update();
  });
  if (video.readyState >= 1) layoutHotspots();

  window.addEventListener("resize", layoutHotspots);
  window.addEventListener("scroll", onScroll, { passive: true });

  // -------------------------------------------------------------
  // Vues détail — chaque bouton du couloir ouvre sa vidéo
  // d'explication (gabarit commun tant que les 4 vidéos définitives
  // ne sont pas fournies).
  // -------------------------------------------------------------
  var openDetail = null;

  function closeDetail() {
    if (!openDetail) return;
    var view = document.getElementById("detail-" + openDetail);
    if (view) {
      view.classList.remove("is-open");
      var v = view.querySelector(".detail-video");
      if (v) v.pause();
    }
    openDetail = null;
  }

  function showDetail(key) {
    var view = document.getElementById("detail-" + key);
    if (!view) return;
    closeDetail();
    view.classList.add("is-open");
    var v = view.querySelector(".detail-video");
    if (v) {
      v.currentTime = 0;
      v.play().catch(function () {});
    }
    openDetail = key;
  }

  hotspots.forEach(function (hotspot) {
    hotspot.addEventListener("click", function () {
      showDetail(hotspot.getAttribute("data-key"));
    });
  });

  detailViews.forEach(function (view) {
    var closeBtn = view.querySelector(".detail-back");
    if (closeBtn) closeBtn.addEventListener("click", closeDetail);
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDetail();
  });

  applyLanguage("fr");
  update();
})();
