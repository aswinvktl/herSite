// her site lol
// everything is just screens that get show()'d one at a time
// dont touch the order array at the bottom or it all breaks i swear

const state = { day: null, time: null, food: null, note: "" };
let currentScreen = "landing";
let videoDone = false;


// browsers wont let it autoplay ffs. so just kick it off on the first click
const bgMusic = document.getElementById("bgMusic");
let musicStarted = false;
function startMusic() {
  if (musicStarted || !bgMusic) return;
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => { musicStarted = true; }).catch(() => {});
}
document.addEventListener("click", startMusic);
document.addEventListener("touchstart", startMusic);

// pause the song while the video plays so they dont fight andthen bring it back
function duckMusicForVideo(vid) {
  if (!bgMusic) return;
  bgMusic.pause();
  const resume = () => { if (currentScreen) bgMusic.play().catch(() => {}); };
  vid.addEventListener("ended", resume, { once: true });
  vid.addEventListener("error", resume, { once: true });
  vid.addEventListener("pause", resume, { once: true });
}

// the main thing. show one screen hide the rest
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

  if (name === "landing") runLandingSequence();
  if (name === "instructions") runInstructionsSequence();
  if (name === "ask1") runScreen1aSequence();
  if (name === "ask2") runScreen1bSequence();
  if (name === "afteryes") runYesSequence();
  if (name === "date") runDateScreenSequence();
  if (name === "time") runTimeScreenSequence();
  if (name === "timeout") runTimeoutScreenSequence();
  if (name === "food") runFoodScreenSequence();
  if (name === "addask") runAddAskScreenSequence();
  if (name === "summary") runSummaryScreenSequence();
  if (name === "memedump") runMemeDumpSequence();

  updateNav();
}

// landing. cat fades in first, then the hello, then the arrow
function runLandingSequence() {
  const img = document.getElementById("landingImgReveal");
  const text = document.getElementById("landingTextReveal");
  const arrow = document.getElementById("landingArrowReveal");

  [img, text, arrow].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "landing") img.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "landing") text.classList.add("show"); }, 1000);
  setTimeout(() => { if (currentScreen === "landing") arrow.classList.add("show"); }, 1700);
}

// intro buttons
document.getElementById("landingBtn").addEventListener("click", () => { show("instructions"); });

// sheldon first, then the heading, then the boxes one by one, then the button
function runInstructionsSequence() {
  const img = document.getElementById("instrImgReveal");
  const head = document.getElementById("instrHeadReveal");
  const row1 = document.getElementById("instrRow1");
  const row2 = document.getElementById("instrRow2");
  const btn = document.getElementById("instrBtnReveal");

  [img, head, row1, row2, btn].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "instructions") img.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "instructions") head.classList.add("show"); }, 1000);
  setTimeout(() => { if (currentScreen === "instructions") row1.classList.add("show"); }, 1500);
  setTimeout(() => { if (currentScreen === "instructions") row2.classList.add("show"); }, 1900);
  setTimeout(() => { if (currentScreen === "instructions") btn.classList.add("show"); }, 2400);
}

// instructions page. she has to tick both or she aint going anywhere
const chk1 = document.getElementById("chk1");
const chk2 = document.getElementById("chk2");
document.getElementById("instructionsBtn").addEventListener("click", () => {
  if (chk1.checked && chk2.checked) {
    show("ready");
  } else {
    // tick the boxes pls
    alert("tick both boxes first 😤");
  }
});

document.getElementById("readyBtn").addEventListener("click", () => { show("ask1"); });

// little delay so the arrow doesnt just slam in
function runScreen1aSequence() {
  const arrow = document.getElementById("arrowReveal");
  arrow.classList.remove("show");
  setTimeout(() => {
    if (currentScreen === "ask1") arrow.classList.add("show");
  }, 600);
}

// punchline then the question then the buttons
function runScreen1bSequence() {
  const punch = document.getElementById("seqPunch");
  const askText = document.getElementById("seqAsk");
  const buttons = document.getElementById("seqButtons");

  [punch, askText, buttons].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "ask2") punch.classList.add("show"); }, 100);
  setTimeout(() => { if (currentScreen === "ask2") askText.classList.add("show"); }, 1100);
  setTimeout(() => { if (currentScreen === "ask2") buttons.classList.add("show"); }, 2000);
}

// the no button runs away plus wicked lady
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

// phones dont hover so do it on tap too
noRegion.addEventListener("touchstart", (e) => {
  e.preventDefault();
  cynthiaScare.classList.add("active");
  moveNoRegion();
  setTimeout(() => { cynthiaScare.classList.remove("active"); }, 1000);
});

// ahhh shit the just hold + fade stacked up
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
    duckMusicForVideo(vid);

    vid.play().catch(() => {
      // if it wont play just let her move on
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

// thurs and sunday are the good ones. fri/sat get rejected and she has to pick again
// the illusion of choice. show memes all the time
const dateReaction = document.getElementById("dateReaction");
const dayReact = document.getElementById("dayReact");
const dateNextBtnReveal = document.getElementById("dateNextBtnReveal");
let badDayTimer = null;

const DAYS = {
  "Thursday 04 June": { good: true, img: "resources/a.jpeg", caption: "the best choice, look at you being decisive hahaha" },
  "Sunday 07 June": { good: true, img: "resources/a.jpeg", caption: "the best choice, look at you being decisive hahaha" },
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

  // little bounce in
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

      // show the rejection for a sec then clear it so she tries again
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

// time
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

    timeReact.style.display = "block";
    timeReact.style.transform = "scale(0.9)";
    timeReact.style.transition = "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
    setTimeout(() => { timeReact.style.transform = "scale(1)"; }, 20);

    timeNextBtnReveal.classList.add("show");
    updateNav();
  });
});

// shaq timeout. frink water
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


// peppa only shows AFTER she clicks.
// fix this later
// ugggghhhh peppa comes after state is true
const foodOther = document.getElementById("foodOther");
const foodReaction = document.getElementById("foodReaction");
const foodReact = document.getElementById("foodReact");
const foodNextBtnReveal = document.getElementById("foodNextBtnReveal");

const FOOD_RESPONSES = {
  "Italian": "i was thinking the same",
  "Japanese": "that is a reaaaalyyy gooood choice",
  "Mediterranean": "that is great choice",
  "Spanish / South American": "oooh spicy pick, i like it"
};

function runFoodScreenSequence() {
  const qText = document.getElementById("foodQuestionReveal");
  const options = document.getElementById("foodOptionsReveal");

  [qText, options].forEach(el => el.classList.remove("show"));
  foodNextBtnReveal.classList.remove("show");
  foodOther.style.display = "none";
  foodOther.value = "";
  document.getElementById("foodOtherHint").hidden = true;
  foodReact.style.display = "none";
  foodReaction.textContent = "";

  setTimeout(() => { if (currentScreen === "food") qText.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "food") options.classList.add("show"); }, 1100);
}

function triggerFoodFeedback(textStr) {
  foodReaction.textContent = textStr;
  foodReact.style.display = "block";

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
      document.getElementById("foodOtherHint").hidden = false;
      foodReaction.textContent = "";
      foodReact.style.display = "none";
      foodNextBtnReveal.classList.remove("show");
      state.food = null;
      updateNav();
      return;
    }

    foodOther.style.display = "none";
    document.getElementById("foodOtherHint").hidden = true;
    state.food = val;
    triggerFoodFeedback(FOOD_RESPONSES[val] || "great choice");
  });
});

// just track what she types, dont show peppa yet
foodOther.addEventListener("input", () => {
  const inputVal = foodOther.value.trim();
  state.food = inputVal || null;
  // if she clears it after submitting, hide peppa again
  if (!inputVal) {
    foodReact.style.display = "none";
    foodNextBtnReveal.classList.remove("show");
    foodReaction.textContent = "";
    updateNav();
  }
});

// peppa only pops once she actually hits enter
foodOther.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const inputVal = foodOther.value.trim();
    if (inputVal) {
      state.food = inputVal;
      document.getElementById("foodOtherHint").hidden = true;
      foodOther.blur();
      triggerFoodFeedback("that is a reaaaalyyy gooood choice");
    }
  }
});

// two stages teaser image first then the actual textbox
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

// just dumps her choices into the receipt. snap qr is a plain image in the html now. write something
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
}

// the leftover memes she can swipe thru or just skip
const dumpTrack = document.getElementById("dumpTrack");
const dumpSlides = dumpTrack ? [...dumpTrack.children] : [];
const dumpDots = document.getElementById("dumpDots");
let dumpIndex = 0;

function dumpRender() {
  dumpTrack.style.transform = `translateX(-${dumpIndex * 100}%)`;
  [...dumpDots.children].forEach((dot, idx) => dot.classList.toggle("on", idx === dumpIndex));
}

function runMemeDumpSequence() {
  dumpIndex = 0;
  dumpRender();
}

if (dumpTrack) {
  dumpDots.innerHTML = "";
  dumpSlides.forEach((_, idx) => {
    const dotMark = document.createElement("span");
    dotMark.className = "ig-dotmark" + (idx === 0 ? " on" : "");
    dumpDots.appendChild(dotMark);
  });
  document.getElementById("dumpNext").addEventListener("click", () => {
    dumpIndex = (dumpIndex + 1) % dumpSlides.length;
    dumpRender();
  });
  document.getElementById("dumpPrev").addEventListener("click", () => {
    dumpIndex = (dumpIndex - 1 + dumpSlides.length) % dumpSlides.length;
    dumpRender();
  });
}

// nav buttons
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  const vid = document.getElementById("yesVideo");
  if (vid) { vid.load(); }
  show("afteryes");
});

document.getElementById("startJourneyBtn").addEventListener("click", () => { show("ask2"); });
document.getElementById("videoNextBtn").addEventListener("click", () => { show("date"); });
document.getElementById("dateNextBtn").addEventListener("click", () => { show("time"); });
document.getElementById("timeNextBtn").addEventListener("click", () => { show("timeout"); });
document.getElementById("foodNextBtn").addEventListener("click", () => { show("addask"); });
document.getElementById("addaskNextBtn").addEventListener("click", () => { show("summary"); });
document.getElementById("summaryNextBtn").addEventListener("click", () => { show("memedump"); });
document.getElementById("memedumpSkip").addEventListener("click", () => { show("sleep"); });

// arrow
const ORDER = ["landing","instructions","ready","ask1","ask2","afteryes","date","time","timeout","food","addask","summary","memedump","sleep"];
// hide the arrows on all the intro/outro screens + ones with their own button
const NAV_HIDDEN_ON = ["landing","instructions","ready","ask1","ask2","timeout","summary","memedump","sleep"];
const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

// cant go forward till the current screen is actually answered
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

// go
show("landing");