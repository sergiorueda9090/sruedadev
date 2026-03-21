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

// BOOT - Ya no necesita cargar partials, Django los incluye via templates
(function boot() {
  setActiveNav();
  initTheme();
  initYear();
})();
