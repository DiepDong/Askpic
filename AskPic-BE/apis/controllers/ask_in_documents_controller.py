import http
import os
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, Form

from apis.schemas.base import GenericResponseModel
from apis.services.ask_in_documents_services import AskInDocumentsServices

ask_in_documents_router = APIRouter(prefix="/apis/ask_in_documents", tags=["Ask In Documents"])


@ask_in_documents_router.post("/upload_document", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def upload_document(document_file: UploadFile = File(..., description="Upload document for reference")):
        
        try:
            # Check if the file is a pdf or word document
            if document_file.filename.split('.')[-1] not in ["pdf", "docx", "doc"]:
                return GenericResponseModel(error="Invalid file format", status_code=http.HTTPStatus.BAD_REQUEST, message="Only PDF and Word documents are allowed")
            
            # Read the document file content and save into tmp folder 
            request_object_content = await document_file.read()
            if not os.path.exists('tmp'):
                os.makedirs('tmp')
            uuid_str = str(uuid4())
            unique_file_name = f"{uuid_str}_{document_file.filename}" # Add a unique identifier to the document file name
            document_path = f'tmp/{unique_file_name}'
            with open(document_path, 'wb') as f:
                f.write(request_object_content)
    
            # Upload document to Firebase Storage and create new record in Firestore Database
            services = AskInDocumentsServices()
            document_id = await services.upload_document(file_name=document_file.filename, file_path=document_path)
            
            # Delete the document file in tmp folder
            os.remove(document_path)
    
            return GenericResponseModel(data=document_id, status_code=http.HTTPStatus.OK, message="Document uploaded successfully")
        
        except Exception as e:
            return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")


@ask_in_documents_router.delete("/delete_document", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def delete_document(document_id: str):
    
    try:
        services = AskInDocumentsServices()
        result = await services.delete_document(document_id=document_id)
        
        return GenericResponseModel(data=result, status_code=http.HTTPStatus.OK, message="Document deleted successfully")
    
    except Exception as e:
        return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")


@ask_in_documents_router.get("/get_document/{document_id}", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def get_document(document_id: str):
    
    try:
        services = AskInDocumentsServices()
        document_data = await services.get_document(document_id=document_id)
        
        return GenericResponseModel(data=document_data, status_code=http.HTTPStatus.OK, message="Document retrieved successfully")
    
    except Exception as e:
        return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")
    
@ask_in_documents_router.get("/get_all_documents", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def get_all_documents():
        
        try:
            services = AskInDocumentsServices()
            documents = await services.get_all_documents()
            
            return GenericResponseModel(data=documents, status_code=http.HTTPStatus.OK, message="Documents retrieved successfully")
        
        except Exception as e:
            return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")
    
@ask_in_documents_router.post("/ask", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def ask_in_document(question: str = Form(..., description="Enter your question"), 
                        document_id: str = Form(..., description="Enter the document ID")):
    
    try:
        services = AskInDocumentsServices()
        answers = await services.get_answers(question=question, document_id=document_id)
        
        return GenericResponseModel(data=answers, status_code=http.HTTPStatus.OK, message="Question answered successfully")
    
    except Exception as e:
        return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")
