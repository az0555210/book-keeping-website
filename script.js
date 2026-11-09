/* =========================================================
   Book Keeping — interactions
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('fixed', window.scrollY > 150);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.has-dropdown > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth <= 991) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
    });
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 991 && !a.parentElement.classList.contains('has-dropdown')) {
      nav.classList.remove('open'); toggle.classList.remove('open');
    }
  }));

  /* ---------- Hero slider ---------- */
  const slides = [...document.querySelectorAll('.hero .slide')];
  const heroDots = [...document.querySelectorAll('#heroDots span')];
  let hero = 0, heroTimer;
  const showSlide = i => {
    hero = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === hero));
    heroDots.forEach((d, n) => d.classList.toggle('active', n === hero));
  };
  const heroPlay = () => { clearInterval(heroTimer); heroTimer = setInterval(() => showSlide(hero + 1), 6000); };
  document.getElementById('nextSlide').addEventListener('click', () => { showSlide(hero + 1); heroPlay(); });
  document.getElementById('prevSlide').addEventListener('click', () => { showSlide(hero - 1); heroPlay(); });
  heroDots.forEach((d, n) => d.addEventListener('click', () => { showSlide(n); heroPlay(); }));
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('mouseenter', () => clearInterval(heroTimer));
  heroEl.addEventListener('mouseleave', heroPlay);
  heroPlay();

  /* ---------- Active nav link on scroll ---------- */
  const links = [...document.querySelectorAll('.nav > ul > li > a')];
  const targets = { '#home': 'home', '#about': 'about', '#services': 'services', '#news': 'news', '#contact': 'contact' };
  const spy = () => {
    let current = 'home';
    Object.values(targets).forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 160) current = id;
    });
    links.forEach(l => l.classList.toggle('active', targets[l.getAttribute('href')] === current));
  };
  window.addEventListener('scroll', spy, { passive: true });

  /* ---------- Testimonials carousel ---------- */
  const track = document.getElementById('tTrack');
  const tSlides = track.children.length;
  const dotsWrap = document.getElementById('tDots');
  let t = 0, tTimer;
  for (let i = 0; i < tSlides; i++) {
    const s = document.createElement('span');
    s.addEventListener('click', () => { goTo(i); tPlay(); });
    dotsWrap.appendChild(s);
  }
  const tDots = [...dotsWrap.children];
  const goTo = i => {
    t = (i + tSlides) % tSlides;
    track.style.transform = `translateX(-${t * 100}%)`;
    tDots.forEach((d, n) => d.classList.toggle('active', n === t));
  };
  const tPlay = () => { clearInterval(tTimer); tTimer = setInterval(() => goTo(t + 1), 5000); };
  goTo(0); tPlay();

  // drag / swipe support
  let startX = null;
  const vp = track.parentElement;
  vp.addEventListener('pointerdown', e => { startX = e.clientX; });
  vp.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) { goTo(t + (dx < 0 ? 1 : -1)); tPlay(); }
    startX = null;
  });

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('.count');
  const fmt = n => n.toLocaleString('en-US');
  const runCounter = el => {
    const target = +el.dataset.target, dur = 1600, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = fmt(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); } });
    }, { threshold: .4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveal = document.querySelectorAll('.about-img, .about-text, .service, .post, .t-person');
  reveal.forEach(el => { el.style.opacity = 0; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity .8s ease, transform .8s ease'; });
  const io2 = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const sibs = [...en.target.parentElement.children];
        const delay = (sibs.indexOf(en.target) % 3) * 120;
        setTimeout(() => { en.target.style.opacity = 1; en.target.style.transform = 'none'; }, delay);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: .12 });
  reveal.forEach(el => io2.observe(el));

  /* ---------- Newsletter ---------- */
  document.getElementById('subForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.send');
    btn.textContent = 'Sent!';
    e.target.reset();
    setTimeout(() => (btn.textContent = 'Send'), 2000);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});