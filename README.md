# 🛡️ Hostel Surveillance System & AI Assistant

An intelligent, real-time surveillance and monitoring ecosystem combined with an AI-driven chatbot assistant designed for university and residential hostels.

---

## 📌 Problem Statement

Hostels often face key security, operational, and management challenges:
1. **Security & Anomaly Detection Gaps**: Traditional CCTV setups require manual 24/7 monitoring, making it difficult to detect intrusions, unauthorized visitors, fights, or unexpected night movements in real time.
2. **Access Control & Attendance Bottlenecks**: Manual registers or manual gate checks lead to long queues, proxy entries, and poor record accuracy.
3. **Delayed Incident Escalation**: Security personnel and hostel wardens are often alerted *after* an incident has occurred rather than receiving proactive, real-time alerts.
4. **Communication & Support Overhead**: Wardens and staff are overwhelmed with repetitive student queries regarding hostel rules, leave approvals, maintenance requests, and announcements.

---

## 💡 Proposed Solution

The **Hostel Surveillance System & AI Assistant** addresses these challenges by merging automated computer vision pipeline with a dedicated multi-role AI Chatbot Assistant:

* **Real-time Computer Vision Monitoring**: Continuous stream ingestion for facial recognition, unauthorized area intrusion detection, and anomaly/incident alerting.
* **Smart Attendance & Entry Logging**: Automated log generation for student entry/exit at hostel gates using face recognition technology.
* **Instant Warden & Admin Alerts**: Automated alerts and notifications sent to security leads and wardens upon detecting high-risk events.
* **Dual-Role AI Chatbot Assistant**:
  * **Student Portal**: Handles rule queries, emergency reporting, maintenance requests, and leave status updates.
  * **Admin/Warden Portal**: Provides real-time activity summaries, query analytics, automated logs, and incident report triage.

---

## 🏗️ System Architecture & Pipeline

```
┌─────────────────┐      ┌──────────────────────────┐      ┌─────────────────────────┐
│  CCTV / Video   ├─────►│  CV Processing Pipeline  ├─────►│  Alert & Incident Engine│
│   Camera Feeds  │      │ (YOLO / OpenCV / FaceId) │      │ (WebSockets / Push/SMS) │
└─────────────────┘      └────────────┬─────────────┘      └─────────────────────────┘
                                      │
                                      ▼
┌─────────────────┐      ┌──────────────────────────┐      ┌─────────────────────────┐
│ Student / Admin │─────►│  AI Chatbot Assistant    ├─────►│  Database & Logs        │
│ Interfaces (Web)│      │ (LLM / RAG / Rule Engine)│      │ (Users, Logs, Incidents)│
└─────────────────┘      └──────────────────────────┘      └─────────────────────────┘
```

### End-to-End Pipeline Workflow:
1. **Video Stream Acquisition**: Ingest RTSP / webcam live streams into the processing queue.
2. **Vision Analysis Pipeline**:
   - **Object & Person Detection**: Track movements across designated zones.
   - **Facial Recognition**: Match against registered student and staff embeddings for gate logging.
   - **Anomaly & Motion Rules**: Trigger flags for curfew violations or restricted area entry.
3. **Alert & Event Dispatcher**: Send instant notifications to wardens for flagged incidents.
4. **Interactive AI Assistant**: Process natural language queries from students (guidelines, leave forms) and admins (security reports, attendance summaries).

---

## 🗺️ Roadmap & Implementation Plan

- [x] **Phase 1: Project Architecture & Workflow Planning**
  - Define system pipeline, database schemas, and branch workflow.
  - Integrate project development guidelines ([AGENTS.md](file:///d:/Hackathons/HACKSPRINT/AGENTS.md)).
- [ ] **Phase 2: Core Vision Pipeline**
  - Implement camera stream ingestion module.
  - Integrate facial recognition & attendance logging system.
  - Implement anomaly and intrusion detection logic.
- [ ] **Phase 3: AI Chatbot Assistant**
  - Develop student query assistant (hostel rules, FAQs, leave requests).
  - Develop warden dashboard assistant (log queries, incident summaries).
- [ ] **Phase 4: Web Dashboard & Integration**
  - Build responsive administrative control panel with live camera stats and incident logs.
  - Build student self-service web dashboard.
- [ ] **Phase 5: Testing, Optimization & Deployment**
  - Conduct end-to-end latency testing and performance tuning.
  - Deploy MVP for live demonstration.

---

## 🌿 Git Branch Structure

- `main` - Production-ready, stable codebase (Default Branch).
- `prithic` - Active development branch.
- `sharan` / `tk` - Feature & experimental branches.

---

## 🛠️ Development Guidelines

This project follows the **Ponytail** engineering philosophy defined in [`AGENTS.md`](file:///d:/Hackathons/HACKSPRINT/AGENTS.md):
- **YAGNI & Reuse**: Prioritize standard library and existing platform capabilities before adding dependencies.
- **Root-Cause Fixes**: Resolve shared utility logic rather than applying superficial patches.
- **Shortest Working Diffs**: Write minimal, clean, and maintainable code.
