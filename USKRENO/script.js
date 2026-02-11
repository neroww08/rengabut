/**
 * SMK MAARIF NU DOLOPO - Landing Page Scripts
 * Interaksi, animasi, dan multimedia
 */

(function () {
  'use strict';

  // ----- Header scroll effect -----
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Mobile menu toggle -----
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.closest('.header').classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.closest('.header').classList.contains('open'));
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.closest('.header').classList.remove('open');
      });
    });
  }

  // ----- Counter animation (stats) -----
  const animateValue = (el, start, end, duration) => {
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + (end - start) * easeOut);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = end;
    };
    requestAnimationFrame(step);
  };

  const stats = document.querySelectorAll('.stat-num[data-count]');
  let statsAnimated = false;

  const checkStats = () => {
    const hero = document.querySelector('.hero');
    if (!hero || statsAnimated) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const viewBottom = window.scrollY + window.innerHeight * 0.85;
    if (viewBottom >= heroBottom) {
      statsAnimated = true;
      stats.forEach((el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        animateValue(el, 0, target, 1800);
      });
    }
  };

  window.addEventListener('scroll', checkStats, { passive: true });
  checkStats();

  // ----- Scroll-triggered animations (AOS) -----
  const aosElements = document.querySelectorAll('[data-aos]');
  const observerOptions = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
      }
    });
  }, observerOptions);

  aosElements.forEach((el) => observer.observe(el));

  // ----- Video section: play button (placeholder - ganti dengan link YouTube jika ada) -----
  const videoPoster = document.getElementById('videoPoster');
  const videoEmbed = document.getElementById('videoEmbed');
  const videoPlay = document.getElementById('videoPlay');
  const videoClose = document.getElementById('videoClose');
  const videoIframe = document.getElementById('videoIframe');

  // Ganti URL di bawah dengan embed YouTube sekolah jika ada
  const videoEmbedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';

  if (videoPoster && videoEmbed && videoPlay) {
    videoPlay.addEventListener('click', () => {
      videoPoster.hidden = true;
      videoEmbed.hidden = false;
      if (videoIframe) {
        videoIframe.src = videoEmbedUrl;
      }
    });
  }

  if (videoClose && videoEmbed && videoPoster) {
    videoClose.addEventListener('click', () => {
      videoEmbed.hidden = true;
      videoPoster.hidden = false;
      if (videoIframe) videoIframe.src = '';
    });
  }

  // ----- Gallery lightbox -----
  const galleryItems = document.querySelectorAll('.gallery-item[data-fancybox]');
  const body = document.body;

  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<div class="lightbox-content"><img src="' + src.replace(/w=1200/, 'w=1200') + '" alt="' + (alt || 'Galeri') + '"><button class="lightbox-close" aria-label="Tutup">×</button></div>';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.lightbox-close')) {
        body.removeChild(overlay);
        body.style.overflow = '';
      }
    });
    body.style.overflow = 'hidden';
    body.appendChild(overlay);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = item.getAttribute('href');
      const img = item.querySelector('img');
      const alt = img ? img.getAttribute('alt') : '';
      if (href) openLightbox(href, alt);
    });
  });

  // ----- PPDB Form submit (terhubung database via API) -----
  const formPPDB = document.getElementById('formPPDB');
  const formMessage = document.getElementById('formPPDBMessage');
  const btnSubmitPPDB = document.getElementById('btnSubmitPPDB');

  if (formPPDB && formMessage && btnSubmitPPDB) {
    formPPDB.addEventListener('submit', function (e) {
      e.preventDefault();
      formMessage.classList.remove('show', 'success', 'error');
      formMessage.textContent = '';
      btnSubmitPPDB.disabled = true;
      btnSubmitPPDB.textContent = 'Mengirim...';

      const formData = new FormData(formPPDB);
      const action = formPPDB.getAttribute('action') || 'api/ppdb-daftar.php';

      fetch(action, {
        method: 'POST',
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // Support respon dari Google Script ({result: 'success'}) atau PHP ({success: true})
          const isSuccess = data.result === 'success' || data.success === true;
          
          formMessage.classList.remove('success', 'error');
          formMessage.classList.add('show', isSuccess ? 'success' : 'error');
          formMessage.textContent = data.message || (isSuccess ? 'Pendaftaran berhasil.' : 'Terjadi kesalahan.');
          
          if (isSuccess) formPPDB.reset();
        })
        .catch(function (err) {
          console.error(err);
          formMessage.classList.remove('success');
          formMessage.classList.add('show', 'error');
          if (err.name === 'SyntaxError') {
            formMessage.textContent = 'URL Google Script salah atau tidak valid. Pastikan berakhiran /exec';
          } else {
            formMessage.textContent = 'Gagal mengirim data. Pastikan koneksi internet lancar.';
          }
        })
        .finally(function () {
          btnSubmitPPDB.disabled = false;
          btnSubmitPPDB.textContent = 'Daftar PPDB';
        });
    });
  }

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
})();
