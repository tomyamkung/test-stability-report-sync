const { getInputFiles } = require("../src/get_input_files");
const fs = require("fs");
const path = require("path");

describe("When using a fixed file path", () => {
  const fixedFileName = "fixed_file.xml";
  const filePath = path.join(__dirname, fixedFileName);

  beforeAll(() => {
    fs.writeFileSync(filePath, "");
  });

  test("should return the file path if the file exists", async () => {
    const inputFiles = await getInputFiles(filePath);
    expect(inputFiles.length).toBe(1);
    expect(inputFiles[0]).toBe(filePath);
  });

  test("should notify an alert if the file does not exist", async () => {
    await expect(getInputFiles("hoge/foo/bar.xml")).rejects.toThrow();
  });

  afterAll(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
});

describe("When using wildcards", () => {
  const testFolder = path.join(__dirname, "test_files");
  const fileNames = [];

  beforeAll(() => {
    if (!fs.existsSync(testFolder)) {
      fs.mkdirSync(testFolder);
    }

    for (let i = 0; i < 10; i++) {
      const fileName = `file_${i}_${Math.random()
        .toString(36)
        .substring(7)}.xml`;
      const filePath = path.join(testFolder, fileName);
      fileNames.push(fileName);
      fs.writeFileSync(filePath, "Test content");
    }
  });

  afterAll(() => {
    fileNames.forEach((fileName) => {
      const filePath = path.join(testFolder, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    if (fs.existsSync(testFolder)) {
      fs.rmdirSync(testFolder);
    }
  });

  test("should get multiple file paths", async () => {
    const searchFilePath = path.join(testFolder, "*.xml");
    const inputFiles = await getInputFiles(searchFilePath);
    expect(inputFiles.length).toBe(10);
  });

  test("should notify an alert if the file does not exist", async () => {
    const searchFilePath = path.join(testFolder, "dummy", "*.xml");
    await expect(getInputFiles(searchFilePath)).rejects.toThrow();
  });
});
