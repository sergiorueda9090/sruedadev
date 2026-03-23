// Marcar link activo
function setActiveNav() {
  const path = window.location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".nav-link").forEach(a => {
    const href = (a.getAttribute("href") || "").replace(/\/+$/, "");
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

// Theme toggle
function initTheme() {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");

  function applyTheme(theme) {
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme);

    const isLight = theme === "theme-light";
    if (icon) icon.className = isLight ? "bi bi-brightness-high" : "bi bi-moon-stars";
    if (label) label.textContent = isLight ? "Claro" : "Oscuro";
  }

  const saved = localStorage.getItem("theme") || "theme-dark";
  applyTheme(saved);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const next = body.classList.contains("theme-light") ? "theme-dark" : "theme-light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }
}

// Año automático
function initYear() {
  const yearEl = document.getElementById("year");
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

  document.querySelectorAll("[data-cta-a][data-cta-b]").forEach(function (el) {
    var text = variant === "A" ? el.getAttribute("data-cta-a") : el.getAttribute("data-cta-b");
    // Preserve icon if present
    var icon = el.querySelector("i");
    if (icon) {
      el.textContent = "";
      el.appendChild(icon);
      el.append(" " + text);
    } else {
      el.textContent = text;
    }
  });

  // Track variant in GA4
  if (typeof gtag === "function") {
    gtag("event", "ab_cta_variant", {
      variant: variant,
      event_category: "AB_Test",
      event_label: "CTA_v1_" + variant
    });
  }

  // Track CTA clicks with variant info
  document.querySelectorAll("[data-cta-a][data-cta-b]").forEach(function (el) {
    el.addEventListener("click", function () {
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

// BOOT - Ya no necesita cargar partials, Django los incluye via templates
(function boot() {
  setActiveNav();
  initTheme();
  initYear();
  initABTest();
})();
