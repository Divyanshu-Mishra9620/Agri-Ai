import base64
import logging
import requests
import cv2
import numpy as np
from fastapi import HTTPException

from app.core.config import settings


class RAGSystem:
    def __init__(self, collection):
        self.collection = collection
        self.ollama_base_url = settings.OLLAMA_API_BASE_URL
        self.generation_model = settings.GENERATION_MODEL_NAME
        self.vision_model = settings.VISION_MODEL_NAME

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
        api_url = f"{self.ollama_base_url}/api/chat"
        logging.info(f"api url: {api_url}")
        payload = {
            "model": self.generation_model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
        }

        try:
            response = requests.post(api_url, json=payload, timeout=120)
            logging.info(f"res: {response}")
            logging.info(f"Response: {response.json()}")
            response.raise_for_status()
            return response.json()['message']['content']
        except requests.RequestException as e:
            logging.error(f"Failed to communicate with Ollama: {e}")
            raise ConnectionError(f"Failed to communicate with Ollama: {e}")

    def _invoke_vision_model(self, prompt: str, images: list[str]) -> str:
        api_url = f"{self.ollama_base_url}/api/generate"
        payload = {
            "model": self.vision_model,
            "prompt": prompt,
            "images": images,
            "stream": False,
        }

        try:
            response = requests.post(api_url, json=payload, timeout=180)
            response.raise_for_status()
            return response.json()['response']
        except requests.RequestException as e:
            logging.error(f"Failed to communicate with Ollama vision model: {e}")
            raise ConnectionError(f"Failed to communicate with Ollama vision model: {e}")

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
            np_arr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            target_width = 1024
            if img is None:
                raise HTTPException(status_code=400, detail="Could not decode image data.")

            aspect_ratio = img.shape[0] / img.shape[1]
            target_height = int(target_width * aspect_ratio)
            resized_img = cv2.resize(img, (target_width, target_height), interpolation=cv2.INTER_AREA)

            _, buffer = cv2.imencode('.jpg', resized_img)
            base64_image = base64.b64encode(buffer).decode('utf-8')

            prompt = settings.VISION_PROMPT
            return self._invoke_vision_model(prompt, images=[base64_image])

        except Exception as e:
            logging.error(f"Error during image processing or analysis: {e}")
            raise HTTPException(status_code=500, detail="Error processing image.")
