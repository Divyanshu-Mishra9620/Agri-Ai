Agri-AI: Your AI-Powered Agricultural Assistant
===============================================

Agri-AI is an intelligent, data-driven platform designed to provide farmers with real-time, actionable insights to improve crop health, predict environmental impacts, and get answers to their agricultural questions. The system leverages the power of Large Language Models (LLMs) to analyze data from various sources, including web searches, user-uploaded images, and weather forecasts.

🚀 API Endpoints
----------------

This document provides a guide for front-end developers on how to interact with the Agri-AI backend API. All endpoints are prefixed with /api.

### 1\. General Agricultural Q&A

*   **Endpoint**: POST /api/get-answer
    
*   **Purpose**: This is the primary endpoint for answering general farming questions. It takes a user's query, performs a real-time web search for the most up-to-date information, and uses Gemini to synthesize the findings into a comprehensive report.
    
*   **Why to Hit This Endpoint**: Use this when a farmer asks a question in a search bar or chat window, such as _"Crops in Lucknow with market price"_ or _"How to treat pests on wheat crops?"_
    
*   JSON{ "query": "Your question here"}
    
*   JSON{ "answer": "A detailed, AI-generated report based on web search results."}
    

### 2\. Predictive Impact Analysis

*   **Endpoint**: POST /api/predict-impact
    
*   **Purpose**: This endpoint provides a forward-looking advisory report on how a specific environmental or market change might affect a particular crop. It searches the web for relevant context to create its analysis.
    
*   **Why to Hit This Endpoint**: Use this for features where a farmer can select a crop and a potential scenario to understand the risks. For example, a form where a user selects "Wheat," the parameter "Water," and the change "Reduces by 40%."
    
*   JSON{ "crop": "wheat", "parameter": "water", "change": "reduces by 40%"}
    
*   JSON{ "answer": "A detailed advisory report in a conversational tone, outlining the risks and mitigation strategies for the farmer."}
    

### 3\. Plant Disease Analysis from Image

*   **Endpoint**: POST /api/analyze-crop-image
    
*   **Purpose**: This endpoint accepts an uploaded image of a plant leaf, analyzes it using the Gemini Vision model, and returns a detailed diagnostic report.
    
*   **Why to Hit This Endpoint**: Use this when a farmer uploads a photo of a potentially diseased plant. This endpoint is ideal for an "Upload and Diagnose" feature in your app.
    
*   **Request Body**:
    
*  The image file should be sent with the key file.
        
*   JSON{ "analysis": "A professional diagnostic report identifying the plant, diagnosing the issue, and providing a step-by-step treatment plan."}
    

### 4\. Proactive Weather Alerts

*   **Endpoint**: POST /api/weather-alert
    
*   **Purpose**: This endpoint fetches a 7-day weather forecast for a specified location from WeatherAPI.com and uses Gemini to analyze it for potential risks to crops.
    
*   **Why to Hit This Endpoint**: Use this to provide a proactive "Weather Alert" feature. The front-end can call this endpoint with the farmer's location to display a daily or weekly AI-powered weather advisory.
    
*   JSON{ "query": "Lucknow"}
    
*   JSON{ "analysis": "A report summarizing the forecast and providing a 'Farmer's Alert' with actionable advice if any risks are detected."}
