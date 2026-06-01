/* =============================================================
   date-site — Complete Custom Playful Stylesheet
   ============================================================= */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Nunito:wght@400;700&display=swap');

:root {
  --bg: #fff0f3;
  --bg2: #ffe3ec;
  --ink: #3a2e35;
  --accent: #ff5d8f;
  --accent-d: #e23e73;
  --yes: #ff5d8f;
  --paper: rgba(255, 253, 250, 0.85);
  --shadow: 0 12px 40px rgba(226, 62, 115, 0.12);
  --display: 'Fraunces', Georgia, serif;
  --body: 'Nunito', system-ui, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--body);
  color: var(--ink);
  background: var(--bg);
  overflow-x: hidden;
}

#stage { position: relative; min-height: 100vh; }

/* Master Background Image Configuration */
.bg-master {
  background-image: url('../resources/•••.jpeg');
  background-size: cover;
  background-position: center;
}
.bg-master::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.4));
  z-index: 0;
}

/* ---------- Screen Layout States ---------- */
.screen {
  position: absolute; inset: 0;
  display: none;
  align-items: center; justify-content: center;
  padding: 24px;
  opacity: 0;
  transition: opacity .45s ease;
}
.screen.is-active {
  display: flex;
  opacity: 1;
}

/* ---------- Semi-Transparent Squiggly Sketchpad Box ---------- */
.cutesy-box {
  background: var(--paper);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 255px 20px 225px 30px / 30px 225px 25px 255px;
  border: 3px solid var(--ink);
  box-shadow: 5px 5px 0px var(--ink), 0 12px 40px rgba(226, 62, 115, 0.12);
  padding: 50px 40px;
  max-width: 620px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}
.cutesy-box:hover {
  border-radius: 225px 30px 255px 20px / 25px 255px 30px 225px;
}

/* ---------- Center Edge Floating Navigation ---------- */
.nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 52px; height: 52px;
  border-radius: 50%;
  border: 3px solid var(--ink);
  background: #fffdfa;
  color: var(--ink);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer; 
  z-index: 50;
  box-shadow: 3px 3px 0px var(--ink);
  display: flex; align-items: center; justify-content: center;
  transition: transform .15s ease, opacity .2s ease, background .15s ease;
}
.nav-arrow:hover:not(:disabled) { 
  transform: translateY(-50%) scale(1.1); 
  background: var(--bg2);
}
.nav-back { left: 24px; }
.nav-fwd  { right: 24px; }
.nav-arrow:disabled { opacity: .25; cursor: default; box-shadow: none; }

@media (max-width: 768px) {
  .nav-arrow { width: 44px; height: 44px; font-size: 1.4rem; }
  .nav-back { left: 10px; } .nav-fwd { right: 10px; }
}

/* ---------- Sequence Step Transitions ---------- */
.reveal-item {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-item.show {
  opacity: 1;
  transform: translateY(0);
}

.joke-q { font-family: var(--display); font-size: clamp(1.8rem, 4.5vw, 2.8rem); line-height: 1.2; margin: 0; color: var(--ink); }
.joke-punch { font-family: var(--body); font-size: clamp(1.2rem, 3vw, 1.5rem); font-style: italic; font-weight: 700; color: var(--accent-d); margin: 0 0 24px; }
.ask { font-family: var(--display); font-size: clamp(2rem, 5.5vw, 3.2rem); color: var(--ink); margin: 0 0 32px; }

/* ---------- Interactive Buttons & Trigger Region ---------- */
.btn-row { display: flex; align-items: center; justify-content: center; gap: 40px; position: relative; min-height: 120px; width: 100%; }
.btn { font-family: var(--body); font-weight: 700; border: 3px solid var(--ink); border-radius: 120px 15px 100px 20px / 25px 95px 15px 110px; cursor: pointer; transition: transform .15s ease, box-shadow .15s ease, border-radius .15s ease; }

.btn-yes {
  background: var(--yes); color: white; font-size: 2.2rem; padding: 12px 48px; box-shadow: 4px 4px 0px var(--ink); z-index: 10;
}
.btn-yes:hover { 
  transform: scale(1.05) rotate(-1.5deg); box-shadow: 2px 2px 0px var(--ink); border-radius: 95px 25px 120px 15px / 15px 110px 25px 95px;
}

/* Invisible Dynamic Trigger Region around the "No" button */
.no-trigger-region {
  padding: 35px 45px; /* Creates an invisible buffer zone surrounding the button */
  display: inline-block;
  position: relative;
  z-index: 9;
  cursor: default;
  transition: transform 0.1s ease; /* Moves the whole region seamlessly */
}

.btn-no {
  background: #fffdfa; color: var(--ink); font-size: 1.1rem; padding: 10px 24px; box-shadow: 3px 3px 0px var(--ink); margin: 0; pointer-events: none; /* Mouse responds to the region box instead */
}

.arrow-next {
  margin-top: 24px; width: 64px; height: 64px; border: 3px solid var(--ink); border-radius: 48% 52% 51% 49% / 49% 51% 49% 51%; background: var(--bg2); color: var(--ink); font-size: 1.8rem; cursor: pointer; box-shadow: 3px 3px 0px var(--ink); transition: transform .15s ease, background .2s ease;
}
.arrow-next:hover { transform: scale(1.1) rotate(15deg); background: var(--accent); color: white; box-shadow: 1px 1px 0px var(--ink); }

/* ---------- YES Page Image/Video Square Stage ---------- */
.yes-stage {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 1 / 1; 
  overflow: hidden;
  border: 3px solid var(--ink);
  border-radius: 40px 30px 45px 35px / 35px 40px 30px 45px;
  box-shadow: 4px 4px 0px var(--ink);
  background: #000;
}
.yes-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  pointer-events: none;
}
.yes-media.show { opacity: 1; }

/* ---------- Center Screen Borderless Cynthia Scare Popup ---------- */
.cynthia-popup {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0.6);
  width: 320px; max-width: 75vw;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.cynthia-popup.active {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* ---------- Option Selections Configuration ---------- */
.options { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 14px; }
.opt { font-family: var(--body); font-weight: 700; background: var(--bg2); border: 2px solid var(--ink); border-radius: 80px 15px 75px 12px / 14px 70px 12px 85px; padding: 12px 20px; font-size: 1rem; cursor: pointer; box-shadow: 2px 2px 0px var(--ink); transition: transform .12s ease, background .2s ease, border-radius .12s ease; }
.opt:hover { transform: translateY(-2px) rotate(1deg); background: var(--accent); color: white; border-radius: 75px 12px 80px 15px / 12px 85px 14px 70px; }
.reaction { font-family: var(--display); font-style: italic; font-size: 1.15rem; min-height: 1.4em; margin: 12px 0 0; color: var(--ink); }
.day-wrap { position: relative; z-index: 2; text-align: center; color: #fff; max-width: 720px; }
.day-gif { width: 200px; max-width: 50vw; border-radius: 14px; margin-bottom: 18px; box-shadow: 0 10px 36px rgba(0,0,0,0.3); }
.day-q { font-family: var(--display); font-size: clamp(1.8rem, 4.5vw, 2.8rem); margin: 0 0 26px; }
.day-react { display: block; margin: 18px auto 0; width: 280px; max-width: 70vw; border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.35); }