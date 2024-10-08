const { linkTestResults } = require("../src/link_test_results");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

jest.mock("axios");

let jsonFilePath;
let pytestXmlFilePath;
let playwrightXmlFilePath;
let mablCliJsonFilePath;

beforeAll(() => {
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
  jsonFilePath = path.join(__dirname, "testData.json");
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");

  const mablCliData = {
    id: "deployment_id",
    href: "deploy_URL",
    execution_results: {
      plan_execution_metrics: {
        total: 1,
        passed: 0,
        failed: 1,
      },
      executions: [
        {
          journey_executions: [
            {
              run_multiplier_index: 0,
              stop_time: 1727919356192,
              environment_id: "environment_id",
              browser_type: "chrome",
              test_cases: [],
              application_id: "application_id",
              completed_time: 1727919356192,
              journey_execution_id: "journey_execution_id",
              href: "URLr",
              journey_id: "journey_id",
              initial_url: "initial_url",
              test_id: "test_id",
              app_href: "result_url",
              status: "completed",
            },
          ],
          start_time: 1727930167078,
          journeys: [
            {
              name: "sample test",
              id: "journey_id",
              href: "url",
              app_href: "url",
            },
          ],
          stop_time: 1727930254084,
          success: false,
          plan: {
            name: "sample plan",
            id: "plan_id",
            href: "URL",
            app_href: "url",
          },
          status: "completed",
          plan_execution: {
            is_retry: false,
            id: "plan_id",
            href: "url",
            status: "completed",
          },
        },
      ],
      journey_execution_metrics: {
        running: 0,
        total: 1,
        passed: 0,
        failed: 1,
        terminated: 0,
        skipped: 0,
      },
      event_status: {
        succeeded_by_plan: {
          "vL6lwEZsDCcFC5VYvhM0Jg-p": false,
        },
        succeeded_first_attempt: false,
        succeeded: false,
      },
    },
  };
  mablCliJsonFilePath = path.join(__dirname, "mabl_cli.json");
  fs.writeFileSync(
    mablCliJsonFilePath,
    JSON.stringify(mablCliData, null, 2),
    "utf8"
  );

  const pytestXmlData = `
    <?xml version='1.0' encoding='utf8'?>
    <testsuites>
      <testsuite name="pytest" errors="0" failures="0" skipped="0" tests="1" time="1.000" timestamp="2024-04-25T09:03:08.040413" hostname="test_data">
        <testcase classname="test" name="test[chromium]" time="1.000" />
      </testsuite>
    </testsuites>`;
  pytestXmlFilePath = path.join(__dirname, "pytestXmlData.xml");
  fs.writeFileSync(pytestXmlFilePath, pytestXmlData, "utf8");

  const playwrightXmlData = `
    <?xml version='1.0' encoding='utf8'?>
    <testsuites id="" name="" tests="6" failures="0" skipped="0" errors="0" time="9.503468999999999">
      <testsuite name="example.spec.js" timestamp="2024-09-12T01:41:24.954Z" hostname="chromium" tests="2" failures="0" skipped="0" time="2.577" errors="0">
        <testcase name="has title" classname="example.spec.js" time="1">
        </testcase>
        <testcase name="get started link" classname="example.spec.js" time="1.577">
        </testcase>
      </testsuite>
    </testsuites>
  `;

  playwrightXmlFilePath = path.join(__dirname, "playwrightXmlData.xml");
  fs.writeFileSync(playwrightXmlFilePath, playwrightXmlData, "utf8");
});

afterAll(() => {
  if (fs.existsSync(jsonFilePath)) {
    fs.unlinkSync(jsonFilePath);
  }

  if (fs.existsSync(pytestXmlFilePath)) {
    fs.unlinkSync(pytestXmlFilePath);
  }

  if (fs.existsSync(playwrightXmlFilePath)) {
    fs.unlinkSync(playwrightXmlFilePath);
  }

  if (fs.existsSync(mablCliJsonFilePath)) {
    fs.unlinkSync(mablCliJsonFilePath);
  }
});

describe("failure scenarios", () => {
  beforeEach(() => {
    axios.post.mockRejectedValue(new Error("Integration Error"));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("should alert on invalid filepath", async () => {
    await expect(
      linkTestResults("hoge.xml", "junit", "", "", "testAPIKey")
    ).rejects.toThrow(/No files found for pattern/);
  });

  test("should alert on fail integration", async () => {
    await expect(
      linkTestResults(jsonFilePath, "magicpod", "", "", "testAPIKey")
    ).rejects.toThrow(/The integration of automated test results has failed/);
  });
});

describe("success integration", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: "success" });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("should integration magicpod test result", async () => {
    await expect(
      linkTestResults(jsonFilePath, "magicpod", "", "", "", "testAPIKey")
    ).resolves.not.toThrow();
  });

  test("should integration mabl-cli test result", async () => {
    await expect(
      linkTestResults(
        mablCliJsonFilePath,
        "mabl-deploy-event",
        "",
        "",
        "",
        "testAPIKey"
      )
    ).resolves.not.toThrow();
  });

  test("should integration junit test result", async () => {
    await expect(
      linkTestResults(
        pytestXmlFilePath,
        "junit",
        "sample",
        "sample_test_cycle",
        "sample_device",
        "testAPIKey"
      )
    ).resolves.not.toThrow();
  });

  test("should integration pytest-playwright test result", async () => {
    await expect(
      linkTestResults(
        pytestXmlFilePath,
        "pytest-playwright",
        "",
        "",
        "",
        "testAPIKey"
      )
    ).resolves.not.toThrow();
  });

  test("should integration pytest test result", async () => {
    await expect(
      linkTestResults(pytestXmlFilePath, "pytest", "", "", "", "testAPIKey")
    ).resolves.not.toThrow();
  });

  test("should integration playwright test result", async () => {
    await expect(
      linkTestResults(
        playwrightXmlFilePath,
        "nodejs-playwright",
        "",
        "",
        "",
        "testAPIKey"
      )
    ).resolves.not.toThrow();
  });

  test("should multi file integration playwright test result", async () => {
    const searchFilePath = path.join(__dirname, "*.xml");
    await expect(
      linkTestResults(searchFilePath, "junit", "", "", "", "testAPIKey")
    ).resolves.not.toThrow();
  }, 10000);

  test("should integrate with wildcard file paths", async () => {
    const searchFilePath = path.join(__dirname, "testData*.json");
    await expect(
      linkTestResults(searchFilePath, "magicpod", "", "", "", "testAPIKey")
    ).resolves.not.toThrow();
  }, 10000);
});
