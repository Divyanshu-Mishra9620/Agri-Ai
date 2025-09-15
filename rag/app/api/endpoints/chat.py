import logging
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.api import schemas
from app.services.rag_system import RAGSystem

router = APIRouter()

rag_system = RAGSystem()

@router.post("/weather-alert", response_model=schemas.AnalysisResponse)
def get_weather_alert_for_location(request: schemas.QueryRequest):
    """
    Accepts a location query and returns a weather alert for farmers.
    """
    logging.info(f"Received weather alert request for: {request.query}")
    try:
        alert_text = rag_system.get_weather_alert(city=request.query)
        return schemas.AnalysisResponse(analysis=alert_text)
    except Exception as e:
        logging.error(f"An unexpected error occurred in get_weather_alert: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/get-answer", response_model=schemas.AnswerResponse)
def get_answer(request: schemas.QueryRequest):
    """
    Receives a user's query and returns an answer based on web search.
    """
    logging.info(f"Received query: {request.query}")
    try:
        answer_text = rag_system.get_answer(request.query)
        return schemas.AnswerResponse(answer=answer_text)
    except ConnectionError as e:
        logging.error(f"A connection error occurred: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred in get_answer: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/predict-impact", response_model=schemas.PredictionResponse)
def predict_impact(request: schemas.PredictRequest):
    """
    Receives a crop and a scenario, and returns a predictive advisory.
    """
    logging.info(f"Received prediction request for crop: {request.crop}")
    try:
        prediction_text = rag_system.generate_predictive_answer(request.crop, request.parameter, request.change)
        return schemas.PredictionResponse(prediction=prediction_text)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logging.error(f"An unexpected error occurred in predict_impact: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.post("/analyze-plant-image", response_model=schemas.AnalysisResponse)
def analyze_crop_image(file: UploadFile = File(...)):
    """
    Receives an image of a plant leaf and returns a diagnostic report.
    """
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