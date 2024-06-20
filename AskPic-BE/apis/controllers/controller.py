import http
import io
import os

from fastapi import APIRouter, UploadFile, File
from PIL import Image

from apis.schemas.base import GenericResponseModel
from apis.services.services import Services

askpic_router = APIRouter(prefix="/apis", tags=["AskPic"])

@askpic_router.post("/answer", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def answer(image_file: UploadFile = File(..., description="Image file to extract questions from")):
    
    try:
        # Check if the file is an image
        if image_file.filename.split('.')[-1] not in ['jpg', 'jpeg', 'png']:
            return GenericResponseModel(error="Invalid file format", status_code=http.HTTPStatus.BAD_REQUEST, message="Only jpg, jpeg and png files are allowed")
        
        # Read the image file content and save into tmp folder 
        request_object_content = await image_file.read()
        image_content = Image.open(io.BytesIO(request_object_content))
        image_path = f'tmp/{image_file.filename}'
        image_content.save(image_path)

        # Extract questions from the image and get answers
        services = Services()
        questions = services.get_questions(image_path)
        answers = await services.get_answers(questions)
        
        # Delete the image file in tmp folder
        os.remove(image_path)

        return GenericResponseModel(data=answers, status_code=http.HTTPStatus.OK, message="Questions extracted and answered successfully")
    
    except Exception as e:
        return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")