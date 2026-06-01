/* =============================================================
   date-site — Integrated Transition & Navigation Engine
   ============================================================= */

const state = { day: null, time: null, food: null, note: "" };
let currentScreen = "ask1";
let videoDone = false;

/* ---------- Core Screen Switching Matrix ---------- */
const screens = document.querySelectorAll(".screen");
function show(name) {
  currentScreen = name;

  screens.forEach(s => {
    if (s.dataset.screen === name) {
      s.classList.add("is-active");
    } else {
      s.classList.remove("is-active");
    }
  });
  window.scrollTo(0, 0);

  if (name === "ask1") runScreen1aSequence();
  if (name === "ask2") runScreen1bSequence();
  if (name === "afteryes") runYesSequence();
  if (name === "date") runDateScreenSequence();
  
  updateNav();
}

/* ---------- Screen 1a Arrow Entry Delay ---------- */
function runScreen1aSequence() {
  const arrow = document.getElementById("arrowReveal");
  arrow.classList.remove("show");
  setTimeout(() => {
    if (currentScreen === "ask1") arrow.classList.add("show");
  }, 1200);
}

/* ---------- Screen 1b Timed Narrative Sequence ---------- */
function runScreen1bSequence() {
  const punch = document.getElementById("seqPunch");
  const askText = document.getElementById("seqAsk");
  const buttons = document.getElementById("seqButtons");

  [punch, askText, buttons].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "ask2") punch.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "ask2") askText.classList.add("show"); }, 2200);
  setTimeout(() => { if (currentScreen === "ask2") buttons.classList.add("show"); }, 3800);
}

/* ---------- Absolute No Region Run Away Logic + Cynthia Popup ---------- */
const noRegion = document.getElementById("noRegion");
const cynthiaScare = document.getElementById("cynthiaScare");

let isMoved = false;

function moveNoRegion() {
  if (!isMoved) {
    noRegion.style.top = "10px";
    noRegion.style.right = "-40px";
    isMoved = true;
  } else {
    noRegion.style.top = "95px";
    noRegion.style.right = "-100px";
    isMoved = false;
  }
}

noRegion.addEventListener("mouseenter", () => {
  cynthiaScare.classList.add("active");
  moveNoRegion();
});

noRegion.addEventListener("mouseleave", () => {
  cynthiaScare.classList.remove("active");
});

noRegion.addEventListener("touchstart", (e) => {
  e.preventDefault();
  cynthiaScare.classList.add("active");
  moveNoRegion();
  setTimeout(() => { cynthiaScare.classList.remove("active"); }, 1000);
});

/* ---------- YES Flow Crossfade Sequence Tracker ---------- */
const YES_HOLD = 2200;   
const YES_FADE = 800;    

function runYesSequence() {
  const img1 = document.getElementById("yesImg1");
  const img2 = document.getElementById("yesImg2");
  const vid  = document.getElementById("yesVideo");
  const inlineNext = document.getElementById("videoNextBtnReveal");

  [img1, img2, vid].forEach(el => el.classList.remove("show"));
  inlineNext.classList.remove("show"); 
  vid.pause(); 
  vid.currentTime = 0;
  
  videoDone = false;
  updateNav(); 

  setTimeout(() => { if (currentScreen === "afteryes") img1.classList.add("show"); }, 50);
  setTimeout(() => { if (currentScreen === "afteryes") img1.classList.remove("show"); }, 50 + YES_HOLD);
  setTimeout(() => { if (currentScreen === "afteryes") img2.classList.add("show"); }, 50 + YES_HOLD + YES_FADE);
  setTimeout(() => { if (currentScreen === "afteryes") img2.classList.remove("show"); }, 50 + YES_HOLD + YES_FADE + YES_HOLD);
  
  const vidStart = 50 + YES_HOLD + YES_FADE + YES_HOLD + YES_FADE;
  setTimeout(() => {
    if (currentScreen !== "afteryes") return;
    vid.classList.add("show");
    
    vid.play().catch(() => {
      videoDone = true;
      inlineNext.classList.add("show");
      updateNav();
    });
  }, vidStart);

  vid.onended = () => {
    videoDone = true;
    updateNav(); 
    if (currentScreen === "afteryes") {
      inlineNext.classList.add("show");
    }
  };

  vid.onerror = () => {
    videoDone = true;
    if (currentScreen === "afteryes") {
      inlineNext.classList.add("show");
      updateNav();
    }
  };
}

/* =============================================================
   SCREEN 2 — DATE PICKER TIMELINE SELECTIONS
   ============================================================= */
const dateReaction = document.getElementById("dateReaction");
const dayReact = document.getElementById("dayReact");
let badDayTimer = null;

const DAYS = {
  "Thursday 04 June": {
    good: true,
    img: "resources/a.jpeg", 
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

function runDateScreenSequence() {
  const qText   = document.getElementById("dateQuestionReveal");
  const options = document.getElementById("dateOptionsReveal");

  [qText, options].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "date") qText.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "date") options.classList.add("show"); }, 1100);
}

function showDayReact(info) {
  dateReaction.textContent = info.caption;
  dayReact.onerror = () => { dayReact.hidden = true; }; 
  dayReact.src = info.img;
  dayReact.hidden = false;
  
  dayReact.style.transform = "scale(0.9)";
  dayReact.style.transition = "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
  setTimeout(() => { dayReact.style.transform = "scale(1)"; }, 20);
}

document.querySelectorAll('[data-choice="day"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const info = DAYS[val];
    if (!info) return;

    if (!info.good) {
      state.day = null;            
      updateNav(); 
      showDayReact(info);
      
      clearTimeout(badDayTimer);
      badDayTimer = setTimeout(() => {
        dayReact.hidden = true;
        dateReaction.textContent = "go on, try again 👀";
      }, 2200);
      return;                      
    }

    clearTimeout(badDayTimer);
    state.day = val;
    showDayReact(info);
    updateNav(); 
  });
});

/* ---------- Static Interaction Bindings ---------- */
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  const vid = document.getElementById("yesVideo");
  if (vid) {
    vid.load(); 
  }
  show("afteryes");
});

document.getElementById("startJourneyBtn").addEventListener("click", () => {
  show("ask2");
});

document.getElementById("videoNextBtn").addEventListener("click", () => {
  show("date"); 
});

/* =============================================================
   CENTER EDGE SYSTEM NAVIGATION Matrix
   ============================================================= */
const ORDER = ["ask1","ask2","afteryes","date"];
const NAV_HIDDEN_ON = ["ask1","ask2"]; 
const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

function forwardAllowed(screen) {
  switch (screen) {
    case "afteryes": return videoDone;   
    case "date": return !!state.day;     
    default:     return true;            
  }
}

function updateNav() {
  const hide = NAV_HIDDEN_ON.includes(currentScreen);
  navBack.hidden = hide;
  navFwd.hidden  = hide;
  if (hide) return;

  const i = ORDER.indexOf(currentScreen);
  navBack.disabled = (i <= 1);
  navFwd.disabled = !forwardAllowed(currentScreen);
}

navBack.addEventListener("click", () => {
  const i = ORDER.indexOf(currentScreen);
  if (i > 1) show(ORDER[i - 1]);
});
navFwd.addEventListener("click", () => {
  const i = ORDER.indexOf(currentScreen);
  if (i < ORDER.length - 1 && forwardAllowed(currentScreen)) {
    show(ORDER[i + 1]);
  }
});

// Kickoff
show("ask1");