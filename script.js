/**
 * PORTFOLIO JAVASCRIPT — MUHAMMAD FEBRIANSYAH (ITB AHMAD DAHLAN)
 * Interactive 3D Parallax, Particle Canvas, Mouse Tilt, Typing Role & Real-time Customizer
 */

document.addEventListener('DOMContentLoaded', () => {
  initOpeningScreen();
  initParticles();
  initHeroParallax();
  initScrollTitleParallax();
  initTypewriter();
  initCustomCursor();
  initTiltCards();
  initNavbar();
  initStatsCounter();
  initCustomizer();
  initProjectModals();
});

/* ==========================================================================
   1. PARTICLES CANVAS (Full-page Constellation Webbing & Mouse Reactivity)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  const particlesCount = Math.min(width > 768 ? 75 : 40, 95);
  const particles = [];

  for (let i = 0; i < particlesCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      baseSize: Math.random() * 2.5 + 0.8,
      size: 1,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: -Math.random() * 0.6 - 0.2, // Float upwards
      opacity: Math.random() * 0.5 + 0.3,
      color: Math.random() > 0.4 ? 'rgba(255, 45, 85, ' : 'rgba(255, 120, 160, ',
      pulse: Math.random() * 0.02 + 0.01
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw connecting constellation lines between nearby particles across all sections
    const maxLineDist = 95;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const cdx = p1.x - p2.x;
        const cdy = p1.y - p2.y;
        const dist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (dist < maxLineDist) {
          const lineAlpha = (1 - dist / maxLineDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 45, 85, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // 2. Render and update particles
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Mouse interactive repulsion (Animasi hidup merespons kursor di seluruh layar)
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 130;

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 3.5;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
        p.size = p.baseSize * 1.6;
      } else {
        p.size += (p.baseSize - p.size) * 0.1;
      }

      // Sine pulse opacity
      const currentAlpha = Math.max(0.15, Math.min(0.85, p.opacity + Math.sin(Date.now() * p.pulse * 0.05) * 0.15));

      // Wrap around screen
      if (p.y < -15) {
        p.y = height + 15;
        p.x = Math.random() * width;
      }
      if (p.x < -15) p.x = width + 15;
      if (p.x > width + 15) p.x = -15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + currentAlpha + ')';
      ctx.shadowBlur = p.size * 3.5;
      ctx.shadowColor = 'rgba(255, 45, 85, 0.7)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. 3D HERO MOUSE PARALLAX TILT & SCROLL-UP TITLE ACCELERATION
   ========================================================================== */
function initHeroParallax() {
  const stage = document.getElementById('heroStage');
  const bgText = document.getElementById('heroBgTextWrap');
  const portrait = document.getElementById('heroPortraitWrap');
  const strokeText = document.getElementById('heroStrokeTextWrap');
  const badge = document.getElementById('heroBadge');
  const luffyHint = document.getElementById('heroLuffyHint');

  if (!stage || !portrait) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let idleTick = 0;

  // Spring Physics & Cursor Tracking for Alter Ego Reveal
  let isPortraitHovered = false;
  let targetCursorX = -1000;
  let targetCursorY = -1000;
  let smoothCursorX = -1000;
  let smoothCursorY = -1000;
  let cursorVelX = 0;
  let cursorVelY = 0;
  let hintTimer = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  });

  function handleCursorOnPortrait(clientX, clientY) {
    const rect = portrait.getBoundingClientRect();
    targetCursorX = clientX - rect.left;
    targetCursorY = clientY - rect.top;
    isPortraitHovered = true;
    portrait.style.setProperty('--luffy-opacity', '1');
    portrait.style.setProperty('--reveal-radius', '135px');
    if (luffyHint) luffyHint.style.opacity = '0';
  }

  portrait.addEventListener('mousemove', (e) => {
    handleCursorOnPortrait(e.clientX, e.clientY);
  });

  portrait.addEventListener('mouseenter', (e) => {
    handleCursorOnPortrait(e.clientX, e.clientY);
  });

  portrait.addEventListener('mouseleave', () => {
    isPortraitHovered = false;
    portrait.style.setProperty('--luffy-opacity', '0');
  });

  // Mobile Touch Support for Luffy Reveal
  portrait.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      handleCursorOnPortrait(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  portrait.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handleCursorOnPortrait(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  portrait.addEventListener('touchend', () => {
    setTimeout(() => {
      isPortraitHovered = false;
      portrait.style.setProperty('--luffy-opacity', '0');
    }, 1200);
  });

  // Periodic Idle Hint: every 4.8s softly pulse Luffy Fire Mode so user knows to hover!
  function updateAlterEgoHint() {
    if (isPortraitHovered) {
      if (luffyHint) luffyHint.style.opacity = '0';
      return;
    }
    hintTimer += 0.016;
    const cycle = hintTimer % 5.0;
    if (cycle < 1.3 && luffyHint) {
      const alpha = Math.sin((cycle / 1.3) * Math.PI) * 0.85;
      luffyHint.style.opacity = alpha.toFixed(3);
    } else if (luffyHint) {
      luffyHint.style.opacity = '0';
    }
  }

  function updateParallax() {
    idleTick += 1;
    const idleFloat = Math.sin(idleTick * 0.035) * 5;
    const textIdleFloat = Math.cos(idleTick * 0.028) * 3;

    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    const scrollY = window.scrollY;

    // JUDUL BERGERAK KE ATAS SAAT DISCROLL KE BAWAH (Title accelerates upwards!)
    const titleScrollY = -scrollY * 0.85;
    const titleOpacity = Math.max(0, 1 - (scrollY / 520));

    if (bgText) {
      bgText.style.transform = `translate(calc(-50% + ${mouseX * -34}px), calc(-50% + ${mouseY * -22 + textIdleFloat + titleScrollY}px))`;
      bgText.style.opacity = titleOpacity;
    }

    if (strokeText) {
      strokeText.style.transform = `translate(calc(-50% + ${mouseX * -34}px), calc(-50% + ${mouseY * -22 + textIdleFloat + titleScrollY}px))`;
      strokeText.style.opacity = titleOpacity;
    }

    if (portrait) {
      const scale = portrait.dataset.scale || 1;
      const offsetY = +(portrait.dataset.offsetY || 0);
      const portraitScrollY = -scrollY * 0.28;
      portrait.style.transform = `translate(calc(-50% + ${mouseX * 28}px), ${offsetY + portraitScrollY + idleFloat}px) scale(${scale})`;
    }

    // Spring physics update for alter ego cursor coordinates
    if (isPortraitHovered) {
      if (smoothCursorX < -500) {
        smoothCursorX = targetCursorX;
        smoothCursorY = targetCursorY;
      }
      cursorVelX = (cursorVelX + (targetCursorX - smoothCursorX) * 0.22) * 0.72;
      cursorVelY = (cursorVelY + (targetCursorY - smoothCursorY) * 0.22) * 0.72;
      smoothCursorX += cursorVelX;
      smoothCursorY += cursorVelY;

      portrait.style.setProperty('--cursor-x', `${smoothCursorX.toFixed(1)}px`);
      portrait.style.setProperty('--cursor-y', `${smoothCursorY.toFixed(1)}px`);
    } else {
      updateAlterEgoHint();
    }

    if (badge) {
      badge.style.transform = `translate(calc(-50% + ${mouseX * 16}px), ${mouseY * 10 - scrollY * 0.45 + idleFloat * 0.5}px)`;
      badge.style.opacity = Math.max(0, 1 - scrollY / 320);
    }

    requestAnimationFrame(updateParallax);
  }

  updateParallax();
}

/* ==========================================================================
   2B. SEMUA JUDUL SECTION BERGERAK KE ATAS SAAT DI-SCROLL
   ========================================================================== */
function initScrollTitleParallax() {
  const headers = document.querySelectorAll('.section-header');
  if (!headers.length) return;

  function onScroll() {
    const vh = window.innerHeight;
    headers.forEach(header => {
      const rect = header.getBoundingClientRect();
      if (rect.top < vh + 100 && rect.bottom > -100) {
        // Progress: increases as user scrolls down through the section
        const progress = (vh - rect.top) / (vh + rect.height);
        // Moves the title smoothly upwards as the user scrolls downwards!
        const moveUp = (progress - 0.5) * -50;
        header.style.transform = `translateY(${moveUp.toFixed(1)}px)`;
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   3. DYNAMIC TYPEWRITER ROLE (Animasi Teks Hidup)
   ========================================================================== */
function initTypewriter() {
  const roleEl = document.getElementById('heroTypingRole');
  if (!roleEl) return;

  const roles = [
    "Mahasiswa S1 Manajemen ITB-AD",
    "Stockly Inventory & Supply Chain Builder",
    "Business Strategy & Financial Analytics",
    "Omnichannel Marketing Strategist",
    "Creative Web & Modern UI/UX Explorer"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      roleEl.innerText = currentRole.substring(0, charIdx - 1);
      charIdx--;
      speed = 40;
    } else {
      roleEl.innerText = currentRole.substring(0, charIdx + 1);
      charIdx++;
      speed = 85;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      speed = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 500; // Pause before typing next
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   4. CUSTOM GLOWING MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Scale ring on interactive elements
  const hoverTargets = 'a, button, input, textarea, .tilt-card, .social-icon, .btn-preset, .upload-dropzone';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ==========================================================================
   5. 3D CARD TILT & SPECULAR GLARE REFLECTION
   ========================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotation range: -10 to +10 deg
      const rotX = -((y - centerY) / centerY) * 9;
      const rotY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.22), transparent 55%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease-out';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ==========================================================================
   6. NAVBAR SHRINK & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navToggle = document.getElementById('navToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   7. STATS NUMBER COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(num => {
          const target = +num.getAttribute('data-target');
          let current = 0;
          const increment = Math.max(1, Math.ceil(target / 45));
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              num.innerText = target;
              clearInterval(timer);
            } else {
              num.innerText = current;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector('.about-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. REAL-TIME CUSTOMIZER MODAL & PHOTO UPLOAD
   ========================================================================== */
function initCustomizer() {
  const trigger = document.getElementById('customizer-btn');
  const sheetAvatar = document.getElementById('sheetAvatarTrigger');
  const modal = document.getElementById('customizerModal');

  if (trigger) trigger.addEventListener('click', openCustomizerModal);
  if (sheetAvatar) sheetAvatar.addEventListener('click', openCustomizerModal);

  loadSavedSettings();
}

function openCustomizerModal() {
  const modal = document.getElementById('customizerModal');
  if (modal) modal.classList.add('active');
}

function closeCustomizerModal() {
  const modal = document.getElementById('customizerModal');
  if (modal) modal.classList.remove('active');
  saveSettings();
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    applyPortraitSrc(dataUrl);
    showToast('Foto berhasil diunggah! Efek 3D aktif.');
  };
  reader.readAsDataURL(file);
}

function setPresetPhoto(src) {
  applyPortraitSrc(src);
  document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  showToast('Preset foto diterapkan!');
}

function applyPortraitSrc(src) {
  const img = document.getElementById('heroPortraitImg');
  if (img) {
    img.src = src;
    localStorage.setItem('portfolio_photo', src);
  }
}

function adjustPhoto() {
  const scaleInput = document.getElementById('photoScale');
  const offsetInput = document.getElementById('photoOffsetY');
  const scaleVal = document.getElementById('scaleVal');
  const offsetYVal = document.getElementById('offsetYVal');
  const portraitWrap = document.getElementById('heroPortraitWrap');

  if (!scaleInput || !offsetInput || !portraitWrap) return;

  const scale = scaleInput.value / 100;
  const offsetY = offsetInput.value;

  scaleVal.innerText = `${scaleInput.value}%`;
  offsetYVal.innerText = `${offsetY}px`;

  portraitWrap.dataset.scale = scale;
  portraitWrap.dataset.offsetY = offsetY;
}

function updateHeroText(val) {
  const bgText = document.getElementById('heroBgText');
  const strokeText = document.getElementById('heroStrokeText');
  const cleanVal = val.trim() || 'FEBRIANSYAH';

  if (bgText) bgText.innerText = cleanVal;
  if (strokeText) strokeText.innerText = cleanVal;
  localStorage.setItem('portfolio_herotext', cleanVal);
}

function updateHeroSubtitle(val) {
  const sub = document.querySelector('.hero-subtitle');
  if (sub) {
    sub.innerHTML = `<strong>${val}</strong>`;
    localStorage.setItem('portfolio_subtitle', val);
  }
}

function saveSettings() {
  const scale = document.getElementById('photoScale')?.value || 100;
  const offset = document.getElementById('photoOffsetY')?.value || 0;
  localStorage.setItem('portfolio_scale', scale);
  localStorage.setItem('portfolio_offset', offset);
  showToast('Pengaturan profil tersimpan di browser Anda!');
}

function loadSavedSettings() {
  localStorage.removeItem('portfolio_photo'); // Clear any legacy cache
  const savedScale = localStorage.getItem('portfolio_scale');

  if (savedScale && document.getElementById('photoScale')) {
    document.getElementById('photoScale').value = savedScale;
    document.getElementById('scaleVal').innerText = `${savedScale}%`;
    document.getElementById('heroPortraitWrap').dataset.scale = savedScale / 100;
  }

  if (savedOffset && document.getElementById('photoOffsetY')) {
    document.getElementById('photoOffsetY').value = savedOffset;
    document.getElementById('offsetYVal').innerText = `${savedOffset}px`;
    document.getElementById('heroPortraitWrap').dataset.offsetY = savedOffset;
  }

  if (savedHeroText) {
    const custName = document.getElementById('custName');
    if (custName) custName.value = savedHeroText;
    updateHeroText(savedHeroText);
  }

  if (savedSubtitle) {
    const custSub = document.getElementById('custFullName');
    if (custSub) custSub.value = savedSubtitle;
    updateHeroSubtitle(savedSubtitle);
  }
}

function resetCustomizer() {
  localStorage.removeItem('portfolio_photo');
  localStorage.removeItem('portfolio_scale');
  localStorage.removeItem('portfolio_offset');
  localStorage.removeItem('portfolio_herotext');
  localStorage.removeItem('portfolio_subtitle');

  applyPortraitSrc('assets/images/febri_portrait.png');
  updateHeroText('FEBRIANSYAH');
  updateHeroSubtitle('Muhammad Febriansyah • Mahasiswa Manajemen ITB Ahmad Dahlan');

  if (document.getElementById('photoScale')) {
    document.getElementById('photoScale').value = 100;
    document.getElementById('scaleVal').innerText = '100%';
  }
  if (document.getElementById('photoOffsetY')) {
    document.getElementById('photoOffsetY').value = 0;
    document.getElementById('offsetYVal').innerText = '0px';
  }
  if (document.getElementById('heroPortraitWrap')) {
    document.getElementById('heroPortraitWrap').dataset.scale = 1;
    document.getElementById('heroPortraitWrap').dataset.offsetY = 0;
  }

  showToast('Pengaturan dikembalikan ke bawaan awal!');
}

/* ==========================================================================
   9. AUTHENTIC PROJECT MODAL DATABASE (NON-AI-SLOP REAL PROJECTS)
   ========================================================================== */
const projectDatabase = {
  'stockly-inventory': {
    title: 'Stockly. INVENTORY — Sistem Manajemen Stok & Distribusi Gudang',
    image: 'assets/images/stockly_inventory.png',
    tags: ['Sistem Manajemen', 'Supply Chain', 'Warehouse Control', 'Live Production', 'PHP / JS'],
    description: `
      <p><strong>Stockly. INVENTORY</strong> adalah sistem aplikasi manajemen inventaris dan rantai pasok terpadu berbasis web yang dirancang untuk mengoptimalkan operasional pergudangan, alur distribusi barang, serta pencatatan audit log mutasi stok secara real-time.</p>
      
      <h4 style="margin: 1.4rem 0 0.6rem; color: #fff;"><i class="fa-solid fa-list-check" style="color: #ff2d55;"></i> Modul &amp; Fitur Operasional Utama:</h4>
      <ul style="padding-left: 1.2rem; color: #a0a0b2; line-height: 1.85;">
        <li><strong>Aktivitas Penjualan &amp; Distribusi:</strong> Pemantauan status pemenuhan pesanan (Draft, Dikonfirmasi, Siap Dikemas, Siap Dikirim, Dalam Pengiriman, Faktur Diterbitkan).</li>
        <li><strong>Manajemen Stok Fisik:</strong> Ringkasan kuantitas stok tersedia, stok menipis, peringatan kedaluwarsa produk, dan pesanan menunggu masuk.</li>
        <li><strong>Sesi Stock Opname Berjalan:</strong> Rekonsiliasi pencatatan fisik stok di gudang dengan data sistem secara berkala tanpa menghentikan operasional.</li>
        <li><strong>Log Aktivitas Audit Real-time:</strong> Pelacakan mutasi barang dan histori persetujuan tertunda (Approval System) per lokasi gudang.</li>
        <li><strong>Scan Barcode Terintegrasi:</strong> Mempercepat identifikasi produk saat penerimaan dan pengeluaran barang.</li>
      </ul>

      <h4 style="margin: 1.4rem 0 0.6rem; color: #fff;"><i class="fa-solid fa-chart-line" style="color: #ff2d55;"></i> Nilai Strategis bagi Manajemen Bisnis:</h4>
      <p style="color: #a0a0b2; line-height: 1.7;">Mencegah terjadinya <em>stockout</em> maupun <em>overstock</em>, memangkas waktu penanganan pesanan (lead time) hingga 40%, serta menyajikan laporan akurasi inventaris siap saji untuk evaluasi keputusan pimpinan.</p>
      
      <div style="margin-top: 1.8rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <a href="https://www.stocklyinventory.web.id" target="_blank" rel="noopener noreferrer" class="btn-primary-glow" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1.5rem; font-size: 0.92rem;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Website Langsung (stocklyinventory.web.id)
        </a>
      </div>
    `
  },
  'fintrack-finance': {
    title: 'FinTrack Pro — Business Cashflow & P&L Intelligence',
    image: 'assets/images/fintrack_dashboard.svg',
    tags: ['Manajemen Keuangan', 'Cashflow P&L', 'Financial Forecasting', 'Cost Center'],
    description: `
      <p><strong>FinTrack Pro</strong> adalah dashboard analitik keuangan bisnis strategis yang dirancang untuk membantu tim manajemen dalam memantau tren pendapatan bruto, rasio margin laba bersih, serta efisiensi beban operasional (OPEX).</p>
      
      <h4 style="margin: 1.4rem 0 0.6rem; color: #fff;"><i class="fa-solid fa-chart-pie" style="color: #ff2d55;"></i> Fitur Unggulan:</h4>
      <ul style="padding-left: 1.2rem; color: #a0a0b2; line-height: 1.85;">
        <li><strong>Analisis Margin Laba Bersih (+28.6%):</strong> Pemetaan performa profitabilitas bulanan dengan proyeksi peramalan (forecasting) hingga awal 2027.</li>
        <li><strong>Alokasi Anggaran Strategis:</strong> Pemantauan realisasi biaya per departemen (Pemasaran, Supply Chain, IT R&amp;D).</li>
        <li><strong>Rekonsiliasi Bank &amp; Verifikasi Faktur Otomatis:</strong> Mengurangi risiko selisih transaksi kas.</li>
      </ul>
      <h4 style="margin: 1.4rem 0 0.6rem; color: #fff;"><i class="fa-solid fa-bullseye" style="color: #ff2d55;"></i> Relevansi Program Studi Manajemen:</h4>
      <p style="color: #a0a0b2; line-height: 1.7;">Menerapkan prinsip manajemen keuangan modern, analisis rasio likuiditas, dan perencanaan anggaran berbasis data akurat.</p>
    `
  },
  'marketpulse-analytics': {
    title: 'MarketPulse — Omnichannel Marketing & Sales Analytics',
    image: 'assets/images/marketpulse_dashboard.svg',
    tags: ['Digital Marketing', 'Omnichannel Strategy', 'TikTok & IG Ads', 'Perilaku Konsumen'],
    description: `
      <p><strong>MarketPulse</strong> adalah platform intelijen pemasaran digital omnichannel yang mengintegrasikan performa kampanye video di TikTok (@Heyann26), interaksi Instagram, serta transaksi marketplace e-commerce ke dalam satu tampilan terpusat.</p>
      
      <h4 style="margin: 1.4rem 0 0.6rem; color: #fff;"><i class="fa-solid fa-bullhorn" style="color: #ff2d55;"></i> Metrik &amp; Fitur Utama:</h4>
      <ul style="padding-left: 1.2rem; color: #a0a0b2; line-height: 1.85;">
        <li><strong>Return on Ad Spend (ROAS 5.82x):</strong> Mengukur efektivitas biaya promosi berbanding omzet penjualan.</li>
        <li><strong>Segmentasi Pasar Generasi Z (54%):</strong> Analisis preferensi produk mobile-first untuk demografi usia 18-24 tahun.</li>
        <li><strong>Net Promoter Score (NPS +72):</strong> Pemantauan tingkat loyalitas dan kepuasan pelanggan secara berkala.</li>
      </ul>
    `
  }
};

function initProjectModals() {
  window.openProjectModal = function(id) {
    const data = projectDatabase[id];
    if (!data) return;

    const modal = document.getElementById('projectModal');
    const titleEl = document.getElementById('modalProjectTitle');
    const bodyEl = document.getElementById('modalProjectBody');

    titleEl.innerText = data.title;
    bodyEl.innerHTML = `
      <div style="width: 100%; max-height: 380px; overflow: hidden; border-radius: 16px; margin-bottom: 1.5rem; background: #0b0c14; border: 1px solid rgba(255,45,85,0.25);">
        <img src="${data.image}" style="width: 100%; height: 100%; object-fit: contain; display: block;">
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.2rem;">
        ${data.tags.map(t => `<span class="tag tag-accent">${t}</span>`).join('')}
      </div>
      ${data.description}
    `;

    modal.classList.add('active');
  };

  window.closeProjectModal = function() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  };
}

/* ==========================================================================
   10. CONTACT FORM & WHATSAPP DISPATCH
   ========================================================================== */
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const subject = document.getElementById('senderSubject').value.trim();
  const message = document.getElementById('senderMessage').value.trim();

  if (!name || !email || !message) {
    showToast('Harap lengkapi semua bidang isian formulir.');
    return;
  }

  const waText = encodeURIComponent(
    `Halo Muhammad Febriansyah (Manajemen ITB Ahmad Dahlan),\n\nSaya: ${name}\nEmail: ${email}\nTopik: ${subject}\n\nPesan:\n"${message}"\n\n(Terkirim dari Portofolio Web @Heyann26)`
  );

  const waUrl = `https://wa.me/6281234567890?text=${waText}`;

  showToast('Membuka WhatsApp untuk mengirim pesan...');

  setTimeout(() => {
    window.open(waUrl, '_blank');
    document.getElementById('contactForm').reset();
  }, 900);
}

function copyEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    showToast('Alamat email berhasil disalin ke clipboard!');
  }).catch(() => {
    showToast(`Email: ${email}`);
  });
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #ff2d55;"></i><span>${msg}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

window.addEventListener('click', (e) => {
  const custModal = document.getElementById('customizerModal');
  const projModal = document.getElementById('projectModal');

  if (e.target === custModal) closeCustomizerModal();
  if (e.target === projModal) closeProjectModal();
});

/* ==========================================================================
   11. CINEMATIC WEBGL LIGHTNING SHADER & PARTICLE TEXT (TIKTOK REFERENCE)
   ========================================================================== */
function initOpeningLightning() {
  const canvas = document.getElementById('openingLightningCanvas');
  if (!canvas) return null;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return null;

  const vsSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uHue;
    uniform float uXOffset;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uSize;
    #define OCTAVE_COUNT 8
    vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }
    float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }
    float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }
    mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
    }
    float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
    }
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
            value += amplitude * noise(p);
            p *= rotate2d(0.45);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
      vec2 uv = fragCoord / iResolution.xy;
      uv = 2.0 * uv - 1.0;
      float aspect = iResolution.x / iResolution.y;
      uv.x *= aspect;
      uv.x += uXOffset;
        
      // 1. Macroscopic sine path
      float path = sin(uv.y * 3.0 - iTime * 2.5) * 0.25 
                 + sin(uv.y * 5.0 + iTime * 1.5) * 0.15;
        
      // 2. Microscopic noise
      vec2 noiseUv = uv * uSize * 1.5;
      float n = 2.0 * fbm(noiseUv + 1.2 * iTime * uSpeed) - 1.0;
        
      float scale = aspect < 1.0 ? (aspect * 1.1) : 1.0;
      float center = (path + n * 0.4) * scale;
        
      uv.y += n * 0.2 * scale;
      float dist = abs(uv.x - center);
        
      vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.72, 0.95));
      vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
      float alpha = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
      fragColor = vec4(col, alpha);
    }
    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = createShader(gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, "aPosition");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "iResolution");
  const uTime = gl.getUniformLocation(prog, "iTime");
  const uHue = gl.getUniformLocation(prog, "uHue");
  const uXOffset = gl.getUniformLocation(prog, "uXOffset");
  const uSpeed = gl.getUniformLocation(prog, "uSpeed");
  const uIntensity = gl.getUniformLocation(prog, "uIntensity");
  const uSize = gl.getUniformLocation(prog, "uSize");

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const startTime = performance.now();
  let animId;

  function render(now) {
    if (document.hidden) {
      animId = requestAnimationFrame(render);
      return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startTime) / 1000);
    gl.uniform1f(uHue, 218.0); // Electric Blue Lightning matching reference
    gl.uniform1f(uXOffset, 0.0);
    gl.uniform1f(uSpeed, 1.5);
    gl.uniform1f(uIntensity, 1.25);
    gl.uniform1f(uSize, 1.8);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animId = requestAnimationFrame(render);
  }
  animId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}

function initOpeningParticleText() {
  const canvas = document.getElementById('openingParticleCanvas');
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let offscreenCanvas = null;
  let frameCount = 0;
  const sampleStep = 4;

  class TextParticle {
    constructor() {
      this.pos = { x: 0, y: 0 };
      this.vel = { x: 0, y: 0 };
      this.acc = { x: 0, y: 0 };
      this.target = { x: 0, y: 0 };
      this.closeEnoughTarget = 100;
      this.maxSpeed = Math.random() * 8 + 8;
      this.maxForce = this.maxSpeed * 0.1;
      this.particleSize = 3;
      this.isKilled = false;
      this.startColor = { r: 255, g: 255, b: 255 };
      this.targetColor = { r: 255, g: 255, b: 255 };
      this.colorWeight = 0;
      this.colorBlendRate = Math.random() * 0.0275 + 0.0025;
    }
    move() {
      let speedMult = 1;
      const dx = this.target.x - this.pos.x;
      const dy = this.target.y - this.pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.closeEnoughTarget) speedMult = dist / this.closeEnoughTarget;

      let desX = 0, desY = 0;
      if (dist > 0) {
        desX = (dx / dist) * this.maxSpeed * speedMult;
        desY = (dy / dist) * this.maxSpeed * speedMult;
      }
      const stX = desX - this.vel.x;
      const stY = desY - this.vel.y;
      const sDist = Math.hypot(stX, stY);
      if (sDist > 0) {
        this.acc.x += (stX / sDist) * this.maxForce;
        this.acc.y += (stY / sDist) * this.maxForce;
      }
      this.vel.x += this.acc.x;
      this.vel.y += this.acc.y;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.acc.x = 0;
      this.acc.y = 0;
    }
    draw(c) {
      if (this.colorWeight < 1) {
        this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
      }
      const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
      const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
      const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
      c.fillStyle = `rgb(${r}, ${g}, ${b})`;
      c.beginPath();
      c.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      c.fill();
    }
  }

  function randomPosAround(cx, cy, radius, w, h) {
    const rx = Math.random() * w - cx;
    const ry = Math.random() * h - cy;
    const len = Math.hypot(rx, ry);
    if (len > 0) return { x: cx + (rx / len) * radius, y: cy + (ry / len) * radius };
    return { x: cx, y: cy };
  }

  function setupTextTargets(w, h) {
    frameCount = 0;
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    const octx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';

    const scale = Math.min(1, w / 750);
    const size1 = Math.round(50 * scale);
    const size2 = Math.round(64 * scale);

    // Line 1: Welcome To My (Crisp white to cyan gradient)
    octx.font = `bold ${size1}px 'Plus Jakarta Sans', Arial, sans-serif`;
    const grad1 = octx.createLinearGradient(w / 2 - 220, 0, w / 2 + 220, 0);
    grad1.addColorStop(0, '#ffffff');
    grad1.addColorStop(0.5, '#dbeafe');
    grad1.addColorStop(1, '#bfdbfe');
    octx.fillStyle = grad1;
    octx.fillText('Welcome To My', w / 2, h / 2 - size1 * 0.7);

    // Line 2: Portofolio Website (Signature electric crimson/blue)
    octx.font = `bold ${size2}px 'Plus Jakarta Sans', Arial, sans-serif`;
    octx.fillStyle = '#ff2d55';
    octx.fillText('Portofolio Website', w / 2, h / 2 + size2 * 0.7);

    const imgData = octx.getImageData(0, 0, w, h).data;
    const pixels = [];
    for (let i = 0; i < imgData.length; i += sampleStep * 4) {
      if (imgData[i + 3] > 0) pixels.push(i);
    }
    // Shuffle positions
    for (let i = pixels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
    }

    particles = [];
    for (const idx of pixels) {
      const px = (idx / 4) % w;
      const py = Math.floor((idx / 4) / w);
      const p = new TextParticle();
      const spawn = randomPosAround(w / 2, h / 2, Math.max(w, h) * 1.1, w, h);
      p.pos.x = spawn.x;
      p.pos.y = spawn.y;
      p.target.x = px;
      p.target.y = py;
      p.targetColor = { r: imgData[idx], g: imgData[idx + 1], b: imgData[idx + 2] };
      particles.push(p);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    if (width > 0 && height > 0) {
      setupTextTargets(width, height);
    }
  }
  resize();
  window.addEventListener('resize', resize);

  let animId;
  function animate() {
    if (document.hidden) {
      animId = requestAnimationFrame(animate);
      return;
    }
    ctx.clearRect(0, 0, width, height);
    frameCount++;

    let lockAlpha = 0;
    if (frameCount > 85) {
      lockAlpha = Math.min(1, (frameCount - 85) / 50);
    }

    ctx.globalAlpha = 1 - lockAlpha;
    for (let i = 0; i < particles.length; i++) {
      particles[i].move();
      particles[i].draw(ctx);
    }

    if (offscreenCanvas && lockAlpha > 0) {
      ctx.globalAlpha = lockAlpha;
      ctx.drawImage(offscreenCanvas, 0, 0);
      ctx.globalAlpha = 1;
    }

    animId = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}

function initOpeningScreen() {
  const screen = document.getElementById('openingScreen');
  const bar = document.getElementById('openingProgressBar');
  const counter = document.getElementById('openingCounter');
  const glowLead = document.getElementById('welcomeLoadingGlow');
  const skipBtn = document.getElementById('openingSkipBtn');
  const stage = document.getElementById('heroStage');

  if (!screen) return;

  // Initialize WebGL Lightning & Particle text
  const stopLightning = initOpeningLightning();
  const stopParticles = initOpeningParticleText();

  const DURATION_MS = 5000; // 5.0 detik
  const startTime = Date.now();
  let finished = false;

  function finishIntro() {
    if (finished) return;
    finished = true;

    if (bar) bar.style.width = '100%';
    if (counter) counter.innerText = '100%';
    if (glowLead) glowLead.style.transform = 'translateX(0%)';

    setTimeout(() => {
      screen.classList.add('loaded');
      if (stage) stage.classList.add('intro-done');

      setTimeout(() => {
        screen.style.display = 'none';
        if (stopLightning) stopLightning();
        if (stopParticles) stopParticles();
      }, 900);
    }, 280);
  }

  if (skipBtn) skipBtn.addEventListener('click', finishIntro);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') finishIntro();
  });

  const interval = setInterval(() => {
    if (finished) {
      clearInterval(interval);
      return;
    }
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, (elapsed / DURATION_MS) * 100);
    if (bar) bar.style.width = `${progress.toFixed(1)}%`;
    if (counter) counter.innerText = `${Math.floor(progress)}%`;
    if (glowLead) glowLead.style.transform = `translateX(${progress - 100}%)`;

    if (progress >= 100) {
      clearInterval(interval);
      finishIntro();
    }
  }, 25);
}
