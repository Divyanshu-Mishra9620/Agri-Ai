from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    query: str

class PredictRequest(BaseModel):
    crop: str
    parameter: str
    change: str

class ImageAnalysisRequest(BaseModel):
    language: Optional[str] = "en"

class AnswerResponse(BaseModel):
    answer: str

class PredictionResponse(BaseModel):
    prediction: str

class AnalysisResponse(BaseModel):
    analysis: str

