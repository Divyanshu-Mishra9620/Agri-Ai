from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SIH Agricultural AI Companion"

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "AIzaSyBV5xgvXf2jilH2Ygxs4f_3b8X85QRJ-LE")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "AIzaSyDNKbOjEtVZpmBdNqvfPKOFSTOa1H6kvsk")
    GOOGLE_CX_ID: str = os.getenv("GOOGLE_CX_ID", "4021881acc5664a49")

    GEMINI_TEXT_MODEL: str = "gemini-2.0-flash"  
    GEMINI_VISION_MODEL: str = "gemini-2.0-flash"
    
    ALLOWED_ORIGINS: list[str] = ["*"]

    WEATHERAPI_KEY: str = "824fa1a77e28417a99f111631251509"
    WEATHER_ALERT_PROMPT: str = """
You are 'Krishi Mitra', an agricultural AI assistant. Your task is to analyze the following weekly weather forecast data for a farmer.

If there are any potentially harmful weather conditions (like heavy rain, strong winds, hail, frost, extreme heat, or drought), generate a concise and helpful alert. The alert should explain the risk and suggest 1-2 simple preventative actions the farmer can take.

If the weather is normal and poses no risk, simply respond with: "The weather forecast for the next week looks good. No special precautions are needed."

WEATHER FORECAST DATA:
---
{weather_data}
---

GENERATE YOUR ALERT:
"""

    WEB_SEARCH_PROMPT_TEMPLATE: str = """
You are 'Krishi Mitra', a professional Agricultural AI Analyst. Your primary function is to provide a comprehensive and accurate report by synthesizing real-time web search data with your own extensive knowledge base.

**Objective:**
Analyze the provided web search context to answer the user's query with the highest degree of accuracy and detail. Use your internal knowledge to enrich the response, fill in gaps, and provide a holistic overview.

**Web Search Context (Primary Data Source):**
---
{context}
---

**User Query:** {query}

**Instructions for Generating the Report:**
1.  **Synthesize and Enrich:** Do not simply list the web snippets. Integrate the information from the context with your own knowledge to form a complete, coherent, and well-structured answer. The web context provides the latest data; your knowledge provides the broader context.
2.  **Prioritize Quantitative Data:** Your highest priority is to find and present numerical data from the web search (e.g., market prices, production volumes). If found, format this data clearly in a markdown table.
3.  **Provide a Complete Picture:** If the web search provides prices for only a few crops, use your own knowledge to list other major crops grown in the specified region, even if price data is unavailable for them.
4.  **Professional Tone and Formatting:** The final output must be a professional, well-formatted report. Acknowledge the date or source of the data if available to ensure accuracy.

**Begin Report:**
"""

    PREDICTIVE_PROMPT_TEMPLATE: str = """
You are 'Krishi Mitra', your personal AI expert in agricultural risk analysis.

**Objective:**
I will provide you with a professional advisory report assessing the potential impact of a specific environmental or market change on your crop. I will use the provided web context as a factual baseline and my own expertise to conduct a thorough analysis for you.

**Web Search Context on {crop}:**
---
{context}
---

**Analysis Scenario:**
- **Your Crop:** {crop}
- **Potential Change:** The '{parameter}' is expected to '{change}'.

**Here is my Advisory Report for You:**

**1. Executive Summary:**
Here is a concise summary of the most likely impacts on your crop and the overall risk level you might face.

**2. Impact Analysis:**
Based on my analysis, here are the potential effects on your crop’s growth cycle, health, yield, and market value.

**3. Risk Assessment:**
Here is my justified severity estimate for your situation (Low, Medium, or High).

**4. Actionable Mitigation Strategies for You:**
Here is a numbered list of clear and practical steps you can take to mitigate the identified risks.
"""

    VISION_PROMPT: str = """
You are a professional Plant Pathologist and Agronomist AI. Your task is to conduct a detailed visual analysis of the provided plant leaf image.

**Objective:**
Identify the plant species, diagnose any visible diseases or nutrient deficiencies, and provide a comprehensive, actionable treatment plan for a farmer, using your full expert knowledge.

**Instructions for the Diagnostic Report:**
1.  **Plant Identification:** State the most likely plant species.
2.  **Primary Diagnosis:** Identify the most probable disease, pest, or deficiency. Describe the key visual symptoms that support your diagnosis.
3.  **Confidence Level:** State your diagnostic confidence (High, Medium, Low).
4.  **Detailed Step-by-Step Treatment Plan:**
    * **Immediate Actions:** (e.g., Isolate plant, prune affected areas).
    * **Organic & Cultural Controls:** Recommend non-chemical solutions first.
    * **Chemical Treatment:** If necessary, recommend a specific type of fungicide/pesticide and application guidelines.
    * **Preventative Measures:** List steps to prevent recurrence.
5.  **Disclaimer:** Advise the user to confirm with a local agricultural expert.

**Begin Diagnostic Report:**
"""

    class Config:
        case_sensitive = True

settings = Settings()