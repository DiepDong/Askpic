from apis.providers.firebase_storage_provider import FirebaseStorageProvider
from apis.providers.firestore_database_provider import FirestoreDatabaseProvider
from apis.providers.qdrant_provider import QdrantProvider
from apis.utils.rag import load_documents, split_text
from apis.configs.llm_configs import llm, json_parser, str_parser
from apis.utils.prompts import ask_in_documents_prompt_template

from langchain_core.runnables import RunnablePassthrough

from dotenv import load_dotenv
import os
load_dotenv()

class AskInDocumentsServices():
    
    def __init__(self) -> None:
        self.firebase_storage = FirebaseStorageProvider(folder_name="documents")
        self.firebase_db = FirestoreDatabaseProvider(collection_name="documents")

    async def upload_document(self, file_name: str, file_path: str):

        # Upload document to Firebase Storage and create new record in Firestore Database
        storage_url = self.firebase_storage.create_file(file_path=file_path)
        data = {
            "document_id": None,
            "document_name": file_name,
            "document_url": storage_url,
        }
        document_id = self.firebase_db.create_document(data=data)

        # Update document_id in Firestore Database
        update_data = {
            "document_id": document_id,
        }
        self.firebase_db.update_document(document_id=document_id, data=update_data)

        # Load document and split into chunks
        docs = load_documents(path=file_path)
        splits = split_text(docs=docs)

        # Create collection, embed chunks and upload to Qdrant
        qdrant_db = QdrantProvider(collection_name=f"askpic_documents_{document_id}")
        qdrant_db.create_collection()
        qdrant_db.upload_documents_and_load_collection(splits=splits)

        document_data = self.firebase_db.read_document(document_id=document_id)
        
        return document_data

    async def delete_document(self, document_id: str):

        # Delete collection from Qdrant
        qdrant_db = QdrantProvider(collection_name=f"askpic_documents_{document_id}")
        qdrant_db.delete_collection()

        # Delete document from Firestore Database and Firebase Storage
        document_data = self.firebase_db.read_document(document_id)
        storage_url = document_data["document_url"]
        
        self.firebase_db.delete_document(document_id=document_id)

        askpic_firebase_url_storagebucket = os.getenv("ASKPIC_FIREBASE_URL_STORAGEBUCKET")
        storage_file_path = storage_url.replace(f"https://storage.googleapis.com/{askpic_firebase_url_storagebucket}/", "").replace("%20", " ")
        self.firebase_storage.delete_file(storage_file_path=storage_file_path)
        
        return True

    async def get_document(self, document_id: str):

        # Get document's data from Firestore Database
        document_data = self.firebase_db.read_document(document_id=document_id)

        return document_data
    
    async def get_all_documents(self):

        # Get all documents' data from Firestore Database
        documents_data = self.firebase_db.read_all_documents()

        return documents_data
    
    @staticmethod
    async def get_answers(question: str, document_id: str):

        # Load collection from Qdrant
        qdrant_db = QdrantProvider(collection_name=f"askpic_documents_{document_id}")
        qdrant_db.load_collection()

        # Create retriever
        retriever = qdrant_db.create_retriever()

        # Get answers
        chain = ask_in_documents_prompt_template | llm | str_parser
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()} | chain
        )
        answers = rag_chain.invoke(question)

        # Create data to return
        data = {
            "question": question,
            "answers": answers,
        }

        return data
