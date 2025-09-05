from pydantic import BaseModel
class QueryRequest(BaseModel):
    query: str

class PredictRequest(BaseModel):
    crop: str
    parameter: str
    change: str

class AnswerResponse(BaseModel):
    answer: str

class PredictionResponse(BaseModel):
    prediction: str

class AnalysisResponse(BaseModel):
    analysis: str

