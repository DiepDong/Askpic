import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser

# Import API key
load_dotenv()

# Define the google api key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0, api_key=GOOGLE_API_KEY, request_timeout=120)

parser = JsonOutputParser()
