import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ["GOOGLE_API_KEY"]) # type: ignore

model = genai.GenerativeModel("gemini-2.5-flash") # type: ignore
topic = "Computer Science jobs"
prompt = f"Make a funny, cartoon-like story (under 80 words) that helps someone remember {topic} easily."
response = model.generate_content(prompt)

print(response.text)

# for model in genai.list_models():
#     if 'generateContent' in model.supported_generation_methods:
#         print(model.name)