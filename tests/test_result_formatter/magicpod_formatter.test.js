const MagicPodFormatter = require("../../src/test_result_formatter/magicpod_formatter");

describe("In case of correct format", () => {
  test("Data formatting for single test result", () => {
    const jsonData = {
      organization_name: "Test",
      project_name: "Test",
      batch_run_number: 100,
      test_setting_name: "Single Test Plan",
      status: "succeeded",
      status_number: 2,
      started_at: "2024-05-09T02:43:36Z",
      finished_at: "2024-05-09T02:44:32Z",
      duration_seconds: 10.0,
      test_cases: {
        succeeded: 1,
        failed: 0,
        total: 1,
        details: [
          {
            pattern_name: null,
            included_labels: [],
            excluded_labels: [],
            results: [
              {
                order: 1,
                test_case: {
                  number: 1,
                  name: "Sample Test",
                  url: "https://example.com/1/result",
                  step_count: 10,
                },
                number: 1,
                status: "succeeded",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
            ],
          },
        ],
      },
      url: "https://example.com",
    };

    const testResultFormatter = new MagicPodFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "Single Test Plan",
      auto_test_cycle_name: "2024-05-09T02:44:32Z",
      auto_test_results: [
        {
          auto_test_case_external_key: "1",
          auto_test_case_name: "Sample Test",
          result: "pass",
          execution_time_taken: 10000,
          info_url: "https://example.com/1/result",
        },
      ],
    });
  });
  test("Data formatting for multiple test result", () => {
    const jsonData = {
      organization_name: "Test",
      project_name: "Test",
      batch_run_number: 100,
      test_setting_name: "Multiple Test Plan",
      status: "failed",
      status_number: 2,
      started_at: "2024-05-09T02:43:36Z",
      finished_at: "2024-05-09T02:44:32Z",
      duration_seconds: 10.0,
      test_cases: {
        succeeded: 1,
        failed: 1,
        aborted: 1,
        unresolved: 1,
        total: 4,
        details: [
          {
            pattern_name: null,
            included_labels: [],
            excluded_labels: [],
            results: [
              {
                order: 1,
                test_case: {
                  number: 1,
                  name: "Sample Test1",
                  url: "https://example.com/1/result",
                  step_count: 10,
                },
                number: 1,
                status: "succeeded",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 2,
                test_case: {
                  number: 2,
                  name: "Sample Test2",
                  url: "https://example.com/2/result",
                  step_count: 5,
                },
                number: 2,
                status: "failed",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 3,
                test_case: {
                  number: 3,
                  name: "Sample Test3",
                  url: "https://example.com/3/result",
                  step_count: 5,
                },
                number: 3,
                status: "aborted",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 4,
                test_case: {
                  number: 4,
                  name: "Sample Test4",
                  url: "https://example.com/4/result",
                  step_count: 5,
                },
                number: 4,
                status: "unresolved",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
            ],
          },
        ],
      },
      url: "https://example.com",
    };

    const testResultFormatter = new MagicPodFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "Multiple Test Plan",
      auto_test_cycle_name: "2024-05-09T02:44:32Z",
      auto_test_results: [
        {
          auto_test_case_external_key: "1",
          auto_test_case_name: "Sample Test1",
          result: "pass",
          execution_time_taken: 10000,
          info_url: "https://example.com/1/result",
        },
        {
          auto_test_case_external_key: "2",
          auto_test_case_name: "Sample Test2",
          result: "fail",
          execution_time_taken: 10000,
          info_url: "https://example.com/2/result",
        },
        {
          auto_test_case_external_key: "3",
          auto_test_case_name: "Sample Test3",
          result: "error",
          execution_time_taken: 10000,
          info_url: "https://example.com/3/result",
        },
        {
          auto_test_case_external_key: "4",
          auto_test_case_name: "Sample Test4",
          result: "error",
          execution_time_taken: 10000,
          info_url: "https://example.com/4/result",
          remark: "要確認",
        },
      ],
    });
  });
  test("Data formatting for single data driven test result", () => {
    const jsonData = {
      organization_name: "Test",
      project_name: "Test",
      batch_run_number: 100,
      test_setting_name: "Single Data Driven Test Plan",
      status: "succeeded",
      status_number: 2,
      started_at: "2024-05-09T02:43:36Z",
      finished_at: "2024-05-09T02:44:32Z",
      duration_seconds: 10.0,
      test_cases: {
        succeeded: 1,
        failed: 0,
        total: 1,
        details: [
          {
            pattern_name: null,
            included_labels: [],
            excluded_labels: [],
            results: [
              {
                order: 1,
                test_case: {
                  number: 1,
                  name: "Sample Test",
                  url: "https://example.com/1/result",
                  step_count: 10,
                },
                number: 1,
                status: "succeeded",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: [
                  {
                    data_index: 0,
                    status: "succeeded",
                    started_at: "2024-05-09T02:43:44Z",
                    finished_at: "2024-05-09T02:43:54Z",
                  },
                ],
              },
            ],
          },
        ],
      },
      url: "https://example.com",
    };

    const testResultFormatter = new MagicPodFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "Single Data Driven Test Plan",
      auto_test_cycle_name: "2024-05-09T02:44:32Z",
      auto_test_results: [
        {
          auto_test_case_external_key: "1",
          auto_test_case_name: "Sample Test",
          auto_execution_pattern_external_key: "0",
          result: "pass",
          execution_time_taken: 10000,
          info_url: "https://example.com/1/result",
        },
      ],
    });
  });
  test("Data formatting for multiple data driven test result", () => {
    const jsonData = {
      organization_name: "Test",
      project_name: "Test",
      batch_run_number: 100,
      test_setting_name: "Multiple Data Driven Test Plan",
      status: "failed",
      status_number: 2,
      started_at: "2024-05-09T02:43:36Z",
      finished_at: "2024-05-09T02:44:32Z",
      duration_seconds: 10.0,
      test_cases: {
        succeeded: 2,
        failed: 2,
        aborted: 2,
        unresolved: 2,
        total: 8,
        details: [
          {
            pattern_name: null,
            included_labels: [],
            excluded_labels: [],
            results: [
              {
                order: 1,
                test_case: {
                  number: 1,
                  name: "Sample Test1",
                  url: "https://example.com/1/result",
                  step_count: 10,
                },
                number: 1,
                status: "succeeded",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 2,
                test_case: {
                  number: 2,
                  name: "Sample Test2",
                  url: "https://example.com/2/result",
                  step_count: 5,
                },
                number: 2,
                status: "failed",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 3,
                test_case: {
                  number: 3,
                  name: "Sample Test3",
                  url: "https://example.com/3/result",
                  step_count: 5,
                },
                number: 3,
                status: "aborted",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 4,
                test_case: {
                  number: 4,
                  name: "Sample Test4",
                  url: "https://example.com/4/result",
                  step_count: 5,
                },
                number: 4,
                status: "unresolved",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
              {
                order: 5,
                test_case: {
                  number: 5,
                  name: "Sample Test5",
                  url: "https://example.com/5/result",
                  step_count: 10,
                },
                number: 5,
                status: "failed",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: [
                  {
                    data_index: 0,
                    status: "succeeded",
                    started_at: "2024-05-09T02:43:44Z",
                    finished_at: "2024-05-09T02:43:54Z",
                  },
                  {
                    data_index: 1,
                    status: "failed",
                    started_at: "2024-05-09T02:43:44Z",
                    finished_at: "2024-05-09T02:43:54Z",
                  },
                  {
                    data_index: 2,
                    status: "aborted",
                    started_at: "2024-05-09T02:43:44Z",
                    finished_at: "2024-05-09T02:43:54Z",
                  },
                  {
                    data_index: 3,
                    status: "unresolved",
                    started_at: "2024-05-09T02:43:44Z",
                    finished_at: "2024-05-09T02:43:54Z",
                  },
                ],
              },
            ],
          },
        ],
      },
      url: "https://example.com",
    };

    const testResultFormatter = new MagicPodFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "Multiple Data Driven Test Plan",
      auto_test_cycle_name: "2024-05-09T02:44:32Z",
      auto_test_results: [
        {
          auto_test_case_external_key: "1",
          auto_test_case_name: "Sample Test1",
          result: "pass",
          execution_time_taken: 10000,
          info_url: "https://example.com/1/result",
        },
        {
          auto_test_case_external_key: "2",
          auto_test_case_name: "Sample Test2",
          result: "fail",
          execution_time_taken: 10000,
          info_url: "https://example.com/2/result",
        },
        {
          auto_test_case_external_key: "3",
          auto_test_case_name: "Sample Test3",
          result: "error",
          execution_time_taken: 10000,
          info_url: "https://example.com/3/result",
        },
        {
          auto_test_case_external_key: "4",
          auto_test_case_name: "Sample Test4",
          result: "error",
          execution_time_taken: 10000,
          info_url: "https://example.com/4/result",
          remark: "要確認",
        },
        {
          auto_test_case_external_key: "5",
          auto_test_case_name: "Sample Test5",
          auto_execution_pattern_external_key: "0",
          result: "pass",
          execution_time_taken: 10000,
          info_url: "https://example.com/5/result",
        },
        {
          auto_test_case_external_key: "5",
          auto_test_case_name: "Sample Test5",
          auto_execution_pattern_external_key: "1",
          result: "fail",
          execution_time_taken: 10000,
          info_url: "https://example.com/5/result",
        },
        {
          auto_test_case_external_key: "5",
          auto_test_case_name: "Sample Test5",
          auto_execution_pattern_external_key: "2",
          result: "error",
          execution_time_taken: 10000,
          info_url: "https://example.com/5/result",
        },
        {
          auto_test_case_external_key: "5",
          auto_test_case_name: "Sample Test5",
          auto_execution_pattern_external_key: "3",
          result: "error",
          execution_time_taken: 10000,
          info_url: "https://example.com/5/result",
          remark: "要確認",
        },
      ],
    });
  });
});

describe("In case of invalid format", () => {
  test("alert for statuses that are out of scope", () => {
    const jsonData = {
      organization_name: "Test",
      project_name: "Test",
      batch_run_number: 100,
      test_setting_name: "Single Test Plan",
      status: "running",
      status_number: 2,
      started_at: "2024-05-09T02:43:36Z",
      finished_at: "2024-05-09T02:44:32Z",
      duration_seconds: 10.0,
      test_cases: {
        succeeded: 1,
        failed: 0,
        total: 1,
        details: [
          {
            pattern_name: null,
            included_labels: [],
            excluded_labels: [],
            results: [
              {
                order: 1,
                test_case: {
                  number: 1,
                  name: "Sample Test",
                  url: "https://example.com/1/result",
                  step_count: 10,
                },
                number: 1,
                status: "running",
                started_at: "2024-05-09T02:43:44Z",
                finished_at: "2024-05-09T02:43:54Z",
                duration_seconds: 10.0,
                data_patterns: null,
              },
            ],
          },
        ],
      },
      url: "https://example.com",
    };
    const testResultFormatter = new MagicPodFormatter();
    expect(() => testResultFormatter.format(jsonData)).toThrow(
      "running is a status that cannot be included in the automatic test stability report."
    );
  });
});
