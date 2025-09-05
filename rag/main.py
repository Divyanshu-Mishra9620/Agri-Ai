import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.endpoints import chat
from app.core.config import settings
from app.utils.data_loader import download_and_process_pdfs
from app.utils import knowledge_base
from app.dependencies import app_state

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Application startup...")
    download_and_process_pdfs(settings.PDF_URLS, settings.DATA_DIR)
    
    collection = knowledge_base.build_or_load_knowledge_base()
    
    app_state["chroma_collection"] = collection
    logging.info("Knowledge base is ready.")
    
    yield
    
    logging.info("Application shutdown.")
    app_state.clear()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="An AI-powered agricultural assistant for SIH.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Agri-AI Companion API!"}

