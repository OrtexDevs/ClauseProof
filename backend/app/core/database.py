"""
ClauseProof Database Setup
Async SQLAlchemy engine with session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from app.core.config import settings


# Sync engine for migrations and initial setup
sync_engine = create_engine(
    settings.DATABASE_SYNC_URL,
    echo=settings.DEBUG,
)
SyncSessionLocal = sessionmaker(bind=sync_engine, class_=Session)


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


def get_sync_db():
    """Get synchronous database session."""
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    from app.models import database_models  # noqa: F401
    Base.metadata.create_all(bind=sync_engine)
