import logging
import os
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from app.services.document_processor import DocumentProcessor
from app.services.vector_store import VectorStore

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Documents"])

# Initialize services
document_processor = DocumentProcessor(chunk_size=1000, chunk_overlap=200)
vector_store = VectorStore(persist_directory="./chroma_db", collection_name="agri_docs")

UPLOAD_DIR = "./documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/ingest-document")
async def ingest_document(file: UploadFile = File(...)):
    """
    Upload and ingest a single document (PDF or TXT) into the vector store.
    """
    try:
        # Validate file type
        if not file.filename.endswith(('.pdf', '.txt')):
            raise HTTPException(
                status_code=400,
                detail="Only PDF and TXT files are supported"
            )
        
        # Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        logger.info(f"Saved uploaded file: {file.filename}")
        
        # Process the document
        processed_docs = document_processor.process_single_file(file_path)
        
        if not processed_docs:
            raise HTTPException(
                status_code=500,
                detail="Failed to process document"
            )
        
        # Add to vector store
        documents = [doc['text'] for doc in processed_docs]
        metadatas = [doc['metadata'] for doc in processed_docs]
        ids = [doc['id'] for doc in processed_docs]
        
        vector_store.add_documents(documents, metadatas, ids)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Successfully ingested {file.filename}",
                "chunks": len(processed_docs),
                "total_documents": vector_store.get_collection_count()
            }
        )
    
    except Exception as e:
        logger.error(f"Error ingesting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest-directory")
async def ingest_directory():
    """
    Ingest all documents from the ./documents directory into the vector store.
    """
    try:
        logger.info("Starting directory ingestion...")
        
        # Process all documents in the directory
        processed_docs = document_processor.process_directory(UPLOAD_DIR)
        
        if not processed_docs:
            return JSONResponse(
                status_code=200,
                content={
                    "message": "No documents found in directory",
                    "chunks": 0,
                    "total_documents": vector_store.get_collection_count()
                }
            )
        
        # Add to vector store
        documents = [doc['text'] for doc in processed_docs]
        metadatas = [doc['metadata'] for doc in processed_docs]
        ids = [doc['id'] for doc in processed_docs]
        
        vector_store.add_documents(documents, metadatas, ids)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Successfully ingested all documents from directory",
                "chunks": len(processed_docs),
                "total_documents": vector_store.get_collection_count()
            }
        )
    
    except Exception as e:
        logger.error(f"Error ingesting directory: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reset-vector-store")
async def reset_vector_store():
    """
    Reset the vector store (delete all documents).
    """
    try:
        vector_store.reset_collection()
        return JSONResponse(
            status_code=200,
            content={
                "message": "Vector store reset successfully",
                "total_documents": 0
            }
        )
    except Exception as e:
        logger.error(f"Error resetting vector store: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/vector-store-info")
async def get_vector_store_info():
    """
    Get information about the vector store.
    """
    try:
        count = vector_store.get_collection_count()
        return JSONResponse(
            status_code=200,
            content={
                "total_documents": count,
                "collection_name": vector_store.collection_name,
                "persist_directory": vector_store.persist_directory
            }
        )
    except Exception as e:
        logger.error(f"Error getting vector store info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search-documents")
async def search_documents(query: str, n_results: int = 5):
    """
    Search for relevant documents in the vector store.
    """
    try:
        results = vector_store.search(query, n_results=n_results)
        
        # Format results
        formatted_results = []
        if results and results['documents'][0]:
            for doc, metadata, distance in zip(
                results['documents'][0],
                results['metadatas'][0],
                results['distances'][0]
            ):
                formatted_results.append({
                    "document": doc,
                    "metadata": metadata,
                    "similarity_score": 1 - distance  # Convert distance to similarity
                })
        
        return JSONResponse(
            status_code=200,
            content={
                "query": query,
                "results": formatted_results,
                "total_results": len(formatted_results)
            }
        )
    
    except Exception as e:
        logger.error(f"Error searching documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))
