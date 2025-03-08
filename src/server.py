import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), ".env")
#print(f"Loading .env from: {env_path}")
load_dotenv(env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Check if the key is missing
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("API key is missing. Set OPENAI_API_KEY in your .env file.")

# The rest of the code starts here (no unintended indentation)
#print("Environment variables loaded successfully!")  # This should execute normally

def get_openai_response(prompt):
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "OpenAI-Organization": "org-JMxuF9HmWOoA5Yup74F4rENl"  # <--- Add this line
    }

    response = requests.post(url, headers=headers, json=payload)
    response_data = response.json()

    if "error" in response_data:
        raise ValueError(f"API Error: {response_data['error']['message']}")

    return response_data["choices"][0]["message"]["content"]


def get_coordinates():
    """ Fetch a random location's coordinates at Clemson University """
    coordinates = get_openai_response("Print coordinates of somewhere on Clemson University's campus in this form: 'Latitude: ', 'Longitude: ' Only give the latitude and longitude.")
    
    try:
        lat, lon = coordinates.split("\n")
        lat = float(lat.split(": ")[1])
        lon = float(lon.split(": ")[1])
        return lat, lon
    except Exception:
        raise ValueError("Failed to parse coordinates.")

def get_riddle(lat, lon):
    """ Generate a riddle based on the given coordinates """
    return get_openai_response(f"Use these coordinates: Latitude {lat}, Longitude {lon} to generate a riddle about the point of interest.")

def get_hint(lat, lon):
    """ Generate a hint based on the given coordinates """
    return get_openai_response(f"Give me a hint about the point of interest at Latitude {lat}, Longitude {lon} different from the riddle provided.")

def main():
    """ Run the scavenger hunt logic """
    lat, lon = get_coordinates()

    riddle = get_riddle(lat, lon)
    print(f"Riddle: {riddle}\n")

    while True:
        user_input = input("Type 'hint' for a hint, or 'quit' to exit: ").strip().lower()
        if user_input == "hint":
            hint = get_hint(lat, lon)
            print(f"Hint: {hint}\n")
        elif user_input == "quit":
            print("Exiting scavenger hunt. Have fun exploring Clemson!")
            break
        else:
            print("Invalid input. Type 'hint' or 'quit'.")

if __name__ == "__main__":
    main()
