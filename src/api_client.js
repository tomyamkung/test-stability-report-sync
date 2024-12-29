const axios = require("axios");

async function linkAutomatedTestStabilityReport(
  formattedData,
  apiKey,
  autoTestSuiteKey,
  autoTestCycleName,
  autoExecutionDeviceName,
  infoURL
) {
  for (let data of formattedData) {
    data.api_key = apiKey;
    data.info_url = infoURL;
    if (autoTestSuiteKey !== "") {
      data.auto_test_suite_external_key = autoTestSuiteKey;
    }
    if (autoTestCycleName !== "") {
      data.auto_test_cycle_name = autoTestCycleName;
    }
    if (autoExecutionDeviceName !== "") {
      data.auto_execution_device_external_key = autoExecutionDeviceName;
    }
    await postData(data);
  }
}
async function postData(data) {
  try {
    console.log("Sending data:", JSON.stringify(data, null, 2));
    await axios.post(
      "https://cloud.veriserve.co.jp/api/v2/auto_test_suites",
      data
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else {
      console.error("Error posting data:", error.message);
    }
    throw error;
  }
}

module.exports = { linkAutomatedTestStabilityReport };
