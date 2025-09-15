import os
import logging
import requests
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

def download_pdf(url: str, directory: str) -> str:
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    try:
        base_filename = url.split('/')[-1].split('?')[0]
        if not base_filename.lower().endswith('.pdf'):
            base_filename += '.pdf'
        filename = os.path.join(directory, base_filename)
        
        if not os.path.exists(filename):
            logging.info(f"Downloading {url}...")
            response = requests.get(url, timeout=60, allow_redirects=True, headers={'User-Agent': 'Mozilla/5.0'})
            response.raise_for_status()
            with open(filename, 'wb') as f:
                f.write(response.content)
            logging.info(f"Successfully downloaded {filename}")
        else:
            logging.info(f"File already exists: {filename}")
        return filename
    except requests.RequestException as e:
        logging.error(f"Failed to download {url}: {e}")
        return ""

def parse_pdf(file_path: str) -> str:
    if not os.path.exists(file_path):
        logging.error(f"PDF file not found for parsing: {file_path}")
        return ""
    try:
        logging.info(f"Parsing PDF: {file_path}")
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        logging.error(f"Failed to parse {file_path}: {e}")
        return ""

def download_and_process_pdfs(urls: list[str], directory: str):
    logging.info("Starting PDF download workflow...")
    for url in urls:
        download_pdf(url, directory)
    logging.info("PDF download workflow finished.")

def load_processed_documents() -> list[str]:
    logging.info("Loading and chunking documents from the data directory...")
    all_chunks = []
    data_dir = settings.DATA_DIR

    if not os.path.exists(data_dir):
        logging.error(f"Data directory '{data_dir}' not found.")
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )

    for filename in os.listdir(data_dir):
        if filename.lower().endswith(".pdf"):
            file_path = os.path.join(data_dir, filename)
            full_text = parse_pdf(file_path)
            
            if full_text:
                chunks = text_splitter.split_text(full_text)
                cleaned_chunks = [chunk.strip() for chunk in chunks if len(chunk.strip()) > 50]
                all_chunks.extend(cleaned_chunks)
                logging.info(f"Processed '{filename}' into {len(cleaned_chunks)} chunks.")

    logging.info(f"Total document chunks loaded: {len(all_chunks)}")
    return all_chunks