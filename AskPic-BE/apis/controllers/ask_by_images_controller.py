import http
import io
import os

from fastapi import APIRouter, UploadFile, File, Form
from PIL import Image

from apis.schemas.base import GenericResponseModel
from apis.services.ask_by_images_services import AskByImagesServices

ask_by_images_router = APIRouter(prefix="/apis/ask_by_images", tags=["Ask By Images"])


@ask_by_images_router.post("/ask", status_code=http.HTTPStatus.OK, response_model=GenericResponseModel)
async def ask(image_file: UploadFile = File(..., description="Upload the image file to extract questions from")):
    try:
        # Check if the file is an image
        if image_file.filename.split('.')[-1] not in ['jpg', 'jpeg', 'png']:
            return GenericResponseModel(error="Invalid file format", status_code=http.HTTPStatus.BAD_REQUEST, message="Only jpg, jpeg and png files are allowed")
        
        # Read the image file content and save into tmp folder 
        request_object_content = await image_file.read()
        image_content = Image.open(io.BytesIO(request_object_content))
        if not os.path.exists('tmp'):
            os.makedirs('tmp')
        image_path = f'tmp/{image_file.filename}'
        image_content.save(image_path)

        # Extract questions from the image and get answers
        services = AskByImagesServices()
        questions = services.get_questions(image_path=image_path)
        answers = await services.get_answers(questions=questions)
        
        # Delete the image file in tmp folder
        os.remove(image_path)

        return GenericResponseModel(data=answers, status_code=http.HTTPStatus.OK, message="Questions extracted and answered successfully")
    
    except Exception as e:
        return GenericResponseModel(error=str(e), status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR, message="An error occurred")
