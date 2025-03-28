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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import StudentCard from "./StudentCard";
import { CSVLink } from "react-csv";

const students = [
  {
    name: "John Doe",
    rollNo: "CSE2201",
    email: "john@example.com",
    password: "securePass123",
    branch: "CSE",
    section: "CSE-2",
    gpa: 8.5,
    courses: ["Artificial Intelligence", "Machine Learning Fundamentals"],
    certificates: ["AWS Machine Learning Specialist", "Google AI Professional"],
    skills: ["Python", "TensorFlow", "PyTorch"],
  },
  {
    name: "Jane Smith",
    rollNo: "IT2203",
    email: "jane@example.com",
    password: "dataScience123",
    branch: "IT",
    section: "IT-1",
    gpa: 9.0,
    courses: ["Data Science Fundamentals", "Machine Learning and Deep Learning"],
    certificates: ["IBM Data Science Professional", "Machine Learning by Coursera"],
    skills: ["R", "SQL", "Pandas", "Machine Learning"],
  },
];

const API_BASE = "http://localhost:5000";

const abbreviationMap = {
  ds: ["data science"],
  ml: ["machine learning"],
  ai: ["artificial intelligence"],
  bd: ["big data"],
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [branchFilter, setBranchFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [gpaFilter, setGpaFilter] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geminiStatus, setGeminiStatus] = useState("Checking...");

  const navigate = useNavigate();

  useEffect(() => {
    let filtered = students;

    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter((student) => {
        const searchFields = [
          student.name,
          student.rollNo,
          student.email,
          student.branch,
          student.section,
          ...student.courses,
          ...student.certificates,
          ...student.skills,
        ].map((f) => f.toLowerCase());

        const hasDirectMatch = searchFields.some((field) => field.includes(searchTerm));
        const abbreviationMatches = abbreviationMap[searchTerm] || [];
        const hasAbbrevMatch = abbreviationMatches.some((term) =>
          searchFields.some((field) => field.includes(term))
        );
        return hasDirectMatch || hasAbbrevMatch;
      });
    }

    if (branchFilter) {
      filtered = filtered.filter((student) => student.branch === branchFilter);
    }
    if (sectionFilter) {
      filtered = filtered.filter((student) => student.section === sectionFilter);
    }
    if (skillFilter) {
      filtered = filtered.filter((student) => student.skills.includes(skillFilter));
    }
    if (gpaFilter) {
      filtered = filtered.filter((student) => student.gpa >= parseFloat(gpaFilter));
    }

    setFilteredStudents(filtered);
  }, [search, branchFilter, sectionFilter, skillFilter, gpaFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/search`, { query: search });
      let fetchedSuggestions = response.data?.improved_queries || [];

      const relevantSuggestions = fetchedSuggestions.filter((suggestion) =>
        students.some((student) =>
          [
            student.name,
            student.rollNo,
            student.branch,
            student.section,
            ...student.courses,
            ...student.certificates,
            ...student.skills,
          ].some((field) => field.toLowerCase().includes(suggestion.toLowerCase()))
        )
      );

      setSuggestions(relevantSuggestions);
      setError(null);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkGeminiConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE}/gemini-status`);
      setGeminiStatus(response.data.status || "Connected");
    } catch (error) {
      setGeminiStatus("Not Connected");
      console.error("Gemini API error:", error);
    }
  };

  useEffect(() => {
    checkGeminiConnection();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">CDC Student Search</h1>
      <p>Gemini Status: {geminiStatus}</p>
      <div className="filters">
        <select onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
        </select>
        <select onChange={(e) => setSectionFilter(e.target.value)}>
          <option value="">All Sections</option>
          <option value="CSE-2">CSE-2</option>
          <option value="IT-1">IT-1</option>
        </select>
        <select onChange={(e) => setSkillFilter(e.target.value)}>
          <option value="">All Skills</option>
          <option value="Python">Python</option>
          <option value="TensorFlow">TensorFlow</option>
          <option value="R">R</option>
        </select>
        <input
          type="number"
          placeholder="Min GPA"
          onChange={(e) => setGpaFilter(e.target.value)}
        />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch(search)}>Search</button>
        <CSVLink
          data={filteredStudents.map(({ rollNo, name, gpa }) => ({
            RollNo: rollNo,
            Name: name,
            GPA: gpa,
          }))}
          filename="students.csv"
        >
          <button>Download CSV</button>
        </CSVLink>
      </div>
      {isLoading && <p>Loading suggestions...</p>}
      {error && <p className="error">{error}</p>}
      {suggestions.length > 0 && (
        <div className="suggestions">
          <p>Suggestions:</p>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="student-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <StudentCard key={index} student={student} />
          ))
        ) : (
          <p className="no-students">No students found.</p>
        )}
      </div>
    </div>
  );
}
