import logging
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.services.rag_system import RAGSystem
from app.api import schemas
from fastapi import Depends
from app.dependencies import get_rag_system

class QueryRequest(BaseModel):
    query: str

class AnswerResponse(BaseModel):
    answer: str

class PredictiveRequest(BaseModel):
    crop: str
    parameter: str
    change: str

class PredictiveResponse(BaseModel):
    answer: str

class AnalysisResponse(BaseModel):
    report: str

router = APIRouter()

rag_system = RAGSystem()

@router.post("/weather-alert", response_model=AnalysisResponse)
async def get_weather_alert_for_location(request: QueryRequest, rag_system: RAGSystem = Depends(get_rag_system)):
    """
    Accepts a location query and returns a weather alert for farmers.
    """
    logging.info(f"Received weather alert request for: {request.query}")
    try:
        alert_text = rag_system.get_weather_alert(city=request.query)
        return {"report": alert_text}
    except Exception as e:
        logging.error(f"An unexpected error occurred in get_weather_alert: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")


@router.post("/get-answer", response_model=AnswerResponse, summary="Get Direct Answer via Web Search")
async def get_answer(request: QueryRequest):
    """
    Receives a user's query, performs a real-time web search, and returns
    a synthesized, data-driven report.
    """
    try:
        answer_text = rag_system.get_answer(request.query)
        return AnswerResponse(answer=answer_text)
    except ConnectionError as e:
        logging.error(f"AI service connection error: {e}")
        raise HTTPException(status_code=503, detail=f"AI service is unavailable: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred in get_answer: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/predict-impact", response_model=PredictiveResponse, summary="Get Predictive Agricultural Advisory")
async def predict_impact(request: PredictiveRequest):
    """
    Receives a crop and a scenario, and returns a predictive
    advisory report based on web search context.
    """
    try:
        prediction_text = rag_system.generate_predictive_answer(
            crop=request.crop,
            parameter=request.parameter,
            change=request.change
        )
        return PredictiveResponse(answer=prediction_text)
    except Exception as e:
        logging.error(f"An unexpected error occurred in predict_impact: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/analyze-plant-image", response_model=AnalysisResponse, summary="Analyze Plant Leaf Image")
async def analyze_plant_image(file: UploadFile = File(...)):
    """
    Receives an image of a plant leaf, analyzes it for diseases or deficiencies,
    and returns a professional diagnostic report.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        image_bytes = await file.read()
        analysis_text = rag_system.analyze_image(image_bytes)
        return AnalysisResponse(report=analysis_text)
    except Exception as e:
        logging.error(f"An unexpected error occurred in analyze_plant_image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.get("/health", summary="Health Check")
def health_check():
    """
    A simple health check endpoint to confirm the API is running.
    """
    return {"status": "healthy", "service": "Krishi Mitra AI Companion"}