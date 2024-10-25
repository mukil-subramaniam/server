from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import spacy
import json

# Load external dataset
with open("external_dataset1.json", "r") as file:
    external_dataset = json.load(file)

nlp = spacy.load("en_core_web_sm")
app = FastAPI()

origins = ["*"]

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    text: str

def recognize_intent(user_input):
    user_tokens = nlp(user_input.lower())
    best_matching_entry = None
    max_matched_keywords = 0

    for entry in external_dataset:
        pattern_keywords = entry["patterns"]
        matched_keywords = sum(keyword in user_tokens.text for keyword in pattern_keywords)

        if matched_keywords > max_matched_keywords:
            best_matching_entry = entry
            max_matched_keywords = matched_keywords

    return best_matching_entry

@app.get("/api/v2/chatbot")
def getreq():
    return {"on kec chatbot"}

@app.post("/api/v2/generate_text")
async def process_input(user_input: UserInput):

    matched_entry = recognize_intent(user_input.text)
    if matched_entry:
        response = matched_entry["response"]
        return { response}
    else:
        return {"I'm sorry, I don't have a response for that."}

