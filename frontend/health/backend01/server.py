from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import google.generativeai as genai
import json
import logging
import os
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import tempfile
import io

app = Flask(__name__)
CORS(app)

# Configure MongoDB
MONGO_URI = "mongodb+srv://rasagna2023:MongoDB_password@cluster0.g8rue.mongodb.net/studentEdgeDB?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['studentEdgeDB']
students_collection = db['students']

# Configure Google Gemini API
API_KEY = "AIzaSyCq4J3kWnxSkl5lWgsxJZw1G2fxSM3R9SA"
genai.configure(api_key=API_KEY)

# Configure upload settings
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath):
    try:
        with open(filepath, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
    except Exception as e:
        logger.error(f"Error reading PDF: {e}")
        return None

def extract_text_from_docx(filepath):
    try:
        doc = docx.Document(filepath)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        return None

def process_document_with_gemini(text):
    prompt = f"""
    Analyze this job description/document and extract ALL the key technical skills, 
    programming languages, frameworks, and other relevant requirements. 
    Focus specifically on computer science and engineering related terms.

    IMPORTANT:
    1. Extract ALL technical skills mentioned
    2. Include both full forms and abbreviations (e.g., "SQL" and "Structured Query Language")
    3. Include programming languages, databases, frameworks, tools, etc.
    4. Return a comprehensive list without omitting any technical requirements

    DOCUMENT CONTENT:
    {text}

    REQUIRED OUTPUT FORMAT (JSON):
    {{
        "skills": ["complete", "list", "of", "all", "technical", "requirements"],
        "summary": "Brief summary of requirements"
    }}

    Example:
    For "Backend Developer: Programming knowledge using Python and MariaDB/PostgreSQL/MySQL",
    you should return:
    {{
        "skills": ["python", "mariadb", "postgresql", "mysql", "sql"],
        "summary": "Backend development with Python and SQL databases"
    }}
    """
    
    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_response)
        
        # Ensure we have a list of skills
        if not isinstance(result.get("skills"), list):
            raise ValueError("Invalid skills format")
            
        # Clean and normalize skills
        cleaned_skills = []
        for skill in result["skills"]:
            if isinstance(skill, str):
                # Normalize skill names
                skill = skill.lower().strip()
                if skill and skill not in cleaned_skills:
                    cleaned_skills.append(skill)
        
        result["skills"] = cleaned_skills
        return result
        
    except Exception as e:
        logger.error(f"Gemini document processing error: {e}")
        return None

@app.route("/")
def home():
    return "Flask server is running!"

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
    You are an AI-enhanced search assistant for engineering student profiles.

    Given this search query: "{query}"

    TASKS:
    1. Correct any typos. For example: "artificil inteligence" → "Artificial Intelligence"
    2. If the query is an abbreviation (e.g., "AI", "ML"), expand it (e.g., "Artificial Intelligence", "Machine Learning")
    3. If the query is a full form (e.g., "Artificial Intelligence"), include its abbreviation too ("AI").
    4. Filter out unrelated or general words. Focus only on terms related to CSE, ECE, EEE, IT (technical fields).
    5. Make sure the returned suggestions match **complete terms only**, not substrings inside unrelated words.

    OUTPUT FORMAT (strict JSON):
    {{
        "original_query": "{query}",
        "corrected_query": "corrected query",
        "expanded_terms": ["Expanded Full Term 1", "Expanded Full Term 2"],
        "abbreviations": ["Abbr1", "Abbr2"],
        "all_suggestions": ["All words to be matched for search"]
    }}

    Examples:
    - Input: "artificil inteligence" → Output: {{"corrected_query": "Artificial Intelligence", "expanded_terms": [...], ...}}
    - Input: "AI" → Output: {{"corrected_query": "AI", "expanded_terms": ["Artificial Intelligence"], ...}}
    - Input: "Machine Learning" → Output includes both "ML" and "Machine Learning"
    """

    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()

        parsed = json.loads(cleaned_response)

        # Fallback logic
        if not parsed.get("expanded_terms") and parsed.get("corrected_query", "").upper() in abbreviation_fallback:
            full_term = abbreviation_fallback[parsed["corrected_query"].upper()]
            parsed["expanded_terms"] = [full_term]
            parsed["abbreviations"] = [parsed["corrected_query"].upper()]
            parsed["all_suggestions"] = list(set([full_term, parsed["corrected_query"].upper()]))

        return parsed

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

@app.route("/upload-requirements", methods=["POST"])
def upload_requirements():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Extract text based on file type
            if filename.lower().endswith('.pdf'):
                text = extract_text_from_pdf(filepath)
            elif filename.lower().endswith(('.doc', '.docx')):
                text = extract_text_from_docx(filepath)
            else:
                return jsonify({"error": "Unsupported file type"}), 400
                
            if not text:
                return jsonify({"error": "Could not extract text from file"}), 400
                
            # Process with Gemini
            processed = process_document_with_gemini(text)
            if not processed:
                return jsonify({"error": "Failed to process document with AI"}), 500
                
            return jsonify({
                "message": "Document processed successfully",
                "skills": processed.get("skills", []),
                "summary": processed.get("summary", "")
            })
            
        except Exception as e:
            logger.error(f"Error processing file: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            # Clean up the uploaded file
            try:
                os.remove(filepath)
            except:
                pass
    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)