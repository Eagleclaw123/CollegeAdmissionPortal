import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  Filter,
  GraduationCap,
  MapPin,
  Building,
  Calendar,
  Users,
  IndianRupee,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { COLLEGE_DATA } from "../data/constants";

// Sample data - fallback if COLLEGE_DATA is not available
const SAMPLE_COLLEGE_DATA = [
  {
    id: 1,
    instCode: "JNTU01",
    instituteName: "Jawaharlal Nehru Technological University",
    place: "Hyderabad",
    distCode: "HYD",
    coEducation: "Co-Ed",
    collegeType: "Government",
    yearOfEstab: "1972",
    branchCode: "CSE",
    branchName: "Computer Science Engineering",
    ranks: {
      oc: { boys: "1500", girls: "1800" },
      bc_a: { boys: "2500", girls: "2800" },
      bc_b: { boys: "3500", girls: "3800" },
      bc_c: { boys: "4500", girls: "4800" },
      bc_d: { boys: "5500", girls: "5800" },
      bc_e: { boys: "6500", girls: "6800" },
      sc: { boys: "7500", girls: "7800" },
      st: { boys: "8500", girls: "8800" },
      ews: { genOu: "1200", girlsOu: "1400" },
    },
    tuitionFee: "150000",
    affiliatedTo: "JNTU Hyderabad",
  },
  {
    id: 2,
    instCode: "OUCT01",
    instituteName: "Osmania University College of Technology",
    place: "Hyderabad",
    distCode: "HYD",
    coEducation: "Co-Ed",
    collegeType: "Government",
    yearOfEstab: "1974",
    branchCode: "ECE",
    branchName: "Electronics & Communication Engineering",
    ranks: {
      oc: { boys: "2000", girls: "2200" },
      bc_a: { boys: "3000", girls: "3200" },
      bc_b: { boys: "4000", girls: "4200" },
      bc_c: { boys: "5000", girls: "5200" },
      bc_d: { boys: "6000", girls: "6200" },
      bc_e: { boys: "7000", girls: "7200" },
      sc: { boys: "8000", girls: "8200" },
      st: { boys: "9000", girls: "9200" },
      ews: { genOu: "1800", girlsOu: "2000" },
    },
    tuitionFee: "120000",
    affiliatedTo: "Osmania University",
  },
  {
    id: 3,
    instCode: "MGIT01",
    instituteName: "Mahatma Gandhi Institute of Technology",
    place: "Gandipet",
    distCode: "RR",
    coEducation: "Co-Ed",
    collegeType: "Private",
    yearOfEstab: "1998",
    branchCode: "IT",
    branchName: "Information Technology",
    ranks: {
      oc: { boys: "3500", girls: "3800" },
      bc_a: { boys: "4500", girls: "4800" },
      bc_b: { boys: "5500", girls: "5800" },
      bc_c: { boys: "6500", girls: "6800" },
      bc_d: { boys: "7500", girls: "7800" },
      bc_e: { boys: "8500", girls: "8800" },
      sc: { boys: "9500", girls: "9800" },
      st: { boys: "10500", girls: "10800" },
      ews: { genOu: "3200", girlsOu: "3500" },
    },
    tuitionFee: "200000",
    affiliatedTo: "JNTU Hyderabad",
  },
  // Add more sample data for demonstration
  {
    id: 4,
    instCode: "CBIT01",
    instituteName: "Chaitanya Bharathi Institute of Technology",
    place: "Hyderabad",
    distCode: "HYD",
    coEducation: "Co-Ed",
    collegeType: "Private",
    yearOfEstab: "1979",
    branchCode: "CSE",
    branchName: "Computer Science Engineering",
    ranks: {
      oc: { boys: "2200", girls: "2500" },
      bc_a: { boys: "3200", girls: "3500" },
      bc_b: { boys: "4200", girls: "4500" },
      bc_c: { boys: "5200", girls: "5500" },
      bc_d: { boys: "6200", girls: "6500" },
      bc_e: { boys: "7200", girls: "7500" },
      sc: { boys: "8200", girls: "8500" },
      st: { boys: "9200", girls: "9500" },
      ews: { genOu: "2000", girlsOu: "2200" },
    },
    tuitionFee: "180000",
    affiliatedTo: "Osmania University",
  },
  {
    id: 5,
    instCode: "VJIT01",
    instituteName: "Vardhaman College of Engineering",
    place: "Shamshabad",
    distCode: "RR",
    coEducation: "Co-Ed",
    collegeType: "Private",
    yearOfEstab: "1999",
    branchCode: "ECE",
    branchName: "Electronics & Communication Engineering",
    ranks: {
      oc: { boys: "4000", girls: "4300" },
      bc_a: { boys: "5000", girls: "5300" },
      bc_b: { boys: "6000", girls: "6300" },
      bc_c: { boys: "7000", girls: "7300" },
      bc_d: { boys: "8000", girls: "8300" },
      bc_e: { boys: "9000", girls: "9300" },
      sc: { boys: "10000", girls: "10300" },
      st: { boys: "11000", girls: "11300" },
      ews: { genOu: "3800", girlsOu: "4000" },
    },
    tuitionFee: "160000",
    affiliatedTo: "JNTU Hyderabad",
  },
];

const CATEGORIES = [
  "OC",
  "BC_A",
  "BC_B",
  "BC_C",
  "BC_D",
  "BC_E",
  "SC",
  "ST",
  "EWS",
];
const GENDERS = ["BOYS", "GIRLS"];

// Number of colleges to load per batch
const COLLEGES_PER_PAGE = 10;

const CollegeAdmissionPortal = () => {
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    minRank: "",
    maxRank: "",
    place: "",
    collegeType: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [displayedCount, setDisplayedCount] = useState(COLLEGES_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Use COLLEGE_DATA if available, otherwise use SAMPLE_COLLEGE_DATA
  const collegeData =
    typeof COLLEGE_DATA !== "undefined" ? COLLEGE_DATA : SAMPLE_COLLEGE_DATA;

  // Filter colleges based on criteria
  const filteredColleges = useMemo(() => {
    let filtered = collegeData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (college) =>
          college.instituteName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          college.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.place.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rank range and category
    if (
      filters.category &&
      filters.gender &&
      (filters.minRank || filters.maxRank)
    ) {
      const categoryKey = filters.category.toLowerCase();
      const genderKey = filters.gender.toLowerCase();

      filtered = filtered.filter((college) => {
        const rank = parseInt(college.ranks[categoryKey]?.[genderKey]) || 0;
        if (rank === 0) return false;

        const minRank = parseInt(filters.minRank) || 0;
        const maxRank = parseInt(filters.maxRank) || Infinity;

        return rank >= minRank && rank <= maxRank;
      });
    }

    // Filter by place
    if (filters.place) {
      filtered = filtered.filter((college) =>
        college.place.toLowerCase().includes(filters.place.toLowerCase())
      );
    }

    // Filter by college type
    if (filters.collegeType) {
      filtered = filtered.filter(
        (college) =>
          college.collegeType.toLowerCase() ===
          filters.collegeType.toLowerCase()
      );
    }

    return filtered;
  }, [filters, searchTerm, collegeData]);

  // Colleges to display (limited by displayedCount)
  const displayedColleges = useMemo(() => {
    return filteredColleges.slice(0, displayedCount);
  }, [filteredColleges, displayedCount]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(COLLEGES_PER_PAGE);
  }, [filters, searchTerm]);

  // Load more colleges
  const loadMoreColleges = useCallback(() => {
    if (isLoading || displayedCount >= filteredColleges.length) return;

    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + COLLEGES_PER_PAGE, filteredColleges.length)
      );
      setIsLoading(false);
    }, 500);
  }, [isLoading, displayedCount, filteredColleges.length]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
      ) {
        loadMoreColleges();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreColleges]);

  const resetFilters = () => {
    setFilters({
      category: "",
      gender: "",
      minRank: "",
      maxRank: "",
      place: "",
      collegeType: "",
    });
    setSearchTerm("");
  };

  const downloadExcel = () => {
    // Prepare data for Excel (use all filtered colleges, not just displayed ones)
    const excelData = filteredColleges.map((college) => ({
      "Institute Code": college.instCode,
      "Institute Name": college.instituteName,
      Place: college.place,
      "College Type": college.collegeType,
      "Branch Name": college.branchName,
      "Year Established": college.yearOfEstab,
      "Tuition Fee": college.tuitionFee,
      "Affiliated To": college.affiliatedTo,
      "OC Boys": college.ranks.oc?.boys || "",
      "OC Girls": college.ranks.oc?.girls || "",
      "BC_A Boys": college.ranks.bc_a?.boys || "",
      "BC_A Girls": college.ranks.bc_a?.girls || "",
      "BC_B Boys": college.ranks.bc_b?.boys || "",
      "BC_B Girls": college.ranks.bc_b?.girls || "",
      "BC_C Boys": college.ranks.bc_c?.boys || "",
      "BC_C Girls": college.ranks.bc_c?.girls || "",
      "BC_D Boys": college.ranks.bc_d?.boys || "",
      "BC_D Girls": college.ranks.bc_d?.girls || "",
      "BC_E Boys": college.ranks.bc_e?.boys || "",
      "BC_E Girls": college.ranks.bc_e?.girls || "",
      "SC Boys": college.ranks.sc?.boys || "",
      "SC Girls": college.ranks.sc?.girls || "",
      "ST Boys": college.ranks.st?.boys || "",
      "ST Girls": college.ranks.st?.girls || "",
      "EWS General": college.ranks.ews?.genOu || "",
      "EWS Girls": college.ranks.ews?.girlsOu || "",
    }));

    // Convert to CSV format
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(","),
      ...excelData.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ].join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `college_admission_data_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    // Create a printable version (use all filtered colleges)
    const printContent = `
      <html>
        <head>
          <title>College Admission Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 30px; }
            .college { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; page-break-inside: avoid; }
            .college-name { font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .details { margin-top: 10px; }
            .detail-row { margin: 5px 0; }
            .ranks { margin-top: 10px; }
            .rank-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
            .rank-item { border: 1px solid #eee; padding: 8px; text-align: center; }
            .rank-category { font-weight: bold; color: #2563eb; font-size: 10px; }
            .rank-value { font-size: 11px; }
            @media print {
              body { margin: 0; }
              .college { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>College Admission Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Colleges: ${filteredColleges.length}</p>
          </div>
          ${filteredColleges
            .map(
              (college) => `
            <div class="college">
              <div class="college-name">${college.instituteName}</div>
              <div class="details">
                <div class="detail-row"><strong>Code:</strong> ${
                  college.instCode
                }</div>
                <div class="detail-row"><strong>Branch:</strong> ${
                  college.branchName
                }</div>
                <div class="detail-row"><strong>Location:</strong> ${
                  college.place
                }</div>
                <div class="detail-row"><strong>Type:</strong> ${
                  college.collegeType
                }</div>
                <div class="detail-row"><strong>Established:</strong> ${
                  college.yearOfEstab
                }</div>
                <div class="detail-row"><strong>Tuition Fee:</strong> ₹${parseInt(
                  college.tuitionFee
                ).toLocaleString()}/year</div>
                <div class="detail-row"><strong>Affiliated To:</strong> ${
                  college.affiliatedTo
                }</div>
                <div class="ranks">
                  <strong>Closing Ranks:</strong>
                  <div class="rank-grid">
                    ${Object.entries(college.ranks)
                      .map(
                        ([category, ranks]) => `
                      <div class="rank-item">
                        <div class="rank-category">${
                          category === "ews"
                            ? "EWS"
                            : category.replace("_", "-").toUpperCase()
                        }</div>
                        <div class="rank-value">
                          M: ${
                            category === "ews"
                              ? ranks.genOu || "-"
                              : ranks.boys || "-"
                          }<br>
                          F: ${
                            category === "ews"
                              ? ranks.girlsOu || "-"
                              : ranks.girls || "-"
                          }
                        </div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const toggleExpand = (collegeId) => {
    setExpandedCard(expandedCard === collegeId ? null : collegeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-3 rounded-full">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  College Admission Portal
                </h1>
                <p className="text-gray-600">
                  Find your perfect college based on rank and category
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <span className="text-indigo-800 font-semibold">
                  {filteredColleges.length} Colleges Found
                </span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-semibold">
                  Showing {displayedColleges.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search colleges, branches, or locations..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={downloadExcel}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  title="Download as Excel/CSV"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <Download className="h-3 w-3" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  title="Download as PDF"
                >
                  <FileText className="h-4 w-4" />
                  <Download className="h-3 w-3" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Gender</option>
                    {GENDERS.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Rank
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.minRank}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minRank: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Rank
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.maxRank}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxRank: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hyderabad"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.place}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, place: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Type
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.collegeType}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        collegeType: e.target.value,
                      }))
                    }
                  >
                    <option value="">All Types</option>
                    <option value="GOV">Government</option>
                    <option value="PVT">Private</option>
                    <option value="UNIV">University</option>
                    <option value="SF">Self Finance</option>
                  </select>
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {displayedColleges.length === 0 && !isLoading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No colleges found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <>
              {displayedColleges.map((college) => (
                <div
                  key={college.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => toggleExpand(college.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {college.instituteName}
                          </h3>
                          <div className="flex items-center text-indigo-600">
                            {expandedCard === college.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm">
                              {college.branchName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{college.place}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Building className="h-4 w-4" />
                            <span className="text-sm">
                              {college.collegeType}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              Est. {college.yearOfEstab}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-600 font-bold">
                          <IndianRupee className="h-4 w-4" />
                          <span>
                            {parseInt(college.tuitionFee).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Annual Fee
                        </span>
                      </div>
                    </div>

                    {/* Rank Information - Always visible */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Closing Ranks
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(college.ranks).map(
                          ([category, ranks]) => (
                            <div key={category} className="text-center">
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="font-medium text-indigo-600 uppercase text-xs mb-1">
                                  {category === "ews"
                                    ? "EWS"
                                    : category.replace("_", "-")}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    <span className="text-gray-600">M:</span>
                                    <span className="font-semibold ml-1">
                                      {category === "ews"
                                        ? ranks.genOu || "-"
                                        : ranks.boys || "-"}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-600">F:</span>
                                    <span className="font-semibold ml-1">
                                      {category === "ews"
                                        ? ranks.girlsOu || "-"
                                        : ranks.girls || "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedCard === college.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              College Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Institute Code:
                                </span>
                                <span className="font-medium">
                                  {college.instCode}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Branch Code:
                                </span>
                                <span className="font-medium">
                                  {college.branchCode}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  District Code:
                                </span>
                                <span className="font-medium">
                                  {college.distCode}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Co-Education:
                                </span>
                                <span className="font-medium flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {college.coEducation}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Affiliated To:
                                </span>
                                <span className="font-medium">
                                  {college.affiliatedTo}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Additional Information
                            </h4>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Note:</strong> The closing ranks shown
                                are based on previous year's admission data.
                                Actual cutoffs may vary depending on the number
                                of applicants and seat availability.
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm text-green-800">
                                <strong>Fee Structure:</strong> The tuition fee
                                mentioned is the annual fee. Additional charges
                                like hostel, mess, and other facilities may
                                apply separately.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Basic Details - Always visible */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            <strong>Code:</strong> {college.instCode}
                          </span>
                          <span>
                            <strong>Affiliated:</strong> {college.affiliatedTo}
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{college.coEducation}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center space-x-2 text-indigo-600">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading more colleges...</span>
                  </div>
                </div>
              )}

              {/* End of results indicator */}
              {!isLoading &&
                displayedColleges.length === filteredColleges.length &&
                filteredColleges.length > 0 && (
                  <div className="text-center py-4 text-gray-600">
                    <p>
                      End of results • {filteredColleges.length} colleges found
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeAdmissionPortal;
