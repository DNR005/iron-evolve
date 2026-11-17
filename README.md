# FORGE AI — Forge Your Strongest Self

[![React 19](https://img.shields.io/badge/Frontend-React_19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Django 6](https://img.shields.io/badge/Backend-Django_6_REST-092e20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Ollama](https://img.shields.io/badge/AI_Engine-Ollama_Qwen3--1.7B-black?style=for-the-badge&logo=ollama)](https://ollama.com/)
[![Vite 8](https://img.shields.io/badge/Bundler-Vite_8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

**FORGE AI** is an intelligent full-stack fitness command center designed with an Iron Man / JARVIS and Batman dark-tech aesthetic. It pairs high-performance resistance training protocols and macro intelligence with a local AI assistant powered by Ollama.

---

## ⚡ Core Features

### 1. Command Center (`/`)
- **Today's Mission**: Daily workout objective, target muscle groups, estimated duration, volume breakdown, and progressive overload targets.
- **Biometric HUD**: Real-time tracking of calories, protein, hydration, BMI category, training streak, and body weight.
- **Data Visualizations**: 7-day weekly training load bar chart and 6-month historical weight trend powered by Recharts.
- **Recent Telemetry**: Chronological feed of logged meals, PRs, and completed sessions.

### 2. Tactical Workouts & Custom Protocol Builder (`/workouts`)
- **7 Pre-Engineered Programs**: Push, Pull, Legs, Upper, Lower, Bro Split, and Arnold Split.
- **Exercise Cards**: Target muscle, sets, reps, rest intervals, and difficulty tier.
- **Custom Builder**: Searchable exercise database to forge, configure, and save personalized training routines to the backend database.

### 3. Nutrition & Hydration Command (`/nutrition`)
- **Food Logging Matrix**: Instant food logger with pre-calculated macros (Calories, Protein, Carbs, Fats) and database persistence.
- **Hydration Array**: Interactive 250ml water intake tracker with progress indicators.
- **Daily Targets**: Visual progress gauges against daily caloric and macro ceilings.

### 4. FORGE AI Neural Assistant (`/assistant`)
- **Local AI Engine**: Powered by **Ollama** running `hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0`.
- **Jarvis-Style HUD Interface**: Fast conversational assistant for custom workout splits, calorie planning, fat-loss advice, and exercise cues.
- **Dual Architecture**: Zero-latency local LLM with deterministic biomechanical fallback if the local service is offline.
- **Chat Persistence**: Full conversation history stored in SQLite via Django REST Framework.

### 5. Progress Analytics (`/progress`)
- 6-month weight trends with interactive tooltips.
- Weekly workout consistency analysis and macro distribution pie charts.
- Gamified achievement badges (*Iron Streak*, *Century Club*, *Protein Machine*, *Two Plate Bench*).

### 6. BMI & Health Optimization (`/bmi`)
- Instant calculation based on height, weight, age, and gender.
- Live category indicators (Underweight, Normal, Overweight, Obese).
- Suggested caloric budgets for cutting, maintaining, and bulking.

### 7. System Settings (`/settings`)
- Warrior callsign, email, primary directive, and experience level.
- Biometric calibrations (height, current weight, target weight).
- Measurement standard toggle (Metric vs. Imperial) and HUD audio preferences.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, TanStack Start & Router, Radix UI, Lucide Icons, Recharts |
| **Backend** | Python 3.14, Django 6, Django REST Framework, SQLite, django-cors-headers |
| **AI Inference** | Ollama (`hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0`) |
| **Build Tooling** | Vite 8, Nitro Server |
| **Automation** | Windows Batch Launcher (`start.bat`) |

---

## 🚀 Quick Start (Single Windows Launcher)

The fastest way to launch the entire application (Backend + Frontend + Ollama) is the included single-click launcher:

```cmd
.\start.bat
```

### What `start.bat` executes automatically:
1. **Ollama Check**: Detects if Ollama is running on port `11434`; starts `ollama serve` if needed and verifies the `Qwen3-1.7B` model.
2. **Python Environment**: Verifies `backend\venv`, creates it if missing, and installs all dependencies from `requirements.txt`.
3. **Database Migration & Seed**: Applies Django database migrations and seeds pre-built splits, meals, and default profiles.
4. **Spawns Backend Core**: Starts the Django API server on `http://127.0.0.1:8000/api/` in a dedicated terminal.
5. **Spawns Frontend Core**: Starts Vite development server on `http://localhost:3000` in a dedicated terminal.
6. **Browser Auto-Launch**: Opens `http://localhost:3000` automatically in your default browser.

---

## 💻 Manual Setup & Development

If you prefer running services manually in separate terminals:

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **Python** (3.11+)
- **Ollama** installed with the model:
  ```sh
  ollama pull hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0
  ```

### 2. Backend Setup (Django)
```sh
cd backend
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend Setup (React + Tailwind)
```sh
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:8080` (or `http://localhost:3000`) and communicate with Django at `http://127.0.0.1:8000/api/`.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard/` | `GET` | Aggregated dashboard metrics, macros, streak, and recent logs |
| `/api/workouts/` | `GET`, `POST` | List preset splits or save a new custom workout routine |
| `/api/workouts/<slug>/` | `GET`, `DELETE` | Retrieve or delete a workout protocol |
| `/api/nutrition/items/` | `GET`, `POST` | List logged meals or log a new meal item |
| `/api/nutrition/items/<id>/` | `DELETE` | Remove a logged meal from database |
| `/api/nutrition/goals/` | `GET`, `PATCH` | Retrieve or update daily calorie/macro/hydration goals |
| `/api/weight/` | `GET`, `POST` | Retrieve weight history or record new bodyweight |
| `/api/settings/` | `GET`, `PATCH` | Retrieve or update user profile parameters and biometrics |
| `/api/ai/chat/` | `GET`, `POST` | Fetch chat history or submit a query to Ollama Qwen3-1.7B |

---

## 📂 Project Structure

```
iron-evolve/
├── backend/                       # Django Backend
│   ├── api/                       # DRF Application
│   │   ├── management/commands/   # Database seed commands
│   │   ├── migrations/            # Django database migrations
│   │   ├── models.py              # Workouts, Nutrition, Settings, Chat models
│   │   ├── serializers.py         # DRF Serializers
│   │   ├── urls.py                # API routing
│   │   └── views.py               # API Views & Ollama LLM integration
│   ├── forge_backend/             # Django settings & root URLs
│   ├── manage.py                  # Django CLI
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── forge/             # AppShell, Navigation, Panels, StatCards
│   │   │   └── ui/                # Radix UI design system primitives
│   │   ├── lib/
│   │   │   ├── api.ts             # Centralized API client connecting to Django
│   │   │   └── forge-data.ts      # Static workout library & fallback datasets
│   │   ├── routes/                # File-based TanStack routes
│   │   │   ├── index.tsx          # Command Center / Dashboard
│   │   │   ├── workouts.tsx       # Programs & Custom Builder
│   │   │   ├── nutrition.tsx      # Macro & Hydration Tracker
│   │   │   ├── assistant.tsx      # FORGE AI (Ollama Local Chat)
│   │   │   ├── progress.tsx       # Charts & Badges
│   │   │   ├── bmi.tsx            # BMI Calculator
│   │   │   └── settings.tsx       # Biometrics & Preferences
│   │   └── styles.css             # Tailwind CSS v4 design tokens & glow utilities
│   ├── public/                    # Static assets & icons
│   ├── vite.config.ts             # Vite bundler configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── package.json               # Node dependencies & scripts
│
├── start.bat                      # 1-click Windows launcher for Ollama, Django & React
└── README.md                      # Documentation & API reference
```

---

## 🔒 Security

Personal access tokens and local environment variables are never committed to version control. SQLite databases (`*.sqlite3`) and Python virtual environments (`backend/venv`) are ignored via `.gitignore`.
