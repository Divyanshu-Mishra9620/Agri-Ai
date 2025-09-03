import logging
from typing import List, Dict

import chromadb
from chromadb.utils import embedding_functions

from app.core.config import settings

def create_and_populate_chroma_db(documents: List[Dict[str, str]]):
    logging.info(f"Initializing ChromaDB with embedding model: {settings.EMBEDDING_MODEL_NAME}...")
    client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)

    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=settings.EMBEDDING_MODEL_NAME
    )

    collection = client.get_or_create_collection(
        name=settings.COLLECTION_NAME,
        embedding_function=sentence_transformer_ef,
        metadata={"hnsw:space": "cosine"}
    )
    
    logging.info("Processing and adding documents to ChromaDB...")
    new_chunks_added = 0
    for doc in documents:
        words = doc["content"].split()
        chunk_size = 350
        chunks = [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
        
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc['source']}_chunk_{i}"
            if not collection.get(ids=[chunk_id])['ids']:
                collection.add(
                    ids=[chunk_id],
                    documents=[chunk],
                    metadatas=[{"source": doc["source"]}]
                )
                new_chunks_added += 1
    
    logging.info(f"Added {new_chunks_added} new document chunks to the '{settings.COLLECTION_NAME}' collection.")
    return collection

