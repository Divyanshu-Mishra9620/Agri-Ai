"""
Quick sanity test - call this to verify server works without RAG initialization
"""
import requests

# Test Render production
url = "https://agri-ai-17u4.onrender.com/api/health-check"

try:
    response = requests.get(url, timeout=10)
    print(f"✅ Status: {response.status_code}")
    print(f"✅ Response: {response.json()}")
except Exception as e:
    print(f"❌ Error: {e}")
