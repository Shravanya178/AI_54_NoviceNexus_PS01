from fastapi import FastAPI, Request, File, UploadFile, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import os
import sys
import asyncio
import re
from transformers import pipeline

# Add parent directory to path to import other modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from knowledge_base.kb_manager import KnowledgeBaseManager

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API is working!"}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize knowledge base manager
kb_manager = KnowledgeBaseManager()

# Load model from directory
MODEL_PATH = os.environ.get("MODEL_PATH", "C:/Users/sanke/Downloads/AI model/src/model/model_output/final")
generator = None  # Will load on startup

# Common greetings mapping for higher accuracy on simple exchanges
GREETING_PATTERNS = {
    "hi": "Hi!",
    "hello": "Hello!",
    "hey": "Hey there!",
    "how are you": "I'm doing well, thanks for asking!",
    "how are you doing": "I'm doing great! How about you?",
    "what's up": "Not much, just here to help!",
    "good morning": "Good morning!",
    "good afternoon": "Good afternoon!",
    "good evening": "Good evening!",
    "good night": "Good night!",
}

class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None

class QueryResponse(BaseModel):
    response: str
    source_documents: Optional[List[Dict[str, Any]]] = None

@app.on_event("startup")
async def startup_event():
    global generator, kb_manager
    print(f"Loading model from {MODEL_PATH}")
    generator = pipeline('text-generation', model=MODEL_PATH)
    
    # Load knowledge base if it exists
    kb_path = os.environ.get("KB_PATH", "../knowledge_base/kb_data.json")
    index_path = os.environ.get("INDEX_PATH", "../knowledge_base/kb_index.bin")
    
    if os.path.exists(kb_path) and os.path.exists(index_path):
        kb_manager.load_index(index_path, kb_path)
    else:
        print("Knowledge base files not found. KB retrieval will not be available.")

def post_process_generated_text(text, max_length=50):
    """
    Clean and filter repetitive content in AI responses,
    enforcing a strict maximum length and removing prompt instructions.
    """
    # Extract only the AI response part
    if "AI:" in text:
        text = text.split("AI:")[-1].strip()
    
    # Remove any remaining instruction patterns
    instruction_patterns = [
        r'\(respond in one or two short sentences\)',
        r'\(be brief\)',
        r'\(be concise\)'
    ]
    for pattern in instruction_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE).strip()
    
    # Remove exact duplicate sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    seen = set()
    cleaned_sentences = []

    for sentence in sentences:
        normalized = re.sub(r'\s+', ' ', sentence.lower().strip())
        if normalized not in seen and len(normalized) > 5:
            seen.add(normalized)
            cleaned_sentences.append(sentence)

    # Limit to first 1-2 sentences for conciseness
    if len(cleaned_sentences) > 2:
        cleaned_sentences = cleaned_sentences[:2]
        
    cleaned_text = ' '.join(cleaned_sentences)
    
    # Truncate to max_length if needed
    if len(cleaned_text) > max_length:
        # Find the last complete sentence within the limit
        last_period = cleaned_text[:max_length].rfind('.')
        last_question = cleaned_text[:max_length].rfind('?')
        last_exclamation = cleaned_text[:max_length].rfind('!')
        
        last_terminal = max(last_period, last_question, last_exclamation)
        
        if last_terminal > 0:
            cleaned_text = cleaned_text[:last_terminal+1]
        else:
            cleaned_text = cleaned_text[:max_length]
    
    # Remove excessive whitespace
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    
    # Make sure the response ends with proper punctuation
    if cleaned_text and not cleaned_text[-1] in ['.', '!', '?']:
        cleaned_text += '.'
        
    return cleaned_text

def check_for_predefined_response(query):
    """
    Check if the query matches any predefined patterns for more accurate responses.
    Returns the predefined response or None if no match.
    """
    # Normalize query for matching
    normalized_query = query.lower().strip()
    
    # Check exact matches first
    if normalized_query in GREETING_PATTERNS:
        return GREETING_PATTERNS[normalized_query]
    
    # Check if the query starts with any of the patterns
    for pattern, response in GREETING_PATTERNS.items():
        if normalized_query.startswith(pattern):
            return response
            
    return None

@app.post("/generate", response_model=QueryResponse)
async def generate_response(request: QueryRequest):
    # Validate query length
    if len(request.query) > 500:
        return QueryResponse(response="Query too long. Please limit to 500 characters.", source_documents=None)
    
    # Check for predefined responses first for higher accuracy
    predefined_response = check_for_predefined_response(request.query)
    if predefined_response:
        return QueryResponse(response=predefined_response, source_documents=None)
    
    # Retrieve relevant context from knowledge base
    kb_results = []
    if kb_manager.index is not None:
        kb_results = kb_manager.retrieve(request.query, top_k=3)
    
    # Format context
    context_text = "\n".join([f"- {doc['content']}" for doc in kb_results]) if kb_results else ""
    
    # Format prompt with instruction as a system message
    prompt = f"{context_text}\nSystem: Respond in one or two short sentences only.\nUser: {request.query}\nAI:"
    
    # Generate response with optimized parameters for accuracy
    response = generator(
        prompt, 
        max_length=150,
        num_return_sequences=1,
        do_sample=True,
        temperature=0.5,  # Lower temperature for even more focused responses
        repetition_penalty=1.9,  # Higher penalty to avoid repetition
        top_k=30,         # Be more selective with word choices
        top_p=0.90,       # Slightly more focused sampling
        no_repeat_ngram_size=2
    )
    
    generated_text = response[0]["generated_text"]
    
    # Apply post-processing with length limit
    cleaned_response = post_process_generated_text(generated_text, max_length=70)
    
    return QueryResponse(response=cleaned_response, source_documents=kb_results if kb_results else None)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            request = json.loads(data)
            
            # Process query
            if request.get("type") == "query":
                query = request.get("query", "")
                
                # Validate query length
                if len(query) > 500:
                    await websocket.send_json({"error": "Query too long. Please limit to 500 characters."})
                    continue
                
                # Check for predefined responses first for higher accuracy
                predefined_response = check_for_predefined_response(query)
                if predefined_response:
                    await websocket.send_json({
                        "type": "response",
                        "text": predefined_response,
                        "sources": None
                    })
                    continue
                
                # Get response from model
                kb_results = []
                if kb_manager.index is not None:
                    kb_results = kb_manager.retrieve(query, top_k=3)
                
                # Format context
                context_text = "\n".join([f"- {doc['content']}" for doc in kb_results]) if kb_results else ""
                
                # Format prompt with instruction as a system message
                prompt = f"{context_text}\nSystem: Respond in one or two short sentences only.\nUser: {query}\nAI:"
                
                # Generate response with optimized parameters for accuracy
                response = generator(
                    prompt, 
                    max_length=150,
                    num_return_sequences=1,
                    do_sample=True,
                    temperature=0.5,
                    repetition_penalty=1.9,
                    top_k=30,
                    top_p=0.90,
                    no_repeat_ngram_size=2
                )
                
                generated_text = response[0]["generated_text"]
                
                # Apply post-processing with length limit
                cleaned_response = post_process_generated_text(generated_text, max_length=70)
                
                # Send response back to client
                await websocket.send_json({
                    "type": "response",
                    "text": cleaned_response,
                    "sources": kb_results if kb_results else None
                })
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)