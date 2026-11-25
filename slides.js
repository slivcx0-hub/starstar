/* STELLAR EVOLUTION — slide navigation, keyboard, fullscreen, language */

(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const progressBar = document.getElementById('progress-bar');
  const counter = document.getElementById('counter');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFs = document.getElementById('btn-fs');
  const btnLang = document.getElementById('btn-lang');

  let current = 0;
  let lang = 'ar'; // 'ar' | 'en'

  function show(index) {
    current = Math.max(0, Math.min(total - 1, index));
    slides.forEach((s, i) => s.classList.toggle('active', i === current));

    progressBar.style.width = ((current + 1) / total) * 100 + '%';
    counter.textContent = current + 1 + ' / ' + total;

    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  function next() {
    show(current + 1);
  }

  function prev() {
    show(current - 1);
  }

  function goTo(n) {
    const n2 = parseInt(n, 10);
    if (!isNaN(n2) && n2 >= 1 && n2 <= total) show(n2 - 1);
  }

  /* ---- Buttons ---- */
  btnNext.addEventListener('click', () => {
    // RTL: visual "next" (the advancing button) is on the left side semantically;
    // we keep one "next" action tied to the primary button.
    next();
  });
  btnPrev.addEventListener('click', prev);
  btnFs.addEventListener('click', toggleFullscreen);
  btnLang.addEventListener('click', toggleLanguage);

  /* ---- Keyboard ---- */
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case 'ArrowLeft': // RTL: left arrow advances
        e.preventDefault();
        next();
        break;
      case 'ArrowRight': // RTL: right arrow goes back
        e.preventDefault();
        prev();
        break;
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        show(0);
        break;
      case 'End':
        e.preventDefault();
        show(total - 1);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      default:
        // Number keys jump to that slide (1–9, 0 = 10)
        if (/^[0-9]$/.test(e.key)) {
          const n = e.key === '0' ? 10 : parseInt(e.key, 10);
          if (n <= total) goTo(n);
        }
    }
  });

  /* ---- Fullscreen ---- */
  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  /* ---- Language toggle ---- */
  function toggleLanguage() {
    lang = lang === 'ar' ? 'en' : 'ar';
    applyLanguage();
  }

  function applyLanguage() {
    const html = document.documentElement;

    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('.i18n').forEach((el) => {
      const en = el.getAttribute('data-en');
      if (!en) return;

      if (!el.getAttribute('data-ar')) el.setAttribute('data-ar', el.textContent);
      el.textContent = lang === 'en' ? en : el.getAttribute('data-ar');
    });

    btnLang.textContent = lang === 'ar' ? 'EN' : 'عربي';
  }

  /* ---- Deep link (#4 = slide 4) ---- */
  function readHash() {
    const n = parseInt(location.hash.slice(1), 10);
    if (!isNaN(n) && n >= 1 && n <= total) show(n - 1);
    else show(0);
  }

  window.addEventListener('hashchange', readHash);

  /* ---- Init ---- */
  readHash();
})();