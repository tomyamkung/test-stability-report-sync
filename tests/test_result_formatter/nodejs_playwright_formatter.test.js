const NodejsPlaywrightFormatter = require("../../src/test_result_formatter/nodejs_playwright_formatter");

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
    const testResultFormatter = new NodejsPlaywrightFormatter();
    expect(() => testResultFormatter.format(jsonData)).toThrow(
      "test suite is missing from the test result data."
    );
  });
});

describe("In case of correct format", () => {
  test("Data formatting for single test case result", () => {
    const jsonData = {
      testsuites: {
        $: {
          id: "",
          name: "",
          tests: "52",
          failures: "3",
          skipped: "0",
          errors: "0",
          time: "40.384420999999996",
        },
        testsuite: [
          {
            $: {
              name: "example.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "firefox",
              tests: "2",
              failures: "0",
              skipped: "0",
              time: "2.393",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "has title",
                  classname: "example.spec.js",
                  time: "1.059",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new NodejsPlaywrightFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "example.spec.js",
      auto_execution_device_external_key: "firefox",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key: "has title",
          result: "pass",
          execution_time_taken: 1059,
        },
      ],
    });
  });
  test("Data formatting for multiple test case results", () => {
    const jsonData = {
      testsuites: {
        $: {
          id: "",
          name: "",
          tests: "52",
          failures: "3",
          skipped: "0",
          errors: "0",
          time: "40.384420999999996",
        },
        testsuite: [
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "firefox",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
              {
                $: {
                  name: "Mark all as completed › should allow me to mark all items as completed",
                  classname: "demo-todo-app.spec.js",
                  time: "30.026",
                },
                failure: [
                  {
                    $: {
                      message:
                        "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
                      type: "FAILURE",
                    },
                    _: "[firefox] › demo-todo-app.spec.js:83:3 › Mark all as completed › should allow me to mark all items as completed",
                  },
                ],
              },
              {
                $: {
                  name: "Item › should allow me to mark items as complete",
                  classname: "demo-todo-app.spec.js",
                  time: "0",
                },
                skipped: [""],
              },
              {
                $: {
                  name: "Editing › should hide other controls when editing",
                  classname: "demo-todo-app.spec.js",
                  time: "30.000",
                },
                error: [""],
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new NodejsPlaywrightFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(1);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "firefox",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
        {
          auto_test_case_external_key:
            "Mark all as completed › should allow me to mark all items as completed",
          result: "fail",
          execution_time_taken: 30026,
          remark:
            "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
        },
        {
          auto_test_case_external_key:
            "Item › should allow me to mark items as complete",
          result: "skip",
          execution_time_taken: 0,
          remark: "Test skipped",
        },
        {
          auto_test_case_external_key:
            "Editing › should hide other controls when editing",
          result: "error",
          execution_time_taken: 30000,
          remark: "Error occurred",
        },
      ],
    });
  });

  test("Data formatting for multiple test case and single browser results", () => {
    const jsonData = {
      testsuites: {
        $: {
          id: "",
          name: "",
          tests: "52",
          failures: "3",
          skipped: "0",
          errors: "0",
          time: "40.384420999999996",
        },
        testsuite: [
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "firefox",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
              {
                $: {
                  name: "Mark all as completed › should allow me to mark all items as completed",
                  classname: "demo-todo-app.spec.js",
                  time: "30.026",
                },
                failure: [
                  {
                    $: {
                      message:
                        "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
                      type: "FAILURE",
                    },
                    _: "[firefox] › demo-todo-app.spec.js:83:3 › Mark all as completed › should allow me to mark all items as completed",
                  },
                ],
              },
              {
                $: {
                  name: "Item › should allow me to mark items as complete",
                  classname: "demo-todo-app.spec.js",
                  time: "0",
                },
                skipped: [""],
              },
              {
                $: {
                  name: "Editing › should hide other controls when editing",
                  classname: "demo-todo-app.spec.js",
                  time: "30.000",
                },
                error: [""],
              },
            ],
          },
          {
            $: {
              name: "example.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "firefox",
              tests: "2",
              failures: "0",
              skipped: "0",
              time: "2.393",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "has title",
                  classname: "example.spec.js",
                  time: "1.059",
                },
              },
              {
                $: {
                  name: "get started link",
                  classname: "example.spec.js",
                  time: "3.059",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new NodejsPlaywrightFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(2);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "firefox",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
        {
          auto_test_case_external_key:
            "Mark all as completed › should allow me to mark all items as completed",
          result: "fail",
          execution_time_taken: 30026,
          remark:
            "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
        },
        {
          auto_test_case_external_key:
            "Item › should allow me to mark items as complete",
          result: "skip",
          execution_time_taken: 0,
          remark: "Test skipped",
        },
        {
          auto_test_case_external_key:
            "Editing › should hide other controls when editing",
          result: "error",
          execution_time_taken: 30000,
          remark: "Error occurred",
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "example.spec.js",
      auto_execution_device_external_key: "firefox",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key: "has title",
          result: "pass",
          execution_time_taken: 1059,
        },
        {
          auto_test_case_external_key: "get started link",
          result: "pass",
          execution_time_taken: 3059,
        },
      ],
    });
  });
  test("Data formatting for multiple test case and browser results", () => {
    const jsonData = {
      testsuites: {
        $: {
          id: "",
          name: "",
          tests: "52",
          failures: "3",
          skipped: "0",
          errors: "0",
          time: "40.384420999999996",
        },
        testsuite: [
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "firefox",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
              {
                $: {
                  name: "Mark all as completed › should allow me to mark all items as completed",
                  classname: "demo-todo-app.spec.js",
                  time: "30.026",
                },
                failure: [
                  {
                    $: {
                      message:
                        "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
                      type: "FAILURE",
                    },
                    _: "[firefox] › demo-todo-app.spec.js:83:3 › Mark all as completed › should allow me to mark all items as completed",
                  },
                ],
              },
              {
                $: {
                  name: "Item › should allow me to mark items as complete",
                  classname: "demo-todo-app.spec.js",
                  time: "0",
                },
                skipped: [""],
              },
              {
                $: {
                  name: "Editing › should hide other controls when editing",
                  classname: "demo-todo-app.spec.js",
                  time: "30.000",
                },
                error: [""],
              },
            ],
          },
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "webkit",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
              {
                $: {
                  name: "Mark all as completed › should allow me to mark all items as completed",
                  classname: "demo-todo-app.spec.js",
                  time: "30.026",
                },
                failure: [
                  {
                    $: {
                      message:
                        "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
                      type: "FAILURE",
                    },
                    _: "[firefox] › demo-todo-app.spec.js:83:3 › Mark all as completed › should allow me to mark all items as completed",
                  },
                ],
              },
              {
                $: {
                  name: "Item › should allow me to mark items as complete",
                  classname: "demo-todo-app.spec.js",
                  time: "0",
                },
                skipped: [""],
              },
              {
                $: {
                  name: "Editing › should hide other controls when editing",
                  classname: "demo-todo-app.spec.js",
                  time: "30.000",
                },
                error: [""],
              },
            ],
          },
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "chromium",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
              {
                $: {
                  name: "Mark all as completed › should allow me to mark all items as completed",
                  classname: "demo-todo-app.spec.js",
                  time: "30.026",
                },
                failure: [
                  {
                    $: {
                      message:
                        "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
                      type: "FAILURE",
                    },
                    _: "[firefox] › demo-todo-app.spec.js:83:3 › Mark all as completed › should allow me to mark all items as completed",
                  },
                ],
              },
              {
                $: {
                  name: "Item › should allow me to mark items as complete",
                  classname: "demo-todo-app.spec.js",
                  time: "0",
                },
                skipped: [""],
              },
              {
                $: {
                  name: "Editing › should hide other controls when editing",
                  classname: "demo-todo-app.spec.js",
                  time: "30.000",
                },
                error: [""],
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new NodejsPlaywrightFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(3);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "firefox",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
        {
          auto_test_case_external_key:
            "Mark all as completed › should allow me to mark all items as completed",
          result: "fail",
          execution_time_taken: 30026,
          remark:
            "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
        },
        {
          auto_test_case_external_key:
            "Item › should allow me to mark items as complete",
          result: "skip",
          execution_time_taken: 0,
          remark: "Test skipped",
        },
        {
          auto_test_case_external_key:
            "Editing › should hide other controls when editing",
          result: "error",
          execution_time_taken: 30000,
          remark: "Error occurred",
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "webkit",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
        {
          auto_test_case_external_key:
            "Mark all as completed › should allow me to mark all items as completed",
          result: "fail",
          execution_time_taken: 30026,
          remark:
            "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
        },
        {
          auto_test_case_external_key:
            "Item › should allow me to mark items as complete",
          result: "skip",
          execution_time_taken: 0,
          remark: "Test skipped",
        },
        {
          auto_test_case_external_key:
            "Editing › should hide other controls when editing",
          result: "error",
          execution_time_taken: 30000,
          remark: "Error occurred",
        },
      ],
    });
    expect(formattedData[2]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "chromium",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
        {
          auto_test_case_external_key:
            "Mark all as completed › should allow me to mark all items as completed",
          result: "fail",
          execution_time_taken: 30026,
          remark:
            "demo-todo-app.spec.js:83:3 should allow me to mark all items as completed",
        },
        {
          auto_test_case_external_key:
            "Item › should allow me to mark items as complete",
          result: "skip",
          execution_time_taken: 0,
          remark: "Test skipped",
        },
        {
          auto_test_case_external_key:
            "Editing › should hide other controls when editing",
          result: "error",
          execution_time_taken: 30000,
          remark: "Error occurred",
        },
      ],
    });
  });
  test("Data formatting for single test case and multiple browser results", () => {
    const jsonData = {
      testsuites: {
        $: {
          id: "",
          name: "",
          tests: "52",
          failures: "3",
          skipped: "0",
          errors: "0",
          time: "40.384420999999996",
        },
        testsuite: [
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "firefox",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
            ],
          },
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "webkit",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
            ],
          },
          {
            $: {
              name: "demo-todo-app.spec.js",
              timestamp: "2024-09-11T09:36:50.583Z",
              hostname: "chromium",
              tests: "24",
              failures: "3",
              skipped: "0",
              time: "111.311",
              errors: "0",
            },
            testcase: [
              {
                $: {
                  name: "New Todo › should allow me to add todo items",
                  classname: "demo-todo-app.spec.js",
                  time: "1.862",
                },
              },
            ],
          },
        ],
      },
    };

    const testResultFormatter = new NodejsPlaywrightFormatter();
    const formattedData = testResultFormatter.format(jsonData);
    expect(formattedData.length).toBe(3);
    expect(formattedData[0]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "firefox",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
      ],
    });
    expect(formattedData[1]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "webkit",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
      ],
    });
    expect(formattedData[2]).toMatchObject({
      auto_test_suite_external_key: "demo-todo-app.spec.js",
      auto_execution_device_external_key: "chromium",
      auto_test_cycle_name: "2024-09-11T09:36:50.583Z",
      auto_test_results: [
        {
          auto_test_case_external_key:
            "New Todo › should allow me to add todo items",
          result: "pass",
          execution_time_taken: 1862,
        },
      ],
    });
  });
});
