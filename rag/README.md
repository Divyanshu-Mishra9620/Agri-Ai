"# Agri-AI RAG Service

This is the RAG (Retrieval-Augmented Generation) service for the Agri-AI platform. It provides AI-powered agricultural assistance using Large Language Models, web search, and vision analysis.

## Features

- 🔍 **Web Search Integration**: Real-time agricultural information retrieval
- 🤖 **AI-Powered Responses**: Powered by Google's Gemini models
- 🌤️ **Weather Alerts**: 7-day weather forecasting with agricultural risk analysis
- 📸 **Plant Disease Detection**: Image-based crop disease diagnosis
- 🌾 **Crop Advisory**: Predictive impact analysis for various agricultural parameters

## Quick Start

### Prerequisites

- Python 3.11+
- pip package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Divyanshu-Mishra9620/Agri-Ai.git
   cd Agri-Ai/rag
   ```

2. **Create and activate a virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your API keys:
     - `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
     - `GOOGLE_API_KEY` & `GOOGLE_CX_ID`: Set up [Google Custom Search](https://developers.google.com/custom-search/v1/overview)
     - `WEATHERAPI_KEY`: Get from [WeatherAPI.com](https://www.weatherapi.com/)

5. **Run the service**:
   ```bash
   uvicorn main:app --reload
   ```

   The service will be available at `http://localhost:8000`

6. **View API documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### 1. General Agricultural Q&A
- **Endpoint**: `POST /api/get-answer`
- **Purpose**: Answer general farming questions using web search
- **Request Body**:
  ```json
  {
    "query": "Your agricultural question here"
  }
  ```

### 2. Predictive Impact Analysis
- **Endpoint**: `POST /api/predict-impact`
- **Purpose**: Analyze impact of environmental/market changes on crops
- **Request Body**:
  ```json
  {
    "crop": "wheat",
    "parameter": "water",
    "change": "reduces by 40%"
  }
  ```

### 3. Plant Disease Detection
- **Endpoint**: `POST /api/analyze-crop-image`
- **Purpose**: Diagnose plant diseases from uploaded images
- **Request**: Multipart form data with image file (key: `file`)

### 4. Weather Alerts
- **Endpoint**: `POST /api/weather-alert`
- **Purpose**: Get 7-day weather forecast with agricultural risk analysis
- **Request Body**:
  ```json
  {
    "query": "Location name (e.g., Lucknow)"
  }
  ```

## Project Structure

```
rag/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   └── chat.py           # API route handlers
│   │   └── schemas.py            # Pydantic models
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py             # Application settings
│   ├── services/
│   │   ├── __init__.py
│   │   ├── rag_system.py         # RAG implementation
│   │   ├── web_search.py         # Web search integration
│   │   └── web_search_enhanced.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── data_loader.py
│   │   └── knowledge_base.py
│   └── dependencies.py           # FastAPI dependencies
├── main.py                       # Application entry point
├── requirements.txt              # Production dependencies
├── requirements-render.txt       # Cloud deployment dependencies
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── Dockerfile                    # Docker configuration
├── render.yaml                   # Render.com deployment config
└── DEPLOYMENT.md                 # Deployment instructions

```

## Deployment

This service can be deployed to various platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Render.com
- Railway.app
- Docker/Container platforms
- Google Cloud Run
- AWS, Azure, DigitalOcean

## Development

### Running Tests
```bash
# Add test commands when tests are implemented
pytest
```

### Code Formatting
```bash
# Format code with black (if configured)
black .
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI responses | Yes |
| `GOOGLE_API_KEY` | Google Custom Search API key | Yes |
| `GOOGLE_CX_ID` | Google Custom Search Engine ID | Yes |
| `WEATHERAPI_KEY` | WeatherAPI.com API key | Yes |
| `GEMINI_TEXT_MODEL` | Gemini model for text (default: gemini-1.5-flash) | No |
| `GEMINI_VISION_MODEL` | Gemini model for vision (default: gemini-1.5-flash) | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the Agri-AI platform.

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/Divyanshu-Mishra9620/Agri-Ai/issues)
- Check the [parent project README](../README.md)"
