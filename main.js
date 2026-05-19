/* ═══════════════════════════════════════════════════
   JOTAS — Portfolio Cinematográfico
   main.js — GSAP + Lenis + Cursor + Interactions
═══════════════════════════════════════════════════ */

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync GSAP ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.set(cursor, { x: mouseX, y: mouseY });
});

(function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(animateCursor);
})();

const hoverTargets = 'a, button, .portfolio-item, .service-card, .filter-btn, .social-btn, .modal-close';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});

/* ── Navigation scroll behavior ── */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -80px',
  onEnter: () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ── Mobile Menu ── */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Hero Reveal ── */
const tl = gsap.timeline({ delay: 0.3 });

tl.to('.hero-eyebrow', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out',
  from: { y: 20 },
});

document.querySelectorAll('.hero-title-line').forEach((line, i) => {
  tl.to(line, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power4.out',
  }, i === 0 ? '-=0.6' : '-=0.8');
});

tl.to('.hero-slogan', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
  .to('.hero-sub',    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
  .to('.hero-ctas',   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
  .to('.scroll-indicator', { opacity: 0.6, duration: 0.6, ease: 'power2.out' }, '-=0.3');

// Set initial states for hero text
gsap.set('.hero-eyebrow', { y: 20, opacity: 0 });
gsap.set('.hero-title-line', { y: '100%', opacity: 0 });
gsap.set('.hero-slogan', { y: 20, opacity: 0 });
gsap.set('.hero-sub', { y: 20, opacity: 0 });
gsap.set('.hero-ctas', { y: 20, opacity: 0 });
gsap.set('.scroll-indicator', { opacity: 0 });

/* ── Hero video fallback ── */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    heroVideo.style.display = 'none';
    document.querySelector('.hero-video-fallback').style.display = 'block';
  });
  // If no src, hide and show fallback
  if (!heroVideo.querySelector('source[src]')?.getAttribute('src').startsWith('http') &&
      !heroVideo.querySelector('source[src]')?.getAttribute('src').endsWith('.mp4')) {
    heroVideo.style.display = 'none';
  }
}

/* ── Scroll Reveal — About ── */
gsap.from('.about-image-frame', {
  scrollTrigger: { trigger: '.about', start: 'top 75%' },
  x: -60,
  opacity: 0,
  duration: 1.4,
  ease: 'power4.out',
});

gsap.from('.about-content > *', {
  scrollTrigger: { trigger: '.about-content', start: 'top 80%' },
  y: 40,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: 'power3.out',
});

/* ── Parallax — About image ── */
gsap.to('.about-image', {
  scrollTrigger: {
    trigger: '.about',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
  },
  y: -60,
  ease: 'none',
});

/* ── Portfolio Filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach((item, i) => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden');
        gsap.fromTo(item, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0,
          duration: 0.5,
          delay: i * 0.05,
          ease: 'power3.out',
        });
      } else {
        gsap.to(item, {
          opacity: 0, y: -10,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => item.classList.add('hidden'),
        });
      }
    });
  });
});

/* ── Portfolio Reveal on scroll ── */
gsap.from('.portfolio-item', {
  scrollTrigger: { trigger: '.portfolio-grid', start: 'top 85%' },
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  ease: 'power3.out',
});

/* ── Portfolio Modal ── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalTitle   = document.getElementById('modalTitle');
const modalType    = document.getElementById('modalType');
const modalMood    = document.getElementById('modalMood');

const projectData = [
  { title: 'Sin Título #01',      type: 'Cortometraje',  mood: 'Melancolía · Silencio · Redención' },
  { title: 'Noche Infinita',      type: 'Videoclip',     mood: 'Euforia · Oscuridad · Liberación' },
  { title: 'Brand Story — Unnamed', type: 'Reel Marca',  mood: 'Elegancia · Identidad · Poder' },
  { title: 'Editorial Urbano',    type: 'Lifestyle',     mood: 'Ciudad · Movimiento · Textura' },
  { title: 'Umbral',              type: 'Cortometraje',  mood: 'Dualidad · Sombra · Identidad' },
  { title: 'Fuego Frío',          type: 'Videoclip',     mood: 'Pasión · Contraste · Arte' },
];

portfolioItems.forEach((item) => {
  item.addEventListener('click', () => {
    const idx  = parseInt(item.dataset.index);
    const data = projectData[idx];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalType.textContent  = data.type;
    modalMood.textContent  = data.mood;

    modalOverlay.classList.add('open');
    document.body.classList.add('modal-open');
    lenis.stop();
  });
});

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  lenis.start();
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ── Section — Services reveal ── */
gsap.from('.service-card', {
  scrollTrigger: { trigger: '.services-grid', start: 'top 85%' },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out',
});

/* ── Section — Social reveal ── */
gsap.from('.social-title, .social-sub', {
  scrollTrigger: { trigger: '.social', start: 'top 80%' },
  y: 30,
  opacity: 0,
  duration: 0.9,
  stagger: 0.15,
  ease: 'power3.out',
});

gsap.from('.social-btn', {
  scrollTrigger: { trigger: '.social-buttons', start: 'top 85%' },
  x: -30,
  opacity: 0,
  duration: 0.7,
  stagger: 0.12,
  ease: 'power3.out',
});

/* ── Section — Contact reveal ── */
gsap.from('.contact-left > *', {
  scrollTrigger: { trigger: '.contact', start: 'top 80%' },
  x: -40,
  opacity: 0,
  duration: 1,
  stagger: 0.12,
  ease: 'power3.out',
});

gsap.from('.contact-right', {
  scrollTrigger: { trigger: '.contact', start: 'top 80%' },
  x: 40,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
});

/* ── Magnetic buttons ── */
document.querySelectorAll('.social-btn, .btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.4,
      ease: 'power2.out',
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ── Contact Form ── */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = '✓ Mensaje enviado';
  btn.style.background = '#1a3d1a';
  btn.style.borderColor = '#2d5a2d';
  setTimeout(() => {
    btn.textContent = 'Hablemos';
    btn.style.background = '';
    btn.style.borderColor = '';
    contactForm.reset();
  }, 3000);
});

/* ── Scroll helper ── */
function scrollToContact() {
  lenis.scrollTo('#contact', { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
}
window.scrollToContact = scrollToContact;

/* ── Nav link smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = anchor.getAttribute('href');
    lenis.scrollTo(target, { duration: 1.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });
});

/* ── Portfolio section title parallax ── */
gsap.to('.section-title', {
  scrollTrigger: {
    trigger: '.portfolio',
    start: 'top bottom',
    end: 'top top',
    scrub: 1,
  },
  y: -30,
  ease: 'none',
});

/* ── Footer reveal ── */
gsap.from('.footer-inner > *', {
  scrollTrigger: { trigger: '.footer', start: 'top 90%' },
  y: 20,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
});
