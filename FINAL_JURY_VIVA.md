# GuardianAI — FINAL JURY VIVA (HackSprint'26)

**Mode:** Code frozen. Interrogation only.  
**Evidence base:** `feat/real-product` as shipped (Security spine + SQLite hostel shell).  
**Format:** Judge asks → **Strong answer (from reality)** → **Grade** → **If weak, why**.

Grading key: **A** sharp & honest · **B** acceptable · **C** hand-wavy · **F** invents unshipped claims.

---

# ROUND 1 — AI RESEARCHER

**Q1.** Why is person detection a solved proxy for “security intelligence”?  
**A:** It isn’t solved intelligence — it’s a *perception* layer. Intelligence is the rule engine (time, zone, dwell, group entry) + human resolve. YOLO only answers “is there a person-shaped blob?”  
**Grade: A**

**Q2.** Your behaviour labels (loiter, group entry) are heuristics. Where is the evaluation set and precision/recall?  
**A:** We do not claim ML classification metrics. Rules are deterministic thresholds. We self-check rules in `test_gate_rules` and demo on real Hikvision FOV. Accuracy = “warden finds the event useful,” not AUC.  
**Grade: A** — honesty wins; claiming PR curves would be F.

**Q3.** ByteTrack IDs can swap. How do you prevent false loitering from ID flicker?  
**A:** Dwell keys on `(zone_id, track_id)`; flicker can reset dwell. Cooldown + edge triggers reduce spam. We accept residual FP outdoors and demote severity (group entry = medium).  
**Grade: B** — knows the failure mode; no hard fix shipped.

**Q4.** Why not a temporal CNN / transformer for behaviour?  
**A:** Hackathon scope, CPU laptop, explainability. Black-box behaviour nets fail the “why?” question wardens ask. Rules are inspectable.  
**Grade: A**

**Q5.** COCO person on outdoor gate — domain gap?  
**A:** Yes. We use yolov8n; optional custom weights exist. We downscale 1440p. We do not claim domain-adapted SOTA.  
**Grade: A**

**Q6.** Night rule uses filename clock. Prove it isn’t wall-clock cheating.  
**A:** Hikvision stems embed `YYYYMMDDHHMMSS`; `_event_time` adds `POS_MSEC`. Daytime D03 does not fire night without Config override — verified.  
**Grade: A**

**Q7.** Camera health via mean luma — IR night scenes?  
**A:** Near-black streak heuristic; can FP on true night IR. Tunable; not a full tamper classifier.  
**Grade: B**

**Q8.** Why not multi-object classes (vehicle, bag)?  
**A:** YAGNI for hostel pedestrian gate narrative; vehicles add FP without identity workflow.  
**Grade: A**

**Q9.** Confidence scores on incidents?  
**A:** Severity bands + rule-fired certainty; no calibrated 0–1 probability shipped.  
**Grade: B** — gap acknowledged.

**Q10.** How do you stop alert storms on a festival crowd?  
**A:** IncidentEngine cooldown (~8s), crowd threshold in Config, warden Resolve. Not adaptive ML.  
**Grade: B**

**Q11.** Tracker returns ephemeral IDs when Ultralytics omits ids — doesn’t that poison temporal rules?  
**A:** Warm-up fallback so UI isn’t stuck at 0 people; group/loiter still prefer stable IDs when present. Tradeoff documented.  
**Grade: B**

**Q12.** Synthetic training vs real CCTV — what did you actually ship?  
**A:** Inference uses COCO/custom weights. Training pipeline exists in repo but demo path is production yolov8n on real footage.  
**Grade: A**

**Q13.** Occlusion at gate peaks?  
**A:** Misses happen; we don’t claim continuous tracks. Decision support ≠ perfect recall.  
**Grade: A**

**Q14.** Why polygons not tripwires?  
**A:** Polygons cover apron/flank; tripwires need calibrated direction — deferred as high FP outdoors.  
**Grade: A**

**Q15.** Adversarial: cardboard cutout / mannequin?  
**A:** CV alone fails; human verification + future QR/RFID. Privacy-first means we *won’t* deepen biometric CV.  
**Grade: A**

**Q16.** Frame drop under CPU — rules on sparse frames?  
**A:** ~11–13 FPS on D03 downscaled. Events may delay; not hard-real-time SOC.  
**Grade: A**

**Q17.** Dataset licensing for custom weights?  
**A:** Training docs/licenses in repo; demo defaults to Ultralytics COCO yolov8n.  
**Grade: B**

**Q18.** Can rules be camera-specific profiles?  
**A:** Zones JSON + env thresholds today; full per-camera profile store deferred.  
**Grade: B**

**Q19.** Explainability — is “reason” string enough for science?  
**A:** For wardens yes (what/where/when/action). For papers no — we are not submitting a paper.  
**Grade: A**

**Q20.** Failure you’d publish in a limitations section?  
**A:** Heuristic behaviour ≠ intent; outdoor FP; no calibrated confidence; single-cam demo.  
**Grade: A**

---

# ROUND 2 — PRODUCT MANAGER

**Q21.** Who is the buyer?  
**A:** Hostel administration / chief warden — not students. Students are SOS/leave actors.  
**Grade: A**

**Q22.** What job-to-be-done in one sentence?  
**A:** Help wardens notice and triage gate anomalies faster without invading student privacy.  
**Grade: A**

**Q23.** Why will they switch from plain CCTV monitors?  
**A:** CCTV is passive pixels; we push explainable incidents + resolve + SOS into one console.  
**Grade: A**

**Q24.** What’s out of scope that competitors fake?  
**A:** Face recognition, parent apps, Digital Twin, real SMS delivery.  
**Grade: A**

**Q25.** Trinity ERP vs GuardianAI — which is the product?  
**A:** GuardianAI security is the judging hero; Trinity is the ops shell. Dual brand is a presentation risk we manage by script.  
**Grade: B** — honest about risk.

**Q26.** Metric of success in 30 days of pilot?  
**A:** Median time from event → warden acknowledge; false-alert rate; SOS drill completion. Not “mAP.”  
**Grade: A**

**Q27.** Why laundry in a security product?  
**A:** Same login console for hostel ops; optional. Demo must not lead with it.  
**Grade: B**

**Q28.** Empty CCTV — product still valuable?  
**A:** Yes — heartbeat shows monitoring alive; “normal” is a security state.  
**Grade: A**

**Q29.** Onboarding a second hostel?  
**A:** New zones JSON, accounts, thresholds; not multi-tenant SaaS yet.  
**Grade: B**

**Q30.** Accessibility / non-English wardens?  
**A:** English UI; not localized. Gap.  
**Grade: C** if claimed otherwise; **B** if admitted.

**Q31.** Notification prefs without SMS — deceit?  
**A:** UI states external channels aren’t connected; in-app bell is real.  
**Grade: A** if said aloud.

**Q32.** What’s the 5-minute demo narrative?  
**A:** Security feed → explainable incident → privacy line → SOS cross-role → stop.  
**Grade: A**

**Q33.** Feature that should be deleted?  
**A:** Anything that competes with Security for judge attention (deep fee/mess theater).  
**Grade: A**

**Q34.** Parent consent UX — real?  
**A:** Prefill theater; not a verified integration.  
**Grade: A**

**Q35.** How do you prioritize backlog?  
**A:** Demo reliability > explainability > notification channels > multi-cam.  
**Grade: A**

**Q36.** What does “done” mean for MVP?  
**A:** Stable single-cam behaviour events + auth roles + SOS + resolve on real footage. Shipped.  
**Grade: A**

**Q37.** Adoption blocker #1?  
**A:** Zone calibration per camera + alert fatigue.  
**Grade: A**

**Q38.** Why wardens trust you vs vendor NVR analytics?  
**A:** Privacy stance + hostel workflow join (SOS/leave) + local control of data.  
**Grade: B**

**Q39.** Student surveillance optics?  
**A:** No faces, no ID from video, behaviour at perimeter; humans verify identity elsewhere.  
**Grade: A**

**Q40.** Roadmap slide — what must NOT appear?  
**A:** Face ID, emotion AI, “100% accurate,” Kubernetes.  
**Grade: A**

---

# ROUND 3 — STARTUP FOUNDER

**Q41.** What’s the wedge?  
**A:** Privacy-first hostel gate intelligence for India/campus hostels — not generic smart-city CV.  
**Grade: A**

**Q42.** TAM/SAM/SOM — numbers?  
**A:** We shouldn’t invent fake TAM on stage. Qualitative: thousands of college hostels; start with one campus pilot.  
**Grade: A** — refusing fake numbers is strength.

**Q43.** Who writes the cheque?  
**A:** College admin / facilities, sometimes IT. Warden is champion user.  
**Grade: B**

**Q44.** Pricing sketch?  
**A:** Not finalized; likely per-camera SaaS or on-prem appliance + support. Unshipped.  
**Grade: B**

**Q45.** Moat?  
**A:** Thin today — workflow + privacy narrative + hostel ops join. Moat is distribution via campuses, not YOLO.  
**Grade: A**

**Q46.** Why won’t Milestone/Hikvision crush you?  
**A:** They sell cameras/NVRs; we sell warden decision workflow + privacy constraints. Partner, don’t out-hardware.  
**Grade: B**

**Q47.** Unit economics on CPU inference?  
**A:** Single stream ~10–15 FPS laptop; edge box per gate is feasible. Not proven at 50 cams.  
**Grade: B**

**Q48.** Data network effects?  
**A:** Weak — and we refuse face datasets. Improve rules/zones, not surveillance dossiers.  
**Grade: A**

**Q49.** 18-month kill criteria?  
**A:** No paid pilot; alert fatigue; inability to calibrate zones without us on-site.  
**Grade: A**

**Q50.** Team risk?  
**A:** Hackathon team; production needs SRE + support. Admit.  
**Grade: A**

**Q51.** Open-source vs closed?  
**A:** Repo is project-open; commercial packaging undecided.  
**Grade: B**

**Q52.** Regulatory (DPDP India)?  
**A:** Minimisation: no biometrics from video; purpose limitation to security ops; access roles. Lawyer review not done.  
**Grade: B**

**Q53.** Sales cycle length?  
**A:** Campus = slow (months). Hackathon ≠ GTM proof.  
**Grade: A**

**Q54.** Why SQLite in a startup pitch?  
**A:** Correct for single-site MVP; Postgres when multi-site. Not a forever choice.  
**Grade: A**

**Q55.** Defensibility of rule engine?  
**A:** Low alone; with calibrated ops playbooks + integrations (RFID) higher.  
**Grade: A**

**Q56.** What would you not build even with funding?  
**A:** Facial recognition. Hard product law.  
**Grade: A**

**Q57.** Internationalization?  
**A:** Not started.  
**Grade: B** if honest.

**Q58.** Hardware partnership ask?  
**A:** Compatible with existing Hikvision RTSP later; today file/webcam.  
**Grade: B**

**Q59.** Support burden of false alerts?  
**A:** Real cost; severity demotion + resolve + thresholds. Still the #1 churn risk.  
**Grade: A**

**Q60.** Exit narrative?  
**A:** Premature. Focus pilot.  
**Grade: A**

---

# ROUND 4 — SECURITY EXPERT

**Q61.** Threat model?  
**A:** LAN demo: session theft, privilege escalation, open stream (mitigated), shared hostel JSON PII, insider warden misuse. Not nation-state.  
**Grade: A**

**Q62.** MJPEG `?token=` in query string?  
**A:** Leaks via logs/Referer; acceptable for local demo; production needs cookie-only or short-lived signed URL.  
**Grade: A**

**Q63.** WebSocket any authenticated role?  
**A:** Yes — gap. UI hides; API allows. Production: Warden-only WS.  
**Grade: A**

**Q64.** `require_warden` means any session — footgun?  
**A:** Naming debt; real gates use `require_role`.  
**Grade: A**

**Q65.** Password storage?  
**A:** PBKDF2 in SQLite users store.  
**Grade: A**

**Q66.** Demo passwords on login UI?  
**A:** Hackathon convenience; strip for any public deploy.  
**Grade: A**

**Q67.** SQL injection?  
**A:** Parameterized SQLite; login not string-concat SQL. Probed.  
**Grade: A**

**Q68.** XSS via chat?  
**A:** Keyword replies; React escaping; no HTML shell. Probed.  
**Grade: A**

**Q69.** CSRF?  
**A:** Bearer + SameSite=Lax cookies; LAN assumption.  
**Grade: B**

**Q70.** Audit trail completeness?  
**A:** login/SOS/resolve/config/source audited; not every hostel patch.  
**Grade: B**

**Q71.** Session fixation / logout?  
**A:** Token removed server-side on logout; in-memory store — restart kills all.  
**Grade: B**

**Q72.** Multi-tenant isolation?  
**A:** None — single hostel_state blob.  
**Grade: A** if admitted.

**Q73.** Supply chain (Ultralytics weights)?  
**A:** Local weights; pin versions in requirements for prod.  
**Grade: B**

**Q74.** Physical security of laptop running NVR AI?  
**A:** On-prem risk; disk encryption / access control = ops, not app.  
**Grade: A**

**Q75.** Prompt injection on chat?  
**A:** Not an LLM — keyword router over live data.  
**Grade: A**

**Q76.** Can student escalate to resolve incidents?  
**A:** No — 403 on incidents API. Probed.  
**Grade: A**

**Q77.** SOS append bypass?  
**A:** Blocked; only `/api/hostel/sos`. Probed.  
**Grade: A**

**Q78.** Log PII?  
**A:** Hostel seed has phones; security incidents avoid identities.  
**Grade: B**

**Q79.** Rate limiting login?  
**A:** Not shipped. Brute-force risk on exposed deploy.  
**Grade: B**

**Q80.** Secure SDLC?  
**A:** Hackathon RC probes + honesty tests; not full pentest.  
**Grade: A**

---

# ROUND 5 — HOSTEL WARDEN

**Q81.** I get 200 alerts a night — then what?  
**A:** Raise thresholds, shrink restricted flank, Resolve aggressively, demote group-entry. If still noisy, turn rules off per camera. Product must not shame you for silencing.  
**Grade: A**

**Q82.** Student at gate with valid outpass — AI still alerts?  
**A:** Yes today — CV doesn’t know outpass. You check Leave module / guard. Future: RFID join, not face.  
**Grade: A**

**Q83.** Power cut?  
**A:** Pipeline stops; SQLite keeps history; no offline edge buffer shipped.  
**Grade: B**

**Q84.** Internet down?  
**A:** Local stack still works; no cloud dependency for core.  
**Grade: A**

**Q85.** Night guard can’t use dashboard — SMS?  
**A:** Not connected. In-app + WS only. Honest gap.  
**Grade: A**

**Q86.** Can I trust “group entry” as tailgating?  
**A:** No — we renamed it. Friends walking together ≠ criminal piggyback.  
**Grade: A**

**Q87.** Who calibrates zones when camera moves?  
**A:** Today: edit JSON / redeploy. Painful — known adoption risk.  
**Grade: A**

**Q88.** False accusation of a student?  
**A:** We never name students from video. Track IDs only. Humans verify.  
**Grade: A**

**Q89.** Laundry staff seeing security?  
**A:** Nav/API blocked.  
**Grade: A**

**Q90.** Emergency — one big red button?  
**A:** SOS creates critical incident + notification.  
**Grade: A**

**Q91.** Multiple gates?  
**A:** Architecture has camera_id; UI demo is one stream.  
**Grade: B**

**Q92.** Training my staff?  
**A:** Resolve workflow + severity meaning; 30-minute drill.  
**Grade: B**

**Q93.** Rain / umbrella crowd FP?  
**A:** Likely; tune crowd threshold.  
**Grade: A**

**Q94.** Will this replace guards?  
**A:** No — assist. Guards still verify.  
**Grade: A**

**Q95.** Data retention — how long incidents?  
**A:** Bounded history in engine + SQLite; no formal retention policy UI.  
**Grade: B**

**Q96.** Can parents sue for camera AI?  
**A:** Legal depends on notice/consent; we minimise biometrics. Not legal advice.  
**Grade: B**

**Q97.** What if AI misses a real fight?  
**A:** Possible. CCTV still recorded in NVR; AI is assist not guarantee.  
**Grade: A**

**Q98.** Hindi UI?  
**A:** Not yet.  
**Grade: B**

**Q99.** Cost to me personally?  
**A:** Institution buys; your cost is attention to alerts.  
**Grade: A**

**Q100.** Why should I care tomorrow morning?  
**A:** Faster triage at the gate you already watch — without turning the hostel into a face database.  
**Grade: A**

---

# INTERRUPT ROUNDS (cross-fire)

**Q101. (AI)** Isn’t this just OpenCV tutorials glued to React?  
**A:** Glue is the product: footage clock, gate zones, explainable lifecycle, RBAC, SOS→incident, real persistence. Tutorials don’t ship that honesty.  
**Grade: A**

**Q102. (PM)** Show me a user who asked for Analytics empty states.  
**A:** Judges and wardens need “system alive” when FOV is empty — that’s the user.  
**Grade: A**

**Q103. (Founder)** You’re optimizing for hackathon judges not customers.  
**A:** True for this weekend. Pilot success metrics differ — we separate them.  
**Grade: A**

**Q104. (Security)** Prove Student cannot read incidents.  
**A:** Live probe 403 on `/api/incidents`.  
**Grade: A**

**Q105. (Warden)** Your zones don’t match my gate paint marks.  
**A:** Expected — polygons are approximate; recalibrate before production. Demo uses flank+apron profile.  
**Grade: A**

**Q106. (AI)** Quantify false positive rate on D03.  
**A:** Not formally measured end-to-end; qualitative demo + rule unit tests only.  
**Grade: B** — must not invent %.

**Q107. (PM)** Kill feature: chatbot. Defend.  
**A:** Keyword assist over live data helps judges query without SQL; not core. Can hide.  
**Grade: B**

**Q108. (Founder)** Competition: “AI hostel app” on Play Store.  
**A:** Most are ERP; few do privacy-constrained gate behaviour with real CCTV pipeline. Differentiate on security honesty.  
**Grade: B**

**Q109. (Security)** Is the database encrypted at rest?  
**A:** No. OS disk encryption recommended.  
**Grade: A**

**Q110. (Warden)** Student triggers SOS as prank.  
**A:** Audit who triggered; social policy + warden follow-up. Technical rate-limit not shipped.  
**Grade: B**

**Q111. (AI)** Why not pose estimation for fights?  
**A:** Unreliable outdoors, privacy optics, FP hell — deferred.  
**Grade: A**

**Q112. (PM)** Accessibility for colour-blind severity?  
**A:** Text + labels; not fully audited WCAG.  
**Grade: B**

**Q113. (Founder)** What’s your unfair advantage this weekend?  
**A:** Real Hikvision footage + willingness to demote fake claims (no faces, group≠tailgate).  
**Grade: A**

**Q114. (Security)** Dependency vulnerabilities scanned?  
**A:** Not fully (pip-audit deferred). Risk accepted for demo LAN.  
**Grade: B**

**Q115. (Warden)** Can I export incident report for principal?  
**A:** Analytics counts + CSV on dashboard summary; full forensic export limited.  
**Grade: B**

**Q116. (AI)** Model update process?  
**A:** Swap `GUARDIAN_MODEL` weights; restart. No OTA.  
**Grade: A**

**Q117. (PM)** Success theater — seeded hostel % — ethical?  
**A:** Seed until mutated; we label Live persistence; don’t claim campus integration.  
**Grade: A**

**Q118. (Founder)** If you win, first hire?  
**A:** Someone who calibrates cameras with wardens (solutions) + hardening auth.  
**Grade: A**

**Q119. (Security)** Privilege of laundry patching lost-and-found?  
**A:** Intentional ops role; not security.  
**Grade: A**

**Q120. (All)** Why do you deserve to win?  
**A:** We built a coherent, privacy-constrained, demo-stable decision-support system on real CCTV — and we refuse the easy lie of face recognition.  
**Grade: A** if delivery is calm and evidenced on stage.

---

# GRADING SUMMARY (answer quality if delivered as above)

| Judge | Avg answer quality |
|-------|-------------------|
| AI Researcher | A/B |
| Product Manager | A |
| Startup Founder | A/B |
| Security Expert | A/B |
| Hostel Warden | A |

**Weakest recurring trap:** inventing accuracy %, SMS, multi-cam UI, or face roadmap.

---

# FINAL SCORES (jury deliberation)

| Scorecard | /10 | Notes |
|-----------|----:|-------|
| **Overall Presentation** | **8.4** | Wins if Security-first; loses if ERP tour |
| **Technical** | **8.6** | Real pipeline, auth, persistence, tests |
| **Innovation** | **7.8** | Innovation = privacy + explainability stance, not novel NN |
| **Business** | **6.5** | Honest early; GTM thin |
| **Judge Confidence** | **8.2** | High for hackathon; not production SOC |
| **Probability of Winning** | **~35–45%** | Field-dependent; strong finalist odds if narrative holds |

### Most likely reason you **lose**
Another team ships a flashier demo **or** you overclaim (faces, 99% accuracy, real SMS) **or** empty CCTV without heartbeat/seek makes AI look dead **or** ERP digression.

### Most likely reason you **win**
Judges believe: *“This helps a warden act faster without turning students into a face database”* — evidenced by live gate incidents, explainable cards, SOS, and disciplined honesty.

### Final recommendation
**Present as privacy-first security intelligence. Show Security. Tell the truth. Stop talking before you invent.**

---

*Viva generated against frozen `feat/real-product` product truth. No code changes.*
