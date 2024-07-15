from langchain_qdrant import Qdrant
from qdrant_client.http import models
import os

from apis.configs.qdrant_configs import qdrant_client
from apis.configs.embedding_configs import embd

class QdrantProvider:
    def __init__(self, collection_name):
        self.qdrant = None
        self.collection_name = collection_name

    def create_collection(self):
        if qdrant_client.collection_exists(collection_name=self.collection_name) == False:
            qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE),
            )
        return True
    
    def delete_collection(self):
        try:
            qdrant_client.delete_collection(collection_name=self.collection_name)
            return True
        except Exception as e:
            print(f"Exception: {e}")
            return False

    def upload_documents_and_load_collection(self, splits):
        qdrant = Qdrant.from_documents(
            documents=splits, 
            embedding=embd, 
            url = os.getenv("ASKPIC_QDRANT_URL"), 
            api_key = os.getenv("ASKPIC_QDRANT_API_KEY"), 
            prefer_grpc=True, 
            collection_name=self.collection_name
        )
        self.qdrant = qdrant
        return qdrant
    
    def load_collection(self):
        qdrant = Qdrant.from_existing_collection(
            embedding=embd,
            url = os.getenv("ASKPIC_QDRANT_URL"), 
            api_key = os.getenv("ASKPIC_QDRANT_API_KEY"), 
            prefer_grpc=True, 
            collection_name=self.collection_name
        )
        self.qdrant = qdrant
        return qdrant
    
    def create_retriever(self):
        retriever = self.qdrant.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 3}
        )
        return retriever