import os
from google import genai
import dotenv
dotenv.load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_story(topic, palace):
    prompt = f"""
You are a memory coach creating vivid, short, bizarre visual scenes to help memorize facts.
Each scene must happen at a specific location inside the user's memory palace. Do not use more locations than provided. Do not use harder words than necessary.

Topic to memorize: {topic}

Memory palace locations (in order): {', '.join(palace)}

For each location:
1. Use the location as the stage.
2. Link **one key concept from the topic** to it.
3. Make the scene weird, funny, or emotionally strong — to make it memorable.
4. Be concise (1–2 sentences per location).
5. Output the keyword/concept at the start of the line in **bold**, so user can see it.

Output format:
Location 1: [short mnemonic scene]  
Topic 1: **[keyword/concept]**

Location 2: [short mnemonic scene]  
Topic 2: **[keyword/concept]**

...and so on for all palace spots.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )
    return response.text
