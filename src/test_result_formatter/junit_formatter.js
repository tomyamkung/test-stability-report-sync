const TestResultFormatter = require("./test_result_formatter");
class JUnitFormatter extends TestResultFormatter {
  constructor() {
    super();
    this.autoTestSuiteResults = {};
  }
  format(data) {
    this.isExistTestSuite(data);
    let testCycleName = "";

    for (let testSuite of data.testsuites.testsuite) {
      let testSuiteName = testSuite["$"].name;
      testCycleName ||= testSuite["$"].timestamp;

      for (let testCase of testSuite.testcase) {
        let testCaseResult = {};
        testCaseResult.auto_test_case_external_key = testCase["$"].name;
        if ("failure" in testCase) {
          testCaseResult.result = "fail";
          testCaseResult.remark =
            testCase.failure?.[0]?.["$"]?.message || "Failure occurred";
        } else if ("skipped" in testCase) {
          testCaseResult.result = "skip";
          testCaseResult.remark =
            testCase.skipped?.[0]?.["$"]?.message || "Test skipped";
        } else if ("error" in testCase) {
          testCaseResult.result = "error";
          testCaseResult.remark =
            testCase.error?.[0]?.["$"]?.message || "Error occurred";
        } else {
          testCaseResult.result = "pass";
        }

        testCaseResult.execution_time_taken = testCase["$"].time * 1000;

        this.addResultToAutoTestSuite(testSuiteName, testCaseResult);
      }
    }
    this.addPostDataList(testCycleName);

    return this.postDataList;
  }
  isExistTestSuite(data) {
    if (!("testsuite" in data.testsuites)) {
      throw new Error("test suite is missing from the test result data.");
    }
  }
  addResultToAutoTestSuite(testSuite, testResult) {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.autoTestSuiteResults,
        testSuite
      )
    ) {
      this.autoTestSuiteResults[testSuite] = [];
    }

    this.autoTestSuiteResults[testSuite].push(testResult);
  }
  addPostDataList(testCycleName) {
    for (const suite in this.autoTestSuiteResults) {
      this.postDataList.push({
        api_key: null,
        auto_test_suite_external_key: suite,
        auto_test_cycle_name: testCycleName,
        auto_test_results: this.autoTestSuiteResults[suite],
      });
    }
  }
}

module.exports = JUnitFormatter;
