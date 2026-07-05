# ⚖️ ClauseProof — SME IPO Compliance-as-Code Operating System

[![SEBI TechSprint](https://img.shields.io/badge/SEBI_Securities_Market_TechSprint-Problem_Statement_4-6366f1?style=for-the-badge&logo=shield)](https://sebi.gov.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Stack: React + TS + FastAPI](https://img.shields.io/badge/Stack-React_18_%7C_TypeScript_%7C_FastAPI_%7C_PostgreSQL-3b82f6?style=for-the-badge)](https://github.com)

**ClauseProof** is a production-ready RegTech platform engineered for **SEBI Securities Market TechSprint (Problem Statement 4)**. It transforms the drafting and review of Draft Red Herring Prospectuses (DRHP) for Small and Medium Enterprises (SMEs) from an opaque, intermediary-dependent process into a transparent, deterministic, and auditable operating system.

---

## 🌟 Key Architectural Innovations

### 1. 🔍 Deterministic Rule Engine (No AI Hallucination)
Unlike generic LLM wrappers that attempt to "self-validate" legal compliance with prompts, ClauseProof features a **deterministic mathematical and logical engine** in Python (`backend/app/core/rule_engine.py`).
*   **Regulation 229 Eligibility Check:** Verifies positive operating profit (EBITDA) in at least 2 out of 3 preceding financial years.
*   **Post-Issue Capital Thresholds:** Automatically flags capital outside the ₹1 Crore to ₹25 Crore SME exchange corridor.
*   **Structural Offer Limits:** Enforces the **20% cap on Offer for Sale (OFS)** and the **15% / ₹10 Crore cap on General Corporate Purposes (GCP)**.
*   **Track Record Validation:** Computes entity age against SEBI's 1-year track record mandate (incorporating 2025/2026 conversion amendments).

### 2. 📋 Delta Wizard — Schedule VI Disclosure Editor
*   **18 Mandatory Sections:** Auto-generates structured templates mapped directly to **SEBI ICDR Schedule VI, Part A** (Cover Page, Risk Factors, Objects of Issue, Capital Structure, Site Visit Reports, etc.).
*   **Real-time Guidance:** Displays section-by-section SEBI compliance notes and character density indicators alongside the editor.
*   **Version Controlled:** Tracks every disclosure edit with incremental versioning and completion status badges.

### 3. 🔗 Cryptographic Hash-Chained Audit Trail
*   **SHA-256 Immutability:** Every action—from project initialization and disclosure edits to formal sign-offs—generates a cryptographic hash incorporating the previous log entry's hash (`previous_hash`).
*   **Tamper-Evident Ledger:** If a single character in the audit database is altered, the chain breaks immediately.
*   **Live Verification:** Built-in verification endpoint and UI dashboard to prove data integrity to regulators.

### 4. 👥 Multi-Party Workspace & Digital Sign-Offs
*   **Role-Based Access Control (RBAC):** Separate workspace hierarchies for **Promoters/SME Issuers**, **Merchant Bankers (Lead Managers)**, **Legal Counsel**, and **SEBI Compliance Officers**.
*   **Digital Approval Stamping:** Formal approval workflows where stakeholders sign off on specific Schedule VI sections with SHA-256 signatures.

---

## 📁 Repository Structure

```text
ClaudeProof/
├── .gitignore               # Comprehensive Node, Python, and OS ignore rules
├── README.md                # Project architecture & documentation
├── backend/                 # Python FastAPI Microservices & Rule Engine
│   ├── app/
│   │   ├── api/             # Auth, Projects, Sections, Compliance & Audit endpoints
│   │   ├── core/            # Database setup, JWT Auth, Rule Engine & SHA-256 Audit Chain
│   │   ├── models/          # SQLAlchemy / SQLModel database entities
│   │   └── schemas/         # Pydantic request/response validation schemas
│   ├── rules/
│   │   └── icdr_rules.json  # JSON-specified SEBI ICDR compliance rule definitions
│   └── main.py              # FastAPI application entry point & CORS configuration
└── client/                  # React 18 + TypeScript + Tailwind CSS Frontend
    ├── src/
    │   ├── components/      # Glassmorphism cards, badges, progress bars & navigation
    │   ├── pages/           # Landing, Auth, Dashboard, Delta Wizard, Rule Hub & Audit Trail
    │   ├── services/        # Axios API client with local-storage fallback engine
    │   └── types/           # Strict TypeScript interfaces matching FastAPI schemas
    ├── package.json         # Modern Vite dependencies (Lucide, Framer Motion, Tailwind)
    ├── tailwind.config.js   # Curated RegTech color palette & dark mode tokens
    └── tsconfig.json        # Strict TypeScript configuration
```

---

## 🚀 Quick Start Guide (Local Development)

### Prerequisites
*   **Node.js:** v18.0.0 or higher
*   **Python:** v3.10 or higher
*   **Git:** v2.30+

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/ClauseProof.git
cd ClauseProof
```

### Step 2: One-Command Full-Stack Startup (Recommended)
Launch both the **FastAPI Backend** (`http://localhost:8000`) and the **React + TypeScript Frontend** (`http://localhost:3000`) simultaneously in a single terminal:
```bash
# Using npm (from root directory):
npm run dev

# OR using our shell script:
./start.sh

# OR using Python directly:
python3 start.py
```
*   **Live Stream Logs:** Both backend and frontend logs will stream directly to your terminal with colored prefixes (`[BACKEND]` and `[CLIENT]`).
*   **Clean Shutdown:** Press `Ctrl+C` at any time to cleanly terminate both servers without leaving background orphan processes!

### Alternative: Standalone Frontend Demo Mode
If you only want to run the React UI without Python installed, you can run just the client:
```bash
cd client
npm install
npm run dev
```
*   *Note:* The frontend includes a built-in **local-storage fallback engine**, allowing you to test the full 18-rule deterministic compliance engine, Schedule VI drafting wizard, and SHA-256 audit verification instantly even without the backend running!


---

## 🎨 Frontend Design & Aesthetics
ClauseProof is built with **modern RegTech design principles**:
*   **Dark Mode Palette:** Tailored deep slate (`#0a0e1a`) background with indigo and purple neon accents.
*   **Glassmorphism:** Backdrop blurred cards with subtle glowing borders (`box-shadow: 0 0 25px rgba(99, 102, 241, 0.25)`).
*   **Dynamic Typography:** Google Fonts integration featuring **Inter** for clean UI legibility and **JetBrains Mono** for rule codes, CINs, and SHA-256 hashes.
*   **Micro-Animations:** Smooth hover transitions, animated progress bars, and glowing status badges.

---

## ⚖️ SEBI ICDR Compliance Rule Mapping

| Rule Code | Regulation | Severity | Description |
| :--- | :--- | :--- | :--- |
| `ICDR_ELIG_001` | Reg 229(1) | **Mandatory** | Positive EBITDA in at least 2 of 3 preceding financial years |
| `ICDR_ELIG_002` | Reg 229(2) | **Mandatory** | Post-issue paid-up capital between ₹1 Crore and ₹25 Crore |
| `ICDR_ELIG_003` | Reg 229(3) | **Mandatory** | Entity in existence for at least 1 full financial year |
| `ICDR_DISC_001` | Schedule VI | **Mandatory** | Presence of all 18 mandatory Schedule VI disclosure sections |
| `ICDR_ISSUE_001` | Reg 230(1) | **Mandatory** | Offer for Sale (OFS) capped at maximum 20% of total issue size |
| `ICDR_ISSUE_002` | Reg 230(2) | **Mandatory** | General Corporate Purposes (GCP) capped at 15% or ₹10 Crore |
| `ICDR_SME_001` | Reg 231 | **Mandatory** | Minimum IPO application size of at least ₹2,00,000 (2025 norm) |

---

## 🔒 Security & Compliance
*   **Data Localization:** Built to support on-premise Indian cloud deployments (AWS Mumbai / Azure Central India) aligned with SEBI data localization frameworks.
*   **RBAC Protection:** JWT bearer authentication with role-enforced route guards.
*   **Tamper-Proof Logs:** Cryptographic chaining prevents retrospective modification of offer documents or approval logs.
