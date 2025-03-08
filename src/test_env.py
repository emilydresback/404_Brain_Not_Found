import os
from dotenv import load_dotenv

# Get the directory where this script is located
env_path = os.path.join(os.path.dirname(__file__), ".env")
print(f"Loading .env from: {env_path}")

# Load environment variables
load_dotenv(env_path)

# Print values to check if they are loaded
print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
print("GOOGLE_MAPS_API_KEY:", os.getenv("GOOGLE_MAPS_API_KEY"))

