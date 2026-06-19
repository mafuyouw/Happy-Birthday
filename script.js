/* =================================================================
   Birthday Website — script.js
   All editable personal data lives in birthdayData below.
   ================================================================= */

// Helper function to get the base URL for assets
function getAssetPath(path) {
  const basePath = window.location.pathname.includes('/Happy-Birthday/') ? '/Happy-Birthday/' : '/';
  return basePath + path;
}

const birthdayData = {
  girlfriendName: "Mila",
  senderName: "Annelys",
  birthDate: "June, 22 2026",
  currentAge: "21",
  mainMessage:
    "I created this little present to celebrate you and remind you how meaningful your presence is.",

  event: {
    date: "Senin, 22 Juni 2026",            // human readable, e.g. "Saturday, 12 July 2025"
    isoDate: "2026-07-22",           // YYYY-MM-DD — used for the calendar file
    startTime: "7:00 PM",       // e.g. "7:00 PM"
    endTime: "Selesai",     // e.g. "10:00 PM"
    startTime24: "19:00",            // HH:MM 24h — used for the calendar file
    endTime24: "22:00",
    venue: "Ciblon Dining & Coffee",
    dressCode: "Biru Tua & Hitam",
    whatsappNumber: "08813234152" // digits only, incl. country code e.g. "6281234567890"
  },

  // hero photo (the birthday girl). Falls back to a soft placeholder if missing.
  get heroPhoto() { return getAssetPath("assets/images/hero.jpg"); },

  get playlist() {
    return [
      { title: "I Still Love You", artist: "TheOvertunes", audio: getAssetPath("assets/music/song-1.mp3"), cover: getAssetPath("assets/images/cover-1.jpg") }
      // add more: { title:"…", artist:"…", audio: getAssetPath("assets/music/song-2.mp3"), cover: getAssetPath("assets/images/cover-2.jpg") }
    ];
  },

  // maximum 3 photos
  get photos() {
    return [
      { src: getAssetPath("assets/images/photo-1.jpg"), caption: "First photobooth kitaa", date: "Rabu, 15 April 2026", sticker: "star" },
      { src: getAssetPath("assets/images/photo-2.jpg"), caption: "First date ke pantaii", date: "Sabtu, 23 Mei 2026", sticker: "flower" },
      { src: getAssetPath("assets/images/photo-3.jpg"), caption: "Foto bareng terlucuuuu", date: "Jumat, 12 Juni 2026", sticker: "heart" }
    ];
  },

  // maximum 3 wishes, each tied to a floating object
  wishes: [
    { object: "balloon", text: "Semoga kamu panjang umur" },
    { object: "star",    text: "Semoga semua plan dan cita-cita kamu tercapai" },
    { object: "gift",    text: "Semoga kamu selalu bahagia kapanpun dan dimanapun kamu berada" }
  ],

  vouchers: [
    { title: "A Full Day Hug Voucher",   description: "Redeemable any time, no questions asked." },
    { title: "A Dinner Date Voucher",    description: "Your favourite place, my treat." },
    { title: "One Special Request Voucher", description: "Ask for anything within reason." }
  ]
};

/* ============ small helpers ============ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get: (k, d = null) => { try { const v = localStorage.getItem("bday_" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem("bday_" + k, JSON.stringify(v)); } catch {} },
  clearAll: () => { try { Object.keys(localStorage).filter(k => k.startsWith("bday_")).forEach(k => localStorage.removeItem(k)); } catch {} }
};
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  requestAnimationFrame(() => t.classList.add("is-show"));
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.classList.remove("is-show"); setTimeout(() => (t.hidden = true), 300); }, 2600);
}

/* placeholder image generator (soft blue gradient + flower) so the site
   looks complete before real photos are dropped in */
function placeholder(label = "Photo") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#EAF8FF'/><stop offset='1' stop-color='#CDEEFF'/></linearGradient></defs>
    <rect width='600' height='600' fill='url(#g)'/>
    <g fill='#8FD3FF' opacity='.55' transform='translate(300 270)'>
      <ellipse cx='0' cy='-60' rx='34' ry='52'/><ellipse cx='72' cy='0' rx='52' ry='34'/>
      <ellipse cx='0' cy='60' rx='34' ry='52'/><ellipse cx='-72' cy='0' rx='52' ry='34'/>
      <circle r='28' fill='#fff'/></g>
    <text x='300' y='430' font-family='Manrope,sans-serif' font-size='26' fill='#66869B' text-anchor='middle'>${label}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
function imgWithFallback(imgEl, src, label) {
  imgEl.src = src;
  imgEl.addEventListener("error", () => { imgEl.src = placeholder(label); }, { once: true });
}

/* ============ floating-object SVGs (wishes / game / vouchers) ============ */
const OBJECT_SVG = {
  balloon: `<svg viewBox="0 0 100 130"><path d="M50 8C28 8 18 26 18 44c0 22 18 38 32 44 14-6 32-22 32-44C82 26 72 8 50 8z" fill="#8FD3FF"/><path d="M50 8C40 8 34 26 36 46" stroke="#fff" stroke-width="2"/><path d="M50 8C60 8 66 26 64 46" stroke="#fff" stroke-width="2"/></svg>`,
  star: `<svg viewBox="0 0 100 100"><path d="M50 6l11 27 29 2-22 19 7 28-25-15-25 15 7-28L10 35l29-2z" fill="#9ad8ff" stroke="#fff" stroke-width="2"/></svg>`,
  gift: `<svg viewBox="0 0 100 100"><rect x="14" y="40" width="72" height="48" rx="6" fill="#8FD3FF"/><rect x="10" y="30" width="80" height="16" rx="5" fill="#a7deff"/><rect x="44" y="30" width="12" height="58" fill="#8FD3FF"/><circle cx="50" cy="36" r="6" fill="#a7deff"/></svg>`,
  crown: `<svg viewBox="0 0 100 100"><path d="M16 70l-6-34 22 16 18-28 18 28 22-16-6 34z" fill="#ffd76a" stroke="#fff" stroke-width="2"/><rect x="16" y="70" width="68" height="12" rx="3" fill="#ffcf4d"/></svg>`,
  flower: `<svg viewBox="0 0 100 100"><g fill="#bfe7ff"><ellipse cx="50" cy="28" rx="14" ry="20"/><ellipse cx="72" cy="50" rx="20" ry="14"/><ellipse cx="50" cy="72" rx="14" ry="20"/><ellipse cx="28" cy="50" rx="20" ry="14"/><circle cx="50" cy="50" r="12" fill="#fff"/></g></svg>`,
  ribbon: `<svg viewBox="0 0 100 100"><path d="M50 40C34 24 18 40 50 44 82 40 66 24 50 40z" fill="#8FD3FF"/><path d="M50 44l-16 40 16-12 16 12z" fill="#a7deff"/><circle cx="50" cy="42" r="6" fill="#fff"/></svg>`,
  heart: `<svg viewBox="0 0 100 100"><path d="M50 84S16 62 16 38C16 25 26 18 36 20c7 1 12 7 14 11 2-4 7-10 14-11 10-2 20 5 20 18 0 24-34 46-34 46z" fill="#9ad8ff"/></svg>`
};

/* =================================================================
   SOUND EFFECTS (WebAudio — no files needed). Can be muted.
   ================================================================= */
const SFX = (() => {
  let ctx = null, enabled = store.get("sfx", true);
  const ensure = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } return ctx; };
  function tone(freq, dur = 0.12, type = "sine", gain = 0.06) {
    if (!enabled || reduceMotion) return;
    const c = ensure(); if (!c) return;
    if (c.state === "suspended") c.resume();
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  }
  return {
    pop:   () => tone(620, 0.1, "triangle", 0.07),
    score: () => { tone(660, 0.08, "sine", 0.06); setTimeout(() => tone(880, 0.1, "sine", 0.06), 70); },
    paper: () => tone(180, 0.25, "sawtooth", 0.03),
    sparkle:() => { [880, 1100, 1320].forEach((f, i) => setTimeout(() => tone(f, 0.12, "sine", 0.04), i * 60)); },
    set enabled(v) { enabled = v; store.set("sfx", v); },
    get enabled() { return enabled; }
  };
})();

/* =================================================================
   CONFETTI / FIREWORKS / BALLOONS engine (single canvas)
   ================================================================= */
const FX = (() => {
  const canvas = $("#fxCanvas"); const ctx = canvas.getContext("2d");
  let parts = [], raf = null, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const COLORS = ["#8FD3FF", "#CDEEFF", "#FFFFFF", "#a7deff", "#DCEAF2"];
  function size() { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener("resize", size);

  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life--; p.rot += p.vr;
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max));
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.kind === "balloon") {
        ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 1.25, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = "rgba(102,134,155,.5)"; ctx.beginPath(); ctx.moveTo(0, p.s * 1.25); ctx.lineTo(0, p.s * 2.4); ctx.stroke();
      } else if (p.kind === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 7); ctx.fill(); }
      else { ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); }
      ctx.restore();
    });
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 60);
    if (parts.length) raf = requestAnimationFrame(loop); else { raf = null; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function start() { if (!raf) raf = requestAnimationFrame(loop); }

  function confetti(count = 120, originY = -10) {
    if (reduceMotion) count = Math.min(count, 24);
    for (let i = 0; i < count; i++) parts.push({
      x: Math.random() * innerWidth, y: originY - Math.random() * 60,
      vx: (Math.random() - 0.5) * 6, vy: Math.random() * 3 + 2, g: 0.08,
      s: Math.random() * 8 + 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[(Math.random() * COLORS.length) | 0], kind: Math.random() < 0.5 ? "rect" : "circle",
      life: 200 + Math.random() * 80, max: 280
    });
    start();
  }
  function balloons(count = 14) {
    for (let i = 0; i < count; i++) parts.push({
      x: Math.random() * innerWidth, y: innerHeight + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.6, vy: -(Math.random() * 1.6 + 1.4), g: -0.002,
      s: Math.random() * 16 + 16, rot: 0, vr: 0,
      color: COLORS[(Math.random() * 3) | 0], kind: "balloon",
      life: 460, max: 460
    });
    start();
  }
  function firework(x, y) {
    const n = reduceMotion ? 14 : 38, hue = COLORS[(Math.random() * COLORS.length) | 0];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n, sp = Math.random() * 3 + 2;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.04, s: Math.random() * 3 + 2,
        rot: 0, vr: 0, color: hue, kind: "circle", life: 80 + Math.random() * 40, max: 120 });
    }
    start();
  }
  return { confetti, balloons, firework };
})();

/* =================================================================
   PETALS (gentle floating flower petals)
   ================================================================= */
const Petals = (() => {
  const layer = $("#petalsLayer"); let timer = null;
  const petalSVG = `<svg viewBox="0 0 40 40"><path d="M20 4C10 10 8 26 20 36 32 26 30 10 20 4z" fill="currentColor"/></svg>`;
  function spawn() {
    if (reduceMotion) return;
    const el = document.createElement("span"); el.className = "petal";
    const size = 14 + Math.random() * 16;
    el.style.cssText = `left:${Math.random() * 100}vw;width:${size}px;height:${size}px;` +
      `color:${Math.random() < 0.5 ? "#fff" : "#CDEEFF"};--drift:${(Math.random() - 0.5) * 160}px;` +
      `animation-duration:${8 + Math.random() * 7}s;opacity:${0.5 + Math.random() * 0.4}`;
    el.innerHTML = petalSVG; layer.appendChild(el);
    setTimeout(() => el.remove(), 16000);
  }
  return {
    start(rate = 2600) { if (reduceMotion || timer) return; timer = setInterval(spawn, rate); for (let i = 0; i < 3; i++) setTimeout(spawn, i * 600); },
    stop() { clearInterval(timer); timer = null; },
    burst(n = 14) { for (let i = 0; i < n; i++) setTimeout(spawn, i * 120); }
  };
})();

/* =================================================================
   1. LOADER
   ================================================================= */
function runLoader() {
  const fill = $("#loaderFill"), loader = $("#loader");
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 6; if (p > 100) p = 100;
    fill.style.width = p + "%";
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => { loader.classList.add("is-done"); $("#opening").focus?.(); }, 350);
    }
  }, 220);
}

/* =================================================================
   2. OPENING GIFT
   ================================================================= */
function initOpening() {
  const btn = $("#openGiftBtn"), gift = $("#openingGift"), opening = $("#opening");
  btn.addEventListener("click", () => {
    gift.classList.add("is-open");
    SFX.sparkle();
    FX.confetti(140);
    Petals.burst(10);
    btn.disabled = true;
    setTimeout(() => {
      opening.classList.add("is-gone");
      $("#main").classList.remove("is-hidden");
      requestAnimationFrame(() => $("#main").classList.add("is-shown"));
      $("#nav").classList.add("is-ready");
      $("#player").hidden = false;
      Petals.start();
      Player.userStart();            // begin music softly
      startTyping();
      location.hash = "#hero";
      store.set("opened", true);
    }, 850);
  });
}

/* =================================================================
   3. HERO
   ================================================================= */
function initHero() {
  $("#heroTitle").textContent = `Happy Birthday, ${birthdayData.girlfriendName}`;
  imgWithFallback($("#heroPhoto"), birthdayData.heroPhoto, "Add your photo");
  $("#heroPhoto").alt = `Photo of ${birthdayData.girlfriendName}`;
  document.title = `Happy Birthday, ${birthdayData.girlfriendName}`;
}
let _typed = false;
function startTyping() {
  if (_typed) return; _typed = true;
  const el = $("#typedText"), text = birthdayData.mainMessage;
  if (reduceMotion) { el.textContent = text; return; }
  let i = 0;
  (function type() { if (i <= text.length) { el.textContent = text.slice(0, i++); setTimeout(type, 38); } })();
}

/* =================================================================
   4. GREETING
   ================================================================= */
function initGreeting() {
  const btn = $("#greetingBtn"), more = $("#greetingMore");
  btn.addEventListener("click", () => {
    const open = !more.hidden;
    more.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
    btn.textContent = open ? "Tap for More" : "Show Less";
  });
}

/* =================================================================
   5. GALLERY
   ================================================================= */
function sticker(kind) {
  const inner = (OBJECT_SVG[kind] || OBJECT_SVG.flower).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const extra = kind === "star" ? " polaroid__sticker--star" : "";
  return `<svg class="polaroid__sticker${extra}" viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
}
let lbIndex = 0;
function initGallery() {
  const grid = $("#galleryGrid");
  const photos = birthdayData.photos.slice(0, 3);
  photos.forEach((ph, i) => {
    const card = document.createElement("button");
    card.className = "polaroid"; card.type = "button";
    card.setAttribute("aria-label", `Open photo: ${ph.caption}`);
    card.innerHTML =
      `${sticker(ph.sticker)}
       <img class="polaroid__img" alt="${ph.caption}" loading="lazy" decoding="async" />
       <span class="polaroid__cap">${ph.caption}</span>
       <span class="polaroid__date">${ph.date}</span>`;
    imgWithFallback(card.querySelector("img"), ph.src, "Add photo " + (i + 1));
    card.addEventListener("click", () => openLightbox(i));
    grid.appendChild(card);
  });

  $("#playMemoriesBtn").addEventListener("click", playMemories);
  $("#randomMemoryBtn").addEventListener("click", randomMemory);

  // lightbox controls
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
  $("#lbNext").addEventListener("click", () => stepLightbox(1));
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", e => {
    if ($("#lightbox").hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}
function openLightbox(i) {
  lbIndex = i; const ph = birthdayData.photos[i];
  const img = $("#lbImg");
  imgWithFallback(img, ph.src, "Photo");
  img.alt = ph.caption;
  $("#lbCaption").textContent = ph.caption;
  $("#lbDate").textContent = ph.date || "";
  $("#lightbox").hidden = false;
}
function stepLightbox(d) {
  const n = birthdayData.photos.length;
  openLightbox((lbIndex + d + n) % n);
}
function closeLightbox() { $("#lightbox").hidden = true; }

function playMemories() {
  const photos = birthdayData.photos.slice(0, 3);
  let i = 0; openLightbox(0); Player.ensurePlaying();
  clearInterval(playMemories._t);
  playMemories._t = setInterval(() => {
    i++;
    if (i >= photos.length) { clearInterval(playMemories._t); return; }
    openLightbox(i);
  }, 2600);
}
function randomMemory() {
  const msgs = ["Another beautiful moment worth keeping.", "This photo will always have a special place in my memories.",
    "One picture, one moment, and so many feelings.", "A small memory that still makes me smile."];
  const i = (Math.random() * birthdayData.photos.length) | 0;
  openLightbox(i);
  $("#randomMsg").textContent = msgs[(Math.random() * msgs.length) | 0];
}

/* =================================================================
   6. WISHES
   ================================================================= */
function initWishes() {
  const row = $("#wishesRow");
  const opened = new Set();
  const wishes = birthdayData.wishes.slice(0, 3);
  wishes.forEach((w, i) => {
    const btn = document.createElement("button");
    btn.className = "wish"; btn.type = "button";
    btn.setAttribute("aria-label", `Open wish ${i + 1}`);
    btn.innerHTML =
      `<span class="wish__obj">${OBJECT_SVG[w.object] || OBJECT_SVG.gift}</span>
       <span class="wish__label">Tap to open</span>
       <span class="wish__bubble" role="status">${w.text}</span>`;
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-open")) return;
      revealWish(btn); SFX.sparkle(); FX.confetti(28);
      opened.add(i);
      updateWishProgress(opened.size, wishes.length);
    });
    row.appendChild(btn);
  });
  updateWishProgress(opened.size, wishes.length);
}
function revealWish(btn) {
  btn.classList.add("is-open");
  btn.querySelector(".wish__label").textContent = "Opened";
}
function updateWishProgress(n, total) {
  $("#wishesProgress").textContent = `You have opened ${n} of ${total} birthday wishes.`;
  $("#wishesDone").hidden = n < total;
}

/* =================================================================
   7. MINI GAME
   ================================================================= */
const Game = (() => {
  const arena = $("#gameArena"), scoreEl = $("#gameScore"), timeEl = $("#gameTime"), bestEl = $("#gameBest");
  const startBtn = $("#gameStart"), pauseBtn = $("#gamePause"), soundBtn = $("#gameSound"), result = $("#gameResult"), hint = $("#gameHint");
  const TYPES = [
    { k: "star", pts: 5 }, { k: "balloon", pts: 10 }, { k: "gift", pts: 15 },
    { k: "flower", pts: 20 }, { k: "crown", pts: 30 }, { k: "ribbon", pts: 10 }
  ];
  let score = 0, time = 20, best = store.get("gameBest", 0), running = false, paused = false, spawnT = null, clockT = null;
  bestEl.textContent = best;

  function spawn() {
    if (!running || paused) return;
    const t = TYPES[(Math.random() * TYPES.length) | 0];
    const b = document.createElement("button");
    b.className = "game__target"; b.type = "button";
    b.setAttribute("aria-label", `${t.k}, ${t.pts} points`);
    b.style.left = (Math.random() * 78 + 6) + "%";
    b.style.top = (Math.random() * 70 + 8) + "%";
    b.innerHTML = OBJECT_SVG[t.k];
    const kill = setTimeout(() => b.remove(), 1300);
    b.addEventListener("click", () => {
      if (b.classList.contains("is-hit")) return;
      clearTimeout(kill); b.classList.add("is-hit");
      score += t.pts; scoreEl.textContent = score; SFX.score();
      const f = document.createElement("span"); f.className = "game__float";
      f.textContent = "+" + t.pts; f.style.left = b.style.left; f.style.top = b.style.top; arena.appendChild(f);
      setTimeout(() => f.remove(), 700);
      setTimeout(() => b.remove(), 300);
    });
    arena.appendChild(b);
  }
  function start() {
    if (running && paused) { paused = false; pauseBtn.textContent = "Pause"; loopSpawn(); return; }
    score = 0; time = 20; running = true; paused = false;
    scoreEl.textContent = 0; timeEl.textContent = 20; result.textContent = "";
    hint.style.display = "none"; startBtn.textContent = "Restart"; pauseBtn.disabled = false;
    $$(".game__target", arena).forEach(e => e.remove());
    loopSpawn();
    clearInterval(clockT);
    clockT = setInterval(() => {
      if (paused) return;
      time--; timeEl.textContent = time;
      if (time <= 0) end();
    }, 1000);
  }
  function loopSpawn() {
    clearInterval(spawnT);
    spawnT = setInterval(spawn, 620);
  }
  function pause() {
    if (!running) return;
    paused = !paused; pauseBtn.textContent = paused ? "Resume" : "Pause";
    if (paused) clearInterval(spawnT); else loopSpawn();
  }
  function end() {
    running = false; clearInterval(spawnT); clearInterval(clockT);
    pauseBtn.disabled = true; startBtn.textContent = "Play Again"; hint.style.display = "none";
    $$(".game__target", arena).forEach(e => e.remove());
    if (score > best) { best = score; store.set("gameBest", best); bestEl.textContent = best; }
    let msg;
    if (score < 100) msg = "It is okay. The main gift is still waiting for you.";
    else if (score < 250) msg = "Good job. You collected so many birthday surprises.";
    else msg = "Birthday Person. You collected every special gift.";
    result.textContent = `${score} points, ${msg}`;
    FX.confetti(40);
  }
  function init() {
    startBtn.addEventListener("click", start);
    pauseBtn.addEventListener("click", pause);
    soundBtn.addEventListener("click", () => {
      SFX.enabled = !SFX.enabled;
      soundBtn.textContent = "Sound: " + (SFX.enabled ? "On" : "Off");
      soundBtn.setAttribute("aria-pressed", String(SFX.enabled));
    });
    soundBtn.textContent = "Sound: " + (SFX.enabled ? "On" : "Off");
    soundBtn.setAttribute("aria-pressed", String(SFX.enabled));
  }
  return { init };
})();

/* =================================================================
   8. MUSIC PLAYER
   ================================================================= */
const Player = (() => {
  const audio = $("#audio");
  const playBtn = $("#playerPlay"), prevBtn = $("#playerPrev"), nextBtn = $("#playerNext"),
        muteBtn = $("#playerMute"), seek = $("#playerSeek"), vol = $("#playerVol"),
        cur = $("#playerCur"), dur = $("#playerDur"),
        song = $("#playerSong"), artist = $("#playerArtist"), cover = $("#playerCover");
  let idx = 0, ready = false;
  const list = birthdayData.playlist.length ? birthdayData.playlist
    : [{ title: "Add a song", artist: "in birthdayData.playlist", audio: "", cover: "" }];

  function fmt(s) { if (!isFinite(s)) return "0:00"; const m = (s / 60) | 0; const r = (s % 60 | 0).toString().padStart(2, "0"); return `${m}:${r}`; }
  function load(i, autoplay) {
    idx = (i + list.length) % list.length; const t = list[idx];
    song.textContent = t.title; artist.textContent = t.artist;
    imgWithFallback(cover, t.cover || "", "♪"); cover.alt = t.title;
    if (t.audio) { audio.src = t.audio; if (autoplay) play(); }
  }
  function play() {
    if (!audio.src) { toast("Add a music file in assets/music/ to play."); return; }
    audio.play().then(() => setIcon(true)).catch(() => setIcon(false));
  }
  function pause() { audio.pause(); setIcon(false); }
  function setIcon(playing) {
    playBtn.innerHTML = `<svg viewBox="0 0 24 24"><use href="#${playing ? "ic-pause" : "ic-play"}"/></svg>`;
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    $("#footerMusic").textContent = playing ? "Pause Music" : "Play Music";
  }

  function init() {
    load(0, false);
    audio.volume = store.get("musicVol", 0.7); vol.value = audio.volume * 100;
    if (store.get("musicMuted", false)) { audio.muted = true; muteBtn.innerHTML = `<svg viewBox="0 0 24 24"><use href="#ic-mute"/></svg>`; }

    playBtn.addEventListener("click", () => (audio.paused ? play() : pause()));
    prevBtn.addEventListener("click", () => load(idx - 1, true));
    nextBtn.addEventListener("click", () => load(idx + 1, true));
    muteBtn.addEventListener("click", () => {
      audio.muted = !audio.muted; store.set("musicMuted", audio.muted);
      muteBtn.innerHTML = `<svg viewBox="0 0 24 24"><use href="#${audio.muted ? "ic-mute" : "ic-volume"}"/></svg>`;
    });
    vol.addEventListener("input", () => { audio.volume = vol.value / 100; store.set("musicVol", audio.volume); });
    seek.addEventListener("input", () => { if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration; });
    audio.addEventListener("timeupdate", () => {
      cur.textContent = fmt(audio.currentTime);
      if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
    });
    audio.addEventListener("loadedmetadata", () => (dur.textContent = fmt(audio.duration)));
    audio.addEventListener("ended", () => load(idx + 1, true));
    audio.addEventListener("play", () => setIcon(true));
    audio.addEventListener("pause", () => setIcon(false));

    $("#playerToggle").addEventListener("click", () => $("#player").classList.toggle("is-collapsed"));
  }
  return {
    init,
    userStart() { if (!ready) { ready = true; if (list[0].audio) { audio.volume = Math.min(audio.volume, 0.5); play(); } } },
    ensurePlaying() { if (audio.src && audio.paused) play(); },
    toggle() { audio.paused ? play() : pause(); },
    playTrack(i) { load(i, true); },
    pause
  };
})();

/* =================================================================
   9. LETTER
   ================================================================= */
function buildLetter() {
  const n = birthdayData.girlfriendName, s = birthdayData.senderName;
  return [
    `Dear ${n},`,
    `Selamat ulang tahun sayangkuu.`,
    `Semoga kamu panjang umur, sehat selalu, bahagia setiap hari, semoga cita-citanya tercapai, pokoknya wish u all the best for u.`,
    `Terima kasih ya sayangg kamu udah mau berjuang di hidup kamu sampai saat ini.`,
    `Terima kasih juga sayangg kamu udah berusaha jadi yang terbaik buat aku, dan selalu support aku dalam keadaan apapun. Aku sangat sangat bersyukur bisa punya kamu di hidup aku.`,
    `Semoga aku bisa terus-terusan nemenin kamu disetiap kondisi kamu, waktu kondisi seneng atau susah, dan bisa jadi tempat yang nyaman buat kamu.`,
    `I love you so much sayang, and i will always be here for you.`,
    `Happy birthday, sayangg.`,
    `With love,`,
    `${s}`
  ];
}
function initLetter() {
  const env = $("#letterEnvelope"), textEl = $("#letterText"), hint = $("#letterHint");
  function open() {
    if (env.classList.contains("is-open")) return;
    env.classList.add("is-open"); SFX.paper(); hint.textContent = "";
    const lines = buildLetter();
    textEl.innerHTML = "";
    lines.forEach((l, i) => {
      const p = document.createElement("p"); p.textContent = l;
      p.style.animationDelay = (reduceMotion ? 0 : i * 0.28) + "s";
      textEl.appendChild(p);
    });
  }
  function reopen() { env.classList.remove("is-open"); requestAnimationFrame(() => requestAnimationFrame(open)); }
  function close() {
    env.classList.remove("is-open"); hint.textContent = "Tap the envelope to open your letter.";
    env.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  env.addEventListener("click", e => { if (!e.target.closest(".letter__actions")) open(); });
  env.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && !env.classList.contains("is-open")) { e.preventDefault(); open(); } });
  $("#letterAgain").addEventListener("click", e => { e.stopPropagation(); reopen(); });
  $("#letterClose").addEventListener("click", e => { e.stopPropagation(); close(); });
}

/* =================================================================
   10. VOUCHERS
   ================================================================= */
function initVouchers() {
  const row = $("#vouchersRow"), resetBtn = $("#voucherReset"), saveBtn = $("#voucherSave");
  const list = birthdayData.vouchers.slice(0, 3);
  let selected = store.get("voucher", null);

  list.forEach((v, i) => {
    const b = document.createElement("button");
    b.className = "voucher"; b.type = "button"; b.dataset.i = i;
    b.setAttribute("aria-label", `Choose: ${v.title}`);
    b.innerHTML =
      `<div class="voucher__box">
         <div class="voucher__reveal"><svg class="v-icon" viewBox="0 0 24 24"><use href="#ic-gift"/></svg><span class="voucher__pick">Your gift</span></div>
         <span class="voucher__ribbon"></span><span class="voucher__bow">✦</span>
         <div class="voucher__lid"></div>
       </div>
       <div class="voucher__title">${v.title}</div>
       <div class="voucher__desc">${v.description || ""}</div>`;
    b.addEventListener("click", () => choose(i));
    row.appendChild(b);
  });

  function choose(i) {
    selected = i; store.set("voucher", i);
    $$(".voucher", row).forEach((el, j) => {
      el.classList.toggle("is-selected", j === i);
      el.classList.toggle("is-open", j === i);
      el.classList.toggle("is-faded", j !== i);
      el.disabled = j !== i;
    });
    resetBtn.hidden = false; saveBtn.hidden = false;
    FX.confetti(40); SFX.sparkle();
  }
  function reset() {
    selected = null; store.set("voucher", null);
    $$(".voucher", row).forEach(el => { el.className = "voucher"; el.disabled = false; });
    resetBtn.hidden = true; saveBtn.hidden = true;
  }
  resetBtn.addEventListener("click", reset);
  saveBtn.addEventListener("click", () => { if (selected != null) saveVoucherImage(list[selected]); });
  if (selected != null) choose(selected);
}
function saveVoucherImage(v) {
  const W = 1000, H = 600, c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#EAF8FF"); g.addColorStop(1, "#CDEEFF");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = "#8FD3FF"; x.lineWidth = 6; x.strokeRect(30, 30, W - 60, H - 60);
  x.fillStyle = "#66869B"; x.font = "600 26px Manrope, sans-serif"; x.textAlign = "center";
  x.fillText("BIRTHDAY GIFT VOUCHER", W / 2, 130);
  x.fillStyle = "#23445C"; x.font = "600 52px Georgia, serif";
  wrapText(x, v.title, W / 2, 280, W - 200, 60);
  x.fillStyle = "#66869B"; x.font = "24px Manrope, sans-serif";
  x.fillText(v.description || "", W / 2, 380);
  x.fillStyle = "#23445C"; x.font = "italic 24px Georgia, serif";
  x.fillText(`For ${birthdayData.girlfriendName}`, W / 2, 470);
  x.fillText(`With love, ${birthdayData.senderName}`, W / 2, 510);
  download(c.toDataURL("image/png"), "birthday-voucher.png");
  toast("Voucher saved as an image.");
}
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(" "); let line = "", yy = y;
  words.forEach(w => {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line.trim(), x, yy); line = w + " "; yy += lh; }
    else line = test;
  });
  ctx.fillText(line.trim(), x, yy);
}
function download(href, name) { const a = document.createElement("a"); a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }

/* =================================================================
   11. FINAL SURPRISE
   ================================================================= */
function initSurprise() {
  $("#surpriseBtn").addEventListener("click", runSurprise);
  $("#surpriseAgain").addEventListener("click", runSurprise);
  $("#cinemaClose").addEventListener("click", endSurprise);
  $("#hugBtn").addEventListener("click", sendHug);
}
let surpriseTimers = [];
function clearSurprise() { surpriseTimers.forEach(clearTimeout); surpriseTimers = []; clearInterval(runSurprise._fw); clearInterval(runSurprise._slide); }
function runSurprise() {
  const cinema = $("#cinema"), photoEl = $("#cinemaPhoto"), msgEl = $("#cinemaMsg"), actions = $("#cinemaActions");
  clearSurprise();
  cinema.hidden = false; requestAnimationFrame(() => cinema.classList.add("is-shown"));
  $("#nav").classList.add("is-hidden");
  actions.hidden = true; $("#cinemaHug").hidden = true;
  buildStars();
  Player.ensurePlaying();
  FX.balloons(16); FX.confetti(120); Petals.burst(18);

  // fireworks loop
  runSurprise._fw = setInterval(() => FX.firework(Math.random() * innerWidth, Math.random() * innerHeight * 0.6 + 40), 700);

  // photo slideshow
  const photos = Array.from({ length: 6 }, (_, i) => {
    const n = i + 4;
    const photoList = birthdayData.photos;
    const match = photoList.find(ph => new RegExp(`photo-${n}\\.(?:jpg|jpeg|png|webp)$`, "i").test(ph.src));
    return {
      src: match?.src || getAssetPath(`assets/images/photo-${n}.jpg`),
      caption: match?.caption || `Photo ${n}`,
      date: match?.date || ""
    };
  });
  let pi = 0;
  const showPhoto = () => {
    const current = photos[pi % photos.length];
    imgWithFallback(photoEl, current.src, "Photo");
    photoEl.alt = current.caption || "Memory";
    pi++;
  };
  showPhoto(); runSurprise._slide = setInterval(showPhoto, 3000);

  // messages one by one
  const msgs = ["Happy Birthday, My Favorite Person.", "May this year be kinder, brighter, and happier for you.",
    "I hope today becomes the beginning of a beautiful new chapter.", "You deserve good things, peaceful days, and meaningful happiness.", "I always wish u all the best for u, and I will always be here for you.",
    `Happy Birthday, Sayang.`];
  msgs.forEach((m, i) => surpriseTimers.push(setTimeout(() => { msgEl.textContent = m; SFX.sparkle(); }, i * 3000 + 400)));
  surpriseTimers.push(setTimeout(() => { actions.hidden = false; }, msgs.length * 3000));
}
function buildStars() {
  const wrap = $("#cinemaStars"); wrap.innerHTML = "";
  const n = reduceMotion ? 30 : 90;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span"); s.className = "cinema__star";
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s;transform:scale(${0.5 + Math.random()})`;
    wrap.appendChild(s);
  }
}
function sendHug() {
  const hug = $("#cinemaHug"); hug.hidden = false; hug.style.animation = "none";
  requestAnimationFrame(() => { hug.querySelector("svg").style.animation = "hugPulse 1.6s var(--ease)"; });
  SFX.sparkle();
  toast("Virtual hug successfully sent.");
  setTimeout(() => (hug.hidden = true), 2000);
}
function endSurprise() {
  clearSurprise();
  $("#cinema").classList.remove("is-shown");
  setTimeout(() => { $("#cinema").hidden = true; }, 700);
  $("#nav").classList.remove("is-hidden");
  $("#invitation").scrollIntoView({ behavior: "smooth" });
}

/* =================================================================
   12. INVITATION
   ================================================================= */
function initInvitation() {
  const e = birthdayData.event;
  $("#inviteName").textContent = `${birthdayData.girlfriendName}'s Birthday`;
  $("#invDate").textContent = e.date;
  $("#invTime").textContent = `${e.startTime}${e.endTime ? " – " + e.endTime : ""}`;
  $("#invVenue").textContent = e.venue;
  $("#invDress").textContent = e.dressCode;

  const waMsg = encodeURIComponent(`Hello, I would like to confirm my attendance for ${birthdayData.girlfriendName}'s birthday celebration on ${e.date} at ${e.startTime}.`);
  const waNum = (e.whatsappNumber || "").replace(/\D/g, "");
  $("#invWaBtn").href = `https://wa.me/${waNum}?text=${waMsg}`;
  $("#invWaBtn").addEventListener("click", ev => { if (!waNum) { ev.preventDefault(); toast("Add a WhatsApp number in birthdayData."); } });

  $("#invCalBtn").href = googleCalUrl();
  $("#invCalBtn").addEventListener("click", ev => { ev.preventDefault(); downloadICS(); window.open(googleCalUrl(), "_blank", "noopener"); });

  $("#invSaveBtn").addEventListener("click", saveInvitationImage);

  // open envelope
  const env = $("#inviteEnvelope"), pre = $("#invitationPre"), card = $("#inviteCard");
  function reveal() {
    env.classList.add("is-open"); SFX.paper(); FX.confetti(50); Petals.burst(10);
    setTimeout(() => {
      pre.style.display = "none"; card.hidden = false;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 600);
  }
  $("#openInviteBtn").addEventListener("click", reveal);
  env.addEventListener("click", reveal);
  env.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); reveal(); } });
}
function calStamps() {
  const e = birthdayData.event;
  const pad = s => s.replace(/[-:]/g, "");
  const start = `${e.isoDate}T${e.startTime24}:00`;
  const end = `${e.isoDate}T${e.endTime24 || e.startTime24}:00`;
  return { start: pad(start), end: pad(end) };
}
function googleCalUrl() {
  const e = birthdayData.event, { start, end } = calStamps();
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${birthdayData.girlfriendName}'s Birthday`,
    dates: `${start}/${end}`,
    location: e.venue,
    details: `Birthday celebration for ${birthdayData.girlfriendName}. Dress code: ${e.dressCode}.`
  });
  return "https://calendar.google.com/calendar/render?" + p.toString();
}
function downloadICS() {
  const e = birthdayData.event, { start, end } = calStamps();
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BirthdayWebsite//EN", "BEGIN:VEVENT",
    `UID:${Date.now()}@birthday`, `DTSTART:${start}`, `DTEND:${end}`,
    `SUMMARY:${birthdayData.girlfriendName}'s Birthday`,
    `LOCATION:${e.venue}`,
    `DESCRIPTION:Birthday celebration for ${birthdayData.girlfriendName}. Dress code: ${e.dressCode}.`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  download("data:text/calendar;charset=utf-8," + encodeURIComponent(ics), "birthday-invitation.ics");
}
function saveInvitationImage() {
  const e = birthdayData.event, W = 800, H = 1130, c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#EAF8FF");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = "#8FD3FF"; x.lineWidth = 4; x.strokeRect(34, 34, W - 68, H - 68);
  x.textAlign = "center";
  x.fillStyle = "#66869B"; x.font = "600 22px Manrope, sans-serif"; x.fillText("BIRTHDAY INVITATION", W / 2, 130);
  x.fillStyle = "#23445C"; x.font = "500 30px Georgia, serif"; x.fillText("You Are Invited to Celebrate", W / 2, 200);
  x.font = "600 52px Georgia, serif"; x.fillText(`${birthdayData.girlfriendName}'s Birthday`, W / 2, 270);
  x.fillStyle = "#8FD3FF"; x.fillText("✦", W / 2, 330);
  const rows = [["Date", e.date], ["Time", `${e.startTime}${e.endTime ? " – " + e.endTime : ""}`],
    ["Venue", e.venue], ["Dress Code", e.dressCode]];
  let y = 430;
  rows.forEach(([k, v]) => {
    x.fillStyle = "#66869B"; x.font = "600 18px Manrope, sans-serif"; x.fillText(k.toUpperCase(), W / 2, y);
    x.fillStyle = "#23445C"; x.font = "500 26px Georgia, serif"; wrapText(x, v, W / 2, y + 36, W - 160, 32);
    y += 110;
  });
  x.fillStyle = "#23445C"; x.font = "italic 24px Georgia, serif";
  x.fillText("Your presence will make this special.", W / 2, H - 120);
  x.fillStyle = "#66869B"; x.font = "20px Manrope, sans-serif";
  x.fillText(`With love, ${birthdayData.senderName}`, W / 2, H - 80);
  download(c.toDataURL("image/png"), "birthday-invitation.png");
  toast("Invitation saved as an image.");
}

/* =================================================================
   13. FOOTER
   ================================================================= */
function initFooter() {
  $("#footerMade").textContent = `Made with love by ${birthdayData.senderName}`;
  $("#footerFor").textContent = `Created especially for ${birthdayData.girlfriendName}'s birthday.`;
  $("#footerDate").textContent = "22 Juni 2026";
  $("#footerMusic").addEventListener("click", () => Player.toggle());
  $("#footerReset").addEventListener("click", () => {
    if (confirm("Reset all saved progress (wishes, game score, voucher, music settings)?")) {
      store.clearAll(); toast("Progress reset. Reloading…"); setTimeout(() => location.reload(), 900);
    }
  });
}

/* =================================================================
   NAVIGATION — scroll spy + smooth scroll
   ================================================================= */
function initNav() {
  const links = $$(".nav__link");
  const map = {};
  links.forEach(l => { map[l.getAttribute("href").slice(1)] = l; });
  links.forEach(l => l.addEventListener("click", e => {
    e.preventDefault();
    const id = l.getAttribute("href").slice(1);
    $("#" + id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }));
  const sections = $$(".section[id]");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.remove("is-active"));
        map[en.target.id]?.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  sections.forEach(s => io.observe(s));
}

/* =================================================================
   Scroll reveal
   ================================================================= */
function initReveal() {
  if (reduceMotion) { $$(".reveal").forEach(el => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => io.observe(el));
}

/* =================================================================
   BOOT
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  runLoader();
  initOpening();
  initHero();
  initGreeting();
  initGallery();
  initWishes();
  Game.init();
  Player.init();
  initLetter();
  initVouchers();
  initSurprise();
  initInvitation();
  initFooter();
  initNav();
  initReveal();
});