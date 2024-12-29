const core = require("@actions/core");
const { linkTestResults } = require("./link_test_results");

(async () => {
  try {
    const apiKey = core.getInput("api-key");
    const inputFilePath = core.getInput("file-path");
    const testFramework = core.getInput("test-framework");
    const autoTestSuiteKey = core.getInput("auto_test_suite_external_key");
    const autoTestCycleName = core.getInput("auto_test_cycle_name");
    const autoExecutionDeviceName = core.getInput(
      "auto_execution_device_external_key"
    );
    const infoURL = core.getInput(
      "info_url"
    );

    await linkTestResults(
      inputFilePath,
      testFramework,
      autoTestSuiteKey,
      autoTestCycleName,
      autoExecutionDeviceName,
      apiKey,
      infoURL
    );
  } catch (error) {
    core.setFailed(error.message);
  }
})();
