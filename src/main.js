import confetti from 'canvas-confetti';

// GLOBAL STATE
const state = {
  isUnlocked: false,
  isPlayingAudio: false
};


// GIFTS DATA
const giftsData = {
  1: {
    icon: 'fa-utensils',
    title: 'عزومة غداء ملوكي 🍕',
    desc: 'عزومة على أكلتك المفضلة في أحلى مكان تختاريه (والحساب عندي طبعاً!) 🍔🥤'
  },
  2: {
    icon: 'fa-film',
    title: 'خروجة سينما وفشار 🎬',
    desc: 'فيلم رايق في السينما مع علبة فشار كبيرة ونفضل نضحك لآخر اليوم! 🍿✨'
  },
  3: {
    icon: 'fa-wand-magic-sparkles',
    title: 'كارت أمنية مفتوحة 👑',
    desc: 'تطلبي أي طلب أو حاجة في بالك في أي وقت وتتنفذ فوراً من غير نقاش! 🎁🪄'
  },
  4: {
    icon: 'fa-mug-hot',
    title: 'قاعدة هادية ☕',
    desc: 'أحلى فنجان قهوة مع سينابون وشوكولاتة وقعدة تفصلك عن الدنيا كلها! 🍰🍫'
  }
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initPasscode();
  initNavigation();
  initAudio();
  initScratchCard();
  initAmbientCanvas();
});

/* ----------------------------------------------------
   1. PASSCODE ENGINE (Accepts ضحاضيحو / ضحى / doha)
   ---------------------------------------------------- */
function initPasscode() {
  const form = document.getElementById('passcode-form');
  const input = document.getElementById('passcode-input');
  const errorMsg = document.getElementById('passcode-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = input.value.trim();

    if (entered === '7/10') {
      errorMsg.classList.add('hidden');
      unlockWebsite();
    } else {
      errorMsg.classList.remove('hidden');
      input.value = '';
      input.focus();
    }
  });
}

function unlockWebsite() {
  state.isUnlocked = true;
  const passcodeScreen = document.getElementById('passcode-screen');
  const mainApp = document.getElementById('main-app');

  passcodeScreen.style.opacity = '0';
  passcodeScreen.style.transition = 'opacity 0.6s ease';

  setTimeout(() => {
    passcodeScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    triggerCelebrationConfetti();

    // AUTO-PLAY CELEBRATION MUSIC UPON UNLOCK
    const bgAudio = document.getElementById('bg-audio');
    if (bgAudio) {
      bgAudio.play().then(() => {
        state.isPlayingAudio = true;
        updateAudioUI();
      }).catch(err => {
        console.log('Audio autoplay status:', err);
      });
    }
  }, 600);
}

/* ----------------------------------------------------
   2. CELEBRATION CONFETTI ENGINE
   ---------------------------------------------------- */
window.triggerCelebrationConfetti = function() {
  const count = 220;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 28, startVelocity: 55, colors: ['#ffd700', '#ff758c', '#a855f7'] });
  fire(0.2, { spread: 65, colors: ['#ffffff', '#38bdf8', '#fbbf24'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffd700', '#f43f5e'] });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

/* ----------------------------------------------------
   3. CLEAN AUDIO PLAYER CONTROLLER
   ---------------------------------------------------- */
function initAudio() {
  const toggleBtn = document.getElementById('music-toggle-btn');
  const bgAudio = document.getElementById('bg-audio');

  toggleBtn.addEventListener('click', () => {
    if (state.isPlayingAudio) {
      bgAudio.pause();
      state.isPlayingAudio = false;
    } else {
      bgAudio.play();
      state.isPlayingAudio = true;
    }
    updateAudioUI();
  });
}

function updateAudioUI() {
  const icon = document.getElementById('music-icon');
  const btn = document.getElementById('music-toggle-btn');

  if (state.isPlayingAudio) {
    icon.classList.add('fa-spin-hover');
    if (btn) {
      btn.style.background = '#f59e0b';
      btn.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.7)';
    }
  } else {
    icon.classList.remove('fa-spin-hover');
    if (btn) {
      btn.style.background = 'rgba(255, 255, 255, 0.14)';
      btn.style.boxShadow = 'none';
    }
  }
}

/* ----------------------------------------------------
   4. NAVIGATION TABS CONTROLLER
   ---------------------------------------------------- */
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.tab-page');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add('active');
      }
    });
  });
}


/* ----------------------------------------------------
   6. VIRTUAL BIRTHDAY CAKE & CANDLES
   ---------------------------------------------------- */
window.blowOutCandles = function() {
  const flames = document.querySelectorAll('.flame-spark');
  flames.forEach(f => f.classList.add('blown-out'));

  const wishMsg = document.getElementById('wish-revealed-msg');
  if (wishMsg) {
    wishMsg.classList.remove('hidden');
  }

  triggerCelebrationConfetti();
};

window.relightCandles = function() {
  const flames = document.querySelectorAll('.flame-spark');
  flames.forEach(f => f.classList.remove('blown-out'));

  const wishMsg = document.getElementById('wish-revealed-msg');
  if (wishMsg) {
    wishMsg.classList.add('hidden');
  }
};

/* ----------------------------------------------------
   7. GIFT CARDS & SCRATCH CARDS
   ---------------------------------------------------- */
window.openGiftBox = function(id) {
  const gift = giftsData[id];
  if (!gift) return;

  const card = document.getElementById(`gift-card-${id}`);
  const icon = document.getElementById(`gift-icon-${id}`);
  const title = document.getElementById(`gift-title-${id}`);
  const status = document.getElementById(`gift-status-${id}`);

  if (icon) {
    icon.innerHTML = `<i class="fa-solid ${gift.icon} text-gold"></i>`;
  }
  if (title) {
    title.innerHTML = gift.title;
    title.style.color = '#facc15';
  }
  if (status) {
    status.innerHTML = `<span style="color: #fff; font-size: 0.88rem; line-height: 1.5; display: block; margin-top: 6px;">${gift.desc}</span>`;
  }
  if (card) {
    card.style.borderColor = 'rgba(250, 204, 21, 0.5)';
    card.style.background = 'rgba(74, 21, 75, 0.7)';
    card.style.transform = 'scale(1.02)';
  }

  confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
};

function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = '700 15px Cairo';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('✨ اكشطي بإيدك هنا عشان تقرئي المفاجأة ✨', canvas.width / 2, canvas.height / 2 + 5);

  let isScratching = false;

  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown', () => isScratching = true);
  window.addEventListener('mouseup', () => isScratching = false);
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', () => isScratching = true);
  window.addEventListener('touchend', () => isScratching = false);
  canvas.addEventListener('touchmove', scratch);
}

window.revealScratchCard = function() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti({ particleCount: 75, spread: 80, origin: { y: 0.7 } });
};

/* ----------------------------------------------------
   8. FESTIVE CELEBRATION STAR & SPARKLE CANVAS
   ---------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const starColors = [
    'rgba(250, 204, 21, 0.45)', // Gold
    'rgba(244, 114, 182, 0.35)', // Soft Rose
    'rgba(192, 132, 252, 0.35)', // Purple
    'rgba(56, 189, 248, 0.35)',  // Sky blue
    'rgba(255, 255, 255, 0.5)'   // White sparkle
  ];

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 0.7 + 0.25,
      speedX: Math.sin(Math.random() * Math.PI) * 0.4,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03
    });
  }

  function drawSparkleStar(cx, cy, spikes, outerRadius, innerRadius, color, angle) {
    let rot = Math.PI / 2 * 3 + angle;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += Math.sin(p.y * 0.01) * p.speedX;
      p.angle += p.rotationSpeed;

      if (p.y < -30) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }

      drawSparkleStar(p.x, p.y, 4, p.size, p.size * 0.35, p.color, p.angle);
    });

    requestAnimationFrame(animate);
  }

  animate();
}
