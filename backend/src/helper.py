import uuid
import os
import pinecone
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Pinecone
from langchain.chains import ConversationalRetrievalChain
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from deep_translator import GoogleTranslator
from langchain_huggingface import HuggingFaceEmbeddings
translator = GoogleTranslator(source="auto", target="en")

index_name = "bhagvad-geeta-chatbot" 
# Load PDF Files
def load_pdf_file_data(data_path):
    loader = DirectoryLoader(data_path, glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    return documents

# Split text into smaller chunks
def text_split_chunks(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=300)
    return text_splitter.split_documents(extracted_data)

# Download embeddings from Hugging Face
def download_hugging_face_embeddings():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# # Translate text
# def translate_text(text, source_language="auto", target_language="en"):
#     """Translate text while preserving meaning."""
#     try:
#         translated = translator.translate(text, src=source_language, dest=target_language)
#         return translated  # translated is already a string
#     except Exception as e:
#         return f"Translation Error: {str(e)}"
def translate_text(text, source_language="auto", target_language="en"):
    """Translate text while preserving meaning."""
    try:
        translated = GoogleTranslator(source=source_language, target=target_language).translate(text)
        return translated.encode("utf-8", "ignore").decode("utf-8")  # ✅ Ensure UTF-8 encoding
    except Exception as e:
        return f"Translation Error: {str(e)}"

# Load and process documents
def initialize_vectorstore(data_path):
    extracted_data = load_pdf_file_data(data_path)
    text_chunks = text_split_chunks(extracted_data)
    embeddings = download_hugging_face_embeddings()

    docsearch = Pinecone.from_documents(
        documents=text_chunks, index_name=index_name, embedding=embeddings
    )

    return docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 5})
