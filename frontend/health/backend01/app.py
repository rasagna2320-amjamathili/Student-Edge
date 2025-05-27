from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
genai.configure(api_key=os.getenv("api_key_flask"))

# Initialize model
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    try:
        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract required fields with defaults
        company_req = data.get('companyRequirements', '')
        student_data = data.get('student', {})
        
        # Prepare prompt
        prompt = f"""
        Create a professional resume for {student_data.get('name', 'Candidate')} 
        tailored for: {company_req}
        
        Include sections for:
        - Education (CGPA: {student_data.get('CGPA', '')})
        - Skills: {', '.join(student_data.get('skills', []))}
        - Certifications: {', '.join(student_data.get('certifications', []))}
        - Projects: {', '.join(student_data.get('participatedTechEvents', []))}
        """
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'resume': response.text
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)