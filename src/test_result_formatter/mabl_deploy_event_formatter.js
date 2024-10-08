const TestResultFormatter = require("./test_result_formatter");

class MablDeployEventFormatter extends TestResultFormatter {
  constructor() {
    super();
    this.autoTestSuiteResults = {};
  }
  format(data) {
    this.extractTestSuiteResults(data["execution_results"]["executions"]);
    return this.preparePostData();
  }

  extractTestSuiteResults(executions) {
    executions.forEach((executionData) => {
      const suiteKey = executionData["plan"]["id"];
      const suiteName = executionData["plan"]["name"];

      if (!this.autoTestSuiteResults[suiteKey]) {
        this.initializeSuiteResult(suiteKey, suiteName);
      }

      const testCaseIdNameMap = this.mapTestCaseIdsToNames(
        executionData.journeys
      );
      this.extractJourneyResults(
        suiteKey,
        executionData.journey_executions,
        testCaseIdNameMap
      );
    });
  }

  initializeSuiteResult(suiteKey, suiteName) {
    this.autoTestSuiteResults[suiteKey] = {
      suiteName: suiteName,
      environment: {},
    };
  }

  mapTestCaseIdsToNames(journeys) {
    const testCaseIdNameMap = {};
    journeys.forEach((journey) => {
      if (!testCaseIdNameMap[journey.id]) {
        testCaseIdNameMap[journey.id] = journey.name;
      }
    });
    return testCaseIdNameMap;
  }

  extractJourneyResults(suiteKey, journeyExecutions, testCaseIdNameMap) {
    journeyExecutions.forEach((journeyResult) => {
      const testCaseResult = this.createTestCaseResult(
        journeyResult,
        testCaseIdNameMap
      );
      this.addTestCaseToSuite(suiteKey, testCaseResult);
    });
  }
  createTestCaseResult(journeyResult, testCaseIdNameMap) {
    const testCaseResult = {};
    testCaseResult.environmentKey = journeyResult.browser_type
      ? `${journeyResult.browser_type}_${journeyResult.initial_url}`
      : "standard";
    testCaseResult.auto_test_case_external_key = journeyResult.journey_id;
    testCaseResult.auto_test_case_name =
      testCaseIdNameMap[journeyResult.journey_id];

    if (journeyResult.scenario_name) {
      testCaseResult.auto_execution_pattern_external_key =
        journeyResult.scenario_name;
    }

    testCaseResult.result = this.determineTestResult(journeyResult);

    if (journeyResult.failure_summary) {
      testCaseResult.remark = journeyResult.failure_summary.error;
    }

    testCaseResult.execution_time_taken =
      this.calculateExecutionTime(journeyResult);
    testCaseResult.info_url = journeyResult.app_href;

    return testCaseResult;
  }

  determineTestResult(journeyResult) {
    switch (journeyResult.status) {
      case "completed":
        return "pass";
      case "failed":
        return journeyResult.failure_summary?.assert_failure ? "fail" : "error";
      case "skipped":
        return "skip";
      case "terminated":
        return "error";
      default:
        throw new Error(
          `${journeyResult.status} is a status that cannot be included in the automatic test stability report.`
        );
    }
  }

  calculateExecutionTime(journeyResult) {
    if (journeyResult.stop_time && journeyResult.start_time) {
      return journeyResult.stop_time - journeyResult.start_time;
    }
    return 0;
  }
  addTestCaseToSuite(suiteKey, testCaseResult) {
    const environmentKey = testCaseResult.environmentKey;
    if (!this.autoTestSuiteResults[suiteKey].environment[environmentKey]) {
      this.autoTestSuiteResults[suiteKey].environment[environmentKey] = [];
    }
    this.autoTestSuiteResults[suiteKey].environment[environmentKey].push(
      testCaseResult
    );
  }

  preparePostData() {
    const testCycleName = new Date().toISOString();
    const postDataList = [];

    for (const [suiteKey, suiteData] of Object.entries(
      this.autoTestSuiteResults
    )) {
      const { suiteName, environment } = suiteData;

      for (const [environmentKey, testCases] of Object.entries(environment)) {
        const postData = {
          auto_test_suite_external_key: suiteKey,
          auto_test_suite_name: suiteName,
          auto_test_cycle_name: testCycleName,
          auto_test_results: testCases,
        };

        if (environmentKey !== "standard") {
          postData.auto_execution_device_external_key = environmentKey;
        }

        postDataList.push(postData);
      }
    }
    return postDataList;
  }
}

module.exports = MablDeployEventFormatter;
