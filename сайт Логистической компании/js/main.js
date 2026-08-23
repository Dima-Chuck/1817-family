(function () {
  'use strict';

  /* Header scroll effect */
  const header = document.getElementById('header');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');

  function setActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* Intersection Observer — reveal animations */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* Hero elements visible on load */
  document.querySelectorAll('.hero .reveal').forEach((el) => {
    setTimeout(() => el.classList.add('visible'), 100);
  });

  /* Reviews slider */
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dotsContainer = document.getElementById('reviewsDots');
  const reviewCards = track ? track.querySelectorAll('.review-card') : [];
  let currentReview = 0;
  let reviewInterval;

  function createDots() {
    if (!dotsContainer) return;
    reviewCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'reviews__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
      dot.addEventListener('click', () => goToReview(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.reviews__dot') : [];
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentReview));
  }

  function goToReview(index) {
    if (!track || !reviewCards.length) return;
    currentReview = (index + reviewCards.length) % reviewCards.length;
    track.style.transform = 'translateX(-' + currentReview * 100 + '%)';
    updateDots();
    resetReviewInterval();
  }

  function resetReviewInterval() {
    clearInterval(reviewInterval);
    reviewInterval = setInterval(() => goToReview(currentReview + 1), 6000);
  }

  if (track && reviewCards.length) {
    createDots();
    prevBtn.addEventListener('click', () => goToReview(currentReview - 1));
    nextBtn.addEventListener('click', () => goToReview(currentReview + 1));
    resetReviewInterval();
  }

  /* Contact form validation */
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('successModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalOk = document.getElementById('modalOk');

  function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + 'Error');
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
  }

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  }

  function validateEmail(email) {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const name = document.getElementById('name').value.trim();
      const cargo = document.getElementById('cargo').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      let valid = true;

      if (!name) {
        showError('name', 'Введите ваше имя');
        valid = false;
      }

      if (!cargo) {
        showError('cargo', 'Опишите информацию о перевозке');
        valid = false;
      }

      if (!phone || !validatePhone(phone)) {
        showError('phone', 'Введите корректный номер телефона');
        valid = false;
      }

      if (!validateEmail(email)) {
        showError('email', 'Введите корректный email');
        valid = false;
      }

      if (valid) {
        form.reset();
        openModal();
      }
    });
  }

  [modalOverlay, modalClose, modalOk].forEach((el) => {
    if (el) el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  /* Phone mask */
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.startsWith('8')) value = '7' + value.slice(1);
      if (!value.startsWith('7') && value.length) value = '7' + value;

      let formatted = '+7';
      if (value.length > 1) formatted += ' (' + value.slice(1, 4);
      if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
      if (value.length >= 7) formatted += '-' + value.slice(7, 9);
      if (value.length >= 9) formatted += '-' + value.slice(9, 11);

      e.target.value = formatted;
    });
  }

  /* Floating contacts — tap to expand on mobile */
  const floatingContacts = document.getElementById('floatingContacts');

  if (floatingContacts) {
    floatingContacts.addEventListener('click', (e) => {
      if (!window.matchMedia('(hover: none)').matches) return;
      if (e.target.closest('.floating-contacts__item')) return;

      e.preventDefault();
      floatingContacts.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!floatingContacts.contains(e.target)) {
        floatingContacts.classList.remove('open');
      }
    });
  }

  /* Cookie banner */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1500);
  } else if (cookieBanner) {
    cookieBanner.classList.add('hidden');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.classList.add('hidden'), 400);
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
