import logging
import chromadb
from chromadb.utils import embedding_functions
from app.core.config import settings
from app.utils.data_loader import load_processed_documents

def build_or_load_knowledge_base():
    logging.info("Initializing knowledge base...")
    client = chromadb.PersistentClient(path=settings.DB_DIR)

    embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=settings.EMBEDDING_MODEL_NAME
    )
    
    collection = client.get_or_create_collection(
        name=settings.COLLECTION_NAME,
        embedding_function=embedding_function
    )
    
    if collection.count() == 0:
        logging.info(f"Collection '{settings.COLLECTION_NAME}' is empty. Populating with new data...")
        
        documents = load_processed_documents()
        
        if not documents:
            logging.warning("No documents found to populate the knowledge base. The chatbot may not have any context.")
            return collection

        ids = [f"doc_{i}" for i in range(len(documents))]

        collection.add(
            documents=documents,
            ids=ids
        )
        logging.info(f"Successfully added {len(documents)} documents to the collection.")
    else:
        logging.info(f"Collection '{settings.COLLECTION_NAME}' already exists with {collection.count()} documents.")
        
    return collection

