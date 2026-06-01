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

  // when the ask screen loads, pop the image in
  if (name === "ask2") {
    const pop = document.getElementById("askPop");
    if (pop) {
      pop.classList.remove("animate__animated", "animate__zoomIn");
      void pop.offsetWidth;
      pop.classList.add("animate__animated", "animate__zoomIn");
    }
  }

  // post-yes sequence: img1 -> img2 -> video
  if (name === "afteryes") runYesSequence();

  // keep nav arrows in sync (defined further down)
  if (typeof onScreenChange === "function") onScreenChange(name);
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

// YES → confetti + go to the post-yes screen
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  pop();
  show("afteryes");
});

/* =============================================================
   POST-YES SEQUENCE: img1 fades in/out -> img2 fades in/out -> video
   Tweak the hold times (ms) below.
   ============================================================= */
const YES_HOLD = 2200;   // how long each image stays fully visible
const YES_FADE = 900;    // must match the CSS transition (0.9s)
let yesSeqRan = false;
let videoDone = false;

function runYesSequence() {
  const img1 = document.getElementById("yesImg1");
  const img2 = document.getElementById("yesImg2");
  const vid  = document.getElementById("yesVideo");

  // reset (so it replays cleanly if she navigates back then forward)
  [img1, img2, vid].forEach(el => el.classList.remove("show"));
  vid.pause(); vid.currentTime = 0;
  yesSeqRan = true;
  videoDone = false;
  updateNav();   // lock the forward arrow while the sequence plays

  // img1 in
  setTimeout(() => img1.classList.add("show"), 50);
  // img1 out, img2 in
  setTimeout(() => img1.classList.remove("show"), 50 + YES_HOLD);
  setTimeout(() => img2.classList.add("show"), 50 + YES_HOLD + YES_FADE);
  // img2 out
  setTimeout(() => img2.classList.remove("show"), 50 + YES_HOLD + YES_FADE + YES_HOLD);
  // video in + play
  const vidStart = 50 + YES_HOLD + YES_FADE + YES_HOLD + YES_FADE;
  setTimeout(() => {
    vid.classList.add("show");
    vid.play().catch(() => {/* if blocked, the forward arrow still works */});
  }, vidStart);

  // when the video finishes, unlock the forward arrow (goes to date)
  vid.onended = () => {
    videoDone = true;
    if (currentScreen === "afteryes") updateNav();
  };
  // safety: if the video can't load/play, don't trap her — unlock anyway
  vid.onerror = () => {
    videoDone = true;
    if (currentScreen === "afteryes") updateNav();
  };
}

/* =============================================================
   SCREEN 2 — DATE
   Thursday / Sunday = good -> show image + caption, then advance.
   Friday / Saturday   = no  -> show image + caption, stay put.
   ============================================================= */
const dateReaction = document.getElementById("dateReaction");
const dayReact = document.getElementById("dayReact");
let badDayTimer = null;
let advanceTimer = null;

const DAYS = {
  "Thursday 04 June": {
    good: true,
    img: "resources/800d8afdfa4443fda08fdf2c89e16629(3).jpg",
    caption: "great choice",
  },
  "Sunday 07 June": {
    good: true,
    img: "resources/901ad9ad498cae6cbc137b6b57c9f012(3).jpg",
    caption: "THE BESTEST CHOICE. look at you being decisive hahahahahah",
  },
  "Friday 05 June": {
    good: false,
    img: "resources/8cef642481853f378a453a318ef7f205(3).jpg",
    caption: "we are working",
  },
  "Saturday 06 June": {
    good: false,
    img: "resources/f38bc75959b15a509d0d0c1a7c11dc88.jpg",
    caption: "too busy, too many people",
  },
};

function showDayReact(info) {
  dateReaction.textContent = info.caption;
  dayReact.onerror = () => { dayReact.hidden = true; };  // missing file -> just show caption
  dayReact.src = info.img;
  dayReact.hidden = false;
  dayReact.classList.remove("animate__animated", "animate__zoomIn");
  void dayReact.offsetWidth;
  dayReact.classList.add("animate__animated", "animate__zoomIn");
}

document.querySelectorAll('[data-choice="day"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const info = DAYS[val];
    if (!info) return;

    if (!info.good) {
      clearTimeout(advanceTimer);  // kill any pending advance from an earlier good pick
      state.day = null;            // don't record a bad day
      updateNav();                 // re-lock the forward arrow
      showDayReact(info);
      clearTimeout(badDayTimer);
      badDayTimer = setTimeout(() => {
        dayReact.hidden = true;
        dateReaction.textContent = "go on, try again 👀";
      }, 1800);
      return;                      // stay on the page
    }

    clearTimeout(badDayTimer);
    state.day = val;
    showDayReact(info);
    updateNav();
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => show("time"), 1400);  // let her see the image first
  });
});

/* =============================================================
   SCREEN 3 — TIME
   ============================================================= */
document.querySelectorAll('[data-choice="time"]').forEach(btn => {
  btn.addEventListener("click", () => {
    state.time = btn.dataset.value;
    setTimeout(() => show("food"), 350);
  });
});

/* =============================================================
   SCREEN 4 — FOOD  (+ "other" text field)
   ============================================================= */
const foodOther = document.getElementById("foodOther");
const foodReaction = document.getElementById("foodReaction");
const foodNext = document.getElementById("foodNext");

// Reaction lines per food option. Empty = no text shown.
// Fill these in YOUR voice if you want a line, or leave "" for none.
const foodReactions = {
  "Ramen": "",
  "Pho": "",
  "Dumplings": "",
  "Poke / rice bowl": "",
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

/* =============================================================
   BACK / FORWARD NAVIGATION
   Fixed-corner arrows. Shown on every screen EXCEPT the first
   (ask1) and last (summary). Forward is only allowed once the
   current step's required choice is made.
   ============================================================= */
const ORDER = ["ask1","ask2","afteryes","date","time","food","addask","reasons","interested","summary"];
const NAV_HIDDEN_ON = ["ask1","summary"];           // no arrows here
const NAV_NO_FORWARD = ["ask2"];                    // YES button advances these, not the arrow

// what each screen needs before forward is allowed (null = no gate)
function forwardAllowed(screen) {
  switch (screen) {
    case "afteryes": return videoDone;   // only after the video finishes
    case "date": return !!state.day;     // must have picked a (non-Friday) day
    case "time": return !!state.time;
    case "food": return !!state.food;
    default:     return true;            // note/reasons/etc. are free to pass
  }
}

let currentScreen = "ask1";

const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

function updateNav() {
  const hide = NAV_HIDDEN_ON.includes(currentScreen);
  navBack.hidden = hide;
  navFwd.hidden  = hide;
  if (hide) return;

  const i = ORDER.indexOf(currentScreen);
  // back is disabled at the very start of the navigable range
  navBack.disabled = (i <= 1); // can't go back past ask2 into ask1
  // forward disabled if this screen advances by its own button, or gate not met
  navFwd.disabled = NAV_NO_FORWARD.includes(currentScreen) || !forwardAllowed(currentScreen);
}

navBack.addEventListener("click", () => {
  const i = ORDER.indexOf(currentScreen);
  if (i > 1) show(ORDER[i - 1]);
});
navFwd.addEventListener("click", () => {
  const i = ORDER.indexOf(currentScreen);
  if (i < ORDER.length - 1 && forwardAllowed(currentScreen)) {
    const next = ORDER[i + 1];
    if (next === "summary") buildSummary();
    show(next);
  }
});

function onScreenChange(name) {
  currentScreen = name;
  updateNav();
}

// initialise
updateNav();