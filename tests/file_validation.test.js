const { validateFileFormat } = require("../src/file_validation");

describe("Validation failure scenarios", () => {
  test("should alert on invalid file extension", () => {
    expect(() => validateFileFormat("hoge.xlsx", "test")).toThrow(
      "Unsupported file format: .xlsx"
    );
  });

  test("should alert on invalid input combinations", () => {
    expect(() => validateFileFormat("hoge.xml", "test")).toThrow(
      "Invalid combination: File format xml and test framework test are not compatible."
    );
  });
});

describe("Validation success scenarios", () => {
  const fileExtensionFrameworkCombinations = [
    {
      fileExtension: ".xml",
      testFramework: "junit",
    },
    {
      fileExtension: ".xml",
      testFramework: "pytest",
    },
    {
      fileExtension: ".xml",
      testFramework: "pytest-playwright",
    },
    {
      fileExtension: ".xml",
      testFramework: "nodejs-playwright",
    },
    {
      fileExtension: ".json",
      testFramework: "magicpod",
    },
    {
      fileExtension: ".json",
      testFramework: "mabl-deploy-event",
    },
  ];
  test.each(fileExtensionFrameworkCombinations)(
    "should properly handle file extension %s with framework %s",
    ({ fileExtension, testFramework }) => {
      expect(() =>
        validateFileFormat(`test${fileExtension}`, testFramework)
      ).not.toThrow();
    }
  );
});
