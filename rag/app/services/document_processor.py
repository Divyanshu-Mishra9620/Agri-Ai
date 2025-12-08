import logging
import os
from typing import List, Dict
from pathlib import Path
import PyPDF2
from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """
    Processes documents (PDF, TXT) and prepares them for ingestion into vector store.
    """
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        """
        Initialize the document processor.
        
        Args:
            chunk_size: Size of text chunks
            chunk_overlap: Overlap between consecutive chunks
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    
    def process_pdf(self, file_path: str) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Extracted text
        """
        try:
            logger.info(f"Processing PDF: {file_path}")
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            logger.info(f"Extracted {len(text)} characters from PDF")
            return text
        except Exception as e:
            logger.error(f"Error processing PDF {file_path}: {e}")
            raise
    
    def process_txt(self, file_path: str) -> str:
        """
        Read text from a TXT file.
        
        Args:
            file_path: Path to the TXT file
            
        Returns:
            File contents
        """
        try:
            logger.info(f"Processing TXT: {file_path}")
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            logger.info(f"Read {len(text)} characters from TXT")
            return text
        except Exception as e:
            logger.error(f"Error processing TXT {file_path}: {e}")
            raise
    
    def chunk_text(self, text: str) -> List[str]:
        """
        Split text into smaller chunks.
        
        Args:
            text: Text to split
            
        Returns:
            List of text chunks
        """
        try:
            chunks = self.text_splitter.split_text(text)
            logger.info(f"Split text into {len(chunks)} chunks")
            return chunks
        except Exception as e:
            logger.error(f"Error chunking text: {e}")
            raise
    
    def process_directory(self, directory_path: str) -> List[Dict]:
        """
        Process all supported documents in a directory.
        
        Args:
            directory_path: Path to directory containing documents
            
        Returns:
            List of dictionaries containing document chunks and metadata
        """
        processed_documents = []
        directory = Path(directory_path)
        
        if not directory.exists():
            logger.error(f"Directory not found: {directory_path}")
            return processed_documents
        
        # Process all files in directory
        for file_path in directory.rglob('*'):
            if file_path.is_file():
                try:
                    # Determine file type and process
                    if file_path.suffix.lower() == '.pdf':
                        text = self.process_pdf(str(file_path))
                    elif file_path.suffix.lower() == '.txt':
                        text = self.process_txt(str(file_path))
                    else:
                        logger.info(f"Skipping unsupported file type: {file_path}")
                        continue
                    
                    # Chunk the text
                    chunks = self.chunk_text(text)
                    
                    # Create document entries with metadata
                    for idx, chunk in enumerate(chunks):
                        doc_entry = {
                            'text': chunk,
                            'metadata': {
                                'source': str(file_path),
                                'filename': file_path.name,
                                'chunk_index': idx,
                                'total_chunks': len(chunks)
                            },
                            'id': f"{file_path.stem}_{idx}"
                        }
                        processed_documents.append(doc_entry)
                    
                    logger.info(f"Processed {file_path.name}: {len(chunks)} chunks")
                    
                except Exception as e:
                    logger.error(f"Error processing file {file_path}: {e}")
                    continue
        
        logger.info(f"Total documents processed: {len(processed_documents)}")
        return processed_documents
    
    def process_single_file(self, file_path: str) -> List[Dict]:
        """
        Process a single document file.
        
        Args:
            file_path: Path to the document file
            
        Returns:
            List of dictionaries containing document chunks and metadata
        """
        processed_documents = []
        path = Path(file_path)
        
        if not path.exists():
            logger.error(f"File not found: {file_path}")
            return processed_documents
        
        try:
            # Determine file type and process
            if path.suffix.lower() == '.pdf':
                text = self.process_pdf(file_path)
            elif path.suffix.lower() == '.txt':
                text = self.process_txt(file_path)
            else:
                logger.error(f"Unsupported file type: {path.suffix}")
                return processed_documents
            
            # Chunk the text
            chunks = self.chunk_text(text)
            
            # Create document entries with metadata
            for idx, chunk in enumerate(chunks):
                doc_entry = {
                    'text': chunk,
                    'metadata': {
                        'source': file_path,
                        'filename': path.name,
                        'chunk_index': idx,
                        'total_chunks': len(chunks)
                    },
                    'id': f"{path.stem}_{idx}"
                }
                processed_documents.append(doc_entry)
            
            logger.info(f"Processed {path.name}: {len(chunks)} chunks")
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
        
        return processed_documents
