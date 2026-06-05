/**
 * rel — PORTFOLIO
 * script.js  |  Minimal, modular, easily extensible
 */

/* ── UTILITIES ─────────────────────────────────────────────── */

/** Query helper */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** QueryAll helper */
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ── SCROLL RESTORATION FIX ────────────────────────────────── */
// Prevents the browser from remembering scroll position on refresh.
// Without this, refreshing on the Skills section keeps you on Skills.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
window.addEventListener('load', () => window.scrollTo(0, 0));

/* ── HEADER: Scroll Shadow ─────────────────────────────────── */

function initHeaderScroll() {
  const header = $('#site-header');
  if (!header) return;

  const handler = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ── MOBILE NAV ────────────────────────────────────────────── */

function initMobileNav() {
  const toggle = $('#nav-toggle');
  const nav    = $('#primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('a', nav).forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
/*
 * Triggers the .visible class once an element enters the viewport.
 * rootMargin -60px bottom: waits until the element clears the fold a little,
 * so the animation plays while the user is looking at it — not before.
 * threshold 0.08: fires as soon as 8% of the element is visible,
 * so tall cards don't wait too long.
 */

function initScrollReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once, never re-hide
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  els.forEach(el => observer.observe(el));
}

/* ── ACTIVE NAV LINK (highlight on scroll) ─────────────────── */

function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.primary-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ── STAGGERED CARD REVEALS ────────────────────────────────── */
/*
 * Each card in a grid gets a slightly longer delay than the previous.
 * Step is 0.10s — noticeable enough to read as a cascade,
 * subtle enough not to feel like a slideshow.
 */

function initCardStagger() {
  const grids = $$('.projects-grid, .bento-grid');

  grids.forEach(grid => {
    const cards = $$('.reveal', grid);
    cards.forEach((card, i) => {
      // Cap at 6 steps so the last card never waits more than 0.6s
      const step = Math.min(i, 6);
      card.style.transitionDelay = `${step * 0.10}s`;
    });
  });
}

/* ── AVATAR: graceful image fallback ──────────────────────── */

function initAvatarFallback() {
  const img = $('.avatar-img-wrap img');
  if (!img) return;

  img.addEventListener('load', () => {
    img.style.display = 'block';
  });

  img.addEventListener('error', () => {
    img.style.display = 'none';
    img.closest('.avatar-img-wrap')?.classList.add('avatar-fallback');
  });
}

/* ── PROJECT CARD: subtle tilt on mouse move ──────────────── */

function initCardTilt() {
  const cards = $$('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 3.5;
      const tiltY = ((cx - x) / cx) * 3.5;

      card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── LERP SMOOTH SCROLL ────────────────────────────────────── */
/*
 * Why not window.scrollTo({ behavior: 'smooth' })?
 * The native implementation varies widely across browsers and OS scroll
 * settings — it can feel snappy on Chrome, sluggish on Firefox, and
 * instant on some mobile WebViews.
 *
 * This lerp (linear interpolation) scroller is deterministic:
 *   next = current + (target - current) * factor
 * Each animation frame closes a fraction of the remaining distance.
 * With factor = 0.09 the scroll decelerates naturally, like a camera
 * easing to rest — "weighted" without any library dependency.
 *
 * LERP_FACTOR: lower = slower/dreamier, higher = snappier.
 * 0.09 is a sweet spot: premium feel without losing responsiveness.
 * SETTLE_THRESHOLD: stop the RAF loop when within 0.5px — imperceptible.
 */

const LERP_FACTOR      = 0.09;
const SETTLE_THRESHOLD = 0.5;

let lerpTarget  = window.scrollY;
let lerpCurrent = window.scrollY;
let lerpRafId   = null;

function lerpScrollStep() {
  lerpCurrent += (lerpTarget - lerpCurrent) * LERP_FACTOR;

  if (Math.abs(lerpTarget - lerpCurrent) < SETTLE_THRESHOLD) {
    // Close enough — snap to exact target and stop the loop
    window.scrollTo(0, lerpTarget);
    lerpCurrent = lerpTarget;
    lerpRafId = null;
    return;
  }

  window.scrollTo(0, lerpCurrent);
  lerpRafId = requestAnimationFrame(lerpScrollStep);
}

function lerpScrollTo(targetY) {
  // Clamp to valid scroll range
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  lerpTarget  = Math.max(0, Math.min(targetY, maxScroll));
  lerpCurrent = window.scrollY; // always start from real current position

  if (lerpRafId) cancelAnimationFrame(lerpRafId);
  lerpRafId = requestAnimationFrame(lerpScrollStep);
}

/* ── SMOOTH ANCHOR ─────────────────────────────────────────── */

function getHeaderHeight() {
  const header = $('#site-header');
  return header ? header.getBoundingClientRect().height : 64;
}

function initSmoothAnchor() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');

      if (href === '#') {
        e.preventDefault();
        lerpScrollTo(0);
        return;
      }

      const id     = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const offset = getHeaderHeight() + 20;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      lerpScrollTo(top);
    });
  });
}

/* ── SCROLL ANIMATIONS (Intersection Observer) ──────────────────────────── */

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.process-step').forEach((el) => {
    observer.observe(el);
  });
}

// terus panggil function-nya di tempat yang sesuai
// misal di dalam DOMContentLoaded atau fungsi init utama kamu
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  // fungsi lain kamu...
});



/* ── INIT ──────────────────────────────────────────────────── */

function init() {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initCardStagger();
  initAvatarFallback();
  initCardTilt();
  // initSmoothAnchor();
  initScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
