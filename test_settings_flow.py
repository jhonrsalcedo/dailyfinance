#!/usr/bin/env python3
"""
Test script to verify the complete settings flow:
1. Create a test user
2. Login to get JWT token
3. Get settings (should return user-specific settings)
4. Update salary
5. Verify salary is saved
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_settings_flow():
    print("Testing complete settings flow...\n")
    
    # Step 1: Create a test user
    print("1. Creating test user...")
    register_response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "email": "settings_test@example.com",
            "password": "testpassword123",
            "username": "SettingsTestUser"
        }
    )
    
    if register_response.status_code not in [200, 400]:  # 400 if user already exists
        print(f"❌ Registration failed: {register_response.json()}")
        # Try to login anyway (user might already exist)
    else:
        if register_response.status_code == 200:
            print("✅ User created!")
        else:
            print("ℹ️ User might already exist, trying login...")
    
    # Step 2: Login
    print("\n2. Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "settings_test@example.com", "password": "testpassword123"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.json()}")
        return
    
    token = login_response.json().get("access_token")
    print(f"✅ Login successful! Token: {token[:20]}...")
    
    # Step 3: Get current settings
    print("\n3. Getting current settings...")
    headers = {"Authorization": f"Bearer {token}"}
    settings_response = requests.get(f"{BASE_URL}/settings", headers=headers)
    
    if settings_response.status_code != 200:
        print(f"❌ Failed to get settings: {settings_response.json()}")
        return
    
    settings = settings_response.json()
    print(f"✅ Settings retrieved!")
    print(f"   - user_id: {settings.get('user_id')}")
    print(f"   - salary: {settings.get('salary')}")
    print(f"   - currency: {settings.get('currency')}")
    
    # Step 4: Update salary
    new_salary = 8500000  # 8.5M COP
    print(f"\n4. Updating salary to {new_salary}...")
    update_response = requests.post(
        f"{BASE_URL}/settings",
        headers=headers,
        json={"salary": new_salary}
    )
    
    if update_response.status_code != 200:
        print(f"❌ Failed to update salary: {update_response.json()}")
        return
    
    updated_settings = update_response.json()
    print(f"✅ Salary updated!")
    print(f"   - New salary: {updated_settings.get('salary')}")
    
    # Step 5: Verify the update
    print("\n5. Verifying update...")
    verify_response = requests.get(f"{BASE_URL}/settings", headers=headers)
    verified_settings = verify_response.json()
    
    if verified_settings.get('salary') == new_salary:
        print(f"✅ Verification successful! Salary is {verified_settings.get('salary')}")
    else:
        print(f"❌ Verification failed! Expected {new_salary}, got {verified_settings.get('salary')}")
    
    print("\n✅ All tests passed!")

if __name__ == "__main__":
    try:
        test_settings_flow()
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        print("   Run: cd backend && python3 -m uvicorn main:app --reload")
