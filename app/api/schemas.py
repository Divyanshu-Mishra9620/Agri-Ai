from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, example="What is the best fertilizer for sugarcane?")

class PredictionRequest(BaseModel):
    crop: str = Field(..., example="wheat")
    parameter: str = Field(..., example="water availability")
    change: str = Field(..., example="-30% due to weak monsoon")

