import base64
import logging
import requests
import cv2
import numpy as np
from fastapi import HTTPException
from transformers import pipeline
import torch

from app.core.config import settings

class RAGSystem:
    def __init__(self, collection):
        self.collection = collection
        self.ollama_base_url = settings.OLLAMA_API_BASE_URL
        self.generation_model = settings.GENERATION_MODEL_NAME
        
        self.hf_token = settings.HUGGINGFACE_API_TOKEN
        self.vision_model = settings.VISION_MODEL_NAME
        self.vision_analyzer = None
        
    def _initialize_vision_model(self):
        """Initialize the Hugging Face vision model only"""
        if self.vision_analyzer is None:
            try:
                self.vision_analyzer = pipeline(
                    "image-to-text",
                    model=self.vision_model,
                    token=self.hf_token,
                    torch_dtype=torch.float16,
                    device_map="auto",
                    max_new_tokens=300
                )
            except Exception as e:
                logging.error(f"Failed to initialize vision model: {e}")
                raise ConnectionError(f"Failed to initialize vision model: {e}")

    def _retrieve_context(self, query: str, n_results: int = 5) -> str:
        try:
            logging.info(f"Retrieving context for query: {query}")
            results = self.collection.query(query_texts=[query], n_results=n_results)
            logging.info(f"Retrieved {len(results['documents'][0])} documents from ChromaDB.")
            return "\n\n".join(results['documents'][0])
        except Exception as e:
            logging.error(f"Error retrieving context from ChromaDB: {e}")
            return ""

    def _invoke_text_model(self, prompt: str) -> str:
        """Use Ollama for text generation"""
        api_url = f"{self.ollama_base_url}/api/chat"
        payload = {
            "model": self.generation_model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
        }

        try:
            response = requests.post(api_url, json=payload, timeout=120)
            response.raise_for_status()
            return response.json()['message']['content']
        except requests.RequestException as e:
            logging.error(f"Failed to communicate with Ollama: {e}")
            raise ConnectionError(f"Failed to communicate with Ollama: {e}")

    def _invoke_vision_model(self, prompt: str, image_bytes: bytes) -> str:
        """Use Hugging Face for vision analysis"""
        self._initialize_vision_model()
        
        try:
            np_arr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(status_code=400, detail="Could not decode image data.")
            
            if img.shape[0] > 512 or img.shape[1] > 512:
                img = cv2.resize(img, (512, 512), interpolation=cv2.INTER_AREA)
            
            response = self.vision_analyzer(
                img,
                prompt=prompt,
                max_new_tokens=400,
                temperature=0.1
            )
            
            return response[0]['generated_text']
            
        except Exception as e:
            logging.error(f"Failed to analyze image with Hugging Face: {e}")
            raise ConnectionError(f"Failed to analyze image: {e}")

    def get_answer(self, query: str) -> str:
        context = self._retrieve_context(query)
        if not context:
            return "I could not find relevant information in my knowledge base to answer your question."

        prompt = settings.QA_PROMPT_TEMPLATE.format(context=context, query=query)
        logging.info(prompt)
        return self._invoke_text_model(prompt)

    def generate_predictive_answer(self, crop: str, parameter: str, change: str) -> str:
        context_query = f"cultivation practices and environmental factors for {crop}"
        context = self._retrieve_context(context_query)

        if not context:
            return f"I do not have enough information about {crop} to make a prediction."

        prompt = settings.PREDICTIVE_PROMPT_TEMPLATE.format(
            crop=crop,
            parameter=parameter,
            change=change,
            context=context,
        )
        return self._invoke_text_model(prompt)

    def analyze_image(self, image_bytes: bytes) -> str:
        try:
            prompt = settings.VISION_PROMPT
            return self._invoke_vision_model(prompt, image_bytes)

        except Exception as e:
            logging.error(f"Error during image processing or analysis: {e}")
            raise HTTPException(status_code=500, detail="Error processing image.")