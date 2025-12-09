import logging
from fastapi import HTTPException
from io import BytesIO
import google.generativeai as genai
from PIL import Image

from app.core.config import settings
from app.services.web_search import search_the_web
from app.services.vector_store import VectorStore
import requests

class RAGSystem:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.text_model = genai.GenerativeModel(settings.GEMINI_TEXT_MODEL)
        self.vision_model = genai.GenerativeModel(settings.GEMINI_VISION_MODEL)
        
        # Initialize vector store for document retrieval
        self.vector_store = VectorStore(
            persist_directory="./chroma_db",
            collection_name="agri_docs"
        )
        logging.info("RAG System initialized with vector store")

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
            analysis_response = self.text_model.generate_content(prompt)
            return analysis_response.text
        except Exception as e:
            logging.exception("Error analyzing weather data with Gemini")
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
        1. First searching the local document vector store
        2. If insufficient, queries Gemini directly
        3. Falls back to web search if needed
        """
        try:
            # Step 1: Search local documents first
            logging.info(f"Searching local documents for query: '{query}'")
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
                
                # Generate answer using document context
                doc_prompt = f"""Based on the following agricultural documents, answer the question accurately and comprehensively.

Documents:
{doc_context}

Question: {query}

Please provide a detailed answer based on the documents above. If the documents don't contain enough information, say so clearly."""
                
                doc_response = self.text_model.generate_content(doc_prompt)
                doc_answer = doc_response.text
                
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
            
            # Step 2: Try direct Gemini query
            logging.info(f"Attempting to get a direct answer for query: '{query}'")
            direct_prompt = settings.DISTRICT_REPORT_PROMPT.format(district_name=query)
            direct_response = self.text_model.generate_content(direct_prompt)
            initial_answer = direct_response.text

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
            final_response = self.text_model.generate_content(web_prompt)
            return final_response.text

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
        response = self.text_model.generate_content(prompt)
        return response.text

    def analyze_image(self, image_bytes: bytes, language: str = "en") -> str:
        """
        Analyzes a plant image using the Gemini Vision model and a professional prompt.
        Supports both English and Hindi output based on the language parameter.
        """
        try:
            logging.info(f"Analyzing image with Gemini Vision in {language}...")
            
            # Select prompt based on language
            if language.lower() == "hi":
                prompt = settings.VISION_PROMPT_HINDI
            else:
                prompt = settings.VISION_PROMPT
            
            img = Image.open(BytesIO(image_bytes))
            
            response = self.vision_model.generate_content([prompt, img])
            return response.text
        except Exception as e:
            logging.error(f"Error during image analysis: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to process or analyze the image.")