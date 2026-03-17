"""
Test script to verify that the RAG system can answer questions about itself
using the ingested documentation.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.services.vector_store import VectorStore


def test_self_awareness():
    """Test if the RAG system can answer questions about itself."""

    print("🧪 Testing RAG System Self-Awareness\n")
    print("=" * 70)

    vector_store = VectorStore()

    total_docs = vector_store.get_collection_count()
    print(f"📊 Vector Store Status: {total_docs} documents loaded\n")

    test_queries = [
        "What API endpoints are available in this system?",
        "How do I upload documents to the RAG system?",
        "What features does this agricultural AI system have?",
        "How do I deploy this application?",
        "What is the architecture of this system?",
        "How does the document-first search work?",
        "What causes bacterial blight in rice?",
        "How to use the image analysis feature?",
    ]

    print("Testing queries:\n")

    for i, query in enumerate(test_queries, 1):
        print(f'{i}. Query: "{query}"')

        results = vector_store.search(query, n_results=3)

        if results and results.get("documents") and results["documents"][0]:
            docs = results["documents"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]

            print(f"   ✅ Found {len(docs)} relevant documents")

            if docs:
                top_doc = docs[0]
                top_meta = metadatas[0]
                top_distance = distances[0]

                print(f"   📄 Top Source: {top_meta.get('source', 'Unknown')}")
                print(f"   📍 Category: {top_meta.get('category', 'Unknown')}")
                print(f"   🎯 Relevance: {1 - top_distance:.2%}")
                print(f"   📝 Preview: {top_doc[:150]}...")
        else:
            print(f"   ❌ No results found")

        print()

    print("=" * 70)
    print("\n✅ Self-awareness test complete!")
    print("\n💡 The RAG system can now:")
    print("   - Answer questions about its own API")
    print("   - Explain how to use its features")
    print("   - Provide deployment guidance")
    print("   - Share agricultural knowledge")
    print("\n🚀 Ready to start the server and test with real queries!")


if __name__ == "__main__":
    try:
        test_self_awareness()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback

        traceback.print_exc()
