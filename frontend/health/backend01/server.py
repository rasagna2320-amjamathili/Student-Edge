from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import google.generativeai as genai
import json
import logging

app = Flask(__name__)
CORS(app)

# Configure MongoDB
MONGO_URI = "mongodb+srv://rasagna2023:MongoDB_password@cluster0.g8rue.mongodb.net/studentEdgeDB?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['studentEdgeDB']
students_collection = db['students']

# Configure Google Gemini API
API_KEY = "AIzaSyDxVPfqi8ki4nMKDed8XgjkSmTUqbgV01s"
genai.configure(api_key=API_KEY)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route("/")
def home():
    return "Flask server is running!"

# Get all students from MongoDB
@app.route("/students", methods=["GET"])
@app.route("/students", methods=["GET"])
def get_students():
    try:
        students = list(students_collection.find({}))
        for student in students:
            student['_id'] = str(student['_id'])
        return jsonify(students)
    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        return jsonify({"error": "Failed to fetch students"}), 500

# Check Gemini connection
def check_gemini_connection():
    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content("Connection test")
        return response.text is not None
    except Exception as e:
        logger.error(f"Gemini connection error: {e}")
        return False

@app.route("/gemini-status", methods=["GET"])
def gemini_status():
    return jsonify({"connected": check_gemini_connection()})

# Generate response with Gemini AI
def generate_gemini_response(query):
    abbreviation_fallback = {
        "SQL": "Structured Query Language",
        "AI": "Artificial Intelligence",
        "ML": "Machine Learning",
        "DBMS": "Database Management System",
        "OS": "Operating System",
        "DSA": "Data Structures and Algorithms",
        "OOP": "Object-Oriented Programming",
    }

    prompt = f"""
    Process this computer science search query: "{query}"

    REQUIRED ACTIONS:
    1. Correct any typos (e.g., "inteligence" → "intelligence")
    2. Expand all abbreviations (e.g., "SQL" → "Structured Query Language") and provide both full forms and abbreviations.
    3. Ensure the response always includes BOTH the full term and its abbreviation (if applicable).
    4. Only return computer science-related terms.

    RESPONSE FORMAT (JSON):
    {{
        "original_query": "{query}",
        "corrected_query": "corrected text",
        "expanded_terms": ["Full Term 1", "Full Term 2"],
        "abbreviations": ["abbr1", "abbr2"],
        "all_suggestions": ["suggestion1", "suggestion2"]
    }}

    If an abbreviation does not have a full form, return the abbreviation as is.
    """

    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_response)
    except Exception as e:
        logger.error(f"Gemini processing error: {e}")
        return None

@app.route("/search", methods=["POST"])
def improved_search():
    data = request.json
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Empty query"}), 400

    # Process query using Gemini
    gemini_response = generate_gemini_response(query)

    if not gemini_response:
        return jsonify({
            "original_query": query,
            "improved_queries": [query]  # Fallback to original
        })

    # Ensure SQL is always included if relevant
    if "sql" in query.lower() or "structured query language" in query.lower():
        if "SQL" not in gemini_response["abbreviations"]:
            gemini_response["abbreviations"].append("SQL")
        if "Structured Query Language" not in gemini_response["expanded_terms"]:
            gemini_response["expanded_terms"].append("Structured Query Language")

    # Combine all suggestions
    all_suggestions = list(set(
        gemini_response["expanded_terms"] +
        gemini_response["abbreviations"] +
        [gemini_response["corrected_query"]]
    ))

    return jsonify({
        "original_query": query,
        "improved_queries": all_suggestions,
        "source": "Gemini AI"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000) 