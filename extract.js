const xlsx = require("xlsx");
const fs = require("fs");

// Load the workbook
const workbook = xlsx.readFile("ranks.xlsx");

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON using the first row as headers
const jsonData = xlsx.utils.sheet_to_json(sheet, {
  defval: "", // Fill empty cells with empty string instead of undefined
  raw: false, // Converts dates and numbers to strings as they appear
});

// Clean and structure the data
const structuredData = jsonData.map((row, index) => {
  // Clean up the row data by trimming whitespace and handling empty values
  const cleanRow = {};
  Object.keys(row).forEach((key) => {
    const cleanKey = key.trim();
    const value = row[key];
    // Convert numeric strings to numbers where appropriate (for ranks and codes)
    if (typeof value === "string" && value.trim() !== "") {
      const trimmedValue = value.trim();
      // Check if it's a numeric value (for ranks, codes, fees)
      if (!isNaN(trimmedValue) && trimmedValue !== "") {
        cleanRow[cleanKey] = parseInt(trimmedValue) || trimmedValue;
      } else {
        cleanRow[cleanKey] = trimmedValue;
      }
    } else {
      cleanRow[cleanKey] = value || "";
    }
  });

  return {
    id: index + 1, // Add unique identifier
    instCode: cleanRow["Inst  Code"] || cleanRow["Inst Code"] || "",
    instituteName: cleanRow["Institute Name"] || "",
    place: cleanRow["Place"] || "",
    distCode: cleanRow["Dist Code"] || "",
    coEducation: cleanRow["Co Education"] || "",
    collegeType: cleanRow["College Type"] || "",
    yearOfEstab: cleanRow["Year of Estab"] || "",
    branchCode: cleanRow["Branch Code"] || "",
    branchName: cleanRow["Branch Name"] || "",
    ranks: {
      oc: {
        boys: cleanRow["OC BOYS"] || "",
        girls: cleanRow["OC GIRLS"] || "",
      },
      bc_a: {
        boys: cleanRow["BC_A BOYS"] || "",
        girls: cleanRow["BC_A GIRLS"] || "",
      },
      bc_b: {
        boys: cleanRow["BC_B BOYS"] || "",
        girls: cleanRow["BC_B GIRLS"] || "",
      },
      bc_c: {
        boys: cleanRow["BC_C BOYS"] || "",
        girls: cleanRow["BC_C GIRLS"] || "",
      },
      bc_d: {
        boys: cleanRow["BC_D BOYS"] || "",
        girls: cleanRow["BC_D GIRLS"] || "",
      },
      bc_e: {
        boys: cleanRow["BC_E BOYS"] || "",
        girls: cleanRow["BC_E GIRLS"] || "",
      },
      sc: {
        boys: cleanRow["SC BOYS"] || "",
        girls: cleanRow["SC GIRLS"] || "",
      },
      st: {
        boys: cleanRow["ST BOYS"] || "",
        girls: cleanRow["ST GIRLS"] || "",
      },
      ews: {
        genOu: cleanRow["EWS GEN OU"] || "",
        girlsOu: cleanRow["EWS GIRLS OU"] || "",
      },
    },
    tuitionFee: cleanRow["Tuition Fee"] || "",
    affiliatedTo: cleanRow["Affiliated To"] || "",
  };
});

// Extract unique categories for easy reference
const categories = [
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

const genders = ["BOYS", "GIRLS"];

// Extract unique college types and places for filtering
const collegeTypes = [
  ...new Set(structuredData.map((item) => item.collegeType).filter(Boolean)),
];
const places = [
  ...new Set(structuredData.map((item) => item.place).filter(Boolean)),
];
const branches = [
  ...new Set(structuredData.map((item) => item.branchName).filter(Boolean)),
];

// Helper functions to include in the constants file
const helperFunctions = `
// Helper functions for working with the college data

export const findCollegesByCategory = (category, gender) => {
  const categoryKey = category.toLowerCase();
  const genderKey = gender.toLowerCase();
  
  return COLLEGE_DATA.filter(college => {
    const rank = college.ranks[categoryKey]?.[genderKey];
    return rank && rank !== "";
  });
};

export const findCollegesByRankRange = (category, gender, minRank, maxRank) => {
  const categoryKey = category.toLowerCase();
  const genderKey = gender.toLowerCase();
  
  return COLLEGE_DATA.filter(college => {
    const rank = parseInt(college.ranks[categoryKey]?.[genderKey]);
    return rank && rank >= minRank && rank <= maxRank;
  });
};

export const findCollegesByPlace = (place) => {
  return COLLEGE_DATA.filter(college => 
    college.place.toLowerCase().includes(place.toLowerCase())
  );
};

export const findCollegesByBranch = (branchName) => {
  return COLLEGE_DATA.filter(college => 
    college.branchName.toLowerCase().includes(branchName.toLowerCase())
  );
};

export const getCollegeById = (id) => {
  return COLLEGE_DATA.find(college => college.id === id);
};
`;

const output = `// Auto-generated college admission data from ranks.xlsx
// Generated on: ${new Date().toISOString()}

export const COLLEGE_DATA = ${JSON.stringify(structuredData, null, 2)};

export const CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const GENDERS = ${JSON.stringify(genders, null, 2)};

export const COLLEGE_TYPES = ${JSON.stringify(collegeTypes, null, 2)};

export const PLACES = ${JSON.stringify(places, null, 2)};

export const BRANCHES = ${JSON.stringify(branches, null, 2)};

${helperFunctions}
`;

fs.writeFileSync("constants.js", output);

console.log("✅ constants.js generated successfully!");
console.log(`📊 Processed ${structuredData.length} college records`);
console.log(`🏫 Found ${collegeTypes.length} unique college types`);
console.log(`📍 Found ${places.length} unique places`);
console.log(`🎓 Found ${branches.length} unique branches`);

// Optional: Generate a summary report
const summaryReport = {
  totalRecords: structuredData.length,
  collegeTypes: collegeTypes.length,
  places: places.length,
  branches: branches.length,
  categories: categories,
  sampleRecord: structuredData[0], // First record as example
};

fs.writeFileSync("data-summary.json", JSON.stringify(summaryReport, null, 2));
console.log("📋 Summary report saved as data-summary.json");
