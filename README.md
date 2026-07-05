# ⚖️ ClauseProof — SME IPO Compliance-as-Code Operating System

[![SEBI TechSprint](https://img.shields.io/badge/SEBI_Securities_Market_TechSprint-Problem_Statement_4-6366f1?style=for-the-badge&logo=shield)](https://sebi.gov.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Stack: React + TS + FastAPI](https://img.shields.io/badge/Stack-React_18_%7C_TypeScript_%7C_FastAPI_%7C_PostgreSQL-3b82f6?style=for-the-badge)](https://github.com)
[![Architecture: Issuer RegTech](https://img.shields.io/badge/Focus-Issuer_%26_Intermediaries-8b5cf6?style=for-the-badge)](https://github.com)

**ClauseProof** is an enterprise-grade RegTech platform engineered specifically for **SEBI Securities Market TechSprint — Problem Statement 4: Simplifying IPO Offer Document Preparation for SMEs**. 

It transforms the drafting, validation, and review of Draft Red Herring Prospectuses (DRHP) from an opaque, expensive, and intermediary-heavy manual process into a **transparent, deterministic, and cryptographically verifiable compliance operating system**.

---

## 🏆 Alignment with SEBI TechSprint Problem Statement 4

| SEBI Problem Statement Requirement | How ClauseProof Solves It | Why This Wins for SMEs & Regulators |
| :--- | :--- | :--- |
| **1. Accessible without specialist knowledge** | **Smart Initiation Wizard (`NewProject.tsx`)** | Promoters input simple business details, capital structures, and 3-year restated financial summaries without needing complex legal jargon. |
| **2. Reduce preparation time & lower early dependence on intermediaries** | **Delta Wizard & AI Boilerplate Generator (`DeltaWizard.tsx`)** | Automatically initializes all **18 mandatory Schedule VI DRHP sections** with SEBI-compliant structural templates and 1-click AI draft generation. |
| **3. Cover all material disclosures under SEBI SME IPO framework** | **Schedule VI, Part A Mapping** | Complete structural coverage: Cover Page, Risk Factors, Objects of Issue, Capital Structure, Site Visit Reports, Restated Financials, etc. |
| **4. Flag gaps or inconsistencies in information provided** | **Deterministic Rule Engine (`ComplianceHub.tsx` & `rule_engine.py`)** | Provable mathematical verification against 18+ SEBI ICDR 2025 rules (positive EBITDA in 2/3 years, ₹1Cr–₹25Cr capital corridor, 20% OFS cap, 15% GCP cap, entity age/conversion norms). |
| **5. Preserve role of authorized intermediaries in review & certification** | **Multi-Party RBAC Workspace (`Workspace.tsx`)** | Role-Based Access Control separates workflows for **Promoters/Issuers**, **Merchant Bankers (Lead Managers)**, **Legal Counsel**, and **Company Secretaries (CS)**. Intermediaries must execute formal review sign-offs! |
| **6. Maintain appropriate checks for accuracy and completeness** | **SHA-256 Cryptographic Audit Trail (`AuditTrail.tsx`)** | Every edit, rule execution, and sign-off forms an immutable hash chain (`previous_hash` linking to `content_hash`). Built-in verifier proves zero data tampering! |

---

## 🌟 Key Architectural Innovations

### 1. 🔍 Deterministic Rule Engine (No AI Hallucination)
In financial and legal regulatory reporting, LLM hallucinations are unacceptable. ClauseProof implements a **deterministic mathematical and logical engine** in Python (`backend/app/core/rule_engine.py`) that executes hardcoded SEBI ICDR 2025 regulations:
*   **Regulation 229 Eligibility Check:** Verifies positive operating profit (EBITDA) in at least 2 out of 3 preceding financial years.
*   **Post-Issue Capital Corridor:** Automatically flags post-issue capital outside the ₹1 Crore to ₹25 Crore SME exchange corridor.
*   **Structural Offer Limits:** Enforces the **20% cap on Offer for Sale (OFS)** and the **15% / ₹10 Crore cap on General Corporate Purposes (GCP)**.
*   **Track Record Validation:** Computes entity age against SEBI's 1-year track record mandate (incorporating 2025/2026 conversion amendments).

### 2. 📋 Delta Wizard — Schedule VI Disclosure Editor
*   **18 Mandatory Sections:** Auto-generates structured templates mapped directly to **SEBI ICDR Schedule VI, Part A**.
*   **Real-time Guidance:** Displays section-by-section SEBI compliance notes and character density indicators alongside the split-pane editor.
*   **AI Drafting Assistant:** Generates baseline regulatory boilerplate text tailored to the issuer's industry and financial metrics.

### 3. 🔗 Cryptographic Hash-Chained Audit Trail
*   **SHA-256 Immutability:** Every action—from project initialization and disclosure edits to formal sign-offs—generates a cryptographic hash incorporating the previous log entry's hash (`previous_hash`).
*   **Tamper-Evident Ledger:** If a single character in the audit database is altered retrospectively, the cryptographic chain breaks immediately.
*   **Live Verification:** Built-in verification endpoint and UI dashboard to prove data integrity to intermediaries and regulators.

### 4. 👥 Issuer-Side Multi-Party Workspace
ClauseProof is designed as a **client-side preparation tool** for the issuing company and its authorized intermediaries:
*   **Promoter / SME Issuer:** Inputs business particulars, financial summaries, and drafts initial section content.
*   **Merchant Banker (Lead Manager):** Conducts due diligence, reviews capital allocation, and certifies issue eligibility.
*   **Legal Counsel / Advisor:** Verifies Schedule VI disclosure completeness and legal risk factors.
*   **Company Secretary / Internal Compliance:** Coordinates internal governance and document readiness.
*   **Digital Sign-Off Stamping:** Formal approval workflows where stakeholders sign off on specific DRHP filings with SHA-256 digital stamping.

### 5. 📦 1-Click DRHP Package Export
*   Promoters and intermediaries can export the entire DRHP filing, all 18 Schedule VI disclosures, the deterministic compliance scorecard, and the SHA-256 sign-off ledger into an official, beautifully formatted **Printable HTML / PDF / JSON Regulatory Package** with a single click!

---

## 💻 How to Run (Windows, Linux & macOS)

We have engineered an **automated 1-command launcher** that sets up Python virtual environments, installs requirements, and launches both the backend and frontend simultaneously with color-coded live streaming logs!

### Prerequisites
*   **Node.js:** v18.0.0 or higher
*   **Python:** v3.10 or higher
*   **Git:** v2.30+

---

### 🚀 Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/ClauseProof.git
cd ClauseProof
```

---

### ⚡ Step 2: One-Command Startup (Choose Your OS)

#### 🐧 Linux & 🍏 macOS (Terminal)
You can run using `npm`, our shell script, or Python directly:
```bash
# Option A: Using npm (recommended)
npm run dev

# Option B: Using the shell script
chmod +x start.sh
./start.sh

# Option C: Using Python directly
python3 start.py
```

#### 🪟 Windows (Command Prompt / PowerShell)
On Windows, run using `npm` or Python directly from your project root:
```powershell
# Option A: Using npm (recommended)
npm run dev

# Option B: Using Python directly
python start.py
```

*   **What happens automatically:**
    1.  Checks `client/` and runs `npm install` if frontend packages are missing.
    2.  Checks `backend/` and creates a Python virtual environment (`venv/`) if not present.
    3.  Runs `pip install -r requirements.txt` automatically if Uvicorn/FastAPI are missing.
    4.  Launches **FastAPI Backend** on `http://localhost:8000` (`[BACKEND]` cyan logs).
    5.  Launches **React+TS Frontend** on `http://localhost:3000` (`[CLIENT]` magenta logs).
*   **Clean Shutdown:** Press `Ctrl+C` in your terminal at any time to cleanly shut down both servers!

---

### 🌐 Standalone Frontend Demo Mode (No Python Needed!)
If you are evaluating the UI on a machine without Python installed, you can run just the React client:
```bash
cd client
npm install
npm run dev
```
*   *Note:* The frontend includes a built-in **local-storage fallback engine**, allowing judges and developers to test the full 18-rule deterministic compliance engine, Schedule VI drafting wizard, multi-party sign-offs, and SHA-256 audit verification instantly even without the backend running!

---

## 📁 Repository Structure

```text
ClauseProof/
├── .gitignore               # Comprehensive Node, Python, and OS ignore rules
├── README.md                # Hackathon architecture & alignment documentation
├── package.json             # Root orchestrator for 1-command startup
├── start.py / start.sh      # Cross-platform automated full-stack launchers
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

## 🎨 Frontend Design & Aesthetics
ClauseProof is designed with **RegTech Premium aesthetics** to instill trust, clarity, and visual excellence:
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

---
*Built with ❤️ for SEBI Securities Market TechSprint.*
