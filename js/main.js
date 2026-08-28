/* ============================================================
   CYNSELING — Main JavaScript
   Interactivity, animations, and dynamic features
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navbar Scroll Effect ----
  initNavbarScroll();

  // ---- Mobile Menu ----
  initMobileMenu();

  // ---- Smooth Scroll for Anchor Links ----
  initSmoothScroll();

  // ---- Scroll Reveal Animations ----
  initScrollReveal();

  // ---- Testimonials Carousel ----
  initTestimonialsCarousel();

  // ---- Active Link Tracking ----
  initActiveLinkTracking();
});

/* ---------- NAVBAR SCROLL ---------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const threshold = 50;

  function handleScroll() {
    if (window.scrollY > threshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');
  const overlay = document.querySelector('.navbar__overlay');
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.classList.add('active');
    menu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ---------- SMOOTH SCROLL ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- TESTIMONIALS CAROUSEL ---------- */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonials__track');
  const dots = document.querySelectorAll('.testimonials__dot');
  const prevBtn = document.querySelector('.testimonials__nav--prev');
  const nextBtn = document.querySelector('.testimonials__nav--next');
  if (!track || !dots.length) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoplayTimer;

  function getDynamicInterval() {
    const activeCard = cards[currentIndex];
    if (activeCard) {
      const textElement = activeCard.querySelector('.testimonial-card__text');
      if (textElement) {
        const charCount = textElement.textContent.trim().length;
        // 50ms por carácter, con un mínimo de 5000ms
        return Math.max(5000, charCount * 50);
      }
    }
    return 10000; // Valor por defecto
  }

  function goTo(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setTimeout(() => {
      next();
      startAutoplay();
    }, getDynamicInterval());
  }

  function stopAutoplay() {
    if (autoplayTimer) clearTimeout(autoplayTimer);
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay(); // Reset autoplay on manual interaction
    });
  });

  // Nav buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      startAutoplay();
    });
  }

  // Pause on hover
  const carousel = document.querySelector('.testimonials__carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    startAutoplay();
  }, { passive: true });

  // Initialize
  goTo(0);
  startAutoplay();
}

/* ---------- ACTIVE LINK TRACKING ---------- */
function initActiveLinkTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}
