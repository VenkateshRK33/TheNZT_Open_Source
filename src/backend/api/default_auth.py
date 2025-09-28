"""
Default authentication for development/testing purposes
Provides pre-configured users that work without database setup
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Response, Header
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated, Optional
from passlib.context import CryptContext
import jwt
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "f524fdd634e89fd7a3d886564d026666b3ea46db9c77a57d68309f02190020cb")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", "30"))

# Pre-configured default users (for development/testing)
DEFAULT_USERS = {
    "admin@thenzt.com": {
        "id": "default_admin_001",
        "email": "admin@thenzt.com",
        "password": pwd_context.hash("admin123".encode('utf-8')),  # password: admin123
        "full_name": "Admin User",
        "auth_provider": "local",
        "created_at": datetime.utcnow().isoformat()
    },
    "test@thenzt.com": {
        "id": "default_test_001", 
        "email": "test@thenzt.com",
        "password": pwd_context.hash("test123".encode('utf-8')),   # password: test123
        "full_name": "Test User",
        "auth_provider": "local",
        "created_at": datetime.utcnow().isoformat()
    },
    "demo@thenzt.com": {
        "id": "default_demo_001",
        "email": "demo@thenzt.com", 
        "password": pwd_context.hash("demo123".encode('utf-8')),   # password: demo123
        "full_name": "Demo User",
        "auth_provider": "local",
        "created_at": datetime.utcnow().isoformat()
    }
}

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

@router.post("/default-login")
async def default_login_endpoint(login: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response):
    """
    Login endpoint for default users (development/testing)
    Available users:
    - admin@thenzt.com / admin123
    - test@thenzt.com / test123  
    - demo@thenzt.com / demo123
    """
    
    # Check if user exists in default users
    user_data = DEFAULT_USERS.get(login.username)
    if not user_data:
        raise HTTPException(
            status_code=400, 
            detail="Invalid email or password. Available test users: admin@thenzt.com, test@thenzt.com, demo@thenzt.com"
        )
    
    # Verify password
    if not pwd_context.verify(login.password.encode('utf-8'), user_data["password"]):
        raise HTTPException(
            status_code=400, 
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token({
        "user_id": user_data["id"],
        "email": user_data["email"], 
        "is_new_user": False
    })
    
    # Set cookie
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=False, 
        max_age=60 * 60 * 24 * 30
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": user_data["email"],
            "full_name": user_data["full_name"]
        }
    }

@router.get("/default-users")
async def get_default_users():
    """Get list of available default users for testing"""
    users_info = []
    for email, user_data in DEFAULT_USERS.items():
        # Extract password from hash for display (development only!)
        password = "admin123" if "admin" in email else "test123" if "test" in email else "demo123"
        users_info.append({
            "email": email,
            "password": password,
            "full_name": user_data["full_name"]
        })
    
    return {
        "message": "Available default users for testing",
        "users": users_info,
        "note": "Use POST /api/auth/default-login to authenticate"
    }

def decode_jwt_token(token: str):
    """Decode JWT token to get user info"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/get_user_info")
async def get_default_user_info(authorization: Optional[str] = Header(None)):
    """Get user info for default users"""
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    payload = decode_jwt_token(token)
    
    user_id = payload.get("user_id")
    email = payload.get("email")
    
    # Find user in default users
    user_data = DEFAULT_USERS.get(email)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user_data["id"],
        "email": user_data["email"],
        "full_name": user_data["full_name"],
        "auth_provider": user_data["auth_provider"],
        "created_at": user_data["created_at"],
        "profile_picture": None  # Default users don't have profile pictures
    }