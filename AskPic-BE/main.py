import http
import json

import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from fastapi.middleware.cors import CORSMiddleware

from apis.controllers.controller import askpic_router

app = FastAPI()
app.title = "AskPic API Service"
app.version = "0.0.1"

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, change this in production to specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Create a GET method that responds with HTML code
@app.get('/', tags=['home'])
def message():
    return HTMLResponse('<h1>AskPic API Service</h1>')

app.include_router(askpic_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
