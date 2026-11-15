# MARSBASE: BEYOND EARTH
### Mission Control & Survival Simulator — Junior Astronaut Mission Trainer
**Developed for the NASA Space Apps Challenge 2026**

[![NASA Space Apps](https://img.shields.io/badge/NASA_Space_Apps-2026_Challenge-FF754F.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](#)
[![React](https://img.shields.io/badge/React-18.3-50D9EA.svg)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8.svg)](#)
[![SQLite](https://img.shields.io/badge/Database-SQLite_Prisma-61D69A.svg)](#)
[![Google Gemini API](https://img.shields.io/badge/AI-Google_Gemini-FFA085.svg)](#)

> *"Humanity's next home is not a destination. It's a responsibility."*

---

## 🚀 1. Project Overview & Challenge Statement

**MARSBASE: BEYOND EARTH** is an immersive, full-stack educational Mars colony management and survival simulator created for the **NASA Space Apps Challenge 2026: Build a Junior Astronaut Mission Trainer**.

The mission challenges students to step into the boots of the **Mars Mission Commander** stationed at Chryse Planitia Base. Over **30 simulated Martian Sols**, commanders must balance genuine closed-loop life-support physics, manage electrical power grids, harvest hydroponic crops, maintain habitat structural integrity, protect a crew of 4 astronauts from lethal cosmic radiation, and make critical engineering decisions during sudden emergencies.

Every command directly manipulates an empirical backend simulation engine backed by SQLite persistence. If resources deplete or emergencies are neglected, the habitat fails; if balance is maintained, the commander achieves full mission certification.

---

## 🌌 2. Core Features

### 🖥️ A. Futuristic NASA-Inspired Mission Control HUD
- **Palette**: Deep space black (`#080D18`), Mars rust orange (`#FF754F`), electric cyan (`#50D9EA`), and warning ambers.
- **HUD Telemetry Array**: 7 animated circular gauges tracking **Oxygen**, **Water**, **Food**, **Electrical Power**, **Cosmic Radiation**, **Crew Morale**, and **Habitat Integrity**.
- **Audio Synthesizer**: Web Audio API sound effects for telemetry clicks, subsystem activations, emergency sirens, and Sol transitions (with persistent mute toggle).
- **Interactive Mars Colony Topography**: Clickable facilities (Central Inflatable Dome, MOXIE Oxygen Plant, ECLSS Hydrological Plant, Photovoltaic Arrays, Hydroponic Greenhouse, Deep Space Comms Antenna, and Sub-Regolith Radiation Vault) with diagnostic condition telemetry and direct action triggers.
- **Cinematic Sol Advance Sequence**: Advances Martian time with diurnal consumption and generation calculations.

### ⚙️ B. Rigorous Simulation Engine & Engineering Trade-Offs
- **Realistic Closed-Loop Physics**:
  - `MOXIE Oxygen Overcharge`: Solid-oxide electrolysis of atmospheric CO2; generates Oxygen at the cost of electrical wattage.
  - `ECLSS Water Distillation`: Catalytic closed-loop purification of greywater; produces potable water with power consumption.
  - `Hydroponic Greenhouse Harvest`: Aeroponic nutrient delivery; consumes water and power to yield caloric nutrition.
  - `Pneumatic Dust Clearing`: Blows electrostatic Martian dust off photovoltaic arrays to restore battery generation.
  - `Active Magnetic Deflector Grid`: Discharges superconducting coils to deflect solar protons and cosmic rays.
  - `Basalt-Fiber Structural Sealant`: Repairs micrometeorite hull fissures to preserve atmospheric pressure.
  - `Psychological Rest Protocol`: Earth video uplink and luxury rations to boost crew morale.
- **Failure Conditions**: Mission failure triggers if any consumable (O2, H2O, Food, Power) reaches 0%, if Habitat Integrity breaches, if Crew Morale collapses, or if Radiation exceeds 100%.

### 🚨 C. Dynamic Emergency Response Center
Simulates real Martian environmental hazards with interactive tactical choices:
1. **Global Dust Storms**: Solar irradiance drops by 75%; choose between battery conservation or robotic panel cleaning.
2. **Airlock Seal Breaches**: Rapid decompression; choose bulkheads isolation, rapid EVA patch, or MOXIE overdrive.
3. **ECLSS Catalytic Membrane Clogging**: Brine precipitation; flush with acid or drill subsurface glacial ice.
4. **Coronal Mass Ejections (Class X-12 SPE)**: High-energy protons; retreat to the 4m subsurface regolith vault or overcharge superconducting coils.
5. **Hydroponic Thermal Inversion**: Crop freezing; deploy infrared heat lamps or pivot to spirulina algae vats.
6. **Coolant Loop Cavitation**: Thermal pump vibration; bleed circuits or deploy accordion radiators.
7. **Circadian Confinement Fatigue**: Shift schedules and broadcast Earth uplinks.

### 🤖 D. ARES — AI Mission Advisor (Gemini API + Dual-Engine Fallback)
- **ARES** (*Astronaut Resource Evaluation System*):
  - Queries `POST /api/ai/advisor`.
  - Securely accesses actual mission state from the server (never relies on client-provided values).
  - Delivers situation analyses, critical risk identification, tactical recommendations, and real NASA aerospace science principles.
  - **Dual-Engine Security**: When `GEMINI_API_KEY` is configured in `server/.env`, it leverages Google's Gemini LLM. If unconfigured or offline, it seamlessly falls back to a deterministic, rule-based expert advisor.

### 📊 E. Flight Telemetry Analytics & Mission Debrief
- **Interactive Recharts Visualizations**:
  - Time-series tracking of O2, H2O, Food, and Power reserves across Sols.
  - Radiation flux area chart.
  - Crew morale vs. hull integrity curves.
  - Sol range filtering (All Sols vs. Recent 7 Sols).
- **Official Mission Debrief Report**:
  - Survival score out of 1000 and flight grade (`S`, `A`, `B`, `C`, `F`).
  - Diagnostic breakdown of commander strengths, tactical vulnerabilities, and educational aerospace lessons.
  - Printable official flight report formatted for NASA evaluation.

### 📚 F. Educational Science Mode & NASA Glossary
- Integrated **Science Explainer** modals for every subsystem and anomaly explaining the real science behind MOXIE, ECLSS, Sabatier reactions, regolith shielding, and astronaut psychology.
- Searchable **Space Exploration Glossary** with official NASA mission and research citations.

---

## 🛠️ 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, Canvas Confetti |
| **Backend** | Node.js, Express.js, TypeScript, REST API Architecture |
| **Database** | SQLite, Prisma ORM (automatic schema migrations & relations) |
| **AI Integration** | Google Gemini API with intelligent local rule-based fallback |
| **Audio** | HTML5 Web Audio API synthesizer (no external audio assets required) |

---

## ⚡ 4. Quickstart Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher — tested on Node v20.18.0)
- **npm** (v9.0.0 or higher)

### 1. Clone or Open the Workspace
```bash
cd "c:\Users\dell\Downloads\NASA SPACE APP HACKATHON"
```

### 2. Install Dependencies
Run the installation command from the repository root:
```bash
npm run install:all
```
*(Or navigate into `server/` and run `npm install`, then into `client/` and run `npm install`)*

### 3. Initialize the Database
Generate Prisma Client and push the schema to SQLite:
```bash
npm run prisma:setup
```

### 4. Configure Environment Variables (Optional Gemini API Key)
Copy the example environment file in the `server` directory:
```bash
cp server/.env.example server/.env
```
Inside `server/.env`:
```ini
PORT=5000
DATABASE_URL="file:./dev.db"

# Optional: Add your Google Gemini API key to activate the live LLM
# If left blank, the built-in deterministic ARES Rule-Based Advisor operates automatically!
GEMINI_API_KEY=""
```

### 5. Launch the Application

**Option A — Run Both Concurrently (Separate Terminals):**

*Terminal 1 (Backend Server):*
```bash
cd server
npm run dev
```
*Server starts on `http://localhost:5000`*

*Terminal 2 (Frontend Client):*
```bash
cd client
npm run dev
```
*Client starts on `http://localhost:5173`*

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📡 5. API Reference

All backend endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & Gemini configuration status |
| `POST` | `/api/missions` | Initialize new mission (`name`, `commanderName`, `difficulty`) |
| `GET` | `/api/missions` | Retrieve list of all missions |
| `GET` | `/api/missions/:id` | Fetch specific mission with current resources, actions, events |
| `POST` | `/api/missions/:id/advance-day` | Advance simulation Sol (+1 Day) and evaluate consumption & events |
| `POST` | `/api/missions/:id/pause` | Pause mission simulation clock |
| `POST` | `/api/missions/:id/resume` | Resume active mission simulation clock |
| `POST` | `/api/missions/:id/restart` | Reset mission to baseline Sol 1 |
| `GET` | `/api/missions/:id/actions` | Retrieve available life support actions and history |
| `POST` | `/api/missions/:id/actions` | Execute system action with atomic resource validation |
| `GET` | `/api/missions/:id/events` | Fetch all active and resolved emergency incidents |
| `POST` | `/api/missions/:id/events/:eventId/respond` | Authorize tactical directive to resolve an emergency |
| `GET` | `/api/missions/:id/analytics` | Fetch historical daily snapshots for Recharts graphs |
| `GET` | `/api/missions/:id/report` | Generate comprehensive mission debrief and score report |
| `POST` | `/api/ai/advisor` | Query ARES Mission Advisor with current verified telemetry |
| `GET` | `/api/science/glossary` | Get space exploration glossary and NASA citations |

---

## 🧪 6. Educational Science & NASA Methodology

### Disclaimer
*MARSBASE: BEYOND EARTH is an educational simulation developed for the NASA Space Apps Challenge 2026. Simulation values are simplified educational approximations (0-100% metrics) designed to teach students closed-loop thermodynamics and decision-making under resource constraints. It is not official NASA mission flight software.*

### Scientific Principles Modeled
- **Electrolysis & ISRU (MOXIE)**: Extracting oxygen directly from atmospheric carbon dioxide ($2\text{CO}_2 \rightarrow 2\text{CO} + \text{O}_2$) at high temperatures over solid-oxide ceramic tubes.
- **Closed-Loop Water Distillation (ECLSS)**: Recovering humidity condensate and hygiene wastewater via vapor compression distillation and catalytic oxidation (achieving >98% efficiency on the ISS).
- **Controlled Environment Agriculture (CEA)**: Dwarf cultivars (such as Apogee wheat) cultivated in aeroponic root chambers with tailored LED light recipes.
- **Ionizing Radiation Mitigation**: Passive shielding via high-hydrogen materials (water bladders) and dense in-situ regolith overburden, supplemented by active magnetic deflectors during solar particle events.

---

## 🏆 NASA Space Apps Challenge 2026 Submission Team
*Built with passion for space exploration, science education, and the next generation of Martian pioneers.*
