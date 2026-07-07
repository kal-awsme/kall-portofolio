/* ==============================
   KALL PORTFOLIO - script.js
   Premium UX with subtle animations
   ============================== */

(function () {
  'use strict';

  // ------------------------------
  // UTILS
  // ------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const select = (selector, parent = document) => parent.querySelector(selector);
  const selectAll = (selector, parent = document) => parent.querySelectorAll(selector);

  // Throttle function for scroll events
  const throttle = (fn, delay) => {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  };

  // ------------------------------
  // LOADING SCREEN
  // ------------------------------
  const initLoadingScreen = () => {
    const loader = select('#loading-screen');
    if (!loader) return;

    // Prevent body scroll during loading
    document.body.style.overflow = 'hidden';

    // Simulate loading time (1.8s)
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';

      // Remove from DOM after transition
      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });
    }, 1800);
  };

  // ------------------------------
  // SMOOTH SCROLL FOR ANCHORS
  // ------------------------------
  const initSmoothScroll = () => {
    const navbarHeight = select('.navbar')?.offsetHeight || 70;

    const handleAnchorClick = (e) => {
      const link = e.currentTarget;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = select(href);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      const menu = select('#navbar-nav');
      const hamburger = select('#hamburger-btn');
      if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
      }

      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };

    // Attach to all navbar links, footer links, hero buttons, contact cards
    selectAll('a[href^="#"]').forEach(link => {
      if (link.getAttribute('href') !== '#') {
        link.addEventListener('click', handleAnchorClick);
      }
    });

    // Scroll to top button
    const scrollTopBtn = select('#scroll-top-btn');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    }
  };

  // ------------------------------
  // ACTIVE NAVIGATION LINK
  // ------------------------------
  const initActiveNav = () => {
    const sections = selectAll('section[id]');
    const navLinks = selectAll('.navbar-link');
    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is near top
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  };

  // ------------------------------
  // MOBILE MENU
  // ------------------------------
  const initMobileMenu = () => {
    const hamburger = select('#hamburger-btn');
    const menu = select('#navbar-nav');
    if (!hamburger || !menu) return;

    const openMenu = () => {
      hamburger.classList.add('active');
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on menu link click
    selectAll('.navbar-link', menu).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') &&
          !menu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });
  };

  // ------------------------------
  // REVEAL ON SCROLL (SECTIONS & CARDS)
  // ------------------------------
  const initRevealAnimations = () => {
    if (prefersReducedMotion) return;

    const revealElements = selectAll('.about-card, .service-card, .portfolio-card, .contact-card, .ebook-container');
    const revealSections = selectAll('section');

    // Add .reveal class to elements that should animate
    revealElements.forEach(el => el.classList.add('reveal'));
    revealSections.forEach(section => {
      // Only add to main sections, not hero (it's already visible)
      if (section.id !== 'hero') {
        section.classList.add('reveal');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });

    selectAll('.reveal').forEach(el => observer.observe(el));
  };

  // ------------------------------
  // SCROLL BLUR EFFECT
  // ------------------------------
  const initScrollBlur = () => {
    if (prefersReducedMotion) return;

    const sections = selectAll('section');
    if (sections.length === 0) return;

    // Add .section-blur class to each section for styling
    sections.forEach(section => section.classList.add('section-blur'));

    const observer = new IntersectionObserver((entries) => {
      // Find which section is currently most visible (largest intersection ratio)
      let maxRatio = 0;
      let currentIndex = -1;

      entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const index = Array.from(sections).indexOf(entry.target);
          if (index !== -1) currentIndex = index;
        }
      });

      if (currentIndex === -1) return;

      // Blur all sections before the current active one
      sections.forEach((section, idx) => {
        if (idx < currentIndex) {
          section.classList.add('blurred');
        } else {
          section.classList.remove('blurred');
        }
      });
    }, {
      threshold: [0.3, 0.5, 0.7]
    });

    sections.forEach(section => observer.observe(section));
  };

  // ------------------------------
  // NAVBAR SCROLL EFFECT
  // ------------------------------
  const initNavbarScrollEffect = () => {
    const navbar = select('.navbar');
    if (!navbar) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
  };

  // ------------------------------
  // SCROLL TO TOP BUTTON
  // ------------------------------
  const initScrollToTopButton = () => {
    const btn = select('#scroll-top-btn');
    if (!btn) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  // ------------------------------
  // PARALLAX ON HERO BACKGROUND GLOW
  // ------------------------------
  const initParallax = () => {
    if (prefersReducedMotion) return;

    const heroBg = select('.hero-background');
    if (!heroBg) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      // Subtle movement - max 30px shift
      const offset = Math.min(scrollY * 0.03, 30);
      heroBg.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  };

  // ------------------------------
  // PROFILE IMAGE FLOATING ANIMATION (INJECT KEYFRAME)
  // ------------------------------
  const initFloatingProfile = () => {
    if (prefersReducedMotion) return;

    const imgWrapper = select('.hero-image-wrapper');
    if (!imgWrapper) return;

    // Create a style element for floating keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatProfile {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .hero-image-wrapper.floating {
        animation: floatProfile 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    imgWrapper.classList.add('floating');
  };

  // ------------------------------
  // BUTTON RIPPLE EFFECT (optional but elegant)
  // ------------------------------
  const initButtonRipple = () => {
    if (prefersReducedMotion) return;

    // Inject ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    const addRipple = (e) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Remove existing ripples
      button.querySelectorAll('.ripple').forEach(r => r.remove());
      button.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    };

    selectAll('.hero-btn, .ebook-btn').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', addRipple);
    });
  };

  // ------------------------------
  // INITIALIZE EVERYTHING
  // ------------------------------
  const init = () => {
    initLoadingScreen();
    initSmoothScroll();
    initActiveNav();
    initMobileMenu();
    initRevealAnimations();
    initScrollBlur();
    initNavbarScrollEffect();
    initScrollToTopButton();
    initParallax();
    initFloatingProfile();
    initButtonRipple();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();