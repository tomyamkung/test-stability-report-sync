const { linkTestResults } = require("../src/link_test_results");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

jest.mock("axios");

let jsonFilePath;
let pytestXmlFilePath;
let playwrightXmlFilePath;

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
});

describe("failure scenarios", () => {
  beforeEach(() => {
    axios.post.mockRejectedValue(new Error("Integration Error"));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("should alert on invalid filepath", () => {
    expect(() =>
      linkTestResults("hoge.xml", "junit", "", "", "testAPIKey")
    ).rejects.toThrow(/no such file or directory/);
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
      linkTestResults(jsonFilePath, "magicpod", "", "", "testAPIKey")
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
});
