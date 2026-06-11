(function() {
  const STORAGE_KEY = 'citybuilding-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === THEME_DARK || stored === THEME_LIGHT) return stored;
    return THEME_LIGHT;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.innerHTML = theme === THEME_DARK
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-fill"></i>';
      btn.setAttribute('aria-label', theme === THEME_DARK ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    setTheme(current === THEME_DARK ? THEME_LIGHT : THEME_DARK);
  }

  document.addEventListener('DOMContentLoaded', function() {
    setTheme(getPreferredTheme());
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(THEME_LIGHT);
        }
      });
    }
  });
})();
