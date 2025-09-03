import logging
import io
import base64
from typing import Dict

import requests
from PIL import Image
from fastapi import HTTPException

from app.core.config import settings

class RAGSystem:    
    def __init__(self, collection):
        self.collection = collection
        logging.info(f"RAG System initialized to use Ollama models: {settings.GENERATION_MODEL_NAME} and {settings.VISION_MODEL_NAME}.")

    def _call_ollama_generate(self, model: str, prompt: str, timeout: int = 120) -> Dict:
        try:
            response = requests.post(
                f"{settings.OLLAMA_API_BASE_URL}/generate",
                json={"model": model, "prompt": prompt, "stream": False},
                timeout=timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logging.error(f"Error calling Ollama generate API: {e}")
            raise HTTPException(status_code=503, detail=f"Failed to communicate with Ollama: {e}")

    def _call_ollama_vision(self, model: str, prompt: str, image_data: bytes, timeout: int = 180) -> Dict:
        try:
            encoded_image = base64.b64encode(image_data).decode('utf-8')
            response = requests.post(
                f"{settings.OLLAMA_API_BASE_URL}/generate",
                json={"model": model, "prompt": prompt, "images": [encoded_image], "stream": False},
                timeout=timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logging.error(f"Error calling Ollama vision API: {e}")
            raise HTTPException(status_code=503, detail=f"Failed to communicate with Ollama: {e}")

    def retrieve_context(self, query: str, n_results: int = 5) -> str:
        logging.info(f"Retrieving context for query: '{query}'")
        results = self.collection.query(query_texts=[query], n_results=n_results)
        return "\n---\n".join(results['documents'][0])

    def generate_answer(self, query: str, context: str) -> Dict[str, str]:
        prompt = settings.QA_PROMPT_TEMPLATE.format(context=context, query=query)
        ollama_response = self._call_ollama_generate(settings.GENERATION_MODEL_NAME, prompt)
        return {"answer": ollama_response.get("response", "No response from model.")}

    def generate_predictive_answer(self, crop: str, parameter: str, change: str) -> Dict[str, str]:
        retrieval_query = f"cultivation practices and management for {crop}"
        context = self.retrieve_context(retrieval_query)
        prompt = settings.PREDICTIVE_PROMPT_TEMPLATE.format(crop=crop, context=context, parameter=parameter, change=change)
        ollama_response = self._call_ollama_generate(settings.GENERATION_MODEL_NAME, prompt)
        return {"prediction": ollama_response.get("response", "No response from model.")}

    def analyze_crop_image(self, image_data: bytes) -> Dict[str, str]:
        try:
            Image.open(io.BytesIO(image_data))
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file.")
        
        ollama_response = self._call_ollama_vision(settings.VISION_MODEL_NAME, settings.VISION_PROMPT, image_data)
        return {"analysis": ollama_response.get("response", "No response from model.")}

