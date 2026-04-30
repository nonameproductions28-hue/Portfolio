(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = $('[data-nav]');
  const menuBtn = $('[data-menu-btn]');
  const sections = $$('[data-section]');
  const navLinks = $$('.nav__link');
  const railDots = $$('.rail__dot');
  const railLabel = $('[data-rail-label]');
  const progress = $('[data-progress]');

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const closeMenu = () => {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    if (!nav || !menuBtn) return;
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  };

  menuBtn?.addEventListener('click', toggleMenu);
  document.addEventListener('click', (e) => {
    if (!nav || !menuBtn || !nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  const jump = (hash) => {
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    closeMenu();
  };

  $$('[data-jump]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('data-jump');
      if (!hash || hash[0] !== '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      jump(hash);
    });
  });

  $('[data-top]')?.addEventListener('click', () => jump('#home'));

  const setProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const value = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, value))}%`;
  };
  window.addEventListener('scroll', setProgress, { passive: true });
  setProgress();

  const revealEls = $$('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  const activateSection = (id) => {
    navLinks.forEach(link => {
      const target = (link.getAttribute('data-jump') || '').replace('#', '');
      link.classList.toggle('is-active', target === id);
    });
    railDots.forEach(dot => {
      const target = (dot.getAttribute('data-jump') || '').replace('#', '');
      dot.classList.toggle('is-active', target === id);
    });
    const section = document.getElementById(id);
    if (railLabel && section) railLabel.textContent = section.getAttribute('data-label') || id;
  };

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) activateSection(visible.target.id);
    }, { threshold: [0.25, 0.45, 0.6] });
    sections.forEach(section => spy.observe(section));
  }

  const filterChips = $$('.filterChip');
  const projectCards = $$('.projectCard[data-tags]');
  const applyFilter = (key) => {
    projectCards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
      const show = key === 'all' || tags.includes(key);
      card.classList.toggle('is-hidden', !show);
    });
  };
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-filter') || 'all';
      filterChips.forEach(btn => {
        const active = btn === chip;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      applyFilter(key);
    });
  });
  applyFilter('all');

  const copyBtn = $('[data-copy-email]');
  copyBtn?.addEventListener('click', async () => {
    const email = 'hello@nonameproductions.com';
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1000);
    } catch {
      copyBtn.textContent = email;
      setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1400);
    }
  });

  $('[data-open-demo]')?.addEventListener('click', () => {
    const subject = encodeURIComponent('Project enquiry — No Name Productions');
    const body = encodeURIComponent([
      'Hi No Name Productions,',
      '',
      'I want help with:',
      'Timeline:',
      'Budget range:',
      'Project details:',
      '',
      'Thanks,'
    ].join('\n'));
    window.location.href = `mailto:hello@nonameproductions.com?subject=${subject}&body=${body}`;
  });

  const form = $('#contactForm');
  const msg = $('#formMsg');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = $$('[required]', form);
    const invalid = required.some(el => {
      if (!el.value.trim()) return true;
      if (el.type === 'email') return !/^\S+@\S+\.\S+$/.test(el.value.trim());
      return false;
    });
    if (invalid) {
      if (msg) msg.textContent = 'Please complete all fields with a valid email.';
      return;
    }
    if (msg) msg.textContent = 'Nice — this demo form is ready for Formspree, Netlify Forms, or your backend.';
    form.reset();
  });
})();
