from fastapi import HTTPException
from app.services.rag_system import RAGSystem

app_state = {}

def get_rag_system() -> RAGSystem:
    collection = app_state.get("chroma_collection")
    if not collection:
        raise HTTPException(status_code=503, detail="Knowledge base is not ready or still initializing.")
    return RAGSystem(collection)