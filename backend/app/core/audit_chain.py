"""
ClauseProof Hash-Chained Audit Trail
Implements tamper-evident, immutable audit logging with cryptographic hash chains.
Every action is cryptographically linked to the previous one, making any 
modification detectable — critical for SEBI regulatory compliance.
"""
import hashlib
import json
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.database_models import AuditLog


class AuditChain:
    """
    Manages the hash-chained audit log.
    Each entry's hash is computed from its content + the previous entry's hash,
    creating a tamper-evident chain similar to blockchain.
    """
    
    GENESIS_HASH = "0" * 64  # Genesis block hash
    
    @staticmethod
    def compute_hash(
        action: str,
        entity_type: str,
        entity_id: str,
        details: dict,
        actor_id: str,
        timestamp: str,
        previous_hash: str,
    ) -> str:
        """Compute SHA-256 hash for an audit entry."""
        content = json.dumps({
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "details": details,
            "actor_id": actor_id,
            "timestamp": timestamp,
            "previous_hash": previous_hash,
        }, sort_keys=True, default=str)
        return hashlib.sha256(content.encode("utf-8")).hexdigest()
    
    @classmethod
    def get_last_hash(cls, db: Session, project_id: Optional[str] = None) -> str:
        """Get the hash of the most recent audit log entry."""
        query = db.query(AuditLog).order_by(AuditLog.id.desc())
        if project_id:
            query = query.filter(AuditLog.project_id == project_id)
        last_entry = query.first()
        return last_entry.content_hash if last_entry else cls.GENESIS_HASH
    
    @classmethod
    def log(
        cls,
        db: Session,
        action: str,
        actor_id: str,
        project_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: Optional[dict] = None,
    ) -> AuditLog:
        """Create a new hash-chained audit log entry."""
        timestamp = datetime.now(timezone.utc)
        previous_hash = cls.get_last_hash(db, project_id)
        
        content_hash = cls.compute_hash(
            action=action,
            entity_type=entity_type or "",
            entity_id=entity_id or "",
            details=details or {},
            actor_id=actor_id,
            timestamp=timestamp.isoformat(),
            previous_hash=previous_hash,
        )
        
        entry = AuditLog(
            project_id=project_id,
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            content_hash=content_hash,
            previous_hash=previous_hash,
            timestamp=timestamp,
        )
        
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry
    
    @classmethod
    def verify_chain(cls, db: Session, project_id: Optional[str] = None) -> dict:
        """
        Verify the integrity of the entire audit chain.
        Returns verification result with any detected breaks.
        """
        query = db.query(AuditLog).order_by(AuditLog.id.asc())
        if project_id:
            query = query.filter(AuditLog.project_id == project_id)
        
        entries = query.all()
        if not entries:
            return {"valid": True, "entries_checked": 0, "breaks": []}
        
        breaks = []
        expected_previous = cls.GENESIS_HASH
        
        for entry in entries:
            # Verify previous hash linkage
            if entry.previous_hash != expected_previous:
                breaks.append({
                    "entry_id": entry.id,
                    "expected_previous": expected_previous,
                    "actual_previous": entry.previous_hash,
                    "type": "chain_break",
                })
            
            # Verify content hash
            computed_hash = cls.compute_hash(
                action=entry.action,
                entity_type=entry.entity_type or "",
                entity_id=entry.entity_id or "",
                details=entry.details or {},
                actor_id=entry.actor_id,
                timestamp=entry.timestamp.isoformat() if entry.timestamp else "",
                previous_hash=entry.previous_hash,
            )
            
            if entry.content_hash != computed_hash:
                breaks.append({
                    "entry_id": entry.id,
                    "expected_hash": computed_hash,
                    "actual_hash": entry.content_hash,
                    "type": "content_tamper",
                })
            
            expected_previous = entry.content_hash
        
        return {
            "valid": len(breaks) == 0,
            "entries_checked": len(entries),
            "breaks": breaks,
        }
