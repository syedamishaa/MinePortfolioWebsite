 //  SYEDA MISHAA — PERSONAL PORTFOLIO
 //  script.js | Interactions, Animations, Utilities

//  scroll behaviour & active link 
(function initNavbar() {
  const nav    = document.getElementById('mainNav');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class after 50px
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveLink();
    toggleBackToTop();
  }, { passive: true });

  // Highlight nav link matching visible section
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }

  // Smooth close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarMenu');
      if (collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();


//  TYPED TEXT: hero role animation 
(function initTyped() {
  const roles = [
    'Software Engineering Student',
    'Aspiring Full Stack Developer',
    'Front-End Enthusiast',
    'UI/UX Design Learner',
    'AI Integration Explorer',
  ];

  const el     = document.getElementById('typedRole');
  if (!el) return;

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let waiting  = false;

  function type() {
    const current = roles[roleIdx];

    if (!deleting) {
      // Typing forward
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        // Pause at end before deleting
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      // Deleting
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 55 : 85);
  }

  setTimeout(type, 600);
})();


// SKILL BAR ANIMATION: trigger on scroll 
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  let animated = false;

  function animateBars() {
    if (animated) return;
    const triggerAt = window.innerHeight * 0.85;

    bars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < triggerAt) {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }
    });

    const allDone = [...bars].every(b => b.style.width !== '');
    if (allDone) animated = true;
  }

  window.addEventListener('scroll', animateBars, { passive: true });
  animateBars();
})();


// SCROLL-TRIGGERED SECTION REVEALS 
(function initScrollReveal() {
  const targets = document.querySelectorAll('.animate-on-scroll');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children slightly
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
})();


//  BACK TO TOP button 
function toggleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


//  CONTACT FORM: client-side validation
function handleFormSubmit() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('emailField').value.trim();
  const subject   = document.getElementById('subjectField').value.trim();
  const message   = document.getElementById('messageField').value.trim();
  const alertEl   = document.getElementById('formAlert');

  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showAlert(type, msg) {
    alertEl.className = `form-alert ${type}`;
    alertEl.innerHTML = msg;
    alertEl.classList.remove('d-none');
    alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Validation checks
  if (!firstName || !lastName) {
    showAlert('error', '<i class="fas fa-exclamation-circle me-2"></i>Please enter your full name.');
    return;
  }
  if (!emailRegex.test(email)) {
    showAlert('error', '<i class="fas fa-exclamation-circle me-2"></i>Please enter a valid email address.');
    return;
  }
  if (!subject) {
    showAlert('error', '<i class="fas fa-exclamation-circle me-2"></i>Please provide a subject.');
    return;
  }
  if (message.length < 20) {
    showAlert('error', '<i class="fas fa-exclamation-circle me-2"></i>Message must be at least 20 characters.');
    return;
  }

  // Simulate submission success
  showAlert('success',
    `<i class="fas fa-check-circle me-2"></i>
    Thank you, ${firstName}! Your message has been received. I'll get back to you within 24–48 hours.`
  );

  // Clear fields
  ['firstName','lastName','emailField','subjectField','messageField']
    .forEach(id => { document.getElementById(id).value = ''; });
}


// FOOTER: current year 
(function setYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();


//  SMOOTH ANCHOR OFFSET (account for fixed nav) 
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('mainNav')?.offsetHeight || 70;
      const y    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();


// HOVER TILT on project cards (subtle 3D)
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(600px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 6}deg)
        translateY(-8px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


//  ICON GRID hover ripple in About card 
(function initIconRipple() {
  document.querySelectorAll('.icon-cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      cell.style.color = getRandomColor();
    });
    cell.addEventListener('mouseleave', () => {
      cell.style.color = '';
    });
  });

  function getRandomColor() {
    const colors = ['#e87fa0','#5b8dee','#22c55e','#f59e0b','#a855f7','#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
})();
