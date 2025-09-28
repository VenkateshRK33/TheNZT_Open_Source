#!/usr/bin/env python3
"""
Script to create a test user account for TheNZT application
"""
import asyncio
import os
from datetime import datetime
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys

# Add the src directory to Python path
sys.path.append('src')

from backend.models.model import Users, AccountStatus

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_test_user():
    """Create a test user account"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URI)
    database = client["insight_agent"]
    
    # Initialize Beanie
    await init_beanie(database=database, document_models=[Users])
    
    # Test user credentials
    test_email = "test@example.com"
    test_password = "password123"
    test_name = "Test User"
    
    # Check if user already exists
    existing_user = await Users.find_one({"email": test_email})
    if existing_user:
        print(f"User with email {test_email} already exists!")
        return
    
    # Hash the password
    hashed_password = pwd_context.hash(test_password.encode('utf-8'))
    
    # Create user data
    user_data = {
        "email": test_email,
        "password": hashed_password,
        "full_name": test_name,
        "auth_provider": "local",
        "account_status": AccountStatus.ACTIVE,
        "created_at": datetime.utcnow()
    }
    
    # Create and save user
    user = Users(**user_data)
    await user.insert()
    
    print("✅ Test user created successfully!")
    print(f"📧 Email: {test_email}")
    print(f"🔑 Password: {test_password}")
    print(f"👤 Name: {test_name}")
    print("\nYou can now login with these credentials.")

if __name__ == "__main__":
    asyncio.run(create_test_user())