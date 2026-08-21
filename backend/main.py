import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google import genai
from google.genai import types

app = FastAPI(title="Smart Campus AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client()

# Load custom campus knowledge base text file
campus_data = ""
info_path = os.path.join(os.path.dirname(__file__), "campus_info.txt")
if os.path.exists(info_path):
    with open(info_path, "r", encoding="utf-8") as f:
        campus_data = f.read()

campus_instructions = (
    "You are the official Smart Campus AI Assistant. Your job is to help students, "
    "faculty, and visitors with university buildings, schedules, campus events, dining options, "
    "and student resources. Use the following official Campus Information Knowledge Base "
    "to answer accurately:\n\n"
    f"{campus_data}\n\n"
    "Keep your answers concise, friendly, and practical based on this data."
)

chat = client.chats.create(
    model="gemini-3.6-flash",
    config=types.GenerateContentConfig(
        system_instruction=campus_instructions,
        temperature=0.7,
    ),
)

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "Smart Campus AI Backend is running with custom knowledge base!"}

@app.post("/generate")
async def generate_text(request: PromptRequest):
    try:
        def stream_generator():
            response_stream = chat.send_message_stream(request.prompt)
            for chunk in response_stream:
                if chunk.text:
                    yield chunk.text
        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
