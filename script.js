/* ═══════════════════════════════════════════════════════
   AMNA — ONE YEAR AROUND OUR SUN
   Starfield · Orbit map · Letter reveal · Celebration
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════ 1. UNIVERSE STARFIELD ══════════ */
  var canvas = document.getElementById('universe-canvas');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var W = 0, H = 0, DPR = 1;
  var stars = [], shooters = [], dust = [];
  var running = true;

  function sizeCanvas() {
    if (!canvas) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildStars();
  }

  function buildStars() {
    var area = W * H;
    // Density tuned for phones: enough depth, never heavy.
    var count = Math.round(Math.min(Math.max(area / 5200, 110), 340));
    stars = [];
    for (var i = 0; i < count; i++) {
      var layer = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: layer < 0.72 ? Math.random() * 0.85 + 0.25 : Math.random() * 1.5 + 0.7,
        a: Math.random() * 0.55 + 0.22,
        tw: Math.random() * 0.014 + 0.004,
        ph: Math.random() * Math.PI * 2,
        vy: (reduceMotion ? 0 : (0.012 + layer * 0.055)),
        tint: Math.random() < 0.14
          ? (Math.random() < 0.5 ? '190,208,255' : '255,206,224')
          : '255,255,255'
      });
    }
    dust = [];
    var dustCount = Math.round(count * 0.16);
    for (var d = 0; d < dustCount; d++) {
      dust.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 22 + 10,
        a: Math.random() * 0.035 + 0.012,
        vx: (Math.random() - 0.5) * 0.09,
        vy: (Math.random() - 0.5) * 0.09,
        hue: Math.random() < 0.5 ? '150,175,235' : '230,180,210'
      });
    }
  }

  function spawnShooter() {
    if (reduceMotion) return;
    if (shooters.length > 1) return;
    if (Math.random() > 0.0065) return;
    var ang = Math.PI / 4 + (Math.random() * 0.34 - 0.17);
    shooters.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.32,
      len: 70 + Math.random() * 90,
      v: 5.5 + Math.random() * 4.5,
      ang: ang,
      a: 1
    });
  }

  function draw() {
    if (!running || !ctx) return;
    ctx.clearRect(0, 0, W, H);

    /* dust haze */
    for (var d = 0; d < dust.length; d++) {
      var p = dust[d];
      if (!reduceMotion) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.hue + ',' + p.a + ')';
      ctx.fill();
    }

    /* stars */
    var t = performance.now();
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!reduceMotion) {
        s.y -= s.vy;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      }
      var alpha = s.a + Math.sin(t * s.tw + s.ph) * 0.22;
      if (alpha < 0.05) alpha = 0.05;
      if (alpha > 1) alpha = 1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + s.tint + ',' + alpha + ')';
      ctx.fill();
    }

    /* shooting stars */
    spawnShooter();
    for (var k = shooters.length - 1; k >= 0; k--) {
      var sh = shooters[k];
      var ex = sh.x + Math.cos(sh.ang) * sh.len;
      var ey = sh.y + Math.sin(sh.ang) * sh.len;
      var g = ctx.createLinearGradient(sh.x, sh.y, ex, ey);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(226,236,255,' + sh.a + ')');
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.stroke();
      sh.x += Math.cos(sh.ang) * sh.v;
      sh.y += Math.sin(sh.ang) * sh.v;
      sh.a -= 0.016;
      if (sh.a <= 0 || sh.x > W + 60 || sh.y > H + 60) shooters.splice(k, 1);
    }

    requestAnimationFrame(draw);
  }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  window.addEventListener('orientationchange', function () { setTimeout(sizeCanvas, 220); });
  requestAnimationFrame(draw);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { running = false; }
    else if (!running) { running = true; requestAnimationFrame(draw); }
  });

  /* ══════════ 2. OPENING GATE ══════════ */
  var gate = document.getElementById('gate');
  var enterBtn = document.getElementById('enter-btn');
  var experience = document.getElementById('experience');
  var entered = false;

  function enter() {
    if (entered) return;
    entered = true;
    if (gate) gate.classList.add('gone');
    if (experience) {
      experience.setAttribute('aria-hidden', 'false');
      experience.classList.add('on');
    }
    document.body.classList.remove('gate-open');
    startAudio();
    setTimeout(function () { if (gate) gate.style.display = 'none'; }, 1000);
  }

  if (enterBtn) enterBtn.addEventListener('click', enter);
  document.body.classList.add('gate-open');

  /* ══════════ 3. AUDIO (Eastside) ══════════ */
  var audio = document.getElementById('bg-audio');
  var orb = document.getElementById('audio-orb');
  var orbSub = orb ? orb.querySelector('.orb-sub') : null;
  var audioReady = false;

  function startAudio() {
    if (!audio || audioReady) return;
    var attempt = audio.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt.then(function () {
        audioReady = true;
        if (orb) orb.classList.add('on');
        if (orbSub) orbSub.textContent = 'now playing';
      }).catch(function () {
        /* Autoplay blocked or file absent — the orb stays tappable. */
        if (orbSub) orbSub.textContent = 'tap to play';
      });
    }
  }

  if (orb) {
    orb.addEventListener('click', function () {
      if (!audio) return;
      if (audio.paused) {
        var p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(function () {
            audioReady = true;
            orb.classList.add('on');
            if (orbSub) orbSub.textContent = 'now playing';
          }).catch(function () {
            if (orbSub) orbSub.textContent = 'add eastside.mp3';
          });
        }
      } else {
        audio.pause();
        orb.classList.remove('on');
        if (orbSub) orbSub.textContent = 'paused';
      }
    });
  }

  /* First tap anywhere arms playback (mobile autoplay rules). */
  function armOnce() {
    startAudio();
    document.removeEventListener('touchstart', armOnce);
    document.removeEventListener('click', armOnce);
  }
  document.addEventListener('touchstart', armOnce, { passive: true });
  document.addEventListener('click', armOnce);

  /* ══════════ 4. LIVE COUNTER ══════════ */
  var START = new Date(2025, 10, 12, 0, 0, 0); /* 12 Nov 2025 local */
  var dEl = document.getElementById('ct-days');
  var hEl = document.getElementById('ct-hrs');
  var mEl = document.getElementById('ct-min');
  var sEl = document.getElementById('ct-sec');

  function two(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var diff = Date.now() - START.getTime();
    if (diff < 0) diff = 0;
    var secs = Math.floor(diff / 1000);
    var days = Math.floor(secs / 86400);
    var hrs = Math.floor((secs % 86400) / 3600);
    var mins = Math.floor((secs % 3600) / 60);
    var s = secs % 60;
    if (dEl) dEl.textContent = days;
    if (hEl) hEl.textContent = two(hrs);
    if (mEl) mEl.textContent = two(mins);
    if (sEl) sEl.textContent = two(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ══════════ 5. PLANET MAP NAVIGATION ══════════ */
  var mapPlanets = document.querySelectorAll('.map-planet');
  for (var i = 0; i < mapPlanets.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('data-target'));
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    })(mapPlanets[i]);
  }

  /* ══════════ 6. SCROLL REVEALS ══════════ */
  var revealTargets = document.querySelectorAll('.month, .ch-head, .ch-planet, .map-legend, .site-foot, .finale .gallery');
  for (var r = 0; r < revealTargets.length; r++) revealTargets[r].classList.add('reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          entries[e].target.classList.add('in');
          io.unobserve(entries[e].target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var q = 0; q < revealTargets.length; q++) io.observe(revealTargets[q]);
  } else {
    for (var w = 0; w < revealTargets.length; w++) revealTargets[w].classList.add('in');
  }

  /* ══════════ 7. HEARTS ══════════ */
  var hearts = document.querySelectorAll('.heart');
  for (var hh = 0; hh < hearts.length; hh++) {
    (function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var n = parseInt(btn.getAttribute('data-count'), 10) || 0;
        n += 1;
        btn.setAttribute('data-count', n);
        btn.classList.add('liked');

        var b = document.createElement('span');
        b.className = 'burst';
        b.textContent = '\u2764';
        b.style.left = ev.clientX + 'px';
        b.style.top = ev.clientY + 'px';
        document.body.appendChild(b);
        setTimeout(function () { b.remove(); }, 1350);
      });
    })(hearts[hh]);
  }

  /* ══════════ 8. LIGHTBOX ══════════ */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbClose = document.getElementById('lb-close');

  function openLB(fig) {
    var img = fig.querySelector('img');
    if (!img || !lb || !lbImg) return;
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt') || '';
    if (lbCap) lbCap.textContent = fig.getAttribute('data-cap') || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (lbImg && !lb.classList.contains('open')) lbImg.src = '';
    }, 450);
  }

  var shots = document.querySelectorAll('.shot');
  for (var sI = 0; sI < shots.length; sI++) {
    (function (fig) {
      fig.addEventListener('click', function () { openLB(fig); });
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(fig); }
      });
    })(shots[sI]);
  }
  if (lbClose) lbClose.addEventListener('click', closeLB);
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });

  /* ══════════ 9. THE LETTER (SURPRISE) ══════════ */
  var overlay = document.getElementById('letter-overlay');
  var trigger = document.getElementById('surprise-trigger');
  var letterClose = document.getElementById('letter-close');
  var letterCanvas = document.getElementById('letter-canvas');
  var lctx = letterCanvas ? letterCanvas.getContext('2d') : null;
  var lStars = [], lRunning = false, lRAF = null;

  function sizeLetterCanvas() {
    if (!letterCanvas) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    letterCanvas.width = Math.floor(window.innerWidth * d);
    letterCanvas.height = Math.floor(window.innerHeight * d);
    letterCanvas.style.width = window.innerWidth + 'px';
    letterCanvas.style.height = window.innerHeight + 'px';
    lctx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.round(Math.min(Math.max((window.innerWidth * window.innerHeight) / 9000, 60), 150));
    lStars = [];
    for (var i = 0; i < n; i++) {
      lStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.6 + 0.2,
        ph: Math.random() * Math.PI * 2,
        tw: Math.random() * 0.02 + 0.006,
        vy: reduceMotion ? 0 : Math.random() * 0.085 + 0.015,
        tint: Math.random() < 0.2 ? '190,208,255' : '255,255,255'
      });
    }
  }

  function drawLetter() {
    if (!lRunning || !lctx) return;
    var w = window.innerWidth, h = window.innerHeight, t = performance.now();
    lctx.clearRect(0, 0, w, h);
    for (var i = 0; i < lStars.length; i++) {
      var s = lStars[i];
      s.y -= s.vy;
      if (s.y < -3) { s.y = h + 3; s.x = Math.random() * w; }
      var a = s.a + Math.sin(t * s.tw + s.ph) * 0.26;
      if (a < 0.06) a = 0.06; if (a > 1) a = 1;
      lctx.beginPath();
      lctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      lctx.fillStyle = 'rgba(' + s.tint + ',' + a + ')';
      lctx.fill();
    }
    lRAF = requestAnimationFrame(drawLetter);
  }

  function openLetter() {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    sizeLetterCanvas();
    lRunning = true;
    if (lRAF) cancelAnimationFrame(lRAF);
    drawLetter();
    var scroller = overlay.querySelector('.letter-scroll');
    if (scroller) scroller.scrollTop = 0;
    startAudio();
    burst();
  }

  function closeLetter() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    lRunning = false;
    if (lRAF) cancelAnimationFrame(lRAF);
  }

  if (trigger) trigger.addEventListener('click', openLetter);
  if (letterClose) letterClose.addEventListener('click', closeLetter);
  window.addEventListener('resize', function () {
    if (overlay && overlay.classList.contains('open')) sizeLetterCanvas();
  });

  /* ══════════ 10. CELEBRATION BURST ══════════ */
  var cc = document.getElementById('celebration-canvas');
  var cctx = cc ? cc.getContext('2d') : null;
  var particles = [], ceRunning = false, ceRAF = null;

  function sizeCeleb() {
    if (!cc) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    cc.width = Math.floor(window.innerWidth * d);
    cc.height = Math.floor(window.innerHeight * d);
    cc.style.width = window.innerWidth + 'px';
    cc.style.height = window.innerHeight + 'px';
    cctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function burst() {
    if (!cc || !cctx || reduceMotion) return;
    sizeCeleb();
    cc.classList.add('live');
    var w = window.innerWidth, cx = w / 2, cy = window.innerHeight * 0.42;
    var palette = ['255,255,255', '200,214,255', '255,190,212', '170,225,210', '255,232,180'];
    for (var i = 0; i < 110; i++) {
      var ang = (Math.PI * 2 * i) / 110 + Math.random() * 0.16;
      var sp = Math.random() * 4.6 + 1.5;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 1.2,
        r: Math.random() * 2.1 + 0.7,
        col: palette[Math.floor(Math.random() * palette.length)],
        a: 1,
        decay: Math.random() * 0.012 + 0.007,
        g: 0.045
      });
    }
    if (!ceRunning) {
      ceRunning = true;
      ceRAF = requestAnimationFrame(stepCeleb);
    }
  }

  function stepCeleb() {
    if (!cctx) { ceRunning = false; return; }
    var w = window.innerWidth, h = window.innerHeight;
    cctx.clearRect(0, 0, w, h);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.992;
      p.a -= p.decay;
      if (p.a <= 0 || p.y > h + 40) { particles.splice(i, 1); continue; }
      cctx.beginPath();
      cctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cctx.fillStyle = 'rgba(' + p.col + ',' + p.a + ')';
      cctx.fill();
    }
    if (particles.length) {
      ceRAF = requestAnimationFrame(stepCeleb);
    } else {
      ceRunning = false;
      cc.classList.remove('live');
      cctx.clearRect(0, 0, w, h);
    }
  }

  /* ══════════ 11. KEYBOARD / PARALLAX ══════════ */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (overlay && overlay.classList.contains('open')) { closeLetter(); return; }
    closeLB();
  });

})();
