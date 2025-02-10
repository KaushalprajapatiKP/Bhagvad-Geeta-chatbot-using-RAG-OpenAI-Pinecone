import uuid
import os
from flask import Blueprint,request, jsonify
from dotenv import load_dotenv
from src.helper import download_hugging_face_embeddings, translate_text
from langchain.chains import RetrievalQA
from langchain_openai import OpenAI
from langchain_pinecone import PineconeVectorStore
from src.prompt import custom_prompt  # Ensure custom_prompt is imported properly

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("❌ Missing Pinecone API Key!")

# Load embeddings and initialize Pinecone
embeddings = download_hugging_face_embeddings()
index_name = "bhagvad-geeta-chatbot"
docsearch = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings)
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 5})

# Store chat histories per session
chat_histories = {}

# Create Flask Blueprint
api = Blueprint("api", __name__)

def ask_krishna(session_id=None, message="", language="en", openai_api_key=None, temperature=0.4, max_tokens=500):
    """Handles multilingual chat requests with RetrievalQA and Krishna's wisdom."""
    global chat_histories

    # Initialize session if not provided
    if not session_id:
        session_id = str(uuid.uuid4())
        chat_histories[session_id] = []
        print(f"🆕 New session started: {session_id}")

    chat_history = chat_histories.get(session_id, [])

    try:
        # 🔒 Validate OpenAI API Key
        if not openai_api_key or not openai_api_key.startswith("sk-"):
            return session_id, "❌ Invalid OpenAI API key."

        # 🌍 Translate user input to English
        translated_message = translate_text(message, source_language=language, target_language="en")

        # 🔍 Retrieve relevant context from Pinecone
        retrieved_docs = retriever.invoke(translated_message)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs]) if retrieved_docs else "No context found."
        # context = "\n\n".join([
        #     f"📖 **Bhagavad Gita {doc.metadata.get('chapter')}.{doc.metadata.get('verse')}**\n\n"
        #     f"🕉 **{doc.metadata.get('sanskrit', '')}**\n\n"
        #     f"_({doc.metadata.get('transliteration', '')})_\n\n"
        #     f"➡️ **Translation:** {doc.page_content}"
        #     for doc in retrieved_docs if doc.page_content
        # ]) if retrieved_docs else "No context found."

        # 🔥 Format the Prompt with Context, Chat History, and Question
        formatted_prompt = custom_prompt.format(
            context=context,  # Bhagavad Gita verses from retrieval
            chat_history="\n".join([f"You: {q}\nKrishna: {a}" for q, a in chat_history]),  # Chat history
            question=translated_message
        )

        # ✨ Invoke OpenAI LLM directly (no need for RetrievalQA again)
        llm = OpenAI(temperature=temperature, max_tokens=max_tokens, openai_api_key=openai_api_key)
        response = llm.invoke(formatted_prompt)

        # 🌍 Translate response back to the user's language
        translated_response = translate_text(response, source_language="en", target_language=language)

        # 💾 Store conversation history (limit to last 10 messages)
        chat_history.append((message, translated_response))
        chat_histories[session_id] = chat_history[-10:]

        return session_id, translated_response

    except Exception as e:
        print(f"❌ Error in ask_krishna: {str(e)}")
        return session_id, f"❌ Error: {str(e)}"


@api.route("/ask_krishna", methods=["POST"])
def chat():
    """API endpoint to handle chat requests."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request, no data received"}), 400

        session_id = data.get("session_id", None)
        message = data.get("message", "")
        language = data.get("language", "en")
        openai_api_key = data.get("apiKey")
        temperature = data.get("temperature", 0.4)  # Default temperature
        max_tokens = data.get("max_tokens", 500)   # Default token limit

        if not message:
            return jsonify({"error": "Message field is required"}), 400

        if not openai_api_key:
            return jsonify({"error": "OpenAI API key is required"}), 400

        session_id, response = ask_krishna(session_id, message, language, openai_api_key, temperature, max_tokens)

        return jsonify({"session_id": session_id, "response": response})

    except Exception as e:
        print(f"❌ Error in /ask_krishna: {str(e)}")
        return jsonify({"error": str(e)}), 500
