import logging
from fastapi import APIRouter, HTTPException, File, UploadFile

from app.api.schemas import QueryRequest, PredictionRequest
from app.services.rag_system import RAGSystem

router = APIRouter()

rag_service: RAGSystem = None

@router.post("/get-answer", summary="Get Answer to an Agricultural Query")
def get_answer(request: QueryRequest):
    if not rag_service: raise HTTPException(status_code=503, detail="RAG system not initialized.")
    try:
        context = rag_service.retrieve_context(request.query)
        if not context.strip():
            return {"answer": "I could not find relevant information in my documents to answer your question."}
        return rag_service.generate_answer(request.query, context)
    except Exception as e:
        logging.error(f"Error processing /get-answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-impact", summary="Predict Impact of Environmental Changes")
def predict_impact(request: PredictionRequest):
    if not rag_service: raise HTTPException(status_code=503, detail="RAG system not initialized.")
    try:
        return rag_service.generate_predictive_answer(request.crop, request.parameter, request.change)
    except Exception as e:
        logging.error(f"Error processing /predict-impact: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-crop-image", summary="Analyze a Crop Image for Defects")
async def analyze_crop_image(file: UploadFile = File(...)):
    if not rag_service: raise HTTPException(status_code=503, detail="RAG system not initialized.")
    if not file.content_type.startswith("image/"): raise HTTPException(status_code=400, detail="Invalid file type.")
    try:
        image_data = await file.read()
        return rag_service.analyze_crop_image(image_data)
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        logging.error(f"Error processing /analyze-crop-image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

