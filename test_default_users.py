#!/usr/bin/env python3
"""
Test script to verify default users are working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_default_users():
    """Test the default users endpoint"""
    print("🔍 Testing default users endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/auth/default-users")
        if response.status_code == 200:
            data = response.json()
            print("✅ Default users endpoint working!")
            print(f"📋 Available users:")
            for user in data['users']:
                print(f"   📧 {user['email']} | 🔑 {user['password']} | 👤 {user['full_name']}")
            return data['users']
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return []

def test_login(email, password):
    """Test login with default user"""
    print(f"\n🔐 Testing login for {email}...")
    
    try:
        login_data = {
            "username": email,
            "password": password
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/default-login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful for {email}")
            print(f"🎫 Token: {data['access_token'][:50]}...")
            return data['access_token']
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Testing TheNZT Default Users")
    print("=" * 50)
    
    # Test getting default users
    users = test_default_users()
    
    if users:
        # Test login for first user
        first_user = users[0]
        token = test_login(first_user['email'], first_user['password'])
        
        if token:
            print(f"\n🎉 Success! You can now login with:")
            print(f"📧 Email: {first_user['email']}")
            print(f"🔑 Password: {first_user['password']}")
    else:
        print("\n❌ Could not retrieve default users. Make sure the backend is running.")
    
    print("\n" + "=" * 50)
    print("💡 Available default users:")
    print("   • admin@thenzt.com / admin123")
    print("   • test@thenzt.com / test123") 
    print("   • demo@thenzt.com / demo123")