# Medical Vision Assistant

An end-to-end, full-stack AI platform that analyzes chest X-ray images and
demonstrates: disease classification, explainable AI (Grad-CAM), automated
report generation, and a patient-history research dashboard.

**Stack:** Next.js 15 + TypeScript + Tailwind + shadcn/ui (frontend) ·
FastAPI + PostgreSQL + SQLAlchemy (backend) · PyTorch, DenseNet121, ViT,
Grad-CAM (AI/ML) · Docker + Docker Compose (infra).

---

## Getting Started

### Option A: Docker Compose (recommended)

```bash
cd docker
cp .env.example .env
docker compose up --build
```

This starts:

- **frontend** → http://localhost:3000
- **backend** → http://localhost:8000 (docs at `/docs`)
- **postgres** → localhost:5432

### Option B: Run locally without Docker

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Make sure PostgreSQL is running locally and DATABASE_URL in .env matches
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Verify it's working

- Frontend landing page: http://localhost:3000
- Backend root: http://localhost:8000 → `{"message": "Medical Vision Assistant API", ...}`
- Backend health + DB check: http://localhost:8000/api/v1/health
- Interactive API docs (Swagger): http://localhost:8000/docs

---

## Disclaimer

This project is built strictly for **educational and research**
purposes. It is not FDA-cleared, not CE-marked, not validated against any
clinical ground truth beyond public benchmark datasets, and should never be
used to make real medical decisions.
