"""
Script to ingest agricultural documents into the RAG vector store.

Usage:
1. Place your PDF/TXT documents in the ./documents directory
2. Run this script: python ingest_documents.py
"""

import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.document_processor import DocumentProcessor
from app.services.vector_store import VectorStore

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main function to ingest documents."""
    
    # Initialize services
    logger.info("Initializing document processor and vector store...")
    processor = DocumentProcessor(chunk_size=1000, chunk_overlap=200)
    vector_store = VectorStore(
        persist_directory="./chroma_db",
        collection_name="agri_docs"
    )
    
    # Check document directory
    doc_dir = "./documents"
    doc_path = Path(doc_dir)
    
    if not doc_path.exists():
        logger.error(f"Documents directory not found: {doc_dir}")
        logger.info("Creating documents directory...")
        doc_path.mkdir(exist_ok=True)
        logger.info(f"Please place your PDF/TXT files in {doc_dir} and run again.")
        return
    
    # Count existing documents in vector store
    existing_count = vector_store.get_collection_count()
    logger.info(f"Current documents in vector store: {existing_count}")
    
    # Process documents
    logger.info(f"Processing documents from {doc_dir}...")
    processed_docs = processor.process_directory(doc_dir)
    
    if not processed_docs:
        logger.warning("No documents found to process.")
        logger.info("Supported formats: PDF, TXT")
        return
    
    # Add to vector store
    logger.info(f"Adding {len(processed_docs)} chunks to vector store...")
    documents = [doc['text'] for doc in processed_docs]
    metadatas = [doc['metadata'] for doc in processed_docs]
    ids = [doc['id'] for doc in processed_docs]
    
    vector_store.add_documents(documents, metadatas, ids)
    
    # Report success
    new_count = vector_store.get_collection_count()
    logger.info(f"✓ Successfully ingested documents!")
    logger.info(f"  - Processed files: {len(set(doc['metadata']['filename'] for doc in processed_docs))}")
    logger.info(f"  - Total chunks added: {len(processed_docs)}")
    logger.info(f"  - Total documents in store: {new_count}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("\nOperation cancelled by user.")
    except Exception as e:
        logger.error(f"Error during ingestion: {e}", exc_info=True)
