import logging
from fastapi import HTTPException
from io import BytesIO
import google.generativeai as genai
from PIL import Image

from app.core.config import settings
from app.services.web_search import search_the_web
import requests

class RAGSystem:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.text_model = genai.GenerativeModel(settings.GEMINI_TEXT_MODEL)
        self.vision_model = genai.GenerativeModel(settings.GEMINI_VISION_MODEL)

    def get_weather_alert(self, city: str = "Gorakhpur") -> str:
        """
        Fetch 7-day forecast from WeatherAPI, return analysis text.
        On transient fetch/analysis errors, return a friendly message string
        instead of raising ConnectionError (so endpoint can return 200).
        """
        try:
            logging.info(f"Fetching weather forecast for {city} from WeatherAPI.com...")
            api_url = (
                f"http://api.weatherapi.com/v1/forecast.json"
                f"?key={settings.WEATHERAPI_KEY}&q={city}&days=7&aqi=no&alerts=no"
        )
            resp = requests.get(api_url, timeout=10)
            resp.raise_for_status()
            weather_data = resp.json()
        except requests.RequestException as e:
            logging.error(f"Failed to fetch weather data: {e}")
            return "Sorry, I couldn't fetch the weather forecast at the moment."

        try:
            forecast_summary = self._summarize_forecast(weather_data)
            prompt = settings.WEATHER_ALERT_PROMPT.format(weather_data=forecast_summary)
            analysis_response = self.text_model.generate_content(prompt)
            return analysis_response.text
        except Exception as e:
            logging.exception("Error analyzing weather data with Gemini")
            return "Sorry, I couldn't analyze the weather data at the moment."

    def _summarize_forecast(self, data: dict) -> str:
        """Helper function to create a simple text summary from WeatherAPI.com data."""
        location = data['location']['name']
        summary = f"7-Day Weather Forecast for {location}:\n"
        
        for day_data in data['forecast']['forecastday']:
            date = day_data['date']
            day_info = day_data['day']
            summary += (
                f" - {date}: "
                f"Avg Temp: {day_info['avgtemp_c']}°C, "
                f"Max Wind: {day_info['maxwind_kph']} kph, "
                f"Total Precip: {day_info['totalprecip_mm']} mm, "
                f"Condition: {day_info['condition']['text']}\n"
            )
        return summary.strip()

    def get_answer(self, query: str) -> str:
        """
        Generates a detailed answer by performing a real-time web search.
        """
        logging.info(f"Initiating web search for query: '{query}'")
        try:
            web_context = search_the_web(query)
            
            if not web_context or "error" in web_context.lower():
                return "I was unable to retrieve relevant information from the web to answer your query at this time."
            prompt = settings.WEB_SEARCH_PROMPT_TEMPLATE.format(context=web_context, query=query)
            response = self.text_model.generate_content(prompt)
            return response.text
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

    def analyze_image(self, image_bytes: bytes) -> str:
        """
        Analyzes a plant image using the Gemini Vision model and a professional prompt.
        """
        try:
            logging.info("Analyzing image with Gemini Vision...")
            prompt = settings.VISION_PROMPT
            img = Image.open(BytesIO(image_bytes))
            
            response = self.vision_model.generate_content([prompt, img])
            return response.text
        except Exception as e:
            logging.error(f"Error during image analysis: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to process or analyze the image.")