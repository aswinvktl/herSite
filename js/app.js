/* =============================================================
   date-site — engine
   No build step. Plain JS. Everything driven off data-attributes.
   ============================================================= */

/* ---------- tiny state object ---------- */
const state = { day: null, time: null, food: null, note: "" };

let currentScreen = "ask1";

/* ---------- screen switching (fade) ---------- */
const screens = document.querySelectorAll(".screen");
function show(name) {
  currentScreen = name; // Fix: Explicitly update global state immediately

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
    const popImg = document.getElementById("askPop");
    if (popImg) {
      popImg.classList.remove("animate__animated", "animate__zoomIn");
      void popImg.offsetWidth;
      popImg.classList.add("animate__animated", "animate__zoomIn");
    }
  }

  // post-yes sequence: img1 -> img2 -> video
  if (name === "afteryes") runYesSequence();

  // reset the timeout/water-break screen so it replays
  if (name === "timeout" && typeof resetTimeout === "function") resetTimeout();

  // keep nav arrows in sync
  updateNav();
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

// For mobile layout support where mouseover doesn't exist
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  noMeme.hidden = false;
  noMeme.classList.add("animate__animated", "animate__zoomIn");
  const dx = (Math.random() * 200 - 100).toFixed(0);
  const dy = (Math.random() * 120 - 60).toFixed(0);
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

// YES → confetti + go to the post-yes screen
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  pop();
  show("afteryes");
});

/* =============================================================
   POST-YES SEQUENCE: img1 fades in/out -> img2 fades in/out -> video
   ============================================================= */
const YES_HOLD = 2200;   // how long each image stays fully visible
const YES_FADE = 900;    // must match the CSS transition (0.9s)
let yesSeqRan = false;
let videoDone = false;

function runYesSequence() {
  const img1 = document.getElementById("yesImg1");
  const img2 = document.getElementById("yesImg2");
  const vid  = document.getElementById("yesVideo");

  // reset
  [img1, img2, vid].forEach(el => el.classList.remove("show"));
  vid.pause(); vid.currentTime = 0;
  yesSeqRan = true;
  videoDone = false;
  updateNav();   // lock the forward arrow while sequence plays

  // img1 in
  setTimeout(() => { if(currentScreen === "afteryes") img1.classList.add("show"); }, 50);
  
  // img1 out, img2 in
  setTimeout(() => { if(currentScreen === "afteryes") img1.remove.classList ? img1.classList.remove("show") : null; }, 50 + YES_HOLD);
  setTimeout(() => { if(currentScreen === "afteryes") img2.classList.add("show"); }, 50 + YES_HOLD + YES_FADE);
  
  // img2 out
  setTimeout(() => { if(currentScreen === "afteryes") img2.classList.remove("show"); }, 50 + YES_HOLD + YES_FADE + YES_HOLD);
  
  // video in + play
  const vidStart = 50 + YES_HOLD + YES_FADE + YES_HOLD + YES_FADE;
  setTimeout(() => {
    if (currentScreen !== "afteryes") return;
    vid.classList.add("show");
    vid.play().catch(() => {
      videoDone = true;
      updateNav();
    });
  }, vidStart);

  // when video finishes, unlock arrow and snap automatically to date pick!
  vid.onended = () => {
    videoDone = true;
    if (currentScreen === "afteryes") {
      updateNav();
      show("date");
    }
  };
  vid.onerror = () => {
    videoDone = true;
    if (currentScreen === "afteryes") updateNav();
  };
}

/* =============================================================
   SCREEN 2 — DATE
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
  dayReact.onerror = () => { dayReact.hidden = true; }; 
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
      clearTimeout(advanceTimer);  
      state.day = null;            
      updateNav();                 
      showDayReact(info);
      clearTimeout(badDayTimer);
      badDayTimer = setTimeout(() => {
        dayReact.hidden = true;
        dateReaction.textContent = "go on, try again 👀";
      }, 1800);
      return;                      
    }

    clearTimeout(badDayTimer);
    state.day = val;
    showDayReact(info);
    updateNav();
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => show("time"), 1400);  
  });
});

/* =============================================================
   SCREEN 3 — TIME 
   ============================================================= */
const timeReaction = document.getElementById("timeReaction");
const timeReact = document.getElementById("timeReact");
const timeNext = document.getElementById("timeNext");

document.querySelectorAll('[data-choice="time"]').forEach(btn => {
  btn.addEventListener("click", () => {
    state.time = btn.dataset.value;
    timeReaction.textContent = "great choice again";
    timeReact.hidden = false;
    timeReact.classList.remove("animate__animated", "animate__zoomIn");
    void timeReact.offsetWidth;
    timeReact.classList.add("animate__animated", "animate__zoomIn");
    timeNext.hidden = false;
    updateNav();
  });
});

/* =============================================================
   SCREEN 3b — TIMEOUT / WATER BREAK
   ============================================================= */
const timeoutStage1 = document.getElementById("timeoutStage1");
const timeoutStage2 = document.getElementById("timeoutStage2");
const waterCount = document.getElementById("waterCount");
const waterSkip = document.getElementById("waterSkip");
let waterTimer = null;

timeoutStage1.addEventListener("click", () => {
  timeoutStage1.hidden = true;
  timeoutStage2.hidden = false;
  startWaterBreak();
});

function startWaterBreak() {
  let n = 10;
  waterCount.textContent = n;
  clearInterval(waterTimer);
  waterTimer = setInterval(() => {
    n--;
    waterCount.textContent = n;
    if (n <= 0) {
      clearInterval(waterTimer);
      show("food");
    }
  }, 1000);
}

waterSkip.addEventListener("click", () => {
  clearInterval(waterTimer);
  show("food");
});

function resetTimeout() {
  clearInterval(waterTimer);
  timeoutStage1.hidden = false;
  timeoutStage2.hidden = true;
  waterCount.textContent = "10";
}

/* =============================================================
   SCREEN 4 — FOOD 
   ============================================================= */
const foodOther = document.getElementById("foodOther");
const foodReaction = document.getElementById("foodReaction");
const foodReact = document.getElementById("foodReact");
const foodNext = document.getElementById("foodNext");

function foodChosen() {
  foodReaction.textContent = "that's a banging choice. yes make me that";
  foodReact.hidden = false;
  foodReact.classList.remove("animate__animated", "animate__zoomIn");
  void foodReact.offsetWidth;
  foodReact.classList.add("animate__animated", "animate__zoomIn");
  foodNext.hidden = false;
  updateNav();
}

document.querySelectorAll('[data-choice="food"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    if (val === "__other__") {
      foodOther.hidden = false;
      foodOther.focus();
      foodReaction.textContent = "";
      foodReact.hidden = true;
      foodNext.hidden = true;
      state.food = null;
      updateNav();
      return;
    }
    foodOther.hidden = true;
    state.food = val;
    foodChosen();
  });
});

foodOther.addEventListener("input", () => {
  const v = foodOther.value.trim();
  state.food = v || null;
  if (v) {
    foodChosen();
  } else {
    foodReact.hidden = true;
    foodNext.hidden = true;
    foodReaction.textContent = "";
    updateNav();
  }
});

/* =============================================================
   SCREEN 5 — note box
   ============================================================= */
const noteBox = document.getElementById("noteBox");
noteBox.addEventListener("input", () => { state.note = noteBox.value.trim(); });

/* =============================================================
   SCREEN 6 — IG carousel 
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
  igDots.innerHTML = ""; // Clear placeholders
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
   generic "goto" buttons
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
  } else {
    document.getElementById("sumNoteRow").hidden = true;
  }
  pop();
  renderQR();
}

// Pre-filled WhatsApp response integration
const WHATSAPP_URL = "https://wa.me/REPLACE_WHATSAPP_NUMBER?text=Hey!%20Here%20is%20our%20date%20plan!%20💖";

function renderQR() {
  const el = document.getElementById("qr");
  el.innerHTML = "";
  try {
    const qr = qrcode(0, "M");
    qr.addData(WHATSAPP_URL);
    qr.make();
    el.innerHTML = qr.createImgTag(5, 8);
  } catch (err) {
    el.textContent = "Error generating QR Code";
  }
}

/* =============================================================
   BACK / FORWARD NAVIGATION
   ============================================================= */
const ORDER = ["ask1","ask2","afteryes","date","time","timeout","food","addask","reasons","summary"];
const NAV_HIDDEN_ON = ["ask1","summary"];           
const NAV_NO_FORWARD = ["ask2","timeout"];          

function forwardAllowed(screen) {
  switch (screen) {
    case "afteryes": return videoDone;   
    case "date": return !!state.day;     
    case "time": return !!state.time;
    case "food": return !!state.food;
    default:     return true;            
  }
}

const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

function updateNav() {
  const hide = NAV_HIDDEN_ON.includes(currentScreen);
  navBack.hidden = hide;
  navFwd.hidden  = hide;
  if (hide) return;

  const i = ORDER.indexOf(currentScreen);
  navBack.disabled = (i <= 1); 
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

// Initialize on load explicitly
show("ask1");