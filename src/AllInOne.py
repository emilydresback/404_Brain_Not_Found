import os
import requests
import json

def get_openai_response(prompt):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key is missing. Set OPENAI_API_KEY as an environment variable.")

    url = "https://api.openai.com/v1/chat/completions"

    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, json=payload)

    try:
        response_data = response.json()
        #print("API Response:", json.dumps(response_data, indent=2))  # Print the full response
        content = response_data["choices"][0]["message"]["content"]

        return content
    
    except KeyError:
        raise ValueError(f"Unexpected API response: {response_data}")

return(get_openai_response("Print coordinates of somewhere on Clemson University's campus in this form: 'Longitude: ', 'Latitude: '"))
