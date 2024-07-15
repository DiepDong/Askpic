import google.generativeai as genai
from apis.configs.genai_configs import model
from apis.configs.llm_configs import llm, json_parser
from apis.utils.prompts import ask_by_images_prompt_template

class AskByImagesServices():

    def __init__(self) -> None:
        pass
        
    def get_questions(self, image_path: str):

        uploaded_file = genai.upload_file(path=f"{image_path}",
                            display_name="image")

        response = model.generate_content(["""
            Perform OCR on the image. Do not miss any text.""", 
            uploaded_file
        ])

        extracted_text = response.text

        genai.delete_file(uploaded_file.name)

        return extracted_text
    
    @staticmethod
    async def get_answers(questions: str):

        chain = ask_by_images_prompt_template | llm | json_parser

        response = chain.invoke({"text": questions})

        answers = response["response"]

        return answers