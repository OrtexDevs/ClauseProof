"""
ClauseProof Authentication API
Handles user registration, login, and profile management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_sync_db
from app.core.security import (
    get_password_hash, verify_password, create_access_token,
    get_current_user
)
from app.core.audit_chain import AuditChain
from app.models.database_models import User
from app.schemas.api_schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_sync_db)):
    """Register a new user."""
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        organization=user_data.organization,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create JWT token
    token = create_access_token(data={"sub": user.id, "role": user.role})
    
    # Audit log
    AuditChain.log(
        db=db,
        action="user_registered",
        actor_id=user.id,
        entity_type="user",
        entity_id=user.id,
        details={"email": user.email, "role": user.role},
    )
    
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_sync_db)):
    """Login with email and password."""
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    token = create_access_token(data={"sub": user.id, "role": user.role})
    
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse.model_validate(current_user)
