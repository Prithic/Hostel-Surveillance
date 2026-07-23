/* =========================================================
   HUMAN-TRAINED HOSTEL DETAILS & CONVERSATIONAL NLP ENGINE
   ========================================================= */
const NN_HOSTEL = {
  name: "Trinity Engine",
  faqs: [
    { tag:"room_types", label:"Room types", keywords:["room","sharing","single","double","triple","occupancy","types","options","bathroom","attached"],
      answer:"Good question! We've got three room options, and every single one comes with its own <b>attached bathroom</b> — no queuing down the hall. <b>4-share</b> is ₹1.25L/year, <b>3-share</b> is ₹1.45L/year, and if you want a bit more room, <b>2-share</b> is ₹1.85L/year. Each room is set up with cozy beds, study desks, and wardrobes!" },
    { tag:"fees", label:"Fees & Rent", keywords:["price","cost","rent","fee","fees","how much","charges"],
      answer:"Here's the annual breakdown (attached bathroom included): <b>4-share</b> is ₹1.25 Lakh, <b>3-share</b> is ₹1.45 Lakh, and <b>2-share</b> is ₹1.85 Lakh. Rent is due during the first 5 days of each month!" },
    { tag:"warden_contact", label:"Warden Contact", keywords:["warden","contact","phone","email","call","reach","office"],
      answer:"Sure thing — you can reach our warden's office at <b>+91 98765 43210</b> or drop a line to <b>warden@scholarsnest.example</b>. We're open from 8 AM to 9 PM daily, so don't hesitate to reach out!" },
    { tag:"location", label:"Location", keywords:["location","address","where","directions","near","distance","college"],
      answer:"We're right at <b>21 College Road</b> — literally a quick 5-minute walk from the main campus gate, with auto and bus stands right outside!" }
  ],
  greetings:["hi","hello","hey","yo","sup","good morning","good afternoon","good evening"],
  thanks:["thanks","thank you","thx","cheers","appreciate"],
  bye:["bye","goodbye","see you","later"]
};

// Trained human responses for all hostel rules & guidelines
const NN_RULES_FAQS = [
  { tag:"checkin_checkout", label:"Check-in / Out", keywords:["check", "checkin", "checkout", "out", "timings"],
    answer:"You can check in from <b>12:00 PM</b>, and check-out is by <b>11:00 AM</b>. If you need a little extra time, a late check-out is usually fine — just give our desk a quick heads-up!" },
  { tag:"curfew", label:"Curfew Hours", keywords:["close", "curfew", "enter", "entry", "gates", "last", "late", "night"],
    answer:"Our main gate closes at <b>10:00 PM on weekdays</b> and <b>11:00 PM on weekends</b>. Coming in after that is totally fine, just sign in at the security desk when you arrive!" },
  { tag:"visitors", label:"Visitors", keywords:["come", "family", "friends", "guests", "overnight", "room", "stay", "visit", "visitor", "visitors"],
    answer:"Friends and family are welcome to visit in our common lounge from <b>9:00 AM to 8:00 PM</b> — just sign them in at reception. For overnight stays, you'll just need written approval from the warden in advance!" },
  { tag:"id_card", label:"ID Card", keywords:["card", "carry", "enter", "id", "lose", "mandatory"],
    answer:"Keep your hostel ID on you — security asks for it at the gate. If you ever lose it, just let us know at the desk and we'll get you a replacement!" },
  { tag:"mess_dining", label:"Mess Timings", keywords:["breakfast", "cook", "dining", "dinner", "food", "hall", "mess", "outside", "own", "served", "skip", "timings"],
    answer:"Here's when meals are served: <b>Breakfast</b> 7:30–9:30 AM, <b>Lunch</b> 12:30–2:30 PM, <b>Snacks</b> 5:00–6:00 PM, and <b>Dinner</b> 7:30–9:30 PM. Outside food is welcome in the common lounge!" },
  { tag:"room_cleanliness", label:"Cleanliness", keywords:["cleaning", "cleanliness", "cleans", "inspected", "keep", "messy", "often", "provided", "room", "rooms"],
    answer:"Housekeeping cleans all common areas daily, while your room is yours to keep tidy. We do periodic checks, but don't worry — you'll always get advance notice!" },
  { tag:"noise", label:"Quiet Hours", keywords:["hours", "loud", "make", "music", "night", "noise", "play", "quiet", "until"],
    answer:"Quiet hours run from <b>10:00 PM to 6:00 AM</b> so everyone gets a good night's sleep. During the day, feel free to study and enjoy music!" },
  { tag:"alcohol_smoking_drugs", label:"Substances", keywords:["alcohol", "drink", "drugs", "room", "smoking"],
    answer:"This one's a hard rule — smoking, alcohol, and drugs aren't allowed anywhere on the premises to maintain a safe, clean community for all residents." },
  { tag:"electrical_appliances", label:"Appliances", keywords:["appliances", "banned", "bring", "electrical", "heater", "iron", "kettle", "own", "room", "rooms", "use"],
    answer:"Your everyday electronics — laptops, phone chargers, table lamps — are all totally fine! Just high-power heaters or induction cooktops are banned for fire safety." },
  { tag:"laundry", label:"Laundry", keywords:["available", "clothes", "laundry", "machine", "service", "timings", "wash", "washing"],
    answer:"Each floor has washing machines open <b>6:00 AM to 9:00 PM</b> daily. We also have a paid laundry service if you'd rather have your clothes ironed!" },
  { tag:"payment_fees", label:"Fees & Deposit", keywords:["deposit", "due", "fee", "fees", "late", "pay", "payment", "security"],
    answer:"Fees are due in the first 5 days of each month online or at the desk. There's also a refundable security deposit collected when you move in!" },
  { tag:"room_change", label:"Room Change", keywords:["change", "request", "room", "roommate", "single", "switch"],
    answer:"Want to switch rooms? Just send a quick written note to the warden's desk. Approved changes usually go through within 3–5 working days!" },
  { tag:"safety_security", label:"Safety", keywords:["case", "cctv", "contact", "emergency", "issues", "measures", "place", "safety", "security"],
    answer:"You're in safe hands — 24/7 security duty, CCTV in common corridors, and emergency contacts posted on every single floor." },
  { tag:"pets", label:"Pets", keywords:["keep", "pet", "pets"],
    answer:"Sorry, pets aren't allowed in rooms due to hygiene and community safety." },
  { tag:"internet_wifi", label:"Wi-Fi", keywords:["available", "data", "fi", "internet", "limit", "wi", "wifi"],
    answer:"High-speed fiber Wi-Fi is available across all resident rooms, study areas, and common lounges for studies, streaming, and work!" }
];

const NN_ALL_TOPICS = [...NN_RULES_FAQS, ...NN_HOSTEL.faqs];
const NN_STOPWORDS = new Set("a an the is are am was were be been being do does did i my me you your in on at to of for if can could should would will shall must have has had what when where who why how there here this that these those it its any allowed need needed permit permitted policy rule rules time times get got about with without into from as or and but not no yes so please tell during after before happen happens hostel".split(" "));

function nnTokenize(text){
  return text.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(w => w.length > 1 && !NN_STOPWORDS.has(w));
}

let nnAudioCtx = null, nnSoundOn = true;
function nnEnsureAudio(){
  if (!nnAudioCtx) {
    try { nnAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { nnAudioCtx = null; }
  }
  if (nnAudioCtx && nnAudioCtx.state === 'suspended') nnAudioCtx.resume();
}
function nnTone(freq, duration, type='sine', gainLevel=0.12, sweepTo=null, delay=0){
  if (!nnSoundOn) return; nnEnsureAudio(); if (!nnAudioCtx) return;
  const t0 = nnAudioCtx.currentTime + delay;
  const osc = nnAudioCtx.createOscillator(), gain = nnAudioCtx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + duration);
  gain.gain.setValueAtTime(gainLevel, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(nnAudioCtx.destination);
  osc.start(t0); osc.stop(t0 + duration);
}
const nnSfx = {
  open:    () => { nnTone(660, 0.09, 'sine', 0.12); nnTone(880, 0.12, 'sine', 0.12, null, 0.08); },
  send:    () => nnTone(520, 0.06, 'square', 0.05),
  receive: () => nnTone(780, 0.14, 'sine', 0.09),
  shake:   () => nnTone(520, 0.35, 'sawtooth', 0.08, 120),
  sleep:   () => nnTone(440, 0.45, 'sine', 0.06, 200),
  wake:    () => nnTone(320, 0.28, 'sine', 0.07, 560)
};

function nnPick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

const NN_GREETING_REPLIES = [
  `Hey there! 👋 Welcome to <b>${NN_HOSTEL.name}</b>. I'm Alex at the desk — ask me anything about rooms, fees, curfew, or mess timings!`,
  `Hi! 👋 Good to see you. What's on your mind today — room options, attached bathrooms, or fees?`,
  `Hey! Welcome. Feel free to ask me anything about hostel life, fees, or timings!`
];
const NN_BYE_REPLIES = [
  "Anytime! Reach out whenever you've got more questions. Have a great day! 😊",
  "You're super welcome! I'm here if anything else comes up.",
  "No problem at all! Good luck and talk soon 👋"
];
const NN_FALLBACK_REPLIES = [
  "I want to make sure you get the exact answer — feel free to ask about room prices, attached bathrooms, curfew, or call the warden at +91 98765 43210! 😊",
  "I'm here to help with all things Trinity Engine! What can I check for you — rooms, fees, or mess timings?"
];

function nnFindAnswer(rawText){
  const text = rawText.toLowerCase();
  const tokens = new Set(nnTokenize(rawText));

  const isGreeting = NN_HOSTEL.greetings.some(g => text.includes(g) || tokens.has(g));
  const isBye = [...NN_HOSTEL.bye, ...NN_HOSTEL.thanks].some(g => text.includes(g) || tokens.has(g));
  if (isGreeting) return nnPick(NN_GREETING_REPLIES);
  if (isBye) return nnPick(NN_BYE_REPLIES);

  const allFaqs = [...NN_HOSTEL.faqs, ...NN_RULES_FAQS];
  let best = null, bestScore = 0;
  for (const faq of allFaqs) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (kw.includes(" ")) { if (text.includes(kw)) score += 2; }
      else if (tokens.has(kw)) score += 1;
    }
    if (score > bestScore) { bestScore = score; best = faq; }
  }
  if (best && bestScore > 0) return best.answer;
  return nnPick(NN_FALLBACK_REPLIES);
}

(function(){
  if (window.__nnChatbotBooted) return;
  const launcherWrap = document.getElementById('nn-chat-launcher-wrap');
  const launcher = document.getElementById('nn-chat-launcher');
  const panel = document.getElementById('nn-chat-panel');
  const closeBtn = document.getElementById('nn-chat-close');
  const body = document.getElementById('nn-chat-body');
  const input = document.getElementById('nn-chat-input');
  const sendBtn = document.getElementById('nn-chat-send');
  if (!launcherWrap || !launcher || !panel || !closeBtn || !body || !input || !sendBtn) {
    console.error('Tk chatbot: DOM nodes missing');
    return;
  }
  window.__nnChatbotBooted = true;
  const eyesTrack = launcher.querySelector('.nn-bot-eyes-track');
  const antenna = launcher.querySelector('.nn-bot-antenna');

  const LAUNCHER_SIZE = 62, EDGE_MARGIN = 6;

  let dragging = false, moved = false, startX, startY, startLeft, startTop;
  let lastX = 0, lastY = 0, lastT = 0, downT = 0, velocity = 0;

  function clamp(val, min, max){ return Math.max(min, Math.min(max, val)); }

  function pointerDown(x, y){
    dragging = true; moved = false; startX = x; startY = y;
    lastX = x; lastY = y; lastT = performance.now(); velocity = 0;
    downT = lastT;
    const rect = launcherWrap.getBoundingClientRect();
    startLeft = rect.left; startTop = rect.top;
    launcher.classList.add('nn-dragging'); wake();
  }
  function pointerMove(x, y){
    if (!dragging) return;
    const dx = x - startX, dy = y - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    const dist = Math.hypot(x - lastX, y - lastY);
    velocity = dist / dt; // px per ms
    lastX = x; lastY = y; lastT = now;

    const maxLeft = window.innerWidth - LAUNCHER_SIZE - EDGE_MARGIN;
    const maxTop = window.innerHeight - LAUNCHER_SIZE - EDGE_MARGIN;
    const newLeft = clamp(startLeft + dx, EDGE_MARGIN, Math.max(EDGE_MARGIN, maxLeft));
    const newTop = clamp(startTop + dy, EDGE_MARGIN, Math.max(EDGE_MARGIN, maxTop));
    launcherWrap.style.left = newLeft + 'px';
    launcherWrap.style.top = newTop + 'px';
  }
  function pointerUp(){
    if (!dragging) return; dragging = false;
    launcher.classList.remove('nn-dragging');
    const elapsed = performance.now() - downT;
    const travel = Math.hypot(lastX - startX, lastY - startY);
    // Short press / tiny jitter still opens the panel
    if (!moved || (travel < 14 && elapsed < 400)) {
      openPanel();
    } else if (velocity > 1.1) {
      doShake();
    }
  }

  function updateEyeTracking(mx, my){
    if (!eyesTrack) return;
    const rect = launcher.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = mx - cx, dy = my - cy;
    const dist = Math.hypot(dx, dy) || 1;
    eyesTrack.style.transform = `translate(${(dx / dist) * Math.min(1, dist / 250) * 0.55}px, ${(dy / dist) * Math.min(1, dist / 250) * 0.55}px)`;
  }
  window.addEventListener('mousemove', e => updateEyeTracking(e.clientX, e.clientY), { passive:true });

  // Mouse drag
  launcher.addEventListener('mousedown', e => { pointerDown(e.clientX, e.clientY); });
  window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', pointerUp);
  // Backup open path (mousedown preventDefault was swallowing clicks)
  launcher.addEventListener('click', () => openPanel());

  // Touch drag (phones/tablets) — the widget can be dragged anywhere on screen
  launcher.addEventListener('touchstart', e => {
    const t = e.touches[0]; pointerDown(t.clientX, t.clientY);
  }, { passive:true });
  window.addEventListener('touchmove', e => {
    if (!dragging) return;
    const t = e.touches[0]; pointerMove(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive:false });
  window.addEventListener('touchend', pointerUp);

  // Keep the widget on-screen if the window is resized after dragging
  window.addEventListener('resize', () => {
    const rect = launcherWrap.getBoundingClientRect();
    const maxLeft = window.innerWidth - LAUNCHER_SIZE - EDGE_MARGIN;
    const maxTop = window.innerHeight - LAUNCHER_SIZE - EDGE_MARGIN;
    if (rect.left > maxLeft || rect.top > maxTop) {
      launcherWrap.style.left = clamp(rect.left, EDGE_MARGIN, Math.max(EDGE_MARGIN, maxLeft)) + 'px';
      launcherWrap.style.top = clamp(rect.top, EDGE_MARGIN, Math.max(EDGE_MARGIN, maxTop)) + 'px';
    }
  });

  // Double-click / double-tap → playful shake + dizzy-eyes wiggle
  function doShake(){
    wake();
    launcher.classList.remove('nn-shake'); void launcher.offsetWidth;
    launcher.classList.add('nn-shake', 'nn-dizzy');
    nnSfx.shake();
    clearTimeout(doShake._t);
    doShake._t = setTimeout(() => {
      launcher.classList.remove('nn-shake', 'nn-dizzy');
    }, 800);
  }
  launcher.addEventListener('dblclick', doShake);
  let tapCount = 0, tapTimer = null;
  launcher.addEventListener('touchend', () => {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 320);
    if (tapCount === 2) { tapCount = 0; doShake(); }
  });

  let idleTimer = null;
  function wake(){
    const wasSleepy = launcher.classList.contains('nn-sleepy');
    launcher.classList.remove('nn-sleepy');
    launcherWrap.classList.remove('nn-wrap-sleepy');
    if (wasSleepy) nnSfx.wake();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      launcher.classList.add('nn-sleepy');
      launcherWrap.classList.add('nn-wrap-sleepy');
      nnSfx.sleep();
    }, 14000);
    nnEnsureAudio();
  }
  ['mousedown','touchstart','keydown','click'].forEach(evt => document.addEventListener(evt, wake, { passive:true }));
  wake();

  function openPanel(){
    panel.classList.add('nn-open');
    nnSfx.open();
    if (body.children.length === 0) {
      addMessage(`Hi! I'm Alex at the front desk for <b>${NN_HOSTEL.name}</b> 👋 Ask me about rooms, attached bathrooms, fees, or curfew!`, 'bot');
      addChips();
    }
    input.focus();
  }

  function addMessage(text, sender){
    const div = document.createElement('div');
    div.className = 'nn-msg nn-' + sender;
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    if (sender === 'bot') {
      antenna.classList.remove('nn-happy'); void antenna.offsetWidth; antenna.classList.add('nn-happy');
      nnSfx.receive();
    }
  }

  function addChips(){
    const wrap = document.createElement('div');
    wrap.className = 'nn-chips';
    NN_ALL_TOPICS.forEach(topic => {
      const chip = document.createElement('button');
      chip.className = 'nn-chip';
      chip.textContent = topic.label;
      chip.onclick = () => {
        wake(); addMessage(topic.label, 'user'); nnSfx.send();
        showTyping();
        setTimeout(() => { hideTyping(); addMessage(topic.answer, 'bot'); }, 260);
      };
      wrap.appendChild(chip);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping(){
    const t = document.createElement('div');
    t.className = 'nn-typing'; t.id = 'nn-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t); body.scrollTop = body.scrollHeight;
  }
  function hideTyping(){ const t = document.getElementById('nn-typing-indicator'); if (t) t.remove(); }

  function sendMessage(){
    const text = input.value.trim();
    if (!text) return;
    wake(); addMessage(text, 'user'); nnSfx.send();
    input.value = ''; showTyping();
    setTimeout(() => {
      hideTyping();
      const reply = nnFindAnswer(text);
      addMessage(reply, 'bot');
    }, 300);
  }

  const soundToggle = document.getElementById('nn-sound-toggle');
  if (soundToggle) soundToggle.addEventListener('click', () => {
    nnSoundOn = !nnSoundOn; soundToggle.textContent = nnSoundOn ? '🔊' : '🔇';
    nnEnsureAudio(); if (nnSoundOn) nnSfx.open();
  });

  closeBtn.addEventListener('click', () => panel.classList.remove('nn-open'));
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
})();