/**
 * rel — PORTFOLIO
 * script.js  |  Minimal, modular, easily extensible
 */

/* ── UTILITIES ─────────────────────────────────────────────── */

/** Query helper */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** QueryAll helper */
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ── SCROLL RESTORATION FIX (Safari-compatible) ────────────── */
// Safari ignores history.scrollRestoration and beforeunload unreliably.
// The fix is pageshow with persisted check — this works on ALL browsers
// including Safari on iOS and macOS.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

window.addEventListener('pageshow', (e) => {
  // e.persisted = true means Safari loaded the page from bfcache (back/forward cache)
  // We scroll to top in both cases: fresh load and cached load
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

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
  // Exclude .hero .reveal — those are handled by initHeroEntrance()
  const els = Array.from($$('.reveal')).filter(el => !el.closest('.hero'));
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


/* ── LANGUAGE SYSTEM ───────────────────────────────────────── */

const translations = {
  en: {
    // NAV
    'nav.about':    'About',
    'nav.process':  'Process',
    'nav.skills':   'Skills',
    'nav.projects': 'Projects',
    'nav.tools':    'Tools',
    'nav.contact':  'Contact',

    // HERO
    'hero.eyebrow': "Hi there, I'm",
    'hero.tagline': 'Building creative ideas into a masterpiece<br>One project at a time.',
    'hero.cta1':    'View Work',
    'hero.cta2':    'Get in touch →',

    // ABOUT
    'about.label':   'About',
    'about.heading': 'A storyteller<br>through <em>visuals.</em>',
    'about.p1':      "I'm Rifa'i Khairul ilham, a student with a sharp focus on building real things from web interfaces to understanding the systems beneath them. I'm an active person who loves programming, tech, and exploring about how a system works. Besides my obsession with tech, now i currently focusing on my plan to become an engineer.",
    'about.p2':      "I also have talents in the automotive field, such as repairing motorcycle engines, electrical systems, and other mechanical components. I'm also into sports like swimming, running, basketball, and badminton. But what matters most is that i always try to balance my technical learning with my physical fitness.",

    // PROCESS
    'process.label':    'My Process',
    'process.title':    'A simple process<br><em>Consistent results</em>',
    'process.intro':    'Just a clear flow from idea to finished work.',
    'process.1.title':  'Understand',
    'process.1.desc':   "Before touching any tool, I take time to actually listen. What's the goal? Who's it for? What does done look like? Getting this right upfront saves everyone time down the line.",
    'process.2.title':  'Build',
    'process.2.desc':   'Once the direction is clear, I move — methodically. I keep the scope tight, communicate openly if something shifts, and stay focused on what actually matters for the final output.',
    'process.3.title':  'Refine',
    'process.3.desc':   "Good work doesn't ship rough. I review, tighten details, and make sure everything feels intentional — not just functional. The last 10% is what separates decent from solid.",

    // SKILLS
    'skills.label': 'Skills',
    'skills.title': 'What I<br><em>Bring?</em>',
    'skills.intro': 'More than just talents.',
    'skills.bento1': 'About turning creative ideas into structured, efficient, and functional logic.',
    'skills.bento2': 'Turning obstacles into opportunities, build more efficient solutions.',
    'skills.bento3': 'Confident presenting, MC work, and workshop facilitation at institutional events.',

    // PROJECTS
    'projects.label': 'Projects',
    'projects.title': 'Some of my<br><em>favorite work.</em>',
    'projects.intro': 'A selection of projects that showcase my skills and process.',
    'projects.card1.title': 'MacOS Recreation',
    'projects.card1.desc':  'This project challenges me to recreate the macOS interface from scratch, focusing on precision, and achieving pixel-perfect visual fidelity.',
    'projects.card2.title': 'null',
    'projects.card2.desc':  'null',
    'projects.card3.title': 'null',
    'projects.card3.desc':  'null',
    'projects.viewproject1': 'View Project →',
    'projects.viewproject2': 'View Project →',
    'projects.viewproject3': 'View Project →',

    // TOOLS
    'tools.label': 'Tools',
    'tools.title': 'Tools I reach<br><em>for daily</em>',
    'tools.intro': 'Nothing exotic, just the right tools, used well.',
    'tools.vscode': 'Where the code lives. <br> Clean, fast, and endlessly configurable.',
    'tools.github': 'Version control, collaboration, and keeping a clean history of everything built.',
    'tools.vercel': 'Deploy in seconds. Iterate fast, the smoothest way to get projects live without the hassle.',
    'tools.htmlcssjs': 'The foundation. Understanding the web at its core makes everything else make sense.',
    'tools.databases': 'Comfortable with structured data — from simple queries to designing schemas that scale.',
    'tools.terminal': 'CLI-first workflow. Faster, cleaner, and a lot more satisfying than clicking through menus.',

    // CONTACT
    'contact.heading': 'Wanna talk about<br>something? <em>Say hi.</em>',
    'contact.intro':   "Let's find me on social media",

    // FOOTER
    'footer.copy': '© 2026 - rel',
  },

  id: {
    // NAV
    'nav.about':    'Tentang',
    'nav.process':  'Proses',
    'nav.skills':   'Keahlian',
    'nav.projects': 'Proyek',
    'nav.tools':    'Alat',
    'nav.contact':  'Kontak',

    // HERO
    'hero.eyebrow': 'Halo, saya',
    'hero.tagline': 'Membangun ide kreatif menjadi mahakarya <br> Satu proyek dalam satu waktu.',
    'hero.cta1':    'Lihat Karya',
    'hero.cta2':    'Hubungi saya →',

    // ABOUT
    'about.label':   'Tentang',
    'about.heading': 'Pencerita<br>lewat <em>visual.</em>',
    'about.p1':      "Saya Rifa'i Khairul Ilham, seorang pelajar yang fokus membangun hal nyata dari antarmuka web hingga memahami sistem di baliknya. Saya merupakan orang yang aktif, suka programming, teknologi, dan senang mengeksplorasi cara kerja sebuah sistem. Di balik obsesi saya terhadap teknik, kini saya sedang fokus merencanakan masa depan untuk menjadi seorang engineer.",
    'about.p2':      "Saya juga punya bakat di bidang otomotif, seperti memperbaiki mesin motor, sistem kelistrikan, dan komponen mekanis lainnya. Saya juga suka olahraga seperti renang, lari, basket, dan bulu tangkis. Yang terpenting, saya selalu berusaha menyeimbangkan pembelajaran teknis dengan kebugaran fisik.",

    // PROCESS
    'process.label':    'Proses Saya',
    'process.title':    'Proses sederhana<br><em>Hasil konsisten</em>',
    'process.intro':    'Alur yang jelas dari ide hingga hasil akhir.',
    'process.1.title':  'Pahami',
    'process.1.desc':   'Sebelum menyentuh alat apapun, saya meluangkan waktu untuk benar-benar memahami. Apa tujuannya? Untuk siapa? Seperti apa hasil akhirnya? Memahami ini sejak awal menghemat waktu semua orang.',
    'process.2.title':  'Bangun',
    'process.2.desc':   'Setelah arahnya jelas, saya bergerak secara metodis. Menjaga cakupannya tetap ketat, komunikasi terbuka jika ada perubahan, dan tetap fokus pada hal yang benar-benar penting untuk hasil akhir.',
    'process.3.title':  'Sempurnakan',
    'process.3.desc':   'Karya yang baik tidak dikirim dalam keadaan kasar. Saya tinjau, perketat detail, dan pastikan semuanya terasa disengaja — bukan sekadar fungsional. 10% terakhir itulah yang membedakan karya biasa dari karya solid.',

    // SKILLS
    'skills.label': 'Keahlian',
    'skills.title': 'Apa yang<br><em>Saya Tawarkan?</em>',
    'skills.intro': 'Lebih dari sekadar bakat.',
    'skills.bento1': 'Tentang mengubah ide kreatif menjadi logika yang terstruktur, efisien, dan fungsional.',
    'skills.bento2': 'Mengubah hambatan menjadi peluang, membangun solusi yang lebih efisien.',
    'skills.bento3': 'Percaya diri dalam presentasi, MC, dan fasilitasi workshop di berbagai acara.',

    // PROJECTS
    'projects.label': 'Proyek',
    'projects.title': 'Beberapa<br><em>mahakarya saya.</em>',
    'projects.intro': 'Kumpulan proyek yang menunjukkan keahlian dan proses saya.',
    'projects.card1.title': 'MacOS Recreation',
    'projects.card1.desc':  'Proyek ini menantang saya untuk merekonstruksi interface macOS dari nol, berfokus pada presisi dan mencapai kesetiaan visual yang sempurna.',
    'projects.card2.title': 'null',
    'projects.card2.desc':  'null',
    'projects.card3.title': 'null',
    'projects.card3.desc':  'null',
    'projects.viewproject1': 'Lihat Proyek →',
    'projects.viewproject2': 'Lihat Proyek →',
    'projects.viewproject3': 'Lihat Proyek →',

    // TOOLS
    'tools.label': 'Alat',
    'tools.title': 'Alat yang saya<br><em>gunakan sehari-hari</em>',
    'tools.intro': 'Tidak ada yang eksotis, hanya alat yang tepat, digunakan dengan baik.',
    'tools.vscode':    'Tempat kode tinggal. <br> Bersih, cepat, dan bisa dikonfigurasi sesuka hati.',
    'tools.github':    'Version control dan kolaborasi menjaga riwayat semua yang pernah dibangun tetap bersih.',
    'tools.vercel':    'Deploy dalam hitungan detik. Cara paling mulus untuk membuat proyek live tanpa ribet.',
    'tools.htmlcssjs': 'Fondasi utama. Memahami web dari dasarnya membuat segalanya jadi masuk akal.',
    'tools.databases': 'Nyaman dengan data terstruktur — dari query sederhana hingga merancang skema yang skalabel.',
    'tools.terminal':  'Workflow berbasis CLI. Lebih cepat, lebih bersih, dan jauh lebih memuaskan.',

    // CONTACT
    'contact.heading': 'Mau tanya<br>tentang sesuatu? <em>Sapa hai.</em>',
    'contact.intro':   'Temukan saya di media sosial',

    // FOOTER
    'footer.copy': '© 2026 - rel',
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text) el.innerHTML = text;
  });

  // Update toggle button label
  const btn = $('#lang-toggle');
  if (btn) btn.textContent = lang.toUpperCase();

  // Update html lang attribute
  document.documentElement.lang = lang;
}

function initLangToggle() {
  const btn = $('#lang-toggle');
  if (!btn) return;

  // terapin bahasa pas web pertama dibuka
  applyLanguage(currentLang);

  btn.addEventListener('click', () => {
    // 1. tentuin bahasa yang baru
    const newLang = currentLang === 'en' ? 'id' : 'en';
    
    // 2. simpen bahasa baru ke memori browser
    localStorage.setItem('lang', newLang);
    
    // 3. paksa refresh halamannya!
    window.location.reload();
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

/* ── SCROLL ANIMATIONS (Intersection Observer) ──────────────── */

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



/* ── HERO ENTRANCE ANIMATION ───────────────────────────────── */
/*
 * Hero elements are already in the viewport on load so IntersectionObserver
 * never fires for them. Instead we trigger .visible manually with staggered
 * delays so each element glides in one after another — eyebrow, name,
 * tagline, buttons, then avatar.
 */

function initHeroEntrance() {
  const heroEls = document.querySelectorAll('.hero .reveal');
  if (!heroEls.length) return;

  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 150 + i * 120); // starts after 150ms, each element 120ms apart
  });
}

function init() {
  initHeaderScroll();
  initMobileNav();
  initLangToggle();
  initHeroEntrance();   // ← fires immediately on load, before scroll observer
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
