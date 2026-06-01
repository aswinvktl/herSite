/* =============================================================
   date-site — Integrated Transition & Navigation Engine
   ============================================================= */

const state = { day: null, time: null, food: null, note: "" };
let currentScreen = "ask1";
let videoDone = false;
let qrGenerated = false;

/* ---------- Background music ---------- */
const bgMusic = document.getElementById("bgMusic");
let musicStarted = false;
function startMusic() {
  if (musicStarted || !bgMusic) return;
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => { musicStarted = true; }).catch(() => {/* will retry on next interaction */});
}
// kick it off on the first interaction anywhere (autoplay policies need a gesture)
document.addEventListener("click", startMusic, { once: false });
document.addEventListener("touchstart", startMusic, { once: false });

function duckMusicForVideo(vid) {
  if (!bgMusic) return;
  bgMusic.pause();
  const resume = () => { if (currentScreen) bgMusic.play().catch(() => {}); };
  vid.addEventListener("ended", resume, { once: true });
  vid.addEventListener("error", resume, { once: true });
  vid.addEventListener("pause", resume, { once: true });
}

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
  if (name === "time") runTimeScreenSequence();
  if (name === "timeout") runTimeoutScreenSequence();
  if (name === "food") runFoodScreenSequence();
  if (name === "addask") runAddAskScreenSequence();
  if (name === "reasons") runReasonsScreenSequence();
  if (name === "summary") runSummaryScreenSequence();
  
  updateNav();
}

/* ---------- Screen 1a Arrow Entry Delay ---------- */
function runScreen1aSequence() {
  const arrow = document.getElementById("arrowReveal");
  arrow.classList.remove("show");
  setTimeout(() => {
    if (currentScreen === "ask1") arrow.classList.add("show");
  }, 600);
}

/* ---------- Screen 1b Timed Narrative Sequence ---------- */
function runScreen1bSequence() {
  const punch = document.getElementById("seqPunch");
  const askText = document.getElementById("seqAsk");
  const buttons = document.getElementById("seqButtons");

  [punch, askText, buttons].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "ask2") punch.classList.add("show"); }, 100);
  setTimeout(() => { if (currentScreen === "ask2") askText.classList.add("show"); }, 1100);
  setTimeout(() => { if (currentScreen === "ask2") buttons.classList.add("show"); }, 2000);
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
    duckMusicForVideo(vid);   // pause bg music while the video plays, resume after
    
    vid.play().catch(() => {
      videoDone = true;
      inlineNext.classList.add("show");
      if (bgMusic) bgMusic.play().catch(() => {});
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
const dateNextBtnReveal = document.getElementById("dateNextBtnReveal");
let badDayTimer = null;

const DAYS = {
  "Thursday 04 June": { good: true, img: "resources/a.jpeg", caption: "great choice" },
  "Sunday 07 June": { good: true, img: "resources/901ad9ad498cae6cbc137b6b57c9f012(3).jpg", caption: "THE BESTEST CHOICE. look at you being decisive hahahahahah" },
  "Friday 05 June": { good: false, img: "resources/8cef642481853f378a453a318ef7f205(3).jpg", caption: "we are working" },
  "Saturday 06 June": { good: false, img: "resources/f38bc75959b15a509d0d0c1a7c11dc88.jpg", caption: "too busy, too many people" },
};

function runDateScreenSequence() {
  const qText   = document.getElementById("dateQuestionReveal");
  const options = document.getElementById("dateOptionsReveal");

  [qText, options].forEach(el => el.classList.remove("show"));
  dateNextBtnReveal.classList.remove("show");
  
  dayReact.style.display = "none"; 
  dateReaction.textContent = "";

  setTimeout(() => { if (currentScreen === "date") qText.classList.add("show"); }, 150);
  setTimeout(() => { if (currentScreen === "date") options.classList.add("show"); }, 750);
}

function showDayReact(info) {
  dateReaction.textContent = info.caption;
  dayReact.onerror = () => { dayReact.style.display = "none"; }; 
  dayReact.src = info.img;
  dayReact.style.display = "block"; 
  
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
      dateNextBtnReveal.classList.remove("show");
      updateNav(); 
      showDayReact(info);
      
      clearTimeout(badDayTimer);
      badDayTimer = setTimeout(() => {
        dayReact.style.display = "none";
        dateReaction.textContent = "go on, try again 👀";
      }, 2200);
      return;                      
    }

    clearTimeout(badDayTimer);
    state.day = val;
    showDayReact(info); 
    dateNextBtnReveal.classList.add("show"); 
    updateNav(); 
  });
});

/* =============================================================
   SCREEN 3 — TIME PICKER TIMELINE SELECTIONS
   ============================================================= */
const timeReaction = document.getElementById("timeReaction");
const timeReact = document.getElementById("timeReact");
const timeNextBtnReveal = document.getElementById("timeNextBtnReveal");

function runTimeScreenSequence() {
  const qText = document.getElementById("timeQuestionReveal");
  const options = document.getElementById("timeOptionsReveal");

  [qText, options].forEach(el => el.classList.remove("show"));
  timeNextBtnReveal.classList.remove("show");
  
  timeReact.style.display = "none"; 
  timeReaction.textContent = "";

  setTimeout(() => { if (currentScreen === "time") qText.classList.add("show"); }, 150);
  setTimeout(() => { if (currentScreen === "time") options.classList.add("show"); }, 750);
}

document.querySelectorAll('[data-choice="time"]').forEach(btn => {
  btn.addEventListener("click", () => {
    state.time = btn.dataset.value;
    timeReaction.textContent = "great choice again";
    timeReact.style.display = "none"; 

    timeNextBtnReveal.classList.add("show"); 
    updateNav();
  });
});

/* =============================================================
   SCREEN 3b — TIMEOUT / INTERMISSION WATER BREAK
   ============================================================= */
const timeoutStage1 = document.getElementById("timeoutStage1");
const timeoutStage2 = document.getElementById("timeoutStage2");
const waterCount = document.getElementById("waterCount");
let waterTimer = null;

function runTimeoutScreenSequence() {
  clearInterval(waterTimer);
  timeoutStage1.hidden = false;
  timeoutStage2.hidden = true;

  const shaqImg = document.getElementById("shaqImgReveal");
  const shaqHead = document.getElementById("shaqHeaderReveal");
  const shaqSub = document.getElementById("shaqSubReveal");
  const shaqBtn = document.getElementById("shaqBtnReveal");

  [shaqImg, shaqHead, shaqSub, shaqBtn].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "timeout") shaqImg.classList.add("show"); }, 150);
  setTimeout(() => { if (currentScreen === "timeout") shaqHead.classList.add("show"); }, 900);
  setTimeout(() => { if (currentScreen === "timeout") shaqSub.classList.add("show"); }, 1500);
  setTimeout(() => { if (currentScreen === "timeout") shaqBtn.classList.add("show"); }, 2200);
}

function startWaterBreak() {
  let count = 10;
  waterCount.textContent = count;
  clearInterval(waterTimer);

  waterTimer = setInterval(() => {
    count--;
    waterCount.textContent = count;
    if (count <= 0) {
      clearInterval(waterTimer);
      leaveWaterBreak();
    }
  }, 1000);
}

function leaveWaterBreak() {
  clearInterval(waterTimer);
  show("food");
}

document.getElementById("timeoutStartBtn").addEventListener("click", () => {
  timeoutStage1.hidden = true;
  timeoutStage2.hidden = false;
  startWaterBreak();
});

document.getElementById("waterSkip").addEventListener("click", () => {
  leaveWaterBreak();
});

/* =============================================================
   SCREEN 4 — CUISINE PICKER SELECTIONS FLOW
   ============================================================= */
const foodOther = document.getElementById("foodOther");
const foodReaction = document.getElementById("foodReaction");
const foodReact = document.getElementById("foodReact");
const foodNextBtnReveal = document.getElementById("foodNextBtnReveal");

const FOOD_RESPONSES = {
  "Italian": "i was thinking the same",
  "Japanese": "that is a reaaaalyyy gooood choice",
  "Mediterranean": "that is great choice"
};

function runFoodScreenSequence() {
  const qText = document.getElementById("foodQuestionReveal");
  const options = document.getElementById("foodOptionsReveal");

  [qText, options].forEach(el => el.classList.remove("show"));
  foodNextBtnReveal.classList.remove("show");
  foodOther.style.display = "none";
  foodOther.value = "";
  foodReact.hidden = true;
  foodReaction.textContent = "";

  setTimeout(() => { if (currentScreen === "food") qText.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "food") options.classList.add("show"); }, 1100);
}

function triggerFoodFeedback(textStr) {
  foodReaction.textContent = textStr;
  foodReact.hidden = false;
  
  foodReact.style.transform = "scale(0.9)";
  foodReact.style.transition = "transform 0.24s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
  setTimeout(() => { foodReact.style.transform = "scale(1)"; }, 20);

  foodNextBtnReveal.classList.add("show");
  updateNav();
}

document.querySelectorAll('[data-choice="food"]').forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    if (val === "__other__") {
      foodOther.style.display = "block";
      foodOther.focus();
      foodReaction.textContent = "";
      foodReact.hidden = true;
      foodNextBtnReveal.classList.remove("show");
      state.food = null;
      updateNav();
      return;
    }
    
    foodOther.style.display = "none";
    state.food = val;
    triggerFoodFeedback(FOOD_RESPONSES[val] || "great choice");
  });
});

foodOther.addEventListener("input", () => {
  const inputVal = foodOther.value.trim();
  state.food = inputVal || null;
  if (inputVal) {
    triggerFoodFeedback("that is a reaaaalyyy gooood choice");
  } else {
    foodReact.hidden = true;
    foodNextBtnReveal.classList.remove("show");
    foodReaction.textContent = "";
    updateNav();
  }
});

/* =============================================================
   SCREEN 5 — CUSTOM INTERACTIVE NOTES FLOW
   ============================================================= */
const noteStageTeaser = document.getElementById("noteStageTeaser");
const noteStageInput = document.getElementById("noteStageInput");
const noteTypingReact = document.getElementById("noteTypingReact");
const noteBox = document.getElementById("noteBox");

function runAddAskScreenSequence() {
  noteStageTeaser.hidden = false;
  noteStageInput.hidden = true;
  noteTypingReact.hidden = true;
  noteBox.value = "";
  state.note = "";

  const teaserImg = document.getElementById("noteTeaserImgReveal");
  const teaserBtn = document.getElementById("noteTeaserBtnReveal");

  [teaserImg, teaserBtn].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "addask") teaserImg.classList.add("show"); }, 150);
  setTimeout(() => { if (currentScreen === "addask") teaserBtn.classList.add("show"); }, 900);
}

noteBox.addEventListener("focus", () => {
  noteTypingReact.hidden = false;
});
noteBox.addEventListener("input", () => { 
  state.note = noteBox.value.trim(); 
  if (state.note) {
    noteTypingReact.hidden = false;
  }
});

document.getElementById("noteOpenBtn").addEventListener("click", () => {
  noteStageTeaser.hidden = true;
  noteStageInput.hidden = false;
  noteBox.focus(); 
});

/* =============================================================
   SCREEN 6 — INSTAGRAM CAROUSEL CONTROLLER
   ============================================================= */
const igTrack = document.getElementById("igTrack");
const igSlides = igTrack ? [...igTrack.children] : [];
const igDots = document.getElementById("igDots");
let igIndex = 0;

function igRender() {
  igTrack.style.transform = `translateX(-${igIndex * 100}%)`;
  [...igDots.children].forEach((dot, idx) => dot.classList.toggle("on", idx === igIndex));
}

function runReasonsScreenSequence() {
  igIndex = 0;
  igRender();
}

if (igTrack) {
  igDots.innerHTML = "";
  igSlides.forEach((_, idx) => {
    const dotMark = document.createElement("span");
    dotMark.className = "ig-dotmark" + (idx === 0 ? " on" : "");
    igDots.appendChild(dotMark);
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
   SCREEN 7 — LIVE ITINERARY & DYNAMIC QR SUMMARY
   ============================================================= */
function runSummaryScreenSequence() {
  document.getElementById("summaryDay").textContent = state.day || "Selected Day";
  document.getElementById("summaryTime").textContent = state.time || "Selected Time";
  document.getElementById("summaryFood").textContent = state.food || "Craved Food";
  
  const noteRow = document.getElementById("summaryNoteRow");
  if (state.note) {
    document.getElementById("summaryNote").textContent = state.note;
    noteRow.style.display = "flex";
  } else {
    noteRow.style.display = "none";
  }

  if (!qrGenerated) {
    const qrTargetContainer = document.getElementById("qrcode");
    qrTargetContainer.innerHTML = "";
    
    // --- PRIVATE CONFIGURATION GATEWAY ---
    // Swap this out with your personal note or calendar link privately!
    const targetUrl = "https://google.com"; 
    
    new QRCode(qrTargetContainer, {
      text: targetUrl,
      width: 140,
      height: 140,
      colorDark : "#3a2e35",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    qrGenerated = true;
  }
}

/* ---------- Static Interaction Bindings ---------- */
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  const vid = document.getElementById("yesVideo");
  if (vid) { vid.load(); }
  show("afteryes");
});

document.getElementById("startJourneyBtn").addEventListener("click", () => { show("ask2"); });
document.getElementById("videoNextBtn").addEventListener("click", () => { show("date"); });
document.getElementById("dateNextBtn").addEventListener("click", () => { show("time"); });

document.getElementById("timeNextBtn").addEventListener("click", () => {
  timeReact.style.display = "block"; 
  timeReact.style.transform = "scale(0.9)";
  timeReact.style.transition = "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
  setTimeout(() => { timeReact.style.transform = "scale(1)"; }, 20);
  setTimeout(() => { if (currentScreen === "time") { show("timeout"); } }, 1500);
});

document.getElementById("foodNextBtn").addEventListener("click", () => { show("addask"); });
document.getElementById("addaskNextBtn").addEventListener("click", () => { show("reasons"); });
document.getElementById("reasonsNextBtn").addEventListener("click", () => { show("summary"); });

/* =============================================================
   CENTER EDGE SYSTEM NAVIGATION Matrix
   ============================================================= */
const ORDER = ["ask1","ask2","afteryes","date","time","timeout","food","addask","reasons","summary"];
const NAV_HIDDEN_ON = ["ask1","ask2","timeout","summary"];
const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

function forwardAllowed(screen) {
  switch (screen) {
    case "afteryes": return videoDone;   
    case "date": return !!state.day;     
    case "time": return !!state.time;
    case "food": return !!state.food;
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