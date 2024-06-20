import os
from dotenv import load_dotenv
import google.generativeai as genai

# Import API key
load_dotenv()

# Define the google api key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")