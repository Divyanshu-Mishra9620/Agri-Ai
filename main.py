import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import chat
from app.core.config import settings
from app.utils.data_loader import download_pdfs, extract_text_from_pdfs
from app.utils.knowledge_base import create_and_populate_chroma_db
from app.services.rag_system import RAGSystem

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="An API for agricultural information using a local Ollama-powered RAG system.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    logging.info("--- Starting Application Initialization ---")
    
    download_pdfs()
    
    documents = extract_text_from_pdfs()
    if not documents:
        logging.error("No documents were processed. The knowledge base will be empty.")
        raise RuntimeError("Failed to load any data. Shutting down.")
    
    collection = create_and_populate_chroma_db(documents)
    
    rag_service = RAGSystem(collection)
    
    chat.rag_service = rag_service
    
    logging.info("--- Application Initialization Complete. API is ready. ---")

app.include_router(chat.router, prefix="/api", tags=["Agricultural Assistant"])

@app.get("/", summary="Health Check", tags=["Root"])
def read_root():
    return {"status": "ok", "message": "Agri-AI Ollama API is running."}

