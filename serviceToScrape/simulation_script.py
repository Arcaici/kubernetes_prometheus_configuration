import requests

web_server_url = "http://localhost:8081"

# Simulate requests
response = requests.get(f"{web_server_url}/simulate-requests")
print(response.text)
