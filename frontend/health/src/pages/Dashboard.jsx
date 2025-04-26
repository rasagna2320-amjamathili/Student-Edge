//this is same as CdcHome
/*import React, { useState, useEffect } from "react";
import axios from "axios";

const students = [
  {
    name: "John Doe",
    email: "john@example.com",
    courses: ["Artificial Intelligence", "Machine Learning Fundamentals"],
    certificates: ["AWS Machine Learning Specialist", "Google AI Professional"],
    skills: ["Python", "TensorFlow", "PyTorch"],
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    courses: ["Data Science Fundamentals", "Machine Learning and Deep Learning"],
    certificates: ["IBM Data Science Professional", "Machine Learning by Coursera"],
    skills: ["R", "SQL", "Pandas", "Machine Learning"],
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    courses: ["Deep Learning", "Natural Language Processing"],
    certificates: ["Deep Learning Specialization", "TensorFlow Developer Certificate"],
    skills: ["Python", "Keras", "NLP", "Data Analysis"],
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [geminiStatus, setGeminiStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const API_BASE = "http://localhost:5000";

  // Check if Gemini AI is connected
  useEffect(() => {
    const checkGemini = async () => {
      try {
        const response = await axios.get(`${API_BASE}/gemini-status`);
        setGeminiStatus(response.data.connected);
      } catch (error) {
        setGeminiStatus(false);
      }
    };
    checkGemini();
  }, []);

  // Fetch AI-enhanced search suggestions
  const fetchSuggestions = async () => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.post(`${API_BASE}/search`, { query: search });
      setSuggestions(response.data.improved_queries || []);
      setError(null); // Clear any previous errors
    } catch (error) {
      setSuggestions([]); // Clear suggestions
      if (error.response && error.response.status === 429) {
        setError("API quota exceeded. Please try again later.");
      } else {
        setError("Failed to fetch suggestions. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    fetchSuggestions();
  };

  // Filter students based on search input and suggestions
  const filteredStudents = students.filter((student) => {
    const searchFields = [
      student.name,
      student.email,
      ...student.courses,
      ...student.certificates,
      ...student.skills,
    ];

    // Convert all fields and search terms to lowercase for case-insensitive matching
    const lowerSearch = search.toLowerCase();
    const lowerSuggestions = suggestions.map((suggestion) => suggestion.toLowerCase());

    // Check if any field matches the search term or any suggestion
    return searchFields.some((field) => {
      const lowerField = field.toLowerCase();
      return (
        lowerField.includes(lowerSearch) || // Match search input
        lowerSuggestions.some((suggestion) => lowerField.includes(suggestion)) // Match suggestions
      );
    });
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">CDC Student Search</h1>
      <p className="text-gray-600 mb-4">Search for students based on their courses, certifications, and skills</p>

      
      <div className="mb-4">
        <strong>Gemini AI Status: </strong>
        <span className={`px-3 py-1 rounded-full ${geminiStatus ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {geminiStatus === null ? "Checking..." : geminiStatus ? "Connected" : "Not Connected"}
        </span>
      </div>

      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search students by skills, courses, or certificates..."
          className="w-full p-3 border rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
 
      {error && (
        <div className="bg-red-100 p-3 rounded-md mb-4 text-red-600">
          {error}
        </div>
      )}
 
      {suggestions.length > 0 && (
        <div className="bg-gray-100 p-3 rounded-md mb-6">
          <strong>Suggestions:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestions.map((suggestion, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-200 rounded-full cursor-pointer"
                onClick={() => {
                  setSearch(suggestion); // Update search input
                  setSuggestions([]); // Clear suggestions
                }}
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
 
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student, index) => (
          <div key={index} className="border p-5 mb-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
            <div className="mt-3">
              <strong>Courses:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {student.courses.map((course, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-200 rounded-full">{course}</span>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <strong>Certificates:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {student.certificates.map((cert, i) => (
                  <span key={i} className="px-3 py-1 border rounded-full">{cert}</span>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <strong>Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {student.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-black text-white rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No students found.</p>
      )}
    </div>
  );
}
*/
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";
import StudentCard from "./StudentCard";
import { CSVLink } from "react-csv";
import { FiUpload, FiDownload } from "react-icons/fi";

const API_BASE = "http://192.168.0.196:5000";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [gpaFilter, setGpaFilter] = useState("");
  const [specificFilter, setSpecificFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiStatus, setAIStatus] = useState("Checking...");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerms, setSearchTerms] = useState([]);
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchStudents();
    checkAIStatus();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchTerms([]);
      setSuggestions([]);
    } else {
      fetchSuggestions();
    }
  }, [search]);

  useEffect(() => {
    let filtered = [...students].map(student => {
      const matchInfo = calculateMatchPercentage(student, searchTerms);
      return {
        ...student,
        matchPercentage: matchInfo.percentage,
        matchedSkills: matchInfo.matchedSkills,
        searchTerms: searchTerms
      };
    });

    if (specificFilter.trim()) {
      const specificTerms = specificFilter.split(",").map(term => term.trim().toLowerCase());
      filtered = filtered.filter(student => 
        specificTerms.some(term => 
          (student.name?.toLowerCase().includes(term) || 
           student.roll_no?.toLowerCase().includes(term) || 
           student.email?.toLowerCase().includes(term))
        )
      );
    }

    if (search.trim() || searchTerms.length > 0) {
      filtered = filtered.filter(student => 
        student.matchPercentage >= matchThreshold
      );
    }

    if (branchFilter) {
      filtered = filtered.filter((student) => {
        const branchCode = student.roll_no?.slice(6, 9);
        const branchMap = {
          "737": "IT", "733": "CSE", "735": "ECE", 
          "734": "EEE", "736": "MECH", "771": "AIDS", "729": "AIML"
        };
        return branchMap[branchCode] === branchFilter;
      });
    }

    if (yearFilter) {
      filtered = filtered.filter((student) => {
        const yearDigits = student.roll_no?.slice(4, 6);
        const yearMap = {"24": "1", "23": "2", "22": "3", "21": "4"};
        return yearMap[yearDigits] === yearFilter;
      });
    }

    if (sectionFilter) {
      filtered = filtered.filter((student) => {
        const sectionIndicator = parseInt(student.roll_no?.slice(9, 12));
        const branchCode = student.roll_no?.slice(6, 9);
        const branchMap = {
          "737": "IT", "733": "CSE", "735": "ECE", 
          "734": "EEE", "736": "MECH", "771": "AIDS", "729": "AIML"
        };
        const branchName = branchMap[branchCode] || "";
        let section = sectionIndicator <= 70 ? "1" : sectionIndicator <= 140 ? "2" : "3";
        return `${branchName}-${section}` === sectionFilter;
      });
    }

    if (gpaFilter) {
      filtered = filtered.filter((student) => student.CGPA >= parseFloat(gpaFilter));
    }

    if (searchTerms.length > 0) {
      filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    setFilteredStudents(filtered);
  }, [search, branchFilter, yearFilter, sectionFilter, gpaFilter, students, suggestions, searchTerms, matchThreshold, specificFilter]);

  const calculateMatchPercentage = (student, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) {
      return { percentage: 0, matchedSkills: [] };
    }

    const equivalentTerms = {
      "ai": ["artificial intelligence"],
      "artificial intelligence": ["ai"],
      "ml": ["machine learning"],
      "machine learning": ["ml"],
      "sql": ["structured query language"],
      "structured query language": ["sql"],
      "dbms": ["database management system"],
      "database management system": ["dbms"],
      "os": ["operating system"],
      "operating system": ["os"],
      "dsa": ["data structures and algorithms", "data structures"],
      "data structures and algorithms": ["dsa"],
      "data structures": ["dsa"],
      "oop": ["object-oriented programming"],
      "object-oriented programming": ["oop"],
      "ui": ["user interface"],
      "user interface": ["ui"],
      "ux": ["user experience"],
      "user experience": ["ux"],
      "api": ["application programming interface"],
      "application programming interface": ["api"],
      "css": ["cascading style sheets"],
      "cascading style sheets": ["css"],
      "html": ["hypertext markup language"],
      "hypertext markup language": ["html"],
      "js": ["javascript"],
      "javascript": ["js"],
      "rest": ["representational state transfer"],
      "representational state transfer": ["rest"],
      "iot": ["internet of things"],
      "internet of things": ["iot"],
      "nlp": ["natural language processing"],
      "natural language processing": ["nlp"],
      "cv": ["computer vision"],
      "computer vision": ["cv"],
      "gui": ["graphical user interface"],
      "graphical user interface": ["gui"],
      "ci/cd": ["continuous integration/continuous deployment"],
      "continuous integration/continuous deployment": ["ci/cd"],
      "vcs": ["version control system"],
      "version control system": ["vcs"],
      "ide": ["integrated development environment"],
      "integrated development environment": ["ide"],
      "orm": ["object-relational mapping"],
      "object-relational mapping": ["orm"],
      "jvm": ["java virtual machine"],
      "java virtual machine": ["jvm"],
      "http": ["hypertext transfer protocol"],
      "hypertext transfer protocol": ["http"],
      "https": ["hypertext transfer protocol secure"],
      "hypertext transfer protocol secure": ["https"],
      "tcp/ip": ["transmission control protocol/internet protocol"],
      "transmission control protocol/internet protocol": ["tcp/ip"],
      "nosql": ["not only sql"],
      "not only sql": ["nosql"],
      "rdbms": ["relational database management system"],
      "relational database management system": ["rdbms"],
    };

    const studentData = [
      ...(student.skills || []),
      ...(student.certifications || []),
      ...(student.coCurricularActivities || []),
      ...(student.additionalFields || [])
    ].map(item => item.toString().toLowerCase());

    const hasExactWordMatch = (term, dataArray) => {
      const exactPattern = new RegExp(`(^|\\s|,|\\.|;|:)${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|,|\\.|;|:|$)`, 'i');
      return dataArray.some(field => exactPattern.test(field));
    };

    const matchedSkills = [];
    const alreadyMatched = new Set();

    for (const skill of requiredSkills) {
      const normalizedSkill = skill.toLowerCase().trim();
      if (alreadyMatched.has(normalizedSkill)) continue;

      const termsToCheck = [normalizedSkill];
      if (equivalentTerms[normalizedSkill]) {
        termsToCheck.push(...equivalentTerms[normalizedSkill]);
      }

      let foundMatch = false;
      for (const term of termsToCheck) {
        if (hasExactWordMatch(term, studentData)) {
          foundMatch = true;
          break;
        }
      }

      if (foundMatch) {
        matchedSkills.push(skill);
        alreadyMatched.add(normalizedSkill);
        if (equivalentTerms[normalizedSkill]) {
          equivalentTerms[normalizedSkill].forEach(term => alreadyMatched.add(term));
        }
      }
    }

    const percentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    return { percentage, matchedSkills };
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/students`);
      setStudents(response.data);
      setFilteredStudents(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load student data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAIStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai-status`);
      const { connected, key_valid, response_ok, message } = response.data;
      setAIStatus(`${message} (Connected: ${connected}, Key Valid: ${key_valid}, Response OK: ${response_ok})`);
    } catch (err) {
      console.error("AI status check failed:", err);
      setAIStatus("Connection Failed ❌");
    }
  };

  const fetchSuggestions = useCallback(async () => {
    if (!search.trim()) {
      setSuggestions([]);
      setSearchTerms([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.post(`${API_BASE}/search`, { query: search });
      const improvedQueries = response.data.improved_queries || [];
      // Ensure full phrases and abbreviations are included
      const processedTerms = processSearchTerms(search);
      setSuggestions([...new Set([...improvedQueries, ...processedTerms])]);
      setSearchTerms(processedTerms); // Use processed terms for matching
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
      setError("Failed to get search suggestions. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, [search]);

  const processSearchTerms = (input) => {
    const terms = input.split(",").map(term => term.trim().toLowerCase());
    const equivalentTerms = {
      "ai": ["artificial intelligence"],
      "artificial intelligence": ["ai"],
      "ml": ["machine learning"],
      "machine learning": ["ml"],
      "sql": ["structured query language"],
      "structured query language": ["sql"],
      // Add more mappings as needed
    };
    const allTerms = [];
    terms.forEach(term => {
      allTerms.push(term);
      if (equivalentTerms[term]) {
        allTerms.push(...equivalentTerms[term]);
      }
    });
    return [...new Set(allTerms)];
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Uploading and processing document...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/upload-requirements`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("Document processed successfully!");
      setSearchTerms(response.data.skills || []);
      setSearch(response.data.skills.join(", ") || "");
      setMatchThreshold(50);
    } catch (err) {
      console.error("Error uploading file:", err);
      setUploadStatus("Failed to process document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">CDC Dashboard</h1>
      <div className="status-bar">
        <span>AI Status: {aiStatus}</span>
        {isLoading && <span className="loading">Loading...</span>}
        {error && <span className="error">{error}</span>}
        {uploadStatus && <span className={uploadStatus.includes("Failed") ? "error" : "success"}>{uploadStatus}</span>}
      </div>

      <div className="filters">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
          <option value="AIDS">AIDS</option>
          <option value="AIML">AIML</option>
        </select>

        <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
          <option value="">All Sections</option>
          {["IT", "CSE", "ECE", "EEE", "MECH", "AIDS", "AIML"].map((branch) => (
            [1, 2, 3].map((section) => (
              <option key={`${branch}-${section}`} value={`${branch}-${section}`}>
                {branch}-{section}
              </option>
            ))
          ))}
        </select>

        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <input
          type="number"
          placeholder="Min GPA"
          min="0"
          max="10"
          step="0.1"
          value={gpaFilter}
          onChange={(e) => setGpaFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by Name, Roll No, or Email (comma-separated)"
          value={specificFilter}
          onChange={(e) => setSpecificFilter(e.target.value)}
        />

        {searchTerms.length > 0 && (
          <div className="match-filter">
            <label>Match: ≥{matchThreshold}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(parseInt(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="search-export">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search Students by Their Skills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchSuggestions();
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchSuggestions()}
          />
          <button 
            onClick={fetchSuggestions}
            disabled={isSearching}
            className="search-btn"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-box">
            <strong>AI Suggestions:</strong>
            <div className="suggestions-list">
              {suggestions.map((suggestion, i) => (
                <span
                  key={i}
                  className="suggestion-tag"
                  onClick={() => {
                    setSearch(suggestion);
                    setSuggestions([]);
                    fetchSuggestions();
                  }}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="action-buttons">
          <label className="upload-btn">
            <FiUpload className="btn-icon" />
            {isUploading ? "Processing..." : "Upload Requirements"}
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </label>

          <CSVLink
            data={filteredStudents.map((student) => ({
              RollNo: student.roll_no,
              Name: student.name,
              Email: student.email,
              Branch: student.roll_no?.slice(6, 9),
              Year: student.roll_no?.slice(4, 6),
              Section: (() => {
                const sectionIndicator = parseInt(student.roll_no?.slice(9, 12));
                if (sectionIndicator <= 70) return "1";
                if (sectionIndicator <= 140) return "2";
                return "3";
              })(),
              CGPA: student.CGPA,
              MatchPercentage: student.matchPercentage || 0,
              MatchedSkills: student.matchedSkills?.join(", ") || ""
            }))}
            filename="students_data.csv"
            className="export-btn"
          >
            <FiDownload className="btn-icon" />
            Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="student-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard key={student.roll_no} student={student} />
          ))
        ) : (
          <div className="no-results">
            {students.length === 0 ? "No student data available." : "No students match your filters."}
          </div>
        )}
      </div>
    </div>
  );
}