class FileLoader {
  constructor(testFramework) {
    this.testFramework = testFramework;
  }

  format() {
    throw new Error("This method should be overridden by subclasses");
  }
}

module.exports = FileLoader;
