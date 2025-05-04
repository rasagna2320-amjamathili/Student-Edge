from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import openai
import json
import logging
import os
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import tempfile
import io

app = Flask(__name__)
#CORS(app, resources={r"/generate-resume": {"origins": "*"}})
CORS(app)


# Configure MongoDB
MONGO_URI = "mongodb+srv://rasagna2023:MongoDB_password@cluster0.g8rue.mongodb.net/studentEdgeDB?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['studentEdgeDB']
students_collection = db['students']

# Configure OpenRouter API with DeepSeek
API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY
)

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

def process_document_with_deepseek(text):
    prompt = f"""
    Analyze this job description/document and extract ALL the key technical skills, 
    programming languages, frameworks, and other relevant requirements. 
    Focus specifically on computer science and engineering related terms.

    IMPORTANT:
    1. Extract ALL technical skills mentioned
    2. Include both full forms and abbreviations (e.g., "SQL" and "Structured Query Language")
    3. Include programming languages, databases, frameworks, tools, etc.
    4. Return a comprehensive list without omitting any technical requirements
    5. Output MUST be in strict JSON format as specified below
    6. Do NOT include any markdown (e.g., json) or additional text outside the JSON

    DOCUMENT CONTENT:
    {text}

    REQUIRED OUTPUT FORMAT (strict JSON):
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
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.2  # Lower temperature for more structured output
        )
        raw_response = response.choices[0].message.content.strip()
        logger.info(f"Raw DeepSeek response: {raw_response}")  # Log raw response for debugging

        # Remove json markers if present
        cleaned_response = raw_response.replace("json", "").replace("", "").strip()
        if not cleaned_response:
            raise ValueError("Empty response after cleaning")

        result = json.loads(cleaned_response)
        
        # Ensure we have a list of skills
        if not isinstance(result.get("skills"), list):
            raise ValueError("Invalid skills format")
            
        # Clean and normalize skills
        cleaned_skills = []
        for skill in result["skills"]:
            if isinstance(skill, str):
                skill = skill.lower().strip()
                if skill and skill not in cleaned_skills:
                    cleaned_skills.append(skill)
        
        result["skills"] = cleaned_skills
        return result
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}, Raw response: {raw_response}")
        return None
    except Exception as e:
        logger.error(f"DeepSeek document processing error: {e}")
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

@app.route("/health", methods=["GET"])
def health_check():
    try:
        client.admin.command("ping")
        return jsonify({"status": "healthy", "db_connected": True}), 200
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return jsonify({"status": "unhealthy", "db_connected": False, "error": str(e)}), 500

def check_deepseek_connection():
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[{"role": "user", "content": "Connection test"}],
            max_tokens=10
        )
        content = response.choices[0].message.content.strip()
        is_valid = bool(content) and "error" not in content.lower()  # Basic check for valid response
        return {
            "connected": True,
            "key_valid": True,
            "response_ok": is_valid,
            "message": "DeepSeek API is responding" if is_valid else "Response invalid"
        }
    except openai.AuthenticationError:
        logger.error("Invalid API key")
        return {"connected": False, "key_valid": False, "response_ok": False, "message": "Invalid API key"}
    except openai.RateLimitError:
        logger.error("Rate limit exceeded")
        return {"connected": True, "key_valid": True, "response_ok": False, "message": "Rate limit exceeded"}
    except Exception as e:
        logger.error(f"DeepSeek connection error: {e}")
        return {"connected": False, "key_valid": True, "response_ok": False, "message": str(e)}

@app.route("/ai-status", methods=["GET"])
def ai_status():
    return jsonify(check_deepseek_connection())

def generate_deepseek_response(query):
    # Comprehensive abbreviation mapping
    abbreviation_map = {
        "SQL": "Structured Query Language",
        "AI": "Artificial Intelligence",
        "ML": "Machine Learning",
        "DBMS": "Database Management System",
        "OS": "Operating System",
        "DSA": "Data Structures and Algorithms",
        "OOP": "Object-Oriented Programming",
        "UI": "User Interface",
        "UX": "User Experience",
        "API": "Application Programming Interface",
        "CSS": "Cascading Style Sheets",
        "HTML": "Hypertext Markup Language",
        "JS": "JavaScript",
        "REST": "Representational State Transfer",
        "IOT": "Internet of Things",
        "NLP": "Natural Language Processing",
        "CV": "Computer Vision",
        "GUI": "Graphical User Interface",
        "CI/CD": "Continuous Integration/Continuous Deployment",
        "VCS": "Version Control System",
        "IDE": "Integrated Development Environment",
        "ORM": "Object-Relational Mapping",
        "JVM": "Java Virtual Machine",
        "HTTP": "Hypertext Transfer Protocol",
        "HTTPS": "Hypertext Transfer Protocol Secure",
        "TCP/IP": "Transmission Control Protocol/Internet Protocol",
        "NoSQL": "Not Only SQL",
        "RDBMS": "Relational Database Management System",
    }
    
    # Reverse mapping (full form to abbreviation)
    reverse_map = {v.lower(): k for k, v in abbreviation_map.items()}

    prompt = f"""
    You are an AI-enhanced search assistant for engineering student profiles.

    Given this search query: "{query}"

    TASKS:
    1. MOST IMPORTANT: Correct any typos in both individual words and multi-word technical terms.
    2. Identify all technical terms in the query, both single words and multi-word phrases.
    3. For each technical term:
       a. If it's an abbreviation, provide its full form
       b. If it's a full form (possibly with typos), provide its abbreviation
    4. Handle the query as COMPLETE PHRASES first, then as individual words
    5. Focus only on terms related to computer science, engineering, and IT fields
    
    OUTPUT FORMAT (strict JSON):
    {{
        "original_query": "{query}",
        "corrected_query": "corrected query with all typos fixed",
        "expanded_terms": ["Expanded Full Term 1", "Expanded Full Term 2"],
        "abbreviations": ["Abbr1", "Abbr2"],
        "all_suggestions": ["All words to be matched for search"]
    }}
    
    Examples:
    - For typos in technical terms, correct them and provide both forms
    - For abbreviations, provide their full forms 
    - For full terms (even with typos), provide their abbreviations
    - Always normalize capitalization appropriately
    """

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.1  # Lower temperature for more precise responses
        )
        cleaned_response = response.choices[0].message.content.strip()
        logger.info(f"DeepSeek search response: {cleaned_response}")
        
        # Remove JSON code blocks if present
        if "json" in cleaned_response:
            cleaned_response = cleaned_response.split("json")[1].split("")[0]
        elif "" in cleaned_response:
            cleaned_response = cleaned_response.split("")[1].split("")[0]
            
        parsed = json.loads(cleaned_response)

        # Ensure all required fields are present
        for field in ["corrected_query", "expanded_terms", "abbreviations", "all_suggestions"]:
            if field not in parsed:
                parsed[field] = [] if field != "corrected_query" else query

        # Ensure corrected_query is populated
        if not parsed["corrected_query"]:
            parsed["corrected_query"] = query

        # Ensure no duplicates and proper formatting
        parsed["all_suggestions"] = list(set(x for x in parsed.get("all_suggestions", []) if x))
        parsed["expanded_terms"] = list(set(x for x in parsed.get("expanded_terms", []) if x))
        parsed["abbreviations"] = list(set(x for x in parsed.get("abbreviations", []) if x))
        
        # Add the corrected query to suggestions if not already included
        if parsed["corrected_query"] and parsed["corrected_query"] not in parsed["all_suggestions"]:
            parsed["all_suggestions"].append(parsed["corrected_query"])
            
        # Add expanded terms and abbreviations to all_suggestions
        parsed["all_suggestions"].extend([x for x in parsed["expanded_terms"] if x not in parsed["all_suggestions"]])
        parsed["all_suggestions"].extend([x for x in parsed["abbreviations"] if x not in parsed["all_suggestions"]])
        
        return parsed

    except Exception as e:
        logger.error(f"DeepSeek processing error: {e}")
        # General fallback processing that doesn't rely on hardcoded special cases
        result = {
            "original_query": query,
            "corrected_query": query,
            "expanded_terms": [],
            "abbreviations": [],
            "all_suggestions": [query]  # At minimum, include the original query
        }

        # Split query into terms
        query_terms = query.lower().strip().split()

        for term in query_terms:
            term = term.strip()
            if not term:
                continue
            
            # Process abbreviations and full forms from our mapping
            if term.upper() in abbreviation_map:
                full_form = abbreviation_map[term.upper()]
                result["expanded_terms"].append(full_form)
                result["abbreviations"].append(term.upper())
                result["all_suggestions"].extend([term.upper(), full_form])
            elif term.lower() in reverse_map:
                abbr = reverse_map[term.lower()]
                result["expanded_terms"].append(term)
                result["abbreviations"].append(abbr)
                result["all_suggestions"].extend([term, abbr])
            else:
                if term not in result["all_suggestions"]:
                    result["all_suggestions"].append(term)

        # Remove duplicates
        result["all_suggestions"] = list(set(result["all_suggestions"]))
        result["expanded_terms"] = list(set(result["expanded_terms"]))
        result["abbreviations"] = list(set(result["abbreviations"]))
        
        return result

@app.route("/search", methods=["POST"])
def improved_search():
    data = request.json
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Empty query"}), 400

    # Process query using DeepSeek
    deepseek_response = generate_deepseek_response(query)
    logger.info(f"Search query: {query}, DeepSeek response: {deepseek_response}")

    if not deepseek_response:
        return jsonify({
            "original_query": query,
            "improved_queries": [query]
        })

    # Combine all suggestions
    all_suggestions = list(set(deepseek_response.get("all_suggestions", [])))

    return jsonify({
        "original_query": query,
        "improved_queries": all_suggestions,
        "source": "DeepSeek AI"
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
                
            # Process with DeepSeek
            processed = process_document_with_deepseek(text)
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

@app.route("/students/<string:student_id>", methods=["GET"])
def get_student(student_id):
    try:
        # Attempt to convert student_id to ObjectId
        student_oid = ObjectId(student_id)
        student = students_collection.find_one({"_id": student_oid})
        if student:
            student["_id"] = str(student["_id"])
            return jsonify(student)
        return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        logger.error(f"Error fetching student: {e}")
        # Check if the error is due to invalid ObjectId
        if "invalid" in str(e).lower():
            return jsonify({"error": "Invalid student ID format"}), 400
        return jsonify({"error": "Failed to fetch student"}), 500

@app.route("/generate-resume", methods=["POST","OPTIONS"])
def generate_resume():
        
    try:
        if request.method == 'OPTIONS':
        # Preflight request handling
            return '', 200
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # ❌ Don't get student_data
        # ✅ Get student_id
        student_id = data.get("student_id")
        requirements = data.get("requirements", "")

        if not student_id:
            return jsonify({"error": "No student ID provided"}), 400

        # ✅ Now fetch the student from MongoDB
        student_oid = ObjectId(student_id)
        student_data = students_collection.find_one({"_id": student_oid})
        

        if not student_data:
            return jsonify({"error": "Student not found"}), 404

        # ✨ Now you can continue to generate resume using student_data
        branch_code = student_data.get("roll_no", "000")[6:9]
        branch_map = {
            "737": "Information Technology",
            "733": "Computer Science and Engineering",
            "735": "Electronics and Communication Engineering",
            "734": "Electrical and Electronics Engineering",
            "736": "Mechanical Engineering",
            "771": "Artificial Intelligence and Data Science",
            "729": "Artificial Intelligence and Machine Learning",
        }
        branch_name = branch_map.get(branch_code, "Engineering")

        prompt = f"""
        Create a professional resume using the following student data.
        
        INSTRUCTIONS:
        1. STRICTLY EXCLUDE THE EDUCATION SECTION (we'll add it separately)
        2. DO NOT include any mention of the student's name or email
        3. DO NOT use markdown (no asterisks or symbols)
        4. Use ALL UPPERCASE HEADINGS(BOLD)(OTHER DETAILS LOWERCASE, except the starting letter of the heading text, make that capital)
        5. Structure SKILLS into subcategories like:(STRICTLY ADD BULLET POINTS in place of hyphens, one for each sub category, same line only bullet points and the whole sub category in one line)

            -Programming Languages:
            -Databases:
            -Frameworks/Libraries:
            -Tools:
            -Others: (if present only)
        6. Include only these sections in this order:
           SUMMARY (4 lines only)(HEADING AS OBJECTIVE), TECHNICAL SKILLS, CERTIFICATIONS, 
           PROJECTS AND TECHNICAL EVENTS, CO-CURRICULAR ACTIVITIES, 
           EXTRACURRICULAR ACTIVITIES.
        7.STRICTLY Make all these sections headings BOLD and UPPERCASE.
    
        
        
        STUDENT BACKGROUND:
        - Pursuing B.Tech in {branch_name}
        - CGPA: {student_data.get("CGPA", "N/A")}   
        - LinkedIn: {student_data.get("linkedinProfile", "Not provided")}
        - GitHub: {student_data.get("githubProfile", "Not provided")}
        
        
        

        SKILLS: {", ".join(student_data.get("skills", [])) or "None"}
        CERTIFICATIONS: {", ".join(student_data.get("certifications", [])) or "None"}
        PROJECTS AND EVENTS: {", ".join(student_data.get("participatedTechEvents", [])) or "None"}
        CO-CURRICULAR: {", ".join(student_data.get("coCurricularActivities", [])) or "None"}
        EXTRA-CURRICULAR: {", ".join(student_data.get("extraCurricularActivities", [])) or "None"}
        """

        # DeepSeek AI call
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
            temperature=0.3
        )
        
        resume_text = response.choices[0].message.content.strip()

        education_section = f"""Chaitanya Bharathi Institute of Technology (CBIT)
Bachelor of Technology in {branch_name} (Pursuing)
CGPA: {student_data.get("CGPA", "N/A")}\n
"""
        professional_details_section = f"""LinkedIn: {student_data.get("linkedinProfile", "Not provided")}\nGitHub: {student_data.get("githubProfile", "Not provided")}\n"""

        contact_info = []
        if student_data.get("linkedinProfile"):
            contact_info.append(f"LinkedIn: {student_data['linkedinProfile']}")
        if student_data.get("githubProfile"):
            contact_info.append(f"GitHub: {student_data['githubProfile']}")

        if contact_info:
            resume_text = resume_text.replace(
                "SUMMARY",
                f"{' | '.join(contact_info)}\n\nSUMMARY"
            )

        full_resume = education_section + resume_text

        return jsonify({
            "resume": full_resume,
            "status": "success"
        })

    except Exception as e:
        logger.error(f"Error generating resume: {e}")
        return jsonify({
            "error": "Failed to generate resume",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)