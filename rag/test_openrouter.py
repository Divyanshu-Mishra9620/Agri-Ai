#!/usr/bin/env python3
"""Test OpenRouter API key validity"""
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
print(f"Testing API Key: {API_KEY[:20]}...{API_KEY[-10:]}")
print(f"Full key length: {len(API_KEY)} characters")
print("-" * 60)

url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
data = {
    "model": "google/gemini-2.0-flash-exp:free",
    "messages": [
        {"role": "user", "content": "Say 'Hello World'"}
    ]
}

print("\n🔄 Sending test request to OpenRouter...")
print(f"URL: {url}")
print(f"Model: {data['model']}")
print("-" * 60)

try:
    print("Making POST request...")
    response = requests.post(url, headers=headers, json=data, timeout=10)
    print(f"Request completed!")
    
    print(f"\n📊 Response Status: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print("-" * 60)
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ SUCCESS! OpenRouter API is working!")
        print(f"Response: {json.dumps(result, indent=2)}")
    else:
        print(f"\n❌ ERROR {response.status_code}")
        print(f"Response Body: {response.text}")
        
        try:
            error_data = response.json()
            print(f"\nError Details: {json.dumps(error_data, indent=2)}")
        except:
            pass
            
        if response.status_code == 401:
            print("\n💡 401 Unauthorized - Possible causes:")
            print("   1. API key is invalid or expired")
            print("   2. Email not verified on OpenRouter account")
            print("   3. Account not activated (need to add payment method)")
            print("   4. API key doesn't belong to this account")
            print("\n🔧 Fix: Go to https://openrouter.ai/keys and:")
            print("   - Verify your email")
            print("   - Add a payment method (even for free tier)")
            print("   - Generate a new API key")
        
except requests.exceptions.Timeout:
    print("\n⏱️ Request timed out after 30 seconds")
except requests.exceptions.ConnectionError as e:
    print(f"\n🌐 Connection error: {e}")
except Exception as e:
    print(f"\n❌ Unexpected error: {type(e).__name__}: {e}")
