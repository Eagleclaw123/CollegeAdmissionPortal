import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
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
  // ... (your existing sample data)
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
const BRANCHES = [
  "Computer Science Engineering",
  "Electronics & Communication Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

const CollegeAdmissionPortal = () => {
  // Initial search state
  const [hasSearched, setHasSearched] = useState(false);
  const [initialSearch, setInitialSearch] = useState({
    rank: "",
    category: "",
    gender: "",
    branch: "",
  });

  // Main states
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
  const [sortBy, setSortBy] = useState("rank-asc");

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
    if (filters.category && filters.gender) {
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

    // Filter by branch
    if (initialSearch.branch) {
      filtered = filtered.filter((college) =>
        college.branchName
          .toLowerCase()
          .includes(initialSearch.branch.toLowerCase())
      );
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
  }, [filters, searchTerm, initialSearch.branch, collegeData]);

  // Sort colleges
  const sortedColleges = useMemo(() => {
    return [...filteredColleges].sort((a, b) => {
      const categoryKey = filters.category.toLowerCase();
      const genderKey = filters.gender.toLowerCase();

      switch (sortBy) {
        case "rank-asc":
          return (
            parseInt(a.ranks[categoryKey]?.[genderKey]) -
            parseInt(b.ranks[categoryKey]?.[genderKey])
          );
        case "rank-desc":
          return (
            parseInt(b.ranks[categoryKey]?.[genderKey]) -
            parseInt(a.ranks[categoryKey]?.[genderKey])
          );
        case "fee-asc":
          return parseInt(a.tuitionFee) - parseInt(b.tuitionFee);
        case "fee-desc":
          return parseInt(b.tuitionFee) - parseInt(a.tuitionFee);
        case "name-asc":
          return a.instituteName.localeCompare(b.instituteName);
        case "name-desc":
          return b.instituteName.localeCompare(a.instituteName);
        default:
          return 0;
      }
    });
  }, [filteredColleges, sortBy, filters.category, filters.gender]);

  const handleInitialSearch = (e) => {
    e.preventDefault();
    if (
      !initialSearch.rank ||
      !initialSearch.category ||
      !initialSearch.gender
    ) {
      alert("Please fill in rank, category and gender fields");
      return;
    }

    setFilters({
      ...filters,
      minRank: initialSearch.rank,
      maxRank: (parseInt(initialSearch.rank) + 5000).toString(),
      category: initialSearch.category,
      gender: initialSearch.gender,
    });

    setHasSearched(true);
  };

  const resetFilters = () => {
    setFilters({
      category: initialSearch.category,
      gender: initialSearch.gender,
      minRank: initialSearch.rank,
      maxRank: (parseInt(initialSearch.rank) + 5000).toString(),
      place: "",
      collegeType: "",
    });
    setSearchTerm("");
  };

  const toggleExpand = (collegeId) => {
    setExpandedCard(expandedCard === collegeId ? null : collegeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-600 p-2 sm:p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                College Admission Portal
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Find your perfect college based on rank and category
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasSearched ? (
          // Initial Search Form
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleInitialSearch}
              className="bg-white rounded-xl shadow-lg p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rank *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter your rank"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={initialSearch.rank}
                  onChange={(e) =>
                    setInitialSearch((prev) => ({
                      ...prev,
                      rank: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={initialSearch.category}
                  onChange={(e) =>
                    setInitialSearch((prev) => ({
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
                  Gender *
                </label>
                <select
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={initialSearch.gender}
                  onChange={(e) =>
                    setInitialSearch((prev) => ({
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
                  Branch (Optional)
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={initialSearch.branch}
                  onChange={(e) =>
                    setInitialSearch((prev) => ({
                      ...prev,
                      branch: e.target.value,
                    }))
                  }
                >
                  <option value="">All Branches</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Search Colleges
              </button>
            </form>
          </div>
        ) : (
          // Results Section
          <>
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                {/* Search and Sort Section */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search colleges, branches, or locations..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <select
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="rank-asc">Rank (Low to High)</option>
                      <option value="rank-desc">Rank (High to Low)</option>
                      <option value="fee-asc">Fee (Low to High)</option>
                      <option value="fee-desc">Fee (High to Low)</option>
                      <option value="name-asc">College Name (A-Z)</option>
                      <option value="name-desc">College Name (Z-A)</option>
                    </select>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Advanced Filters</span>
                      {showFilters ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
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
                          setFilters((prev) => ({
                            ...prev,
                            place: e.target.value,
                          }))
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
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                        <option value="Autonomous">Autonomous</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                      <button
                        onClick={resetFilters}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Reset Filters</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                  Found {sortedColleges.length} colleges matching your criteria
                </div>
              </div>
            </div>

            {/* College Cards */}
            <div className="space-y-6">
              {sortedColleges.length === 0 ? (
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
                sortedColleges.map((college) => (
                  <div
                    key={college.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => toggleExpand(college.id)}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-4">
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

                      {/* Rank Information */}
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Closing Ranks
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                                  Actual cutoffs may vary depending on the
                                  number of applicants and seat availability.
                                </p>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-800">
                                  <strong>Fee Structure:</strong> The tuition
                                  fee mentioned is the annual fee. Additional
                                  charges like hostel, mess, and other
                                  facilities may apply separately.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollegeAdmissionPortal;
