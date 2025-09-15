import logging
from googleapiclient.discovery import build
from app.core.config import settings

def search_the_web(query: str, num_results: int = 4) -> str:
    """
    Performs a targeted Google search for agricultural market prices.
    """
    refined_query = f"{query} mandi price today commodity rates"
    logging.info(f"Performing targeted web search for query: {refined_query}")
    
    try:
        service = build("customsearch", "v1", developerKey=settings.GOOGLE_API_KEY)
        
        result = service.cse().list(
            q=refined_query,
            cx=settings.GOOGLE_CX_ID,
            num=num_results
        ).execute()

        search_items = result.get("items", [])
        if not search_items:
            logging.warning("Targeted web search returned no results.")
            return ""

        snippets = [
            f"Source: {item['title']}\nContent: {item.get('snippet', 'No snippet available.')}" 
            for item in search_items
        ]
        
        return "\n\n".join(snippets)

    except Exception as e:
        logging.error(f"An error occurred during targeted web search: {e}", exc_info=True)
        return ""