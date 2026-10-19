/**
 * ==========================================================================
 * MASTERCLASS JAVASCRIPT ENGINE — AKASH KELUTH PORTFOLIO
 * Features:
 * 1. Multi-Theme Engine (Obsidian Dark / Midnight Synth / Studio Light)
 * 2. Dedicated Mobile Slide-In Drawer with Overlay & Esc handler
 * 3. Real Web Audio API Synthesizer & Audio Spectrogram Simulator
 * 4. Project Live Search & Dynamic Category Filter
 * 5. Project Architecture Deep-Dive Modal Dialog
 * 6. Supercharged Developer Terminal CLI (History, Autocomplete & Sound)
 * 7. Viewport-Safe Animated Stats Counter
 * 8. Skills Tab Filter & Animated Skill Bars
 * 9. Scroll Progress Indicator & Smooth Back-to-Top
 * 10. Real-time Form Validation, Clipboard & Toast Notifications
 * 11. Constellation Particle Canvas Physics
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Flag body as JS-ready for progressive reveal animations
  document.body.classList.add('js-ready');

  initThemeEngine();
  initNavbarAndDrawer();
  initCustomCursor();
  initAmbientCanvas();
  initTypewriter();
  initStatsCounter();
  initProjectSearchAndFilter();
  initProjectModal();
  initAudioSimulator();
  initTerminalCLI();
  initSkillsTabs();
  initScrollProgressWidget();
  initClipboardAndForms();
  initScrollSpyAndReveals();
  initTiltCards();
});

/* ==========================================================================
   1. MULTI-THEME ENGINE (OBSIDIAN / MIDNIGHT / LIGHT)
   ========================================================================== */
function initThemeEngine() {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeDropdownMenu = document.getElementById('themeDropdownMenu');
  const themeIcon = document.getElementById('themeIcon');
  const themeOptions = document.querySelectorAll('.theme-option');
  const drawerThemePills = document.querySelectorAll('.theme-pill-btn');
  const metaThemeColor = document.getElementById('metaThemeColor');

  const THEMES = {
    obsidian: { icon: 'fa-moon', meta: '#080a11' },
    midnight: { icon: 'fa-wand-magic-sparkles', meta: '#0b0716' },
    light: { icon: 'fa-sun', meta: '#f8fafc' }
  };

  const themeList = ['obsidian', 'midnight', 'light'];
  let currentTheme = localStorage.getItem('akash_theme') || 'obsidian';

  function applyTheme(theme) {
    if (!THEMES[theme]) theme = 'obsidian';
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('akash_theme', theme);

    // Update Meta Color
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEMES[theme].meta);
    }

    // Update Header Icon
    if (themeIcon) {
      themeIcon.className = `fa-solid ${THEMES[theme].icon}`;
    }

    // Update Dropdown Options Active State
    themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });

    // Update Mobile Drawer Pills Active State
    drawerThemePills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-theme-val') === theme);
    });
  }

  applyTheme(currentTheme);

  // Theme Toggle Button Handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // On Mobile (<768px): cycle directly through themes
      if (window.innerWidth <= 768) {
        const nextIdx = (themeList.indexOf(currentTheme) + 1) % themeList.length;
        const nextTheme = themeList[nextIdx];
        applyTheme(nextTheme);
        showToast(`Theme: ${nextTheme.toUpperCase()}`);
        return;
      }

      // On Desktop: toggle dropdown
      if (themeDropdownMenu) {
        themeDropdownMenu.classList.toggle('is-active');
      }
    });

    // Close Dropdown on outside click
    document.addEventListener('click', (e) => {
      if (themeDropdownMenu && !themeDropdownMenu.contains(e.target) && e.target !== themeToggleBtn) {
        themeDropdownMenu.classList.remove('is-active');
      }
    });

    // Desktop Dropdown Option Click
    themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.getAttribute('data-theme');
        applyTheme(theme);
        if (themeDropdownMenu) themeDropdownMenu.classList.remove('is-active');
        showToast(`Theme switched to ${theme.toUpperCase()}`);
      });
    });
  }

  // Mobile Drawer Theme Pills Click
  drawerThemePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const theme = pill.getAttribute('data-theme-val');
      applyTheme(theme);
      showToast(`Theme set to ${theme.toUpperCase()}`);
    });
  });

  // Expose globally for Terminal commands
  window.setPortfolioTheme = applyTheme;
}

/* ==========================================================================
   2. NAVBAR & MOBILE SLIDE-IN DRAWER
   ========================================================================== */
function initNavbarAndDrawer() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.mobile-drawer .drawer-link, .drawer-footer a');

  // Sticky Scroll Header Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open Drawer Function
  function openDrawer() {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    menuToggle?.classList.add('active');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  // Close Drawer Function
  function closeDrawer() {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('is-open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Set Current Year in Footer
  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   3. CUSTOM GLOWING CURSOR (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot || window.innerWidth < 992) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const hoverables = document.querySelectorAll('a, button, input, textarea, .tilt-card, .term-chip, .filter-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/* ==========================================================================
   4. DYNAMIC AMBIENT CONSTELLATION CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth > 768 ? 55 : 20;

  let mouse = { x: null, y: null, radius: 130 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.45 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   5. DYNAMIC TYPEWRITER SUBTITLE
   ========================================================================== */
function initTypewriter() {
  const typingText = document.getElementById('typingText');
  if (!typingText) return;

  const roles = [
    'Machine Learning & AI Engineer',
    'Full-Stack Developer (MERN)',
    'Cloud & DevOps Practitioner',
    'Speech & Audio Signal Researcher',
    'ISE Scholar at MSRIT Bangalore'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40;
    } else {
      typingText.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1600;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }
  type();
}

/* ==========================================================================
   6. VIEWPORT-SAFE ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasCounted = false;

  function runCounter() {
    if (hasCounted) return;
    hasCounted = true;

    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        stat.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
        }
      }
      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounter();
        observer.unobserve(statsSection);
      }
    }, { threshold: 0.05 });

    observer.observe(statsSection);
  }

  setTimeout(() => {
    const rect = statsSection?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight) {
      runCounter();
    }
  }, 400);
}

/* ==========================================================================
   7. PROJECT SEARCH & CATEGORY FILTER ENGINE
   ========================================================================== */
function initProjectSearchAndFilter() {
  const searchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-showcase-card');
  const countBadge = document.getElementById('projectsCountBadge');
  const noProjectsMsg = document.getElementById('noProjectsMessage');
  const resetBtn = document.getElementById('resetSearchFilterBtn');

  if (!projectCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function filterProjects() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('.project-heading')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();
      const allText = `${title} ${desc} ${keywords}`;

      const matchesCat = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !searchTerm || allText.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = 'grid';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });

    if (countBadge) {
      countBadge.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
    }

    if (noProjectsMsg) {
      noProjectsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('is-active', searchTerm.length > 0);
      }
      filterProjects();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearSearchBtn.classList.remove('is-active');
      filterProjects();
      searchInput.focus();
    });
  }

  if (resetBtn && searchInput) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      if (clearSearchBtn) clearSearchBtn.classList.remove('is-active');
      filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
      activeCategory = 'all';
      filterProjects();
    });
  }
}

/* ==========================================================================
   8. PROJECT ARCHITECTURE DEEP-DIVE MODAL
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const triggerBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalContent) return;

  const PROJECT_DATA = {
    'deepfake-audio': {
      title: 'Deepfake Audio Detection & Biometric Authentication',
      category: 'AI & Acoustic Signal Processing',
      badgeClass: 'ai-tag',
      date: '2026 • Flagship Research',
      image: './assets/images/deepfake-audio.jpg',
      overview: 'Engineered a specialized anti-spoofing pipeline that protects biometric voice authentication systems against high-fidelity neural vocoders (such as Tacotron, WaveNet, and ElevenLabs). Extracts spectral phase artifacts invisible to human ears.',
      architecture: 'Raw WAV Audio → Spectral Preprocessing (Framing & Windowing) → MFCC & LFCC Cepstral Extraction → High-Frequency Residual Analysis → Scikit-learn Classifier Ensemble (Random Forest + SVM) → Confidence Scoring Matrix.',
      challenges: 'Overcame neural vocoder compression loss and background ambient noise by pairing Mel-frequency cepstral coefficients with linear cepstral features, delivering 98.4% validation accuracy on spoofed speech benchmarks.',
      metrics: [
        { val: '98.4%', lbl: 'Detection Accuracy' },
        { val: '<120ms', lbl: 'Inference Latency' },
        { val: '40+', lbl: 'Acoustic Features' }
      ],
      tech: ['Python', 'Scikit-learn', 'Librosa', 'MFCC / LFCC', 'Matplotlib', 'NumPy'],
      github: 'https://github.com/Akashkeluth03'
    },
    'catch-my-dream': {
      title: 'Catch My Dream — International Student Relocation Portal',
      category: 'Full-Stack Web Platform',
      badgeClass: 'web-tag',
      date: '2026 • Live Production Platform',
      image: './assets/images/catch-my-dream.jpg',
      overview: 'An all-in-one centralized digital ecosystem for international students relocating abroad. Solves the fragmented experience between university discovery, landlord-verified accommodations, job marketplaces, and transit planning.',
      architecture: 'Modern React SPA Client → Node.js / Express RESTful API Gateway → JWT Authentication & Role-Based Access → MongoDB Document Store with Geo-spatial Queries for campus housing proximity.',
      challenges: 'Engineered responsive multi-faceted filtering for 500+ global universities, implemented verified student reviews with anti-fraud moderation, and cached high-demand query results.',
      metrics: [
        { val: '500+', lbl: 'Universities Indexed' },
        { val: '100%', lbl: 'Responsive Mobile UX' },
        { val: 'REST', lbl: 'Scalable API Engine' }
      ],
      tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'CSS3 Modern Grid'],
      github: 'https://github.com/Akashkeluth03/catchmydream1'
    },
    'cloud-devops': {
      title: 'Cloud-Native Microservices & CI/CD Deployment Pipelines',
      category: 'Cloud & DevOps Infrastructure',
      badgeClass: 'cloud-tag',
      date: '2026 • Production Lab',
      image: './assets/images/cloud-devops.jpg',
      overview: 'Enterprise-grade microservices infrastructure designed for zero-downtime rolling deployments, high availability, and automated testing across containerized container clusters.',
      architecture: 'Git Trigger → Jenkins Automated Test Pipeline → Multi-Stage Docker Image Build & Vulnerability Scanning → Container Registry Push → Kubernetes Cluster Deployment with Ingress Controller & HPA Autoscaling on AWS.',
      challenges: 'Optimized Docker container image sizes from 850MB to under 95MB via multi-stage alpine builds; configured automated rolling updates with liveness and readiness health probes.',
      metrics: [
        { val: '0s', lbl: 'Downtime Deployments' },
        { val: '-85%', lbl: 'Docker Image Size' },
        { val: 'AWS', lbl: 'Cloud Hosted' }
      ],
      tech: ['Docker', 'Kubernetes', 'AWS (EC2, S3, IAM)', 'Jenkins CI/CD', 'Linux', 'GitOps'],
      github: 'https://github.com/Akashkeluth03'
    },
    'ai-ml-pipeline': {
      title: 'Neural Network Architecture & Predictive Intelligence',
      category: 'Deep Learning & Applied Research',
      badgeClass: 'ai-tag',
      date: '2026 • Applied Lab',
      image: './assets/images/ai-ml-pipeline.jpg',
      overview: 'Applied research exploration into deep convolutional layers, tensor operations, optimizer convergence, and automated feature selection on noisy multi-class datasets.',
      architecture: 'Data Cleaning & Normalization → Pandas/NumPy Vectorization → Dense & Convolutional Neural Architecture → Loss Optimization (Adam/SGD) with Early Stopping → ROC-AUC & Confusion Matrix Validation.',
      challenges: 'Prevented overfitting on imbalanced training distributions through dropout regularization, data augmentation, and stratified k-fold cross-validation.',
      metrics: [
        { val: 'TensorFlow', lbl: 'Deep Learning Engine' },
        { val: '96.2%', lbl: 'Model Precision' },
        { val: 'Automated', lbl: 'Preprocessing' }
      ],
      tech: ['Python', 'TensorFlow', 'NumPy', 'Pandas', 'Seaborn', 'Scikit-learn'],
      github: 'https://github.com/Akashkeluth03'
    }
  };

  function openModal(projectKey) {
    const data = PROJECT_DATA[projectKey];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-header-hero">
        <div class="modal-meta-row">
          <span class="meta-tag ${data.badgeClass}">${data.category}</span>
          <span class="project-date">${data.date}</span>
        </div>
        <h2 class="modal-project-title">${data.title}</h2>
      </div>

      <div class="modal-image-preview">
        <img src="${data.image}" alt="${data.title}" />
      </div>

      <div class="modal-section-block">
        <h3 class="modal-section-title"><i class="fa-solid fa-circle-info"></i> Project Overview</h3>
        <p class="modal-section-text">${data.overview}</p>
      </div>

      <div class="modal-section-block">
        <h3 class="modal-section-title"><i class="fa-solid fa-diagram-project"></i> System Architecture</h3>
        <p class="modal-section-text">${data.architecture}</p>
      </div>

      <div class="modal-section-block">
        <h3 class="modal-section-title"><i class="fa-solid fa-puzzle-piece"></i> Key Engineering Challenges Solved</h3>
        <p class="modal-section-text">${data.challenges}</p>
      </div>

      <div class="modal-section-block">
        <h3 class="modal-section-title"><i class="fa-solid fa-chart-line"></i> Benchmark Results</h3>
        <div class="modal-metrics-grid">
          ${data.metrics.map(m => `
            <div class="modal-metric-card">
              <div class="modal-metric-val">${m.val}</div>
              <div class="modal-metric-lbl">${m.lbl}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="modal-section-block">
        <h3 class="modal-section-title"><i class="fa-solid fa-code"></i> Tech Arsenal</h3>
        <div class="tech-stack-row">
          ${data.tech.map(t => `<span class="stack-badge">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-footer-actions">
        <a href="${data.github}" target="_blank" rel="noreferrer" class="btn btn-primary">
          <i class="fa-brands fa-github"></i>
          <span>View Source on GitHub</span>
        </a>
        <a href="mailto:akashkeluth03@gmail.com?subject=${encodeURIComponent(`Inquiry regarding ${data.title}`)}" class="btn btn-glass">
          <i class="fa-regular fa-envelope"></i>
          <span>Discuss with Akash</span>
        </a>
      </div>
    `;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project-key');
      openModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. REAL WEB AUDIO API SYNTHESIZER & SPECTRAL SIMULATOR
   ========================================================================== */
function initAudioSimulator() {
  const audioBtn = document.getElementById('audioDemoBtn');
  const waveformBars = document.getElementById('waveformBars');
  const audioStatus = document.getElementById('audioSimStatus');
  const audioBtnText = document.getElementById('audioBtnText');
  const audioBtnIcon = document.getElementById('audioBtnIcon');
  const resultBadge = document.getElementById('audioResultBadge');

  if (!audioBtn || !waveformBars) return;

  let isRunning = false;
  let waveInterval = null;
  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;

  const barSpans = waveformBars.querySelectorAll('span');

  function startWebAudioTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();

      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(320, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 1.2);

      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.log('Web Audio non-fatal:', e);
    }
  }

  audioBtn.addEventListener('click', () => {
    isRunning = !isRunning;

    if (isRunning) {
      waveformBars.classList.add('playing');
      audioBtnText.textContent = 'Pause Analysis';
      audioBtnIcon.className = 'fa-solid fa-pause';
      audioStatus.textContent = 'Extracting MFCC & LFCC Tensors...';
      audioStatus.style.color = 'var(--accent-cyan)';
      if (resultBadge) resultBadge.style.display = 'none';

      startWebAudioTone();

      waveInterval = setInterval(() => {
        barSpans.forEach(bar => {
          const height = Math.floor(Math.random() * 75) + 22;
          bar.style.height = `${height}%`;
        });
      }, 100);

      setTimeout(() => {
        if (isRunning) {
          audioStatus.textContent = 'Evaluating Classifier Decision Boundary...';
          audioStatus.style.color = 'var(--accent-purple)';
        }
      }, 700);

      setTimeout(() => {
        if (isRunning) {
          audioStatus.textContent = 'Model Verdict: Authentic Human Voiceprint';
          audioStatus.style.color = '#34d399';
          if (resultBadge) resultBadge.style.display = 'inline-flex';
          showToast('Audio Model Verdict: 98.4% Confidence Verified');
        }
      }, 1400);

    } else {
      waveformBars.classList.remove('playing');
      clearInterval(waveInterval);
      if (oscillator) {
        try { oscillator.stop(); } catch(e){}
      }
      audioBtnText.textContent = 'Run Acoustic Classification';
      audioBtnIcon.className = 'fa-solid fa-play';
      audioStatus.textContent = 'Status: Model Ready';
      audioStatus.style.color = 'var(--text-muted)';
    }
  });
}

/* ==========================================================================
   10. SUPERCHARGED DEVELOPER TERMINAL CLI
   ========================================================================== */
function initTerminalCLI() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const body = document.getElementById('terminalBody');
  const chips = document.querySelectorAll('.term-chip');
  const soundToggle = document.getElementById('terminalSoundToggle');

  if (!form || !input || !body) return;

  let soundEnabled = true;
  let commandHistory = [];
  let historyIdx = -1;

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('is-active', soundEnabled);
      soundToggle.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      showToast(soundEnabled ? 'Terminal audio effects enabled' : 'Terminal audio effects muted');
    });
  }

  function playTerminalBeep(freq = 600, duration = 0.05) {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  const commands = {
    help: `Available interactive terminal commands:
  <span class="highlight-cyan">about</span>      - Learn about Akash Keluth
  <span class="highlight-cyan">skills</span>     - Inspect technical skills matrix
  <span class="highlight-cyan">projects</span>   - Summary of featured engineering masterpieces
  <span class="highlight-cyan">education</span>  - Details on Information Science degree at MSRIT
  <span class="highlight-cyan">theme</span>      - Switch theme (e.g. 'theme obsidian', 'theme light')
  <span class="highlight-cyan">quote</span>      - Engineering philosophy quote
  <span class="highlight-cyan">contact</span>    - Direct communication channels
  <span class="highlight-cyan">whoami</span>     - Check current session privileges
  <span class="highlight-cyan">clear</span>      - Clear terminal window`,

    whoami: `<span class="highlight-green">recruiter@guest-session (Viewer Mode)</span>
Session connected to Akash Keluth's Developer Environment. Full guest read privileges granted.`,

    about: `<span class="highlight-cyan">Akash Keluth</span>
Information Science & Engineering Student at Ramaiah Institute of Technology (MSRIT), Bangalore.
Passionate about Machine Learning, Acoustic Feature Engineering (MFCC/LFCC), Cloud & DevOps, and Full-Stack development.`,

    skills: `<span class="highlight-yellow">--- CORE TECHNICAL ARSENAL ---</span>
• Languages: Python (Advanced), C/C++, Java, JavaScript (ES6+), SQL
• AI & ML: Scikit-learn, Audio Signal Processing (MFCC/LFCC), TensorFlow, NumPy, Pandas
• Web: React.js, Node.js, Express, MongoDB, RESTful APIs, HTML5/CSS3
• Cloud/DevOps: AWS, Docker, Kubernetes, CI/CD Jenkins, Linux, Git`,

    projects: `<span class="highlight-yellow">--- FEATURED PROJECTS ---</span>
1. <span class="highlight-cyan">Deepfake Audio Detection</span>: Acoustic anti-spoofing ML pipeline (98.4% accuracy).
2. <span class="highlight-cyan">Catch My Dream</span>: Unified international student relocation portal (React + Node + Mongo).
3. <span class="highlight-cyan">Cloud CI/CD Matrix</span>: Zero-downtime microservices with Docker, K8s & Jenkins.`,

    education: `<span class="highlight-cyan">Degree:</span> Bachelor of Engineering in Information Science & Engineering (ISE)
<span class="highlight-cyan">Institution:</span> Ramaiah Institute of Technology (MSRIT), Bangalore
<span class="highlight-cyan">Core Areas:</span> DSA (300+ solved), Machine Learning, Cloud Architecture, OS Internals.`,

    quote: `<span style="font-style: italic; color: #a855f7;">"I love the stretch between an idea and a working, resilient system: asking deeper questions, mastering the tools, and delivering value."</span>
&mdash; Akash Keluth`,

    contact: `<span class="highlight-green">Direct Reach Channels:</span>
• Email: <a href="mailto:akashkeluth03@gmail.com" style="color: #00f2fe; text-decoration: underline;">akashkeluth03@gmail.com</a>
• GitHub: <a href="https://github.com/Akashkeluth03" target="_blank" style="color: #00f2fe; text-decoration: underline;">github.com/Akashkeluth03</a>
• Location: Bangalore, Karnataka, India`,

    sudo: `<span style="color: #ff5f56;">Permission denied: User 'recruiter' is not in the sudoers file. This incident will be reported to Akash! 😉</span>`
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIdx = commandHistory.length;
    playTerminalBeep(750, 0.04);

    const echoLine = document.createElement('div');
    echoLine.className = 'term-line';
    echoLine.innerHTML = `<span class="term-prompt">akash@portfolio:~$</span> <span class="term-cmd-echo">${trimmed}</span>`;
    body.appendChild(echoLine);

    const parts = trimmed.toLowerCase().split(' ');
    const cmd = parts[0];
    const arg = parts[1];

    if (cmd === 'clear') {
      body.innerHTML = '';
      return;
    }

    if (cmd === 'theme') {
      if (['obsidian', 'midnight', 'light'].includes(arg)) {
        if (window.setPortfolioTheme) window.setPortfolioTheme(arg);
        printOutput(`<span class="highlight-green">✓ System theme set to '${arg.toUpperCase()}'.</span>`);
      } else {
        printOutput(`Current themes: <span class="highlight-cyan">obsidian</span>, <span class="highlight-cyan">midnight</span>, <span class="highlight-cyan">light</span>.<br/>Usage: <code>theme obsidian</code> or <code>theme light</code>`);
      }
      return;
    }

    if (commands[cmd]) {
      printOutput(commands[cmd]);
    } else {
      printOutput(`<span style="color: #ff5f56;">Command not recognized: "${trimmed}". Type <span class="cmd-pill">help</span> for available commands.</span>`);
    }

    body.scrollTop = body.scrollHeight;
  }

  function printOutput(htmlContent) {
    const outLine = document.createElement('div');
    outLine.className = 'term-line';
    outLine.innerHTML = htmlContent;
    body.appendChild(outLine);
    body.scrollTop = body.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = input.value;
    if (cmd) {
      executeCommand(cmd);
      input.value = '';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length && historyIdx > 0) {
        historyIdx--;
        input.value = commandHistory[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        input.value = commandHistory[historyIdx];
      } else {
        historyIdx = commandHistory.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      const available = Object.keys(commands);
      const match = available.find(c => c.startsWith(val));
      if (match) input.value = match;
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   11. SKILLS INTERACTIVE TABS & ANIMATED BARS
   ========================================================================== */
function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!tabs.length || !skillCards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-skill-tab');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (target === 'all' || cat === target) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   12. CIRCULAR SCROLL PROGRESS & BACK-TO-TOP WIDGET
   ========================================================================== */
function initScrollProgressWidget() {
  const widget = document.getElementById('floatingWidget');
  const scrollBtn = document.getElementById('scrollProgressBtn');

  if (!widget || !scrollBtn) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 200) {
      widget.classList.add('is-visible');
    } else {
      widget.classList.remove('is-visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. CLIPBOARD, FORM VALIDATION & TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initClipboardAndForms() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'akashkeluth03@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast('Email: akashkeluth03@gmail.com');
      });
    });
  });

  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const subjectInput = document.getElementById('userSubject');
  const msgInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('formSubmitBtn');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    document.querySelectorAll('.field-error').forEach(err => err.style.display = 'none');

    if (!nameInput.value.trim()) {
      const err = document.getElementById('nameError');
      if (err) { err.textContent = 'Please enter your name.'; err.style.display = 'block'; }
      isValid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      const err = document.getElementById('emailError');
      if (err) { err.textContent = 'Please provide a valid email address.'; err.style.display = 'block'; }
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      const err = document.getElementById('subjectError');
      if (err) { err.textContent = 'Please specify a subject.'; err.style.display = 'block'; }
      isValid = false;
    }

    if (!msgInput.value.trim()) {
      const err = document.getElementById('messageError');
      if (err) { err.textContent = 'Please provide your message details.'; err.style.display = 'block'; }
      isValid = false;
    }

    if (!isValid) {
      showToast('Please fix highlighted fields.');
      return;
    }

    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Preparing Dispatch...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      const mailtoUrl = `mailto:akashkeluth03@gmail.com?subject=${encodeURIComponent(subjectInput.value)}&body=${encodeURIComponent(`Hi Akash,\n\nMy name is ${nameInput.value} (${emailInput.value}).\n\n${msgInput.value}`)}`;
      
      showToast('Opening email client to send message...');
      window.location.href = mailtoUrl;

      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
      form.reset();
    }, 600);
  });
}

/* ==========================================================================
   14. SCROLL SPY & REVEAL OBSERVERS
   ========================================================================== */
function initScrollSpyAndReveals() {
  const reveals = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .drawer-nav .drawer-link');
  const sections = document.querySelectorAll('section[id]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.05 });

  reveals.forEach(el => revealObserver.observe(el));

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   15. 3D CARD TILT EFFECT (DESKTOP ONLY)
   ========================================================================== */
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth < 992) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}
