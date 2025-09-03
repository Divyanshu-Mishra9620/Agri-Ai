from pathlib import Path
from typing import List, Dict

class Settings:
    
    PROJECT_NAME: str = "SIH Agri-AI Ollama API"

    OLLAMA_API_BASE_URL: str = "http://localhost:11434/api"
    
    GENERATION_MODEL_NAME: str = "llama3.1"
    VISION_MODEL_NAME: str = "llava"
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-base-en-v1.5"

    CHROMA_DB_PATH: str = "chroma_db"
    COLLECTION_NAME: str = "agri_knowledge_base"

    DATA_DIR: Path = Path("data")
    PDF_SOURCES: Dict[str, str] = {
        "sugarcane_practices": "https://icar.org.in/sites/default/files/inline-files/Vegetables-intercropping-with-autumn-planted-sugarcane.pdf",
        "doubling_farmer_income": "https://icar.org.in/sites/default/files/inline-files/How-to-double-farmers-income.pdf",
        "wheat_practices": "https://iiwbr.org.in/wp-content/uploads/2023/08/Wheat-Package-of-practices-for-increasing-production-1984.pdf",
        "rice_practices": "https://www.icar-iirr.org/AICRIP/Final%20POS%202019-2020.pdf"
    }
    
    ALLOWED_HOSTS: List[str] = ["http://localhost", "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5500"]
    
    QA_PROMPT_TEMPLATE: str = """
        You are an expert agricultural assistant for Indian farmers. 
        Your role is to provide clear, practical, and confident answers as if you are talking directly to a farmer in person. 
    
        RULES:
        - Always prioritize the information given in the CONTEXT.
        - If the CONTEXT does not contain the answer, use web knowledge and your expertise to provide the best possible solution.
        - Never say phrases like "I don’t have data," "I don’t have specific data," or "based on my training data." 
        - Respond naturally, as if you have all the information.
        - Only if no information is available even after searching, reply exactly:  
          **"I do not have information on that topic based on my current documents."**
        - Do not invent or make up information.
    
        CONTEXT:
        ---
        {context}
        ---
    
        QUESTION:
        {query}
    
        ANSWER (as an expert agricultural guide for Indian farmers):
    """


    PREDICTIVE_PROMPT_TEMPLATE: str = """
        You are an expert agricultural analyst.
        Based on the provided standard cultivation practices for {crop}, analyze the impact of a specific scenario.
        
        STANDARD PRACTICES CONTEXT:
        ---
        {context}
        ---

        SCENARIO:
        Analyze the likely impact if the '{parameter}' changes by '{change}'.

        Provide a concise, point-form analysis covering:
        1.  **Likely Impact:** What is the most probable effect on the crop's health, growth, or yield?
        2.  **Preventative Measures:** Suggest three actionable steps a farmer could take to mitigate this impact.
        
        ANALYSIS:
    """

    VISION_PROMPT: str = """
        You are an expert plant pathologist and agronomist. Your task is to analyze the provided image of a crop. 
        
        Follow these steps for your analysis:
        1.  **Identify the Crop:** If possible, identify the plant in the image.
        2.  **Describe Observations:** Detail any visible symptoms of stress, such as discoloration, spots, lesions, or pests.
        3.  **Provide a Diagnosis:** Based on the visual evidence, provide one or two most likely diagnoses.
        4.  **Suggest Actionable Solutions:** Recommend clear, actionable steps for the farmer to take.

        Structure your response in clear sections. If the image is unclear or not a plant, state that you cannot perform an analysis.
    """

settings = Settings()

