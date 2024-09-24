const TestResultFormatter = require("./test_result_formatter");

class PytestPlaywrightFormatter extends TestResultFormatter {
  constructor() {
    super();
    this.autoTestSuiteResults = {};
  }
  format(data) {
    const testSuite = data.testsuites.testsuite[0];
    const testCycleName = testSuite["$"].timestamp;

    for (let testCase of testSuite.testcase) {
      let testCaseResult = {};
      let testSuiteName = this.extractTestSuiteName(testCase["$"].classname);
      let testCaseDetails = this.extractTestCaseDetails(testCase["$"].name);

      testCaseResult.auto_test_case_external_key = testCaseDetails.name;
      if (testCaseDetails.dataPattern != null) {
        testCaseResult.auto_execution_pattern_external_key =
          testCaseDetails.dataPattern;
      }

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

      this.addResultToAutoTestSuite(
        testSuiteName,
        testCaseDetails.browser,
        testCaseResult
      );
    }

    this.addPostDataList(testCycleName);

    return this.postDataList;
  }
  extractTestSuiteName(className) {
    const match = className.match(/\.([^.]+)$/);
    if (match) {
      return match[1];
    } else {
      return className;
    }
  }
  extractTestCaseDetails(testCaseName) {
    // eslint-disable-next-line no-useless-escape
    const regex = /^([^\[]+)\[([^\]-]+)(?:-(.+))?\]$/;
    const match = testCaseName.match(regex);

    if (match) {
      return {
        name: match[1],
        browser: match[2],
        dataPattern: match[3] || null,
      };
    } else {
      return {
        name: null,
        browser: null,
        dataPattern: null,
      };
    }
  }
  addResultToAutoTestSuite(testSuite, browser, testResult) {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.autoTestSuiteResults,
        testSuite
      )
    ) {
      this.autoTestSuiteResults[testSuite] = {};
    }
    if (
      !Object.prototype.hasOwnProperty.call(
        this.autoTestSuiteResults[testSuite],
        browser
      )
    ) {
      this.autoTestSuiteResults[testSuite][browser] = [];
    }
    this.autoTestSuiteResults[testSuite][browser].push(testResult);
  }
  addPostDataList(testCycleName) {
    for (const suite in this.autoTestSuiteResults) {
      const browsers = this.autoTestSuiteResults[suite];
      for (const browser in browsers) {
        this.postDataList.push({
          api_key: null,
          auto_test_suite_external_key: suite,
          auto_test_cycle_name: testCycleName,
          auto_execution_device_external_key: browser,
          auto_test_results: browsers[browser],
        });
      }
    }
  }
}

module.exports = PytestPlaywrightFormatter;
