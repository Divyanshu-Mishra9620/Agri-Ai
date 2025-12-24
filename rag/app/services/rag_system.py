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

try:
    from app.services.vector_store import VectorStore
    VECTOR_STORE_AVAILABLE = True
except ImportError:
    VECTOR_STORE_AVAILABLE = False
    logging.warning("Vector store dependencies not available. Document retrieval disabled.")

class RAGSystem:
    def __init__(self):
        """Initialize RAG System with OpenRouter API"""
        logging.info("Starting RAG System initialization...")
        
        self.api_key = settings.OPENROUTER_API_KEY or settings.GEMINI_API_KEY
        self.text_model = settings.OPENROUTER_MODEL
        self.vision_model = settings.OPENROUTER_VISION_MODEL
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
        if not self.api_key:
            logging.error("No API key found!")
            raise ValueError("No API key found! Set OPENROUTER_API_KEY or GEMINI_API_KEY in .env")
        
        logging.info(f"API key configured, using OpenRouter (Model: {self.text_model})")
        
        if VECTOR_STORE_AVAILABLE:
            logging.info("Vector store dependencies available, attempting initialization...")
            try:
                import os
                if os.getenv('RENDER'):
                    logging.info("Running on Render, skipping vector store initialization (no persistent storage)")
                    self.vector_store = None
                else:
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
            logging.info("Vector store dependencies not available (lightweight mode)")
        
        logging.info("RAG System initialization complete!")
    
    def _call_openrouter_stream(self, messages: list, model: str = None, max_tokens: int = 4000, timeout: int = None):
        """
        Stream responses from OpenRouter API
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (defaults to self.text_model)
            max_tokens: Maximum tokens in response
            timeout: Request timeout in seconds (auto-determined if None)
            
        Yields:
            str: Chunks of response text from the model
        """
        if model is None:
            model = self.text_model
            
        # Auto-determine timeout based on model type
        if timeout is None:
            if model == self.vision_model or 'vision' in model.lower() or 'gpt-4o' in model.lower():
                timeout = 120
            else:
                timeout = 45
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://krishinova.app",
            "X-Title": "Krishi Mitra"
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7,
            "stream": True  # Enable streaming
        }
        
        try:
            logging.info(f"Calling OpenRouter API (streaming) with model: {model}, timeout: {timeout}s")
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=timeout,
                stream=True
            )
            
            response.raise_for_status()
            
            # Process streamed response
            for line in response.iter_lines():
                if line:
                    line_text = line.decode('utf-8')
                    if line_text.startswith('data: '):
                        data_str = line_text[6:]  # Remove 'data: ' prefix
                        if data_str == '[DONE]':
                            break
                        try:
                            data = json.loads(data_str)
                            if 'choices' in data and len(data['choices']) > 0:
                                delta = data['choices'][0].get('delta', {})
                                if 'content' in delta:
                                    yield delta['content']
                        except json.JSONDecodeError:
                            continue
                            
        except requests.exceptions.RequestException as e:
            logging.error(f"Streaming API error: {e}")
            raise ConnectionError(f"AI service error: {str(e)}")
    
    def _call_openrouter(self, messages: list, model: str = None, max_tokens: int = 4000, max_retries: int = 3, timeout: int = None) -> str:
        """
        Generic method to call OpenRouter API with retry logic for rate limits
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (defaults to self.text_model)
            max_tokens: Maximum tokens in response
            max_retries: Maximum number of retry attempts for rate limits
            timeout: Request timeout in seconds (auto-determined if None)
            
        Returns:
            str: Response text from the model
        """
        if model is None:
            model = self.text_model
            
        # Auto-determine timeout based on model type
        if timeout is None:
            # Vision models need more time (especially with images)
            if model == self.vision_model or 'vision' in model.lower() or 'gpt-4o' in model.lower():
                timeout = 120  # 2 minutes for vision models
            else:
                timeout = 45  # 45 seconds for text models
            
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
                logging.info(f"Calling OpenRouter API with model: {model} (attempt {attempt + 1}/{max_retries}, timeout: {timeout}s)")
                response = requests.post(
                    self.base_url,
                    headers=headers,
                    json=payload,
                    timeout=timeout
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
            logging.info(f"Formatting district report prompt...")
            direct_prompt = settings.DISTRICT_REPORT_PROMPT.format(district_name=query)
            logging.info(f"Prompt formatted, creating messages...")
            messages = [{"role": "user", "content": direct_prompt}]
            logging.info(f"Calling OpenRouter API for district query...")
            initial_answer = self._call_openrouter(messages, max_tokens=1500)  # Reduced for faster response
            logging.info(f"Received answer from OpenRouter, length: {len(initial_answer)}")

            # Skip web search for district queries - just return the initial answer
            # Web search adds 30-60 seconds and often times out
            if "district" in query.lower() or "farming in" in query.lower():
                logging.info("District query detected. Returning direct answer without web search.")
                
                # Validate response has table format
                if "|" not in initial_answer or "Crop" not in initial_answer:
                    logging.warning("Response missing table format, enhancing...")
                    enhance_prompt = f"""The following response about {query} is missing proper crop price data in table format. 
Please rewrite it to include a comprehensive markdown table with at least 8-10 major crops, their prices per quintal, and growing seasons.

Original response:
{initial_answer}

Provide the enhanced response with a proper table now:"""
                    
                    messages = [{"role": "user", "content": enhance_prompt}]
                    initial_answer = self._call_openrouter(messages, max_tokens=2000)
                    logging.info("Response enhanced with table format")
                
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
            
            # Convert image to base64 with size optimization
            img = Image.open(BytesIO(image_bytes))
            
            # Resize large images to prevent memory issues and reduce API costs
            max_size = (1024, 1024)  # Max 1024x1024 pixels
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                logging.info(f"Resizing image from {img.size} to fit {max_size}")
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            buffered = BytesIO()
            img.save(buffered, format="PNG", optimize=True)
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            logging.info(f"Image encoded to base64, size: {len(img_base64)} characters")
            
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
            
            logging.info(f"Calling OpenRouter vision model: {self.vision_model}")
            # Vision models need more tokens and time
            analysis = self._call_openrouter(messages, model=self.vision_model, max_tokens=2000, max_retries=2)
            return analysis
        except requests.exceptions.Timeout:
            logging.error("Image analysis timed out - vision model took too long")
            raise ConnectionError("The vision model is taking too long to respond. This can happen with large images or when the service is cold starting. Please try again with a smaller image or wait a moment.")
        except Exception as e:
            logging.error(f"Error during image analysis: {e}", exc_info=True)
            raise ConnectionError(f"Failed to process or analyze the image: {str(e)}")

    def analyze_image_stream(self, image_bytes: bytes, language: str = "en"):
        """
        Analyzes a plant image using OpenRouter Vision model with streaming response.
        Supports both English and Hindi output based on the language parameter.
        
        Yields:
            str: Chunks of the analysis text
        """
        try:
            logging.info(f"Analyzing image with OpenRouter Vision (streaming) in {language}...")
            
            # Select prompt based on language
            if language.lower() == "hi":
                prompt = settings.VISION_PROMPT_HINDI
            else:
                prompt = settings.VISION_PROMPT
            
            # Convert image to base64 with size optimization
            img = Image.open(BytesIO(image_bytes))
            
            # Resize large images to prevent memory issues and reduce API costs
            max_size = (1024, 1024)
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                logging.info(f"Resizing image from {img.size} to fit {max_size}")
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            buffered = BytesIO()
            img.save(buffered, format="PNG", optimize=True)
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            logging.info(f"Image encoded to base64, size: {len(img_base64)} characters")
            
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
            
            logging.info(f"Calling OpenRouter vision model (streaming): {self.vision_model}")
            # Stream the response
            for chunk in self._call_openrouter_stream(messages, model=self.vision_model, max_tokens=2000):
                yield chunk
                
        except requests.exceptions.Timeout:
            logging.error("Image analysis timed out - vision model took too long")
            raise ConnectionError("The vision model is taking too long to respond. Please try again.")
        except Exception as e:
            logging.error(f"Error during streaming image analysis: {e}", exc_info=True)
            raise ConnectionError(f"Failed to process or analyze the image: {str(e)}")