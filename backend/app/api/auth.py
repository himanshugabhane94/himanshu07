from fastapi import APIRouter, HTTPException, Depends, status
from app.models.schemas import User, UserLogin, Token, UserRole
from app.core.security import DEMO_USERS, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/login", response_model=Token)
def login(login_data: UserLogin):
    username = login_data.username.lower().strip()
    if username not in DEMO_USERS:
        # Default to investigator1 if demo username entered
        username = "investigator1"

    user_dict = DEMO_USERS[username]
    if not verify_password(login_data.password, user_dict["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"sub": username, "role": user_dict["role"].value})
    user_obj = User(
        id=user_dict["id"],
        username=user_dict["username"],
        full_name=user_dict["full_name"],
        email=user_dict["email"],
        role=user_dict["role"],
        badge_number=user_dict["badge_number"],
        agency=user_dict["agency"],
        created_at=user_dict["created_at"]
    )
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@router.get("/me", response_model=User)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/switch-role/{role}", response_model=Token)
def switch_role(role: UserRole):
    """Convenience endpoint for Hackathon judging to quickly toggle between Investigator, Analyst, and Admin roles."""
    role_map = {
        UserRole.INVESTIGATOR: "investigator1",
        UserRole.ANALYST: "analyst1",
        UserRole.ADMIN: "admin1"
    }
    username = role_map.get(role, "investigator1")
    user_dict = DEMO_USERS[username]
    access_token = create_access_token(data={"sub": username, "role": user_dict["role"].value})
    user_obj = User(
        id=user_dict["id"],
        username=user_dict["username"],
        full_name=user_dict["full_name"],
        email=user_dict["email"],
        role=user_dict["role"],
        badge_number=user_dict["badge_number"],
        agency=user_dict["agency"],
        created_at=user_dict["created_at"]
    )
    return Token(access_token=access_token, token_type="bearer", user=user_obj)
