import logging
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.api import schemas
from app.services.rag_system import RAGSystem
from app.dependencies import get_rag_system

router = APIRouter()

@router.post("/get-answer", response_model=schemas.AnswerResponse)
def get_answer(request: schemas.QueryRequest, rag_system: RAGSystem = Depends(get_rag_system)):
    logging.info(f"Received query: {request.query}")
    try:
        logging.info("Getting answer...")
        answer_text = rag_system.get_answer(request.query)
        logging.info(answer_text)
        return schemas.AnswerResponse(answer=answer_text)
    except ConnectionError as e:
        logging.error(f"Ollama connection error: {e}")
        raise HTTPException(
            status_code=503, 
            detail="AI service is unavailable. Please ensure Ollama is running on localhost:11434"
        )
    except Exception as e:
        logging.error(f"An unexpected error occurred in get_answer: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/predict-impact", response_model=schemas.PredictionResponse)
def predict_impact(request: schemas.PredictRequest, rag_system: RAGSystem = Depends(get_rag_system)):
    logging.info(f"Received prediction request for crop: {request.crop}")
    try:
        prediction_text = rag_system.generate_predictive_answer(request.crop, request.parameter, request.change)
        return schemas.PredictionResponse(prediction=prediction_text)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logging.error(f"An unexpected error occurred in predict_impact: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/analyze-crop-image", response_model=schemas.AnalysisResponse)
def analyze_crop_image(file: UploadFile = File(...), rag_system: RAGSystem = Depends(get_rag_system)):
    logging.info(f"Received image for analysis: {file.filename}")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        image_data = file.file.read()
        analysis_text = rag_system.analyze_image(image_data)
        return schemas.AnalysisResponse(analysis=analysis_text)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logging.error(f"An unexpected error occurred in analyze_crop_image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
    
@router.get("/health")
def health_check():
    try:
        response = requests.get(f"{settings.OLLAMA_API_BASE_URL}/api/tags", timeout=10)
        response.raise_for_status()
        return {"status": "healthy", "ollama": "connected"}
    except requests.RequestException:
        return {"status": "unhealthy", "ollama": "disconnected"}