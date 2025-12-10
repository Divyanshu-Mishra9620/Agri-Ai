import logging
from fastapi import HTTPException
from io import BytesIO
import base64
from PIL import Image
import json
import time

from app.core.config import settings
from app.services.web_search import search_the_web
import requests

# Make vector store optional to avoid heavy dependencies
try:
    from app.services.vector_store import VectorStore
    VECTOR_STORE_AVAILABLE = True
except ImportError:
    VECTOR_STORE_AVAILABLE = False
    logging.warning("Vector store dependencies not available. Document retrieval disabled.")

class RAGSystem:
    def __init__(self):
        """Initialize RAG System with OpenRouter API"""
        self.api_key = settings.OPENROUTER_API_KEY or settings.GEMINI_API_KEY
        self.text_model = settings.OPENROUTER_MODEL
        self.vision_model = settings.OPENROUTER_VISION_MODEL
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
        if not self.api_key:
            raise ValueError("No API key found! Set OPENROUTER_API_KEY or GEMINI_API_KEY in .env")
        
        logging.info(f"RAG System initialized with OpenRouter (Model: {self.text_model})")
        
        # Initialize vector store only if dependencies are available
        if VECTOR_STORE_AVAILABLE:
            try:
                self.vector_store = VectorStore(
                    persist_directory="./chroma_db",
                    collection_name="agri_docs"
                )
                logging.info("RAG System initialized with vector store")
            except Exception as e:
                logging.warning(f"Could not initialize vector store: {e}")
                self.vector_store = None
        else:
            self.vector_store = None
            logging.info("RAG System initialized without vector store (lightweight mode)")
    
    def _call_openrouter(self, messages: list, model: str = None, max_tokens: int = 4000, max_retries: int = 3) -> str:
        """
        Generic method to call OpenRouter API with retry logic for rate limits
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (defaults to self.text_model)
            max_tokens: Maximum tokens in response
            max_retries: Maximum number of retry attempts for rate limits
            
        Returns:
            str: Response text from the model
        """
        if model is None:
            model = self.text_model
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://krishinova.app",  # Optional: your site URL
            "X-Title": "Krishi Mitra"  # Optional: your app name
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        for attempt in range(max_retries):
            try:
                logging.info(f"Calling OpenRouter API with model: {model} (attempt {attempt + 1}/{max_retries})")
                response = requests.post(
                    self.base_url,
                    headers=headers,
                    json=payload,
                    timeout=30
                )
                
                # Handle rate limiting with exponential backoff
                if response.status_code == 429:
                    if attempt < max_retries - 1:
                        wait_time = (2 ** attempt) * 2  # 2, 4, 8 seconds
                        logging.warning(f"Rate limit hit. Waiting {wait_time} seconds before retry...")
                        time.sleep(wait_time)
                        continue
                    else:
                        error_msg = "OpenRouter rate limit exceeded. The free tier has limited requests. Please try again in a few moments or consider upgrading your OpenRouter plan."
                        logging.error(error_msg)
                        raise ConnectionError(error_msg)
                
                response.raise_for_status()
                
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content']
                else:
                    raise ValueError(f"Unexpected response format: {data}")
                    
            except requests.exceptions.Timeout:
                logging.error("OpenRouter API request timed out")
                if attempt < max_retries - 1:
                    wait_time = 3
                    logging.info(f"Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                raise ConnectionError("AI service is taking too long to respond. Please try again.")
            except requests.exceptions.RequestException as e:
                if hasattr(e, 'response') and e.response is not None:
                    try:
                        error_data = e.response.json()
                        error_msg = error_data.get('error', {}).get('message', str(e))
                        logging.error(f"API Error Details: {error_msg}")
                        
                        # Don't retry on client errors (except 429)
                        if e.response.status_code != 429:
                            raise ConnectionError(f"AI service error: {error_msg}")
                    except:
                        pass
                
                if attempt < max_retries - 1:
                    wait_time = 2
                    logging.info(f"Request failed, retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                    
                logging.error(f"OpenRouter API error after {max_retries} attempts: {e}")
                raise ConnectionError(f"An unexpected error occurred while processing your request: {e}")
        
        raise ConnectionError("Failed to get response from AI service after multiple attempts")

    def get_weather_alert(self, city: str = "Gorakhpur") -> str:
        """
        Fetch 5-day forecast from OpenWeather API, return analysis text.
        On transient fetch/analysis errors, return a friendly message string
        instead of raising ConnectionError (so endpoint can return 200).
        """
        try:
            logging.info(f"Fetching weather forecast for {city} from OpenWeather API...")
            api_url = (
                f"https://api.openweathermap.org/data/2.5/forecast"
                f"?q={city}&appid={settings.OPENWEATHER_API_KEY}"
                f"&units=metric&cnt=40"  # cnt=40 gives ~5 days (40 * 3 hours)
        )
            resp = requests.get(api_url, timeout=10)
            resp.raise_for_status()
            weather_data = resp.json()
        except requests.RequestException as e:
            logging.error(f"Failed to fetch weather data: {e}")
            return "Sorry, I couldn't fetch the weather forecast at the moment."

        try:
            forecast_summary = self._summarize_openweather_forecast(weather_data)
            prompt = settings.WEATHER_ALERT_PROMPT.format(weather_data=forecast_summary)
            
            # Use OpenRouter API
            messages = [{"role": "user", "content": prompt}]
            analysis_text = self._call_openrouter(messages)
            return analysis_text
        except Exception as e:
            logging.exception("Error analyzing weather data")
            return "Sorry, I couldn't analyze the weather data at the moment."

    def _summarize_openweather_forecast(self, data: dict) -> str:
        """Helper function to create a simple text summary from OpenWeather API data."""
        from datetime import datetime
        
        city_name = data['city']['name']
        country = data['city']['country']
        summary = f"Weather Forecast for {city_name}, {country}:\n\n"
        
        # Group forecasts by date (OpenWeather provides 3-hour intervals)
        daily_forecasts = {}
        
        for forecast in data['list']:
            # Convert timestamp to date
            date_str = datetime.fromtimestamp(forecast['dt']).strftime('%Y-%m-%d')
            
            if date_str not in daily_forecasts:
                daily_forecasts[date_str] = {
                    'temps': [],
                    'conditions': [],
                    'wind_speeds': [],
                    'precipitation': 0,
                    'humidity': []
                }
            
            # Collect data for this day
            daily_forecasts[date_str]['temps'].append(forecast['main']['temp'])
            daily_forecasts[date_str]['conditions'].append(forecast['weather'][0]['description'])
            daily_forecasts[date_str]['wind_speeds'].append(forecast['wind']['speed'])
            daily_forecasts[date_str]['humidity'].append(forecast['main']['humidity'])
            
            # Add precipitation if exists (rain or snow)
            if 'rain' in forecast and '3h' in forecast['rain']:
                daily_forecasts[date_str]['precipitation'] += forecast['rain']['3h']
            if 'snow' in forecast and '3h' in forecast['snow']:
                daily_forecasts[date_str]['precipitation'] += forecast['snow']['3h']
        
        # Create daily summary (limit to 7 days for consistency)
        for date, day_data in sorted(daily_forecasts.items())[:7]:
            avg_temp = sum(day_data['temps']) / len(day_data['temps'])
            max_temp = max(day_data['temps'])
            min_temp = min(day_data['temps'])
            max_wind = max(day_data['wind_speeds'])
            avg_humidity = sum(day_data['humidity']) / len(day_data['humidity'])
            # Most common condition
            most_common_condition = max(set(day_data['conditions']), 
                                       key=day_data['conditions'].count)
            
            summary += (
                f" - {date}: "
                f"Temp: {min_temp:.1f}°C to {max_temp:.1f}°C (Avg: {avg_temp:.1f}°C), "
                f"Max Wind: {max_wind:.1f} m/s, "
                f"Total Precip: {day_data['precipitation']:.1f} mm, "
                f"Humidity: {avg_humidity:.0f}%, "
                f"Condition: {most_common_condition}\n"
            )
        
        return summary.strip()

    def get_answer(self, query: str) -> str:
        """
        Generates an answer by:
        1. First searching the local document vector store (if available)
        2. If insufficient, queries Gemini directly
        3. Falls back to web search if needed
        """
        try:
            # Step 1: Search local documents first (if vector store is available)
            if self.vector_store:
                logging.info(f"Searching local documents for query: '{query}'")
                try:
                    doc_results = self.vector_store.search(query, n_results=3)
                    
                    if doc_results and doc_results['documents'][0]:
                        # We have relevant documents
                        documents = doc_results['documents'][0]
                        metadatas = doc_results['metadatas'][0]
                        
                        # Build context from retrieved documents
                        doc_context = "\n\n".join([
                            f"Document: {meta.get('filename', 'Unknown')}\n{doc}"
                            for doc, meta in zip(documents, metadatas)
                        ])
                        
                        logging.info(f"Found {len(documents)} relevant documents in vector store")
                        
                        # Generate answer using document context with OpenRouter
                        doc_prompt = f"""Based on the following agricultural documents, answer the question accurately and comprehensively.

Documents:
{doc_context}

Question: {query}

Please provide a detailed answer based on the documents above. If the documents don't contain enough information, say so clearly."""
                        
                        messages = [{"role": "user", "content": doc_prompt}]
                        doc_answer = self._call_openrouter(messages)
                        
                        # Check if the document-based answer is sufficient
                        refusal_keywords = [
                            "I cannot", "I am unable", "I don't have enough information",
                            "documents don't contain", "not enough information"
                        ]
                        
                        if not any(keyword.lower() in doc_answer.lower() for keyword in refusal_keywords):
                            logging.info("Document-based answer is sufficient. Returning to user.")
                            return doc_answer
                        else:
                            logging.info("Document-based answer was insufficient. Proceeding to direct query.")
                    else:
                        logging.info("No relevant documents found in vector store.")
                except Exception as e:
                    logging.warning(f"Error searching vector store: {e}. Falling back to direct query.")
            else:
                logging.info("Vector store not available. Using direct query mode.")
            
            # Step 2: Try direct query with OpenRouter
            logging.info(f"Attempting to get a direct answer for query: '{query}'")
            direct_prompt = settings.DISTRICT_REPORT_PROMPT.format(district_name=query)
            messages = [{"role": "user", "content": direct_prompt}]
            initial_answer = self._call_openrouter(messages, max_tokens=1500)  # Reduced for faster response

            # Skip web search for district queries - just return the initial answer
            # Web search adds 30-60 seconds and often times out
            if "district" in query.lower() or "farming in" in query.lower():
                logging.info("District query detected. Returning direct answer without web search.")
                return initial_answer

            refusal_keywords = ["I cannot", "I am unable", "I don't have enough information"]
            if not any(keyword in initial_answer for keyword in refusal_keywords):
                logging.info("Direct answer is sufficient. Returning to user.")
                return initial_answer

            # Step 3: Fall back to web search
            logging.info(f"Direct answer was insufficient. Initiating web search for: '{query}'")
            web_context = search_the_web(query)
            
            if not web_context or "error" in web_context.lower():
                logging.warning("Web search failed or returned no results.")
                return initial_answer
            
            web_prompt = settings.WEB_SEARCH_PROMPT_TEMPLATE.format(context=web_context, query=query)
            messages = [{"role": "user", "content": web_prompt}]
            final_answer = self._call_openrouter(messages)
            return final_answer

        except Exception as e:
            logging.error(f"An error occurred in the answer generation pipeline: {e}", exc_info=True)
            raise ConnectionError(f"An unexpected error occurred while processing your request: {e}")

    def generate_predictive_answer(self, crop: str, parameter: str, change: str) -> str:
        """
        Generates a predictive advisory by searching the web for context.
        """
        context_query = f"cultivation practices and environmental risk factors for {crop}"
        logging.info(f"Initiating web search for predictive context: '{context_query}'")
        
        web_context = search_the_web(context_query)
        if not web_context:
            return f"I was unable to retrieve sufficient information about {crop} to generate a predictive analysis."
        
        prompt = settings.PREDICTIVE_PROMPT_TEMPLATE.format(
            crop=crop, parameter=parameter, change=change, context=web_context
        )
        messages = [{"role": "user", "content": prompt}]
        answer = self._call_openrouter(messages)
        return answer

    def analyze_image(self, image_bytes: bytes, language: str = "en") -> str:
        """
        Analyzes a plant image using OpenRouter Vision model.
        Supports both English and Hindi output based on the language parameter.
        """
        try:
            logging.info(f"Analyzing image with OpenRouter Vision in {language}...")
            
            # Select prompt based on language
            if language.lower() == "hi":
                prompt = settings.VISION_PROMPT_HINDI
            else:
                prompt = settings.VISION_PROMPT
            
            # Convert image to base64
            img = Image.open(BytesIO(image_bytes))
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            # OpenRouter vision format
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{img_base64}"
                            }
                        }
                    ]
                }
            ]
            
            analysis = self._call_openrouter(messages, model=self.vision_model)
            return analysis
        except Exception as e:
            logging.error(f"Error during image analysis: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to process or analyze the image.")