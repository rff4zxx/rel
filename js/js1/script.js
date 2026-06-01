/* ================================================================
   BIRTHDAY LOVE WEBSITE — MASTER JAVASCRIPT
   rel/js/js1/script.js

   Modules:
   1. Page navigation with fade transition
   2. Floating heart particles (all pages)
   3. Heart burst / explosion (page5 only)
   4. Confetti (page6 only)
================================================================ */

'use strict';

/* ================================================================
   1. NAVIGATION
================================================================ */
function navigateTo(page) {
  const body = document.getElementById('pageBody');
  if (!body) { window.location.href = page; return; }

  // Find the animated element and reverse it
  const main = body.querySelector('.page-enter');
  if (main) {
    main.classList.remove('page-enter');
    main.style.transition = 'opacity .32s ease, transform .32s ease';
    main.style.opacity    = '0';
    main.style.transform  = 'translateY(-20px)';
  }

  // Also fade the nav
  const nav = body.querySelector('.site-nav');
  if (nav) {
    nav.style.transition = 'opacity .28s ease';
    nav.style.opacity    = '0';
  }

  setTimeout(() => { window.location.href = page; }, 320);
}


/* ================================================================
   2. FLOATING HEART PARTICLES
================================================================ */
(function initHearts() {
  const container = document.getElementById('heartsBg');
  if (!container) return;

  const glyphs  = ['💗','💕','🤍','💞','💖','💓','🩷','❤️','♡','˚₊·͟͟͞͞➳❥'];
  const isMobile = window.innerWidth < 500;
  const count    = isMobile ? 12 : 22;

  function spawn() {
    const el  = document.createElement('span');
    el.classList.add('heart-particle');
    el.textContent     = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left      = Math.random() * 100 + '%';
    el.style.fontSize  = (.7 + Math.random() * 1.2) + 'rem';
    el.style.animationDuration = (9 + Math.random() * 13) + 's';
    el.style.animationDelay    = (Math.random() * 14) + 's';
    container.appendChild(el);
  }

  for (let i = 0; i < count; i++) spawn();
  setInterval(() => { if (container.children.length < count + 10) spawn(); }, 4000);
})();


/* ================================================================
   3. HEART BURST — page5.html only
================================================================ */
(function initHeartBurst() {
  const btn         = document.getElementById('bigHeart');
  const container   = document.getElementById('burstParticles');
  const countEl     = document.getElementById('tapCount');
  const msgEl       = document.getElementById('currentMsg');

  if (!btn || !container) return;

  let taps = 0;

  const particles = ['💗','💕','💖','💞','💓','🩷','❤️','✨','🌸','💫','⭐','🌷','🌺'];

  const messages = [
    'You are loved! 💕',
    'So much love for you! 🌸',
    'Keep going! 💖',
    'Boom! Love explosion! 💥',
    'You are amazing! ✨',
    'Happy Birthday! 🎂',
    'Endless love for you! 💞',
    'The heart grows bigger! 🌺',
    'Love × infinity! 💫',
    'You deserve all this love! 🌷',
    'Still going strong! 💗',
    'Unstoppable love! 💖',
    'The universe loves you! ⭐',
    'Every tap = a wish for you! 🌟',
    'You are irreplaceable! 🩷',
  ];

  function burst(e) {
    taps++;
    if (countEl) countEl.textContent = taps;

    // Update message
    if (msgEl) {
      msgEl.style.opacity   = '0';
      msgEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        msgEl.textContent        = messages[(taps - 1) % messages.length];
        msgEl.style.transition   = 'opacity .25s, transform .25s';
        msgEl.style.opacity      = '1';
        msgEl.style.transform    = 'translateY(0)';
      }, 150);
    }

    // Burst animation class
    btn.classList.remove('burst');
    void btn.offsetWidth; // reflow
    btn.classList.add('burst');
    setTimeout(() => btn.classList.remove('burst'), 380);

    // Get click position relative to container centre
    const stageRect = container.parentElement.getBoundingClientRect();
    const cx = stageRect.width  / 2;
    const cy = stageRect.height / 2;

    // Spawn particles
    const count = 14 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      spawnParticle(cx, cy, i, count);
    }
  }

  function spawnParticle(cx, cy, index, total) {
    const el   = document.createElement('span');
    el.classList.add('burst-particle');
    el.textContent = particles[Math.floor(Math.random() * particles.length)];

    // Distribute angles evenly + jitter
    const baseAngle = (360 / total) * index;
    const angle     = (baseAngle + (Math.random() - .5) * 40) * (Math.PI / 180);
    const dist      = 70 + Math.random() * 90;
    const tx        = Math.cos(angle) * dist;
    const ty        = Math.sin(angle) * dist;
    const size      = .7 + Math.random() * 1;
    const dur       = 500 + Math.random() * 400;
    const rot       = (Math.random() - .5) * 540;

    el.style.cssText = `
      font-size: ${size}rem;
      animation-duration: ${dur}ms;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --rot: ${rot}deg;
    `;

    // Override keyframe end state via inline animation
    el.style.animation = `none`;
    container.appendChild(el);

    // Force reflow then kick animation
    void el.offsetWidth;
    el.style.transition = `transform ${dur}ms cubic-bezier(.22,.68,0,1.2), opacity ${dur}ms ease`;
    el.style.transform  = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg) scale(${.3 + Math.random() * .7})`;
    el.style.opacity    = '0';

    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, dur + 50);
  }

  btn.addEventListener('click',       burst);
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); burst(e); }, { passive: false });
})();


/* ================================================================
   4. CONFETTI — page6.html only
================================================================ */
(function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const pieces = [];
  const colors = ['#FF6B8A','#FF8FA3','#C9375A','#FFD6E0','#FF8C69','#FFB7C5','#FFFFFF','#FF94A7'];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const SHAPES = ['circle','rect','heart'];

  class Piece {
    constructor(initial) { this.reset(initial); }
    reset(initial) {
      this.x       = Math.random() * canvas.width;
      this.y       = initial ? Math.random() * -canvas.height * .5 - 20 : -20;
      this.size    = 5 + Math.random() * 8;
      this.color   = colors[Math.floor(Math.random() * colors.length)];
      this.shape   = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.vy      = 2.2 + Math.random() * 3.8;
      this.vx      = (Math.random() - .5) * 1.8;
      this.spin    = (Math.random() - .5) * .14;
      this.angle   = Math.random() * Math.PI * 2;
      this.wobbleT = Math.random() * 100;
      this.opacity = .65 + Math.random() * .35;
    }
    update() {
      this.wobbleT += .05;
      this.x      += this.vx + Math.sin(this.wobbleT) * .8;
      this.y      += this.vy;
      this.angle  += this.spin;
      if (this.y > canvas.height + 20) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        // Heart shape
        const s = this.size * .4;
        ctx.beginPath();
        ctx.moveTo(0, s * .8);
        ctx.bezierCurveTo( s * 1.1,  s * .3,  s * 1.6, -s * .5, 0, -s);
        ctx.bezierCurveTo(-s * 1.6, -s * .5, -s * 1.1,  s * .3, 0,  s * .8);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const total = window.innerWidth < 500 ? 80 : 150;
  for (let i = 0; i < total; i++) pieces.push(new Piece(true));

  let frame = 0;
  const maxFrames = 480; // ~8s

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => { p.update(); p.draw(); });
    frame++;
    if (frame < maxFrames + 90) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.transition = 'opacity 1.4s ease';
      canvas.style.opacity    = '0';
    }
  }
  animate();
})();
