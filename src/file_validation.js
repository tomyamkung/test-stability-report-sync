const path = require("path");
const VALID_COMBINATIONS = {
  json: ["magicpod", "mabl-deploy-event"],
  xml: ["junit", "nodejs-playwright", "pytest", "pytest-playwright"],
};

const SUPPORTED_FORMATS = [".json", ".xml"];

function validateFileFormat(inputFilePath, testFramework) {
  const fileExtension = path.extname(inputFilePath);
  isValidFileExtension(fileExtension);

  const fileFormat = fileExtension.slice(1);

  if (!isValidCombination(fileFormat, testFramework)) {
    throw new Error(
      `Invalid combination: File format ${fileFormat} and test framework ${testFramework} are not compatible.`
    );
  }

  return fileFormat;
}

function isValidFileExtension(fileExtension) {
  if (!SUPPORTED_FORMATS.includes(fileExtension)) {
    throw new Error(`Unsupported file format: ${fileExtension}`);
  }
}
function isValidCombination(fileFormat, testFramework) {
  return (
    VALID_COMBINATIONS[fileFormat] &&
    VALID_COMBINATIONS[fileFormat].includes(testFramework.toLowerCase())
  );
}

module.exports = { validateFileFormat };
