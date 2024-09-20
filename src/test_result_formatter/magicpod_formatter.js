const TestResultFormatter = require("./test_result_formatter");

class MagicPodFormatter extends TestResultFormatter {
  constructor() {
    super();
    this.results = [];
    this.formattedData = {
      api_key: null,
      auto_test_suite_external_key: null,
      auto_test_cycle_name: null,
      auto_test_results: null,
    };
  }
  format(data) {
    this.formattedData.auto_test_suite_external_key = data["test_setting_name"];
    this.formattedData.auto_test_cycle_name = data["finished_at"];

    const testCases = data["test_cases"]["details"][0];

    for (let testCase of testCases.results) {
      if (testCase.data_patterns != null) {
        for (let testCaseDataPattern of testCase.data_patterns) {
          testCaseDataPattern.test_case = {};
          testCaseDataPattern.test_case.number = testCase.test_case["number"];
          testCaseDataPattern.test_case.name = testCase.test_case["name"];
          testCaseDataPattern.test_case.url = testCase.test_case["url"];
          this.assignTestResultsToApiParameters(testCaseDataPattern);
        }
      } else {
        this.assignTestResultsToApiParameters(testCase);
      }
    }
    this.formattedData.auto_test_results = this.results;
    this.postDataList.push(this.formattedData);

    return this.postDataList;
  }
  assignTestResultsToApiParameters(testCase) {
    let testCaseResult = {};
    testCaseResult.auto_test_case_external_key = `${testCase.test_case["number"]}`;
    testCaseResult.auto_test_case_name = testCase.test_case["name"];

    if (testCase.data_index != null) {
      testCaseResult.auto_execution_pattern_external_key = `${testCase.data_index}`;
    }

    if (testCase.status === "succeeded") {
      testCaseResult.result = "pass";
    } else {
      testCaseResult.result = "fail";
    }
    switch (testCase.status) {
      case "succeeded":
        testCaseResult.result = "pass";
        break;
      case "failed":
        testCaseResult.result = "fail";
        break;
      case "aborted":
        testCaseResult.result = "error";
        break;
      case "unresolved":
        testCaseResult.result = "error";
        testCaseResult.remark = "要確認";
        break;
      default:
        throw new Error(
          `${testCase.status} is a status that cannot be included in the automatic test stability report.`
        );
    }

    testCaseResult.execution_time_taken = testCase.duration_seconds * 1000;
    testCaseResult.info_url = testCase.test_case["url"];

    this.results.push(testCaseResult);
  }
}

module.exports = MagicPodFormatter;
