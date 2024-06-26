from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

system_message_prompt_template = SystemMessagePromptTemplate.from_template("""
You are an expert in answering questions. Your task is to extract the questions with options included in multiple-choice questions from the following text and answer them and give your explanation.
The given text might include redundant information, you must focus only on the questions.
The questions must be answered in a clear and concise manner.
You MUST ONLY respond a string using this format:
    {{
        "response": [
            {{
                "question": str,
                "answer": str,
                "explanation": str
            }}
            # repeat for each question
        ]
            
    }}
""")
human_message_prompt_template = HumanMessagePromptTemplate.from_template("""
This is the text you need to extract questions from: {text}
""")

prompt_template = ChatPromptTemplate.from_messages(
    [
    system_message_prompt_template, human_message_prompt_template
    ]
)