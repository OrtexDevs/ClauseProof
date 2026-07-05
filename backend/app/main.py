"""
ClauseProof — FastAPI Main Application
Compliance-as-Code platform for SME IPO Offer Document Preparation.
SEBI Securities Market TechSprint — Problem Statement 4.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api import auth, projects, sections, compliance, audit, workspace

app = FastAPI(
    title="ClauseProof API",
    description=(
        "Compliance-as-Code platform for SME IPO Offer Document Preparation. "
        "Deterministic regulatory validation engine for SEBI ICDR compliance."
    ),
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
prefix = settings.API_PREFIX
app.include_router(auth.router, prefix=prefix)
app.include_router(projects.router, prefix=prefix)
app.include_router(sections.router, prefix=prefix)
app.include_router(compliance.router, prefix=prefix)
app.include_router(audit.router, prefix=prefix)
app.include_router(workspace.router, prefix=prefix)


@app.on_event("startup")
def startup():
    """Initialize database on startup."""
    init_db()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ClauseProof API",
        "version": settings.APP_VERSION,
    }
