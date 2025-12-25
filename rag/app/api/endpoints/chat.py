import logging
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from app.api import schemas
import json

router = APIRouter()

# Lazy initialization of RAG system to avoid import-time failures
_rag_system = None
_rag_init_lock = False

async def get_rag_system_async():
    """Async lazy initialization of RAG system with timeout"""
    global _rag_system, _rag_init_lock
    
    if _rag_system is None:
        if _rag_init_lock:
            # Another request is already initializing, wait a bit
            import asyncio
            logging.info("⏳ Another request is initializing RAG, waiting...")
            await asyncio.sleep(0.5)
            return await get_rag_system_async()
        
        _rag_init_lock = True
        try:
            import asyncio
            logging.info("🔧 Starting async RAG system initialization...")
            logging.info("⏰ Timeout set to 60 seconds for initialization")
            
            # Import and initialize in thread to avoid blocking
            def init_rag():
                try:
                    logging.info("📦 Importing RAGSystem class...")
                    from app.services.rag_system import RAGSystem
                    logging.info("✅ RAGSystem class imported successfully")
                    logging.info("🚀 Creating RAGSystem instance...")
                    instance = RAGSystem()
                    logging.info("✅ RAGSystem instance created successfully")
                    return instance
                except Exception as e:
                    logging.error(f"❌ Error in init_rag thread: {e}", exc_info=True)
                    raise
            
            _rag_system = await asyncio.wait_for(
                asyncio.to_thread(init_rag),
                timeout=60  # Increased to 60 seconds for cold starts
            )
            logging.info("✅ RAG System initialized successfully (async)")
            
        except asyncio.TimeoutError:
            _rag_init_lock = False
            logging.error("❌ RAG initialization timeout after 60 seconds")
            logging.error("💡 This usually means:")
            logging.error("   1. API keys are not configured")
            logging.error("   2. External API (OpenRouter/Gemini) is not responding")
            logging.error("   3. Network connectivity issues")
            raise HTTPException(
                status_code=503,
                detail="RAG service initialization timeout after 60 seconds. The service is taking too long to start. Please check API keys and try again."
            )
        except Exception as e:
            _rag_init_lock = False
            logging.error(f"❌ Failed to initialize RAG System: {e}", exc_info=True)
            raise HTTPException(
                status_code=503,
                detail=f"RAG service initialization failed: {str(e)}"
            )
        finally:
            _rag_init_lock = False
            
    return _rag_system

def get_rag_system():
    """Synchronous lazy initialization of RAG system (legacy)"""
    global _rag_system
    if _rag_system is None:
        try:
            from app.services.rag_system import RAGSystem
            _rag_system = RAGSystem()
            logging.info("RAG System initialized successfully")
        except Exception as e:
            logging.error(f"Failed to initialize RAG System: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"RAG service initialization failed: {str(e)}"
            )
    return _rag_system

@router.post("/weather-alert", response_model=schemas.AnalysisResponse)
def get_weather_alert_for_location(request: schemas.QueryRequest):
    """
    Accepts a location query and returns a weather alert for farmers.
    """
    logging.info(f"Received weather alert request for: {request.query}")
    try:
        rag_system = get_rag_system()
        alert_text = rag_system.get_weather_alert(city=request.query)
        return schemas.AnalysisResponse(analysis=alert_text)
    except Exception as e:
        logging.error(f"An unexpected error occurred in get_weather_alert: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/get-answer", response_model=schemas.AnswerResponse)
async def get_answer(request: schemas.QueryRequest):
    """
    Receives a user's query and returns an answer based on web search.
    """
    import asyncio
    
    logging.info("=" * 60)
    logging.info(f"🔵 STEP 1: Endpoint entered - Query: {request.query}")
    
    try:
        logging.info("🔵 STEP 2: Initializing RAG system (async with 60s timeout)...")
        rag_system = await get_rag_system_async()
        logging.info("✅ STEP 2 COMPLETE: RAG system initialized successfully")
        
        logging.info("🔵 STEP 3: Calling get_answer() method (async with 90s timeout)...")
        
        try:
            answer_text = await asyncio.wait_for(
                asyncio.to_thread(rag_system.get_answer, request.query),
                timeout=90   
            )
            logging.info(f"✅ STEP 3 COMPLETE: Answer generated, length: {len(answer_text)}")
            
        except asyncio.TimeoutError:
            logging.error("❌ TIMEOUT: RAG system took longer than 90 seconds")
            raise HTTPException(
                status_code=504,
                detail="Request timeout: The AI service took too long to respond. Please try again with a simpler query."
            )
        
        logging.info("🔵 STEP 4: Preparing response...")
        response = schemas.AnswerResponse(answer=answer_text)
        logging.info("✅ STEP 4 COMPLETE: Response prepared")
        
        logging.info("🔵 STEP 5: Returning response to client...")
        logging.info("=" * 60)
        return response
        
    except HTTPException:
        logging.error("❌ HTTP Exception occurred, re-raising...")
        raise
    except ConnectionError as e:
        logging.error(f"❌ Connection error: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {str(e)}")
    except Exception as e:
        logging.error(f"❌ CRITICAL ERROR in get_answer: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/predict-impact", response_model=schemas.PredictionResponse)
def predict_impact(request: schemas.PredictRequest):
    """
    Receives a crop and a scenario, and returns a predictive advisory.
    """
    logging.info(f"Received prediction request for crop: {request.crop}")
    try:
        rag_system = get_rag_system()
        prediction_text = rag_system.generate_predictive_answer(request.crop, request.parameter, request.change)
        return schemas.PredictionResponse(prediction=prediction_text)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logging.error(f"An unexpected error occurred in predict_impact: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/analyze-plant-image", response_model=schemas.AnalysisResponse)
def analyze_crop_image(file: UploadFile = File(...), language: str = "en"):
    """
    Receives an image of a plant leaf and returns a diagnostic report.
    Supports language parameter: 'en' for English, 'hi' for Hindi.
    """
    logging.info(f"Received image for analysis: {file.filename} in language: {language}")
    logging.info(f"Content type: {file.content_type}")
    
    if not file.content_type or not file.content_type.startswith("image/"):
        logging.error(f"Invalid content type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        logging.info("Initializing RAG system for image analysis...")
        rag_system = get_rag_system()
        logging.info("Reading image data...")
        image_data = file.file.read()
        logging.info(f"Image data size: {len(image_data)} bytes")
        logging.info("Starting image analysis...")
        analysis_text = rag_system.analyze_image(image_data, language=language)
        logging.info(f"Analysis complete, result length: {len(analysis_text)} characters")
        return schemas.AnalysisResponse(analysis=analysis_text)
    except ConnectionError as e:
        logging.error(f"Connection error in image analysis: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logging.error(f"An unexpected error occurred in analyze_crop_image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")

@router.post("/analyze-plant-image-stream")
async def analyze_crop_image_stream(file: UploadFile = File(...), language: str = "en"):
    """
    Receives an image of a plant leaf and returns a streaming diagnostic report.
    Supports language parameter: 'en' for English, 'hi' for Hindi.
    """
    logging.info(f"Received image for streaming analysis: {file.filename} in language: {language}")
    
    if not file.content_type or not file.content_type.startswith("image/"):
        logging.error(f"Invalid content type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        logging.info("Initializing RAG system for streaming image analysis...")
        rag_system = get_rag_system()
        image_data = await file.read()
        logging.info(f"Image data size: {len(image_data)} bytes")
        
        async def generate():
            try:
                logging.info("Starting streaming image analysis...")
                # Call the streaming version of analyze_image
                for chunk in rag_system.analyze_image_stream(image_data, language=language):
                    # Send as Server-Sent Events (SSE) format
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                yield "data: [DONE]\n\n"
                logging.info("Streaming analysis complete")
            except Exception as e:
                logging.error(f"Error during streaming: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
        
    except Exception as e:
        logging.error(f"An unexpected error occurred in analyze_crop_image_stream: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")