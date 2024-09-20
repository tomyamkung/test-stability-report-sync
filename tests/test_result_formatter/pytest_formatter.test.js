const PytestFormatter = require("../../src/test_result_formatter/pytest_formatter");

describe("In case of correct format", () => {
  test("Data formatting for single test result", () => {
    const jsonData = {
      testsuites: {
        testsuite: [
          {
            $: {
              name: "pytest",
              errors: "0",
              failures: "0",
              skipped: "0",
              tests: "1",
              time: "1.000",
              timestamp: "2024-04-25T09:03:08.040413",
              hostname: "test_data",
            },
            testcase: [
              {
                $: {
                  classname: "test",
                  name: "test",
                  time: "1.000",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new PytestFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "test",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
  });
  test("Data formatting for multiple test results", () => {
    const jsonData = {
      testsuites: {
        testsuite: [
          {
            $: {
              name: "pytest",
              errors: "1",
              failures: "1",
              skipped: "1",
              tests: "1",
              time: "4.000",
              timestamp: "2024-04-25T09:03:08.040413",
              hostname: "test_data",
            },
            testcase: [
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_before_today",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_no_name",
                  time: "0.000",
                },
                skipped: [
                  {
                    _: "test_skipped",
                    $: {
                      message: "test_skipped",
                    },
                  },
                ],
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_after_90days",
                  time: "1.000",
                },
                error: [
                  {
                    _: "test_error",
                    $: {
                      message: "test_error",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new PytestFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(1);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "TestInvalidReserve",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_no_name",
          result: "skip",
          execution_time_taken: 0,
          remark: "test_skipped",
        },
        {
          auto_test_case_external_key: "test_after_90days",
          result: "error",
          execution_time_taken: 1000,
          remark: "test_error",
        },
      ],
    });
  });
  test("Data formatting for multiple test suites and single test case result", () => {
    const jsonData = {
      testsuites: {
        testsuite: [
          {
            $: {
              name: "pytest",
              errors: "0",
              failures: "0",
              skipped: "0",
              tests: "1",
              time: "1.000",
              timestamp: "2024-04-25T09:03:08.040413",
              hostname: "test_data",
            },
            testcase: [
              {
                $: {
                  classname: "test.data_driven",
                  name: "test[test-data]",
                  time: "1.000",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new PytestFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "data_driven",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test",
          auto_execution_pattern_external_key: "test-data",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
  });
  test("Data formatting for single data driven test result", () => {
    const jsonData = {
      testsuites: {
        testsuite: [
          {
            $: {
              name: "pytest",
              errors: "0",
              failures: "0",
              skipped: "0",
              tests: "1",
              time: "1.000",
              timestamp: "2024-04-25T09:03:08.040413",
              hostname: "test_data",
            },
            testcase: [
              {
                $: {
                  classname: "test.sample",
                  name: "test",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_before_today",
                  time: "1.000",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new PytestFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(2);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "sample",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "TestInvalidReserve",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
  });
  test("Data formatting for multi test suite and multi data-driven test results", () => {
    const jsonData = {
      testsuites: {
        testsuite: [
          {
            $: {
              name: "pytest",
              errors: "1",
              failures: "3",
              skipped: "1",
              tests: "18",
              time: "17.000",
              timestamp: "2024-08-29T14:20:51.412623",
              hostname: "039a564c8014",
            },
            testcase: [
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_before_today",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_no_name",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_after_90days",
                  time: "0.000",
                },
                skipped: [
                  {
                    _: "test_skipped",
                    $: {
                      message: "test_skipped",
                    },
                  },
                ],
              },
              {
                $: {
                  classname: "tests.test_reserve.TestReserve",
                  name: "test_reserve[3d-breakfast]",
                  time: "1.000",
                },
                failure: [
                  {
                    _: "test_fail",
                    $: {
                      message: "AssertionError",
                    },
                  },
                ],
              },
              {
                $: {
                  classname: "tests.test_reserve.TestReserve",
                  name: "test_reserve[2d-early]",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_reserve.TestReserve",
                  name: "test_reserve[1d-sightseeing]",
                  time: "1.000",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new PytestFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(2);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "TestInvalidReserve",
      auto_test_cycle_name: "2024-08-29T14:20:51.412623",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_no_name",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_after_90days",
          result: "skip",
          execution_time_taken: 0,
          remark: "test_skipped",
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "TestReserve",
      auto_test_cycle_name: "2024-08-29T14:20:51.412623",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_reserve",
          auto_execution_pattern_external_key: "3d-breakfast",
          result: "fail",
          execution_time_taken: 1000,
          remark: "AssertionError",
        },
        {
          auto_test_case_external_key: "test_reserve",
          auto_execution_pattern_external_key: "2d-early",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_reserve",
          auto_execution_pattern_external_key: "1d-sightseeing",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
  });
});
