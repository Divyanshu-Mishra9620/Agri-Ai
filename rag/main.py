import logging
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging first
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

logger.info("Starting Agri-AI RAG API...")
logger.info(f"Python version: {sys.version}")
logger.info(f"Current working directory: {os.getcwd()}")

try:
    from dotenv import load_dotenv
    load_dotenv()
    logger.info("Environment variables loaded")
except Exception as e:
    logger.warning(f"Could not load .env file: {e}")

try:
    from app.core.config import settings
    logger.info("Settings loaded successfully")
except Exception as e:
    logger.error(f"Failed to load settings: {e}")
    raise

try:
    logger.info("Importing chat endpoint...")
    from app.api.endpoints import chat
    logger.info("Chat endpoint imported successfully")
    
    # Make documents endpoint optional - may not be available with minimal dependencies
    documents = None
    logger.info("Attempting to import documents endpoint (optional)...")
    try:
        from app.api.endpoints import documents
        logger.info("Documents endpoint imported successfully")
    except ImportError as e:
        logger.warning(f"Documents endpoint not available (missing dependencies): {e}")
        logger.info("Continuing without document ingestion features...")
    except Exception as e:
        logger.error(f"Unexpected error importing documents endpoint: {e}")
        logger.info("Continuing without document ingestion features...")
    
    logger.info("API endpoints import completed")
except Exception as e:
    logger.error(f"Failed to import chat endpoint: {e}", exc_info=True)
    raise

logger.info("Creating FastAPI application...")
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="An AI-powered agricultural assistant for SIH.",
    version="1.0.0"
)
logger.info("FastAPI application created")

logger.info("Adding CORS middleware...")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("CORS middleware added")

logger.info("Including routers...")
app.include_router(chat.router, prefix="/api")
if documents is not None:
    app.include_router(documents.router, prefix="/api")
    logger.info("Chat and documents routers included successfully")
else:
    logger.info("Chat router included successfully (documents router skipped)")

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("🚀 Agri-AI RAG API is starting up!")
    logger.info(f"📍 Service: {settings.PROJECT_NAME}")
    logger.info(f"🌐 Environment: {os.getenv('RENDER', 'Local')}")
    logger.info(f"🔑 Gemini API Key configured: {'Yes' if settings.GEMINI_API_KEY else 'No'}")
    logger.info("=" * 50)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Agri-AI Companion API!"}

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Agri-AI RAG API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting uvicorn server on port {port}...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )