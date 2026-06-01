/* ---------- Interactive Buttons & Trigger Region ---------- */
.btn-row { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 80px; 
  position: relative; 
  min-height: 160px; 
  width: 100%; 
}

.btn { 
  font-family: var(--body); 
  font-weight: 700; 
  border: 3px solid var(--ink); 
  border-radius: 120px 15px 100px 20px / 25px 95px 15px 110px; 
  cursor: pointer; 
  transition: transform .15s ease, box-shadow .15s ease, border-radius .15s ease; 
}

.btn-yes {
  background: var(--yes); 
  color: white; 
  font-size: 2.2rem; 
  padding: 12px 48px; 
  box-shadow: 4px 4px 0px var(--ink); 
  z-index: 10;
  /* Keep YES statically positioned in the center lane */
  position: relative;
  right: 40px; 
}
.btn-yes:hover { 
  transform: scale(1.05) rotate(-1.5deg); 
  box-shadow: 2px 2px 0px var(--ink); 
  border-radius: 95px 25px 120px 15px / 15px 110px 25px 95px;
}

/* Invisible Absolute Bounding Box around the "No" option */
.no-trigger-region {
  padding: 40px 50px; 
  display: inline-block;
  position: absolute;
  top: 40px;
  right: 40px;
  z-index: 9;
  cursor: default;
  /* Smooth absolute coordinate slide tracking transitions */
  transition: top 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), right 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-no {
  background: #fffdfa; 
  color: var(--ink); 
  font-size: 1.1rem; 
  padding: 10px 24px; 
  box-shadow: 3px 3px 0px var(--ink); 
  margin: 0; 
  pointer-events: none; /* Forces the mouse cursor to read the parent hotspot region instead */
}