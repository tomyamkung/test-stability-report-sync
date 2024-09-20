const fs = require("fs");
const path = require("path");
const { getFileLoader } = require("./load_file_factory");
const { getTestResultFormatter } = require("./test_result_formatter_factory");
const { validateFileFormat } = require("./file_validation");
const { linkAutomatedTestStabilityReport } = require("./api_client");

async function linkTestResults(
  inputFilePath,
  testFramework,
  autoTestSuiteKey,
  autoTestCycleName,
  autoExecutionDeviceName,
  apiKey
) {
  validateFileFormat(inputFilePath, testFramework);

  const fileProcessor = getFileLoader(
    path.extname(inputFilePath),
    getTestResultFormatter(testFramework)
  );

  return new Promise((resolve, reject) => {
    fs.readFile(inputFilePath, "utf8", async (err, data) => {
      if (err) {
        reject(new Error(`Error reading file: ${err.message}`));
        return;
      }

      try {
        const formattedData = await fileProcessor.format(data);
        await linkAutomatedTestStabilityReport(
          formattedData,
          apiKey,
          autoTestSuiteKey,
          autoTestCycleName,
          autoExecutionDeviceName
        );
        console.log(
          "The integration of automated test results has been completed."
        );
        resolve();
      } catch (formattingError) {
        reject(
          new Error(
            `The integration of automated test results has failed: ${formattingError.message}`
          )
        );
      }
    });
  });
}

module.exports = { linkTestResults };
