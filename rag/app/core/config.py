from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SIH Agricultural AI Companion"
    
    OLLAMA_API_BASE_URL: str = "http://127.0.0.1:11434"
    GENERATION_MODEL_NAME: str = "llama3:8b" 
    
    HUGGINGFACE_API_TOKEN: str = "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"  
    VISION_MODEL_NAME: str = "YuchengShi/LLaVA-v1.5-7B-Plant-Leaf-Diseases-Detection"
    
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-base-en-v1.5"
    
    ALLOWED_ORIGINS: list[str] = ["*"]

    DATA_DIR: str = "data"
    DB_DIR: str = "chroma_db"
    COLLECTION_NAME: str = "agri_docs"

    QA_PROMPT_TEMPLATE: str = """
    You are 'Krishi Mitra', an expert AI agronomist specializing in Indian agriculture. Your audience is Indian farmers, so use simple, clear, and encouraging language.
    **Your Task:**
    Answer the user's question based on the provided CONTEXT. If the context is insufficient, use your general knowledge but always frame it within the Indian agricultural landscape.
    **CONTEXT:**
    ---
    {context}
    ---
    **QUESTION:** {query}
    **Answer (as Krishi Mitra):**
    """

    PREDICTIVE_PROMPT_TEMPLATE: str = """
    You are an AI-powered agricultural risk assessment model for India. Your task is to analyze the impact of a specific environmental change on a crop.
    **Analysis Details:**
    - **Crop:** {crop}
    - **Parameter Change:** The '{parameter}' changes by '{change}'.
    **Provided Context on {crop}:**
    ---
    {context}
    ---
    **Instructions:**
    Based on the context and your expertise, provide a structured report.
    **Impact Assessment Report for {crop}**
    **1. Impact Analysis:**
    **2. Severity Level:** (Low, Medium, or High)
    **3. Actionable Recommendations for Farmers:**
    """

    VISION_PROMPT: str = """
    You are an expert plant pathologist. Analyze the provided image of a plant and generate a detailed diagnostic report for a farmer in a structured format.
    **Plant Health Report**
    **1. Plant Identification:**
    **2. Health Status:** (e.g., Healthy / Diseased)
    **3. Diagnosis:**
    **4. Detailed Analysis:**
    **5. Chemical Treatment Plan:**
    **6. Organic/Biological Treatment Plan:**
    **7. Preventative Measures:**
    """

    PDF_URLS: list[str] = [
        "https://icar.org.in/sites/default/files/inline-files/Vegetables-intercropping-with-autumn-planted-sugarcane.pdf",
        "https://icar.org.in/sites/default/files/inline-files/How-to-double-farmers-income.pdf"
    ]
    
    class Config:
        case_sensitive = True

settings = Settings()