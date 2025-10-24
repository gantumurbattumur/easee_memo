import os
from google import genai
import dotenv
dotenv.load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_story(topic, palace):
    prompt = f"""
You are a memory coach creating vivid, short, bizarre visual scenes to help memorize facts.
Each scene must happen at a specific location inside the user's memory palace.

Topic to memorize: {topic}

Memory palace locations (in order): {', '.join(palace)}

For each location:
1. Use the location as the stage.
2. Link one key concept from the topic to it.
3. Make the scene weird, funny, or emotionally strong — to make it memorable.
4. Be concise (1–2 sentences per location).

Output format:
Location 1: [short mnemonic scene]
Location 2: [short mnemonic scene]
...
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )
    return response.text
