import logging
import requests
import base64
from fastapi import HTTPException

from app.core.config import settings

proxies = {
    "http": None,
    "https": None,
}

class RAGSystem:
    def __init__(self, collection):
        self.collection = collection
        self.ollama_base_url = settings.OLLAMA_API_BASE_URL
        self.generation_model = settings.GENERATION_MODEL_NAME
        self.vision_model = settings.VISION_MODEL_NAME

    def _retrieve_context(self, query: str, n_results: int = 5) -> str:
        try:
            results = self.collection.query(query_texts=[query], n_results=n_results)
            if not results or not results.get('documents') or not results['documents'][0]:
                logging.warning(f"No context found for query: {query}")
                return ""
            return "\n\n".join(results['documents'][0])
        except Exception as e:
            logging.error(f"Error retrieving context from ChromaDB: {e}")
            return ""

    def _invoke_text_model(self, prompt: str) -> str:
        endpoints_to_try = [
            f"{self.ollama_base_url}/api/chat",
            f"{self.ollama_base_url}/api/generate"
        ]
        logging.info(f"Trying endpoints: {endpoints_to_try}")
    
        for api_url in endpoints_to_try:
            try:
                if "/api/chat" in api_url:
                    payload = {
                        "model": self.generation_model,
                        "messages": [{"role": "user", "content": prompt}],
                        "stream": False
                    }
                else:  
                    payload = {
                        "model": self.generation_model,
                        "prompt": prompt,
                        "stream": False
                    }
                response = requests.post(api_url, json=payload, timeout=120, proxies=proxies)
                response.raise_for_status()
            
                if "/api/chat" in api_url:
                    return response.json()['message']['content']
                else:
                    return response.json()['response']
                
            except requests.RequestException:
                continue  
        raise ConnectionError("Failed to communicate with Ollama through any available endpoint")

    def _invoke_vision_model(self, prompt: str, image_bytes: bytes) -> str:
        api_url = f"{self.ollama_base_url}/api/chat" 
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        payload = {
        "model": self.vision_model,
        "messages": [
            {
                "role": "user",
                "content": prompt,
                "images": [base64_image]
            }
        ],
        "stream": False
        }
    
        try:
            response = requests.post(api_url, json=payload, timeout=180, proxies=proxies)
            response.raise_for_status()
            return response.json()['message']['content']
        except requests.RequestException as e:
            logging.error(f"Failed to communicate with Ollama vision model: {e}")
            raise ConnectionError(f"Failed to communicate with Ollama vision model: {e}")

    def get_answer(self, query: str) -> str:
        context = self._retrieve_context(query)
        logging.info(f"Retrieved context: {context}")
        if not context:
            logging.info("No context retrieved. Using general model knowledge.")
            context = "No specific local documents were found. Use your general agricultural knowledge to answer."
        
        prompt = settings.QA_PROMPT_TEMPLATE.format(context=context, query=query)
        return self._invoke_text_model(prompt)

    def generate_predictive_answer(self, crop: str, parameter: str, change: str) -> str:
        context_query = f"cultivation practices and environmental factors for {crop}"
        context = self._retrieve_context(context_query, n_results=10)
        if not context:
            logging.info(f"No context retrieved for {crop}. Using general knowledge for prediction.")
            context = f"General information about {crop} cultivation."

        prompt = settings.PREDICTIVE_PROMPT_TEMPLATE.format(
            crop=crop, parameter=parameter, change=change, context=context
        )
        return self._invoke_text_model(prompt)
    
    def analyze_image(self, image_bytes: bytes) -> str:
        try:
            prompt = settings.VISION_PROMPT
            return self._invoke_vision_model(prompt, image_bytes=image_bytes)
        except Exception as e:
            logging.error(f"Error during image analysis: {e}")
            raise HTTPException(status_code=500, detail=f"Error processing image: {e}")