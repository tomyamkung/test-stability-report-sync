const JUnitFormatter = require("../../src/test_result_formatter/junit_formatter");

describe("In case of invalid format", () => {
  test("should alert on empty test suite", () => {
    const jsonData = {
      testsuites: {
        $: {
          id: "",
          name: "",
          tests: "52",
          failures: "3",
          skipped: "0",
          errors: "0",
          time: "0.384420999999996",
        },
      },
    };
    const testResultFormatter = new JUnitFormatter();
    expect(() => testResultFormatter.format(jsonData)).toThrow(
      "test suite is missing from the test result data."
    );
  });
});

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

    const testResultFormatter = new JUnitFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "pytest",
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
                  name: "test_before_today[chromium]",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_no_name[chromium]",
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
                  name: "test_after_90days[chromium]",
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
              {
                $: {
                  classname: "tests.test_reserve.TestReserve",
                  name: "test_reserve[chromium-3d-breakfast]",
                  time: "1.000",
                },
                failure: [
                  {
                    _: "test_failed",
                    $: {
                      message: "AssertionError",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new JUnitFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(1);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "pytest",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today[chromium]",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_no_name[chromium]",
          result: "skip",
          execution_time_taken: 0,
          remark: "test_skipped",
        },
        {
          auto_test_case_external_key: "test_after_90days[chromium]",
          result: "error",
          execution_time_taken: 1000,
          remark: "test_error",
        },
        {
          auto_test_case_external_key: "test_reserve[chromium-3d-breakfast]",
          result: "fail",
          execution_time_taken: 1000,
          remark: "AssertionError",
        },
      ],
    });
  });
  test("Data formatting for multiple test suite and single test case results", () => {
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
                  name: "test_before_today[chromium]",
                  time: "1.000",
                },
              },
            ],
          },
          {
            $: {
              name: "pytest2",
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
                  name: "test_before_today[chromium]",
                  time: "1.000",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new JUnitFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(2);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "pytest",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today[chromium]",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "pytest2",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today[chromium]",
          result: "pass",
          execution_time_taken: 1000,
        },
      ],
    });
  });
  test("Data formatting for multiple test suite and test case results", () => {
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
                  name: "test_before_today[chromium]",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_no_name[chromium]",
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
                  name: "test_after_90days[chromium]",
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
              {
                $: {
                  classname: "tests.test_reserve.TestReserve",
                  name: "test_reserve[chromium-3d-breakfast]",
                  time: "1.000",
                },
                failure: [
                  {
                    _: "test_failed",
                    $: {
                      message: "AssertionError",
                    },
                  },
                ],
              },
            ],
          },
          {
            $: {
              name: "pytest2",
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
                  name: "test_before_today[chromium]",
                  time: "1.000",
                },
              },
              {
                $: {
                  classname: "tests.test_invalid_reserve.TestInvalidReserve",
                  name: "test_no_name[chromium]",
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
                  name: "test_after_90days[chromium]",
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
              {
                $: {
                  classname: "tests.test_reserve.TestReserve",
                  name: "test_reserve[chromium-3d-breakfast]",
                  time: "1.000",
                },
                failure: [
                  {
                    _: "test_failed",
                    $: {
                      message: "AssertionError",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new JUnitFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(2);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "pytest",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today[chromium]",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_no_name[chromium]",
          result: "skip",
          execution_time_taken: 0,
          remark: "test_skipped",
        },
        {
          auto_test_case_external_key: "test_after_90days[chromium]",
          result: "error",
          execution_time_taken: 1000,
          remark: "test_error",
        },
        {
          auto_test_case_external_key: "test_reserve[chromium-3d-breakfast]",
          result: "fail",
          execution_time_taken: 1000,
          remark: "AssertionError",
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "pytest2",
      auto_test_cycle_name: "2024-04-25T09:03:08.040413",
      auto_test_results: [
        {
          auto_test_case_external_key: "test_before_today[chromium]",
          result: "pass",
          execution_time_taken: 1000,
        },
        {
          auto_test_case_external_key: "test_no_name[chromium]",
          result: "skip",
          execution_time_taken: 0,
          remark: "test_skipped",
        },
        {
          auto_test_case_external_key: "test_after_90days[chromium]",
          result: "error",
          execution_time_taken: 1000,
          remark: "test_error",
        },
        {
          auto_test_case_external_key: "test_reserve[chromium-3d-breakfast]",
          result: "fail",
          execution_time_taken: 1000,
          remark: "AssertionError",
        },
      ],
    });
  });
});
