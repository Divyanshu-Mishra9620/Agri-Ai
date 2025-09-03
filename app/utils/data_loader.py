import logging
import requests
import pypdf
from typing import List, Dict

from app.core.config import settings

def download_pdfs():
    settings.DATA_DIR.mkdir(exist_ok=True)
    logging.info("Checking and downloading PDF data sources...")
    for key, url in settings.PDF_SOURCES.items():
        file_path = settings.DATA_DIR / f"{key}.pdf"
        if not file_path.exists():
            try:
                logging.info(f"Downloading {key}.pdf from {url}")
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                with open(file_path, 'wb') as f:
                    f.write(response.content)
            except requests.RequestException as e:
                logging.warning(f"Failed to download {url}. Error: {e}")
        else:
            logging.info(f"{file_path} already exists.")

def extract_text_from_pdfs() -> List[Dict[str, str]]:
    logging.info("Starting PDF text extraction...")
    documents = []
    for pdf_path in settings.DATA_DIR.glob("*.pdf"):
        try:
            with open(pdf_path, 'rb') as file:
                reader = pypdf.PdfReader(file)
                text = "".join(page.extract_text() or "" for page in reader.pages)
            clean_text = " ".join(text.split())
            if clean_text:
                documents.append({"source": pdf_path.name, "content": clean_text})
        except Exception as e:
            logging.error(f"Could not read {pdf_path.name}. Error: {e}")
    return documents

