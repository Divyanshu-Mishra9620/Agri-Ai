"""
Script to ingest all documentation files into the RAG vector store.
This makes the system self-aware and able to answer questions about itself.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.services.vector_store import VectorStore
from app.services.document_processor import DocumentProcessor


def ingest_documentation():
    """Ingest all documentation markdown files into the vector store."""

    print("🚀 Starting documentation ingestion...\n")

    vector_store = VectorStore()
    doc_processor = DocumentProcessor()

    doc_files = [
        "README.md",
        "API_DOCUMENTATION.md",
        "DOCUMENTATION_SUMMARY.md",
        "DOCUMENT_MANAGEMENT.md",
        "DEPLOYMENT.md",
        "SETUP_GUIDE.md",
        "QUICK_REFERENCE.md",
        "INDEX.md",
    ]

    total_chunks = 0
    processed_files = 0

    all_documents = []
    all_metadatas = []
    all_ids = []
    chunk_counter = 0

    for doc_file in doc_files:
        doc_path = Path(__file__).parent / doc_file

        if not doc_path.exists():
            print(f"⚠️  Warning: {doc_file} not found, skipping...")
            continue

        print(f"📄 Processing {doc_file}...")

        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = doc_processor.chunk_text(content)

        if not chunks:
            print(f"   ⚠️  No content extracted from {doc_file}")
            continue

        for i, chunk in enumerate(chunks):
            metadata = {
                "source": doc_file,
                "chunk_index": i,
                "type": "documentation",
                "category": get_doc_category(doc_file),
            }
            all_documents.append(chunk)
            all_metadatas.append(metadata)
            all_ids.append(f"doc_{chunk_counter}")
            chunk_counter += 1

        print(f"   ✓ Prepared {len(chunks)} chunks from {doc_file}")
        total_chunks += len(chunks)
        processed_files += 1

    if all_documents:
        print(f"\n📦 Adding {len(all_documents)} chunks to vector store...")
        vector_store.add_documents(all_documents, all_metadatas, all_ids)
        print(f"   ✓ Successfully added all chunks!")

    total_docs_in_store = vector_store.get_collection_count()

    print(f"\n{'='*60}")
    print(f"✓ Successfully ingested documentation!")
    print(f"{'='*60}")
    print(f"Processed files: {processed_files}")
    print(f"Total chunks added: {total_chunks}")
    print(f"Total documents in store: {total_docs_in_store}")
    print(f"\n💡 The RAG system can now answer questions about:")
    print(f"   - API usage and endpoints")
    print(f"   - Setup and configuration")
    print(f"   - Document management")
    print(f"   - Deployment procedures")
    print(f"   - System architecture and features")
    print(f"{'='*60}\n")


def get_doc_category(filename: str) -> str:
    """Determine the category of a documentation file."""
    categories = {
        "README.md": "overview",
        "API_DOCUMENTATION.md": "api_reference",
        "DOCUMENTATION_SUMMARY.md": "summary",
        "DOCUMENT_MANAGEMENT.md": "document_management",
        "DEPLOYMENT.md": "deployment",
        "SETUP_GUIDE.md": "setup",
        "QUICK_REFERENCE.md": "quick_reference",
        "INDEX.md": "navigation",
    }
    return categories.get(filename, "general")


if __name__ == "__main__":
    try:
        ingest_documentation()
    except Exception as e:
        print(f"\n❌ Error during ingestion: {str(e)}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
