/* =============================================================
   date-site — engine
   No build step. Plain JS. Everything driven off data-attributes.
   ============================================================= */

/* ---------- tiny state object ---------- */
const state = { day: null, time: null, food: null, note: "" };

/* ---------- screen switching (fade) ---------- */
const screens = document.querySelectorAll(".screen");
function show(name) {
  screens.forEach(s => {
    if (s.dataset.screen === name) {
      s.classList.add("is-active");
    } else {
      s.classList.remove("is-active");
    }
  });
  window.scrollTo(0, 0);
}

/* ---------- audio (start on click only, so browsers allow it) ---------- */
const song1 = document.getElementById("song1");
const song2 = document.getElementById("song2");
function play(audioEl) {
  // stop the other one first so they never overlap
  [song1, song2].forEach(a => { if (a !== audioEl) { a.pause(); a.currentTime = 0; } });
  audioEl.play().catch(() => {/* if a file is missing or blocked, fail silently */});
}

/* ---------- confetti helper ---------- */
function pop() {
  if (window.confetti) {
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
  }
}

/* =============================================================
   SCREEN 1 — the ask
   ============================================================= */
const noBtn = document.getElementById("noBtn");
const noMeme = document.getElementById("noMeme");

// No button runs away on hover + shows the Cynthia meme (desktop)
noBtn.addEventListener("mouseover", () => {
  noMeme.hidden = false;
  noMeme.classList.add("animate__animated", "animate__zoomIn");
  // jump to a random spot within the card area
  const dx = (Math.random() * 240 - 120).toFixed(0);
  const dy = (Math.random() * 140 - 70).toFixed(0);
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

// YES → song1 + confetti + go to the three-meme sequence
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  play(song1);
  pop();
  show("memes");
  runMemeSequence();
});

/* =============================================================
   SCREEN 1b — three-meme timed sequence
   meme0 -> (1.5s) meme1 -> (1.5s) meme2 -> (1.8s) Date screen
   tweak the timings here:
   ============================================================= */
const SEQ_GAP = 1500;     // ms between memes
const SEQ_OUTRO = 1800;   // ms to linger on last meme before Date screen
function runMemeSequence() {
  const memes = [...document.querySelectorAll(".seq-meme")];
  memes.forEach(m => { m.hidden = true; m.classList.remove("animate__animated", "animate__bounceIn"); });
  let i = 0;
  const reveal = () => {
    if (i < memes.length) {
      const m = memes[i];
      m.hidden = false;
      m.classList.add("animate__animated", "animate__bounceIn");
      i++;
      setTimeout(reveal, SEQ_GAP);
    } else {
      setTimeout(() => show("date"), SEQ_OUTRO);
    }
  };
  reveal();
}

/* =============================================================
   SCREEN 2 — DATE  (Friday is a trap that bounces back)
   ============================================================= */
const dateReaction = document.getElementById("dateReaction");
const dayReactions = {
  Thursday: "Thursday it is — good shout. 😌",
  Sunday:   "Sunday, lovely. lazy energy, I respect it.",
};
document.querySelectorAll('[data-choice="day"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    if (val === "Friday") {
      dateReaction.textContent = "Friday?? the whole city's out. pick again 😤";
      dateReaction.classList.remove("animate__animated", "animate__headShake");
      void dateReaction.offsetWidth; // restart animation
      dateReaction.classList.add("animate__animated", "animate__headShake");
      return; // do NOT record, do NOT advance
    }
    state.day = val;
    dateReaction.textContent = dayReactions[val] || "";
    setTimeout(() => show("time"), 900);
  });
});

/* =============================================================
   SCREEN 3 — TIME
   ============================================================= */
const timeReaction = document.getElementById("timeReaction");
document.querySelectorAll('[data-choice="time"]').forEach(btn => {
  btn.addEventListener("click", () => {
    state.time = btn.dataset.value;
    timeReaction.textContent = "perfect.";
    setTimeout(() => show("food"), 700);
  });
});

/* =============================================================
   SCREEN 4 — FOOD  (+ "other" text field)
   ============================================================= */
const foodOther = document.getElementById("foodOther");
const foodReaction = document.getElementById("foodReaction");
const foodNext = document.getElementById("foodNext");

// EDIT these little reactions per option if you want
const foodReactions = {
  "Ramen": "ramen — slurpable, perfect first-date food.",
  "Pho": "pho, warm and easy. great pick.",
  "Dumplings": "dumplings. shareable. dangerous (in a good way).",
  "Poke / rice bowl": "fresh and light, nice.",
};

document.querySelectorAll('[data-choice="food"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    if (val === "__other__") {
      foodOther.hidden = false;
      foodOther.focus();
      foodReaction.textContent = "";
      foodNext.hidden = true;
      state.food = null;
      return;
    }
    foodOther.hidden = true;
    state.food = val;
    foodReaction.textContent = foodReactions[val] || "";
    foodNext.hidden = false;
  });
});

// typing in "other" sets the food + reveals next
foodOther.addEventListener("input", () => {
  const v = foodOther.value.trim();
  state.food = v || null;
  foodReaction.textContent = v ? "ooh, noted." : "";
  foodNext.hidden = !v;
});

/* =============================================================
   SCREEN 5 — note box
   ============================================================= */
const noteBox = document.getElementById("noteBox");
noteBox.addEventListener("input", () => { state.note = noteBox.value.trim(); });

/* =============================================================
   SCREEN 6 — IG carousel (5 slides, wraps)
   ============================================================= */
const igTrack = document.getElementById("igTrack");
const igSlides = igTrack ? [...igTrack.children] : [];
const igDots = document.getElementById("igDots");
let igIndex = 0;

function igRender() {
  igTrack.style.transform = `translateX(-${igIndex * 100}%)`;
  [...igDots.children].forEach((d, i) => d.classList.toggle("on", i === igIndex));
}
if (igTrack) {
  igSlides.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "ig-dotmark" + (i === 0 ? " on" : "");
    igDots.appendChild(d);
  });
  document.getElementById("igNext").addEventListener("click", () => {
    igIndex = (igIndex + 1) % igSlides.length;
    igRender();
  });
  document.getElementById("igPrev").addEventListener("click", () => {
    igIndex = (igIndex - 1 + igSlides.length) % igSlides.length;
    igRender();
  });
}

/* =============================================================
   generic "goto" buttons + per-screen hooks
   ============================================================= */
document.querySelectorAll('[data-action="goto"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (target === "interested") play(song2); // click = allowed to start audio
    if (target === "summary") buildSummary();
    show(target);
  });
});

/* =============================================================
   SCREEN 8 — summary + local QR
   ============================================================= */
function buildSummary() {
  document.getElementById("sumDay").textContent  = state.day  || "you didn't pick (cheeky)";
  document.getElementById("sumTime").textContent = state.time || "—";
  document.getElementById("sumFood").textContent = state.food || "—";
  if (state.note) {
    document.getElementById("sumNoteRow").hidden = false;
    document.getElementById("sumNote").textContent = state.note;
  }
  pop();
  renderQR();
}

/* QR generated locally (no external image call).
   REPLACE the number below with your WhatsApp number in international
   format, no + and no spaces, e.g. 447700900123 for a UK mobile.
   You can also pre-fill a message after ?text= */
const WHATSAPP_URL = "https://wa.me/REPLACE_WHATSAPP_NUMBER?text=here's%20our%20plan";

function renderQR() {
  const el = document.getElementById("qr");
  el.innerHTML = "";
  // qrcode-generator API
  const qr = qrcode(0, "M");
  qr.addData(WHATSAPP_URL);
  qr.make();
  el.innerHTML = qr.createImgTag(5, 8); // (cellSize, margin)
}
