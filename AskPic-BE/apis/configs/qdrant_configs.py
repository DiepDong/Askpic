from qdrant_client import QdrantClient

import os
from dotenv import load_dotenv

load_dotenv()

qdrant_client = QdrantClient(
    url = os.getenv("ASKPIC_QDRANT_URL"), 
    api_key = os.getenv("ASKPIC_QDRANT_API_KEY"),
)
print("Vector Database connected")
