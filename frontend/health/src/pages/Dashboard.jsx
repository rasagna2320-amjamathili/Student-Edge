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
        console.error("Error checking Gemini status:", error);
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
      console.error("Error fetching suggestions:", error);
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import StudentCard from "./StudentCard";
import { CSVLink } from "react-csv";

const API_BASE = "http:// 172.16.7.155:5000";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [gpaFilter, setGpaFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geminiStatus, setGeminiStatus] = useState("Checking...");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerms, setSearchTerms] = useState([]);

  // Fetch students and check Gemini status on mount
  useEffect(() => {
    fetchStudents();
    checkGeminiConnection();
  }, []);

  // Clear search terms when search is empty
  useEffect(() => {
    if (!search.trim()) {
      setSearchTerms([]);
    }
  }, [search]);

  // Apply all filters whenever dependencies change
  useEffect(() => {
    let filtered = [...students];

    // Debug: Log sample student data
    if (filtered.length > 0) {
      console.log("Sample student data:", {
        roll_no: filtered[0].roll_no,
        branchCode: filtered[0].roll_no.slice(6, 9),
        yearDigits: filtered[0].roll_no.slice(5, 7),
        sectionIndicator: filtered[0].roll_no.slice(9, 12),
      });
    }

    // Enhanced search filter (searches both original terms and suggestions)
    if (search.trim() || searchTerms.length > 0) {
      const searchTerm = search.toLowerCase();
      const lowerSuggestions = suggestions.map(s => s.toLowerCase());
      
      filtered = filtered.filter((student) => {
        const searchFields = [
          ...(student.skills || []),
          ...(student.certifications || []),
          ...(student.participatedTechEvents || []),
          ...(student.extraCurricularActivities || []),
          ...(student.coCurricularActivities || []),
          ...(student.additionalFields || [])
        ];

        // Combine all terms we want to search for
        const allSearchTerms = [
          searchTerm,
          ...searchTerms,
          ...lowerSuggestions
        ].filter(term => term.trim() !== '');

        return searchFields.some((field) => {
          const lowerField = String(field).toLowerCase();
          return allSearchTerms.some(term => lowerField.includes(term));
        });
      });
    }

    // Branch filter (digits 7-9 in 0-based index = positions 7-9 in roll number)
    if (branchFilter) {
      filtered = filtered.filter((student) => {
        const branchCode = student.roll_no.slice(6, 9);
        const branchMap = {
          "737": "IT",
          "733": "CSE",
          "735": "ECE",
          "734": "EEE",
          "736": "MECH",
          "771": "AIDS",
          "729": "AIML",
        };
        return branchMap[branchCode] === branchFilter;
      });
    }

    // Year filter (digits 5-6 in 0-based index = positions 6-7 in roll number)
    if (yearFilter) {
      filtered = filtered.filter((student) => {
        const yearDigits = student.roll_no.slice(4, 6);
        const yearMap = {
          "24": "1", // 1st year
          "23": "2", // 2nd year
          "22": "3", // 3rd year
          "21": "4", // 4th year
        };
        return yearMap[yearDigits] === yearFilter;
      });
    }

    // Section filter (last 3 digits determine section, now positions 10-12)
    if (sectionFilter) {
      filtered = filtered.filter((student) => {
        const sectionIndicator = parseInt(student.roll_no.slice(9, 12));
        const branchCode = student.roll_no.slice(6, 9);
        const branchMap = {
          "737": "IT",
          "733": "CSE",
          "735": "ECE",
          "734": "EEE",
          "736": "MECH",
          "771": "AIDS",
          "729": "AIML",
        };
        const branchName = branchMap[branchCode] || "";

        let section;
        if (sectionIndicator <= 70) section = "1";
        else if (sectionIndicator <= 140) section = "2";
        else section = "3";

        return `${branchName}-${section}` === sectionFilter;
      });
    }

    // GPA filter
    if (gpaFilter) {
      filtered = filtered.filter((student) => student.CGPA >= parseFloat(gpaFilter));
    }

    setFilteredStudents(filtered);
  }, [search, branchFilter, yearFilter, sectionFilter, gpaFilter, students, suggestions, searchTerms]);

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

  const checkGeminiConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE}/gemini-status`);
      setGeminiStatus(response.data.connected ? "Connected ✅" : "Not Connected ❌");
    } catch (err) {
      console.error("Gemini connection check failed:", err);
      setGeminiStatus("Connection Failed ❌");
    }
  };

  const fetchSuggestions = async () => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await axios.post(`${API_BASE}/search`, { query: search });
      setSuggestions(response.data.improved_queries || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
      setError("Failed to get search suggestions. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <div className="status-bar">
        <span>Gemini Status: {geminiStatus}</span>
        {isLoading && <span className="loading">Loading...</span>}
        {error && <span className="error">{error}</span>}
      </div>

      {/* Filters */}
      <div className="filters">
        <select 
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">All Branches</option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
          <option value="AIDS">AIDS</option>
          <option value="AIML">AIML</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All Sections</option>
          {["IT", "CSE", "ECE", "EEE", "MECH", "AIDS", "AIML"].map((branch) => (
            [1, 2, 3].map((section) => (
              <option key={`${branch}-${section}`} value={`${branch}-${section}`}>
                {branch}-{section}
              </option>
            ))
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
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
      </div>

      {/* Search and Export */}
      <div className="search-export">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search skills, certifications, events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                    if (search.trim()) {
                      setSearchTerms(prev => [...prev, search.toLowerCase()]);
                    }
                    setSearch(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <CSVLink
          data={filteredStudents.map((student) => ({
            RollNo: student.roll_no,
            Name: student.name,
            Branch: student.roll_no.slice(6, 9),
            Year: student.roll_no.slice(5, 7),
            Section: (() => {
              const sectionIndicator = parseInt(student.roll_no.slice(9, 12));
              if (sectionIndicator <= 70) return "1";
              if (sectionIndicator <= 140) return "2";
              return "3";
            })(),
            CGPA: student.CGPA,
          }))}
          filename="students_data.csv"
          className="export-btn"
        >
          Export to CSV
        </CSVLink>
      </div>

      {/* Results */}
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