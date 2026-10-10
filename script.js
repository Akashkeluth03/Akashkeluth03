/**
 * ==========================================================================
 * MASTERCLASS JAVASCRIPT ENGINE — AKASH KELUTH PORTFOLIO
 * Features: Interactive Canvas, Audio Simulator, Terminal CLI, 3D Tilt,
 * Typewriter, Particle Network, Stats Counter, and Smooth UI Interactions.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCustomCursor();
  initAmbientCanvas();
  initTypewriter();
  initStatsCounter();
  initProjectFilters();
  initAudioSimulator();
  initTerminalCLI();
  initTiltCards();
  initClipboardAndForms();
  initScrollSpyAndReveals();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Scroll Header Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('active', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
      });
    });
  }

  // Footer Year
  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   2. CUSTOM GLOWING CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

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

  // Smooth cursor follow interpolation
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover magnification on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, textarea, .tilt-card, .term-chip, .filter-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/* ==========================================================================
   3. DYNAMIC AMBIENT CANVAS (CONSTELLATION & FLOATING PARTICLES)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth > 768 ? 65 : 25, 80);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.6 ? '#00f2fe' : Math.random() > 0.3 ? '#7928ca' : '#10b981';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting constellation lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00f2fe';
          ctx.globalAlpha = (1 - distance / 120) * 0.12;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   4. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const words = [
    'Machine Learning & AI Engineer.',
    'Python & Backend Developer.',
    'Cloud & DevOps Architect.',
    'Full-Stack Web Innovator.',
    'ISE Student at Heart.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   5. LIVE STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasCounted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          const duration = 2000;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeProgress * target;

            stat.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              stat.textContent = target + suffix;
            }
          }
          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-showcase-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE AUDIO SPECTROGRAM SIMULATOR
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

  const barSpans = waveformBars.querySelectorAll('span');

  audioBtn.addEventListener('click', () => {
    isRunning = !isRunning;

    if (isRunning) {
      waveformBars.classList.add('playing');
      audioBtnText.textContent = 'Pause Spectral Analysis';
      audioBtnIcon.className = 'fa-solid fa-pause';
      audioStatus.textContent = 'Status: Extracting MFCC/LFCC Features...';
      audioStatus.style.color = 'var(--accent-cyan)';

      // Randomize bar amplitudes in real-time
      waveInterval = setInterval(() => {
        barSpans.forEach(bar => {
          const height = Math.floor(Math.random() * 75) + 20;
          bar.style.height = `${height}%`;
        });
      }, 120);

      // Simulated verdict feedback
      setTimeout(() => {
        if (isRunning) {
          audioStatus.textContent = 'Classification Verdict: 98.4% Authentic (Real)';
          audioStatus.style.color = '#34d399';
          resultBadge.style.display = 'inline-flex';
        }
      }, 1400);

    } else {
      waveformBars.classList.remove('playing');
      clearInterval(waveInterval);
      audioBtnText.textContent = 'Run Acoustic Classification';
      audioBtnIcon.className = 'fa-solid fa-play';
      audioStatus.textContent = 'Status: Idle / Model Ready';
      audioStatus.style.color = 'var(--text-muted)';
    }
  });
}

/* ==========================================================================
   8. INTERACTIVE DEVELOPER TERMINAL CLI
   ========================================================================== */
function initTerminalCLI() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const body = document.getElementById('terminalBody');
  const chips = document.querySelectorAll('.term-chip');

  if (!form || !input || !body) return;

  const commands = {
    help: `Available commands:
  <span class="highlight-cyan">about</span>      - Learn about Akash Keluth
  <span class="highlight-cyan">skills</span>     - View technical skill matrix
  <span class="highlight-cyan">projects</span>   - Summary of flagship engineering projects
  <span class="highlight-cyan">education</span>  - Details on Information Science degree
  <span class="highlight-cyan">contact</span>    - Get direct contact channels
  <span class="highlight-cyan">whoami</span>     - Check current user status
  <span class="highlight-cyan">clear</span>      - Clear terminal screen`,

    whoami: `<span class="highlight-green">guest@recruiter-session (Authorized Viewer)</span>
Viewing Akash Keluth's interactive portfolio environment.`,

    about: `<span class="highlight-cyan">Akash Keluth</span>
Information Science & Engineering Student | Bangalore, India
Passionate about Machine Learning, Acoustic Feature Engineering (MFCC/LFCC), Cloud Architecture, and Full-Stack Development.`,

    skills: `<span class="highlight-yellow">--- CORE ARSENAL ---</span>
• Languages: Python (Advanced), C/C++, Java, JavaScript (ES6+), SQL
• AI & ML: Scikit-learn, Audio Signal Processing (MFCC/LFCC), TensorFlow, NumPy, Pandas
• Web: React.js, Node.js, Express, MongoDB, RESTful APIs, HTML5/CSS3
• Cloud/DevOps: AWS, Docker, Kubernetes, CI/CD Jenkins, Linux, Git`,

    projects: `<span class="highlight-yellow">--- FEATURED PROJECTS ---</span>
1. <span class="highlight-cyan">Deepfake Audio Detection</span>: Biometric acoustic classifier (98.4% accuracy).
2. <span class="highlight-cyan">Catch My Dream</span>: Global student relocation & university discovery platform.
3. <span class="highlight-cyan">Cloud CI/CD Matrix</span>: Containerized microservices on Docker & Kubernetes.`,

    education: `<span class="highlight-cyan">Degree:</span> Bachelor of Engineering in Information Science & Engineering (ISE)
<span class="highlight-cyan">Focus Areas:</span> Data Structures, Algorithms, Machine Learning, Cloud Computing, Database Systems.`,

    contact: `<span class="highlight-green">Let's Connect!</span>
• Email: <a href="mailto:akashkeluth03@gmail.com" style="color: #00f2fe; text-decoration: underline;">akashkeluth03@gmail.com</a>
• GitHub: <a href="https://github.com/Akashkeluth03" target="_blank" style="color: #00f2fe; text-decoration: underline;">github.com/Akashkeluth03</a>
• Location: Bangalore, Karnataka, India`
  };

  function executeCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();

    // Echo command
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line';
    echoLine.innerHTML = `<span class="term-prompt">akash@portfolio:~$</span> <span class="term-cmd-echo">${cmdText}</span>`;
    body.appendChild(echoLine);

    if (cleanCmd === 'clear') {
      body.innerHTML = '';
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'term-line';

    if (commands[cleanCmd]) {
      outputLine.innerHTML = commands[cleanCmd];
    } else if (cleanCmd === '') {
      return;
    } else {
      outputLine.innerHTML = `<span style="color: #ff5f56;">Command not found: "${cmdText}". Type <span class="cmd-pill">help</span> for available commands.</span>`;
    }

    body.appendChild(outputLine);
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

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   9. 3D CARD TILT EFFECT (MOUSE MOVEMENT)
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

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   10. CLIPBOARD, FORMS & TOAST NOTIFICATIONS
   ========================================================================== */
function initClipboardAndForms() {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Copy Email Buttons
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

  // Contact Form Feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName')?.value || 'Friend';
      const subject = document.getElementById('userSubject')?.value || 'Inquiry';
      const message = document.getElementById('userMessage')?.value || '';
      
      // Construct mailto link
      const mailtoUrl = `mailto:akashkeluth03@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Akash,\n\nMy name is ${name}.\n\n${message}`)}`;
      
      showToast('Opening email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);

      contactForm.reset();
    });
  }
}

/* ==========================================================================
   11. SCROLL SPY & REVEAL OBSERVERS
   ========================================================================== */
function initScrollSpyAndReveals() {
  const reveals = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.site-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // Active section scroll spy
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
