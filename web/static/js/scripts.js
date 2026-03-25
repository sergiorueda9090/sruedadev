// Marcar link activo
function setActiveNav() {
  var path = window.location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".nav-link").forEach(function(a) {
    var href = (a.getAttribute("href") || "").replace(/\/+$/, "");
    if (!href) return;
    if (
      href === path ||
      (path === "" && href === "/") ||
      (path.endsWith(".html") && href.endsWith(path))
    ) {
      a.classList.add("active");
    }
  });
}

// Navbar scroll detection
function initNavbarScroll() {
  var navbar = document.getElementById("mainNavbar");
  if (!navbar) return;

  function checkScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll();
}

// Scroll Reveal (Intersection Observer)
function initScrollReveal() {
  var reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function(el) { observer.observe(el); });
}

// "Leer más" expand/collapse toggles
function initSvcToggles() {
  document.querySelectorAll(".svc-toggle").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var card = btn.closest(".svc-card");
      if (!card) return;
      var expand = card.querySelector(".svc-expand");
      if (!expand) return;

      var isOpen = expand.classList.contains("is-open");
      if (isOpen) {
        expand.classList.remove("is-open");
        btn.classList.remove("is-open");
        btn.querySelector("span").textContent = "Leer más";
      } else {
        expand.classList.add("is-open");
        btn.classList.add("is-open");
        btn.querySelector("span").textContent = "Leer menos";
      }
    });
  });
}

// Año automático
function initYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// A/B Testing de CTAs
function initABTest() {
  var stored = localStorage.getItem("cta_variant");
  var variant;
  if (stored === "A" || stored === "B") {
    variant = stored;
  } else {
    variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem("cta_variant", variant);
  }

  document.querySelectorAll("[data-cta-a][data-cta-b]").forEach(function(el) {
    var text = variant === "A" ? el.getAttribute("data-cta-a") : el.getAttribute("data-cta-b");
    var icon = el.querySelector("i");
    if (icon) {
      el.textContent = "";
      el.appendChild(icon);
      el.append(" " + text);
    } else {
      el.textContent = text;
    }
  });

  if (typeof gtag === "function") {
    gtag("event", "ab_cta_variant", {
      variant: variant,
      event_category: "AB_Test",
      event_label: "CTA_v1_" + variant
    });
  }

  document.querySelectorAll("[data-cta-a][data-cta-b]").forEach(function(el) {
    el.addEventListener("click", function() {
      if (typeof gtag === "function") {
        gtag("event", "ab_cta_click", {
          variant: variant,
          cta_section: el.getAttribute("data-cta-section") || "unknown",
          cta_text: el.textContent.trim(),
          event_category: "AB_Test"
        });
      }
    });
  });
}

// Generic slider arrow setup
function setupSlider(sliderId, prevId, nextId, itemSelector) {
  var slider = document.getElementById(sliderId);
  var prev = document.getElementById(prevId);
  var next = document.getElementById(nextId);
  if (!slider || !prev || !next) return;

  function getScrollAmount() {
    var item = slider.querySelector(itemSelector);
    if (!item) return 300;
    return item.offsetWidth + 20;
  }

  prev.addEventListener("click", function() {
    slider.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });
  next.addEventListener("click", function() {
    slider.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
}

// Init all sliders
function initSliders() {
  setupSlider("svcSlider", "svcPrev", "svcNext", ".hslider-item");
  setupSlider("portSlider", "portSliderPrev", "portSliderNext", ".port-slide");
  setupSlider("testiSlider", "testiPrev", "testiNext", ".hslider-item");
  setupSlider("projSlider", "projPrev", "projNext", ".hslider-item");
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener("click", function(e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// BOOT
(function boot() {
  setActiveNav();
  initNavbarScroll();
  initScrollReveal();
  initYear();
  initSvcToggles();
  initABTest();
  initSliders();
  initSmoothScroll();
})();
