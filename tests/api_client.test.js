const { linkAutomatedTestStabilityReport } = require("../src/api_client");
const axios = require("axios");

jest.mock("axios");

describe("successful integration", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: "success" });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("should overwrite auto_test_suite_external_key", async () => {
    const formattedData = [
      {
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "chromium",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      },
    ];
    const apiKey = "test_api";
    const autoTestSuiteKey = "sample";
    const autoTestCycleName = "test_cycle";
    const autoExecutionDeviceName = "sample_device";

    await linkAutomatedTestStabilityReport(
      formattedData,
      apiKey,
      autoTestSuiteKey,
      autoTestCycleName,
      autoExecutionDeviceName,
      infoURL
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "https://cloud.veriserve.co.jp/api/v2/auto_test_suites",
      {
        api_key: apiKey,
        auto_test_suite_external_key: "sample",
        auto_test_cycle_name: "test_cycle",
        auto_execution_device_external_key: "sample_device",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      }
    );
  });
  test("should not overwrite auto_test_suite_external_key", async () => {
    const formattedData = [
      {
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "chromium",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      },
    ];
    const apiKey = "test_api";
    const autoTestSuiteKey = "";
    const autoTestCycleName = "";
    const autoExecutionDeviceName = "";

    await linkAutomatedTestStabilityReport(
      formattedData,
      apiKey,
      autoTestSuiteKey,
      autoTestCycleName,
      autoExecutionDeviceName,
      infoURL
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "https://cloud.veriserve.co.jp/api/v2/auto_test_suites",
      {
        api_key: apiKey,
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "chromium",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      }
    );
  });

  test("should be called multiple times", async () => {
    const formattedData = [
      {
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "chromium",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      },
      {
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "firefox",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      },
    ];
    const apiKey = "test_api";
    const autoTestSuiteKey = "";
    const autoTestCycleName = "";
    const autoExecutionDeviceName = "";

    await linkAutomatedTestStabilityReport(
      formattedData,
      apiKey,
      autoTestSuiteKey,
      autoTestCycleName,
      autoExecutionDeviceName,
      infoURL
    );
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenCalledWith(
      "https://cloud.veriserve.co.jp/api/v2/auto_test_suites",
      {
        api_key: apiKey,
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "chromium",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      }
    );
    expect(axios.post).toHaveBeenCalledWith(
      "https://cloud.veriserve.co.jp/api/v2/auto_test_suites",
      {
        api_key: apiKey,
        auto_test_suite_external_key: "pytest",
        auto_test_cycle_name: "2024-04-25T09:03:08.040413",
        auto_execution_device_external_key: "firefox",
        auto_test_results: [
          {
            auto_test_case_external_key: "test",
            result: "pass",
            execution_time_taken: 1000,
          },
        ],
      }
    );
  });
});
