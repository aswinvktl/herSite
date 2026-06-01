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

/* ---------- No Button Run Away Logic + Cynthia Popup Hover Sync ---------- */
const noBtn = document.getElementById("noBtn");
const cynthiaScare = document.getElementById("cynthiaScare");

function moveNoButton() {
  // Move vectors stay isolated on the outer edge plane away from the YES route
  const moveX = (Math.random() * 120 + 60).toFixed(0); 
  const moveY = (Math.random() * 100 - 50).toFixed(0);
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

noBtn.addEventListener("mouseenter", () => {
  cynthiaScare.classList.add("active");
  moveNoButton();
});

noBtn.addEventListener("mouseleave", () => {
  cynthiaScare.classList.remove("active");
});

noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  cynthiaScare.classList.add("active");
  moveNoButton();
  setTimeout(() => { cynthiaScare.classList.remove("active"); }, 1000);
});

/* ---------- YES Flow Crossfade Sequence Tracker ---------- */
const YES_HOLD = 2200;   
const YES_FADE = 800;    

function runYesSequence() {
  const img1 = document.getElementById("yesImg1");
  const img2 = document.getElementById("yesImg2");
  const vid  = document.getElementById("yesVideo");

  [img1, img2, vid].forEach(el => el.classList.remove("show"));
  vid.pause(); 
  vid.currentTime = 0;
  
  videoDone = false;
  updateNav(); 

  setTimeout(() => { 
    if (currentScreen === "afteryes") img1.classList.add("show"); 
  }, 50);
  
  setTimeout(() => { 
    if (currentScreen === "afteryes") img1.classList.remove("show"); 
  }, 50 + YES_HOLD);
  
  setTimeout(() => { 
    if (currentScreen === "afteryes") img2.classList.add("show"); 
  }, 50 + YES_HOLD + YES_FADE);
  
  setTimeout(() => { 
    if (currentScreen === "afteryes") img2.classList.remove("show"); 
  }, 50 + YES_HOLD + YES_FADE + YES_HOLD);
  
  const vidStart = 50 + YES_HOLD + YES_FADE + YES_HOLD + YES_FADE;
  setTimeout(() => {
    if (currentScreen !== "afteryes") return;
    vid.classList.add("show");
    
    vid.play().catch(() => {
      videoDone = true;
      updateNav();
    });
  }, vidStart);

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

/* ---------- Static Interaction Bindings ---------- */
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  show("afteryes");
});

document.getElementById("startJourneyBtn").addEventListener("click", () => {
  show("ask2");
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