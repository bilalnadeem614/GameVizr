import json
from google.oauth2 import service_account
from google import genai

# Load the service account JSON file
with open("/run/media/bilalnadeem614/Data/dev-post-gemini3/test/gen-lang-client-0087589677-2cd3c5a37c60.json") as f:
    sa_json = json.load(f)

# Add the required scopes for Vertex AI
credentials = service_account.Credentials.from_service_account_info(
    sa_json,
    scopes=['https://www.googleapis.com/auth/cloud-platform']
)

# Create the client using Vertex AI
client = genai.Client(
    vertexai=True,
    credentials=credentials,
    project="gen-lang-client-0087589677",
    location="global"
)

response = client.models.generate_content(
    model="gemini-3-pro-preview",
    contents="Hello! Are you Gemini-3?"
)

print(response.text)