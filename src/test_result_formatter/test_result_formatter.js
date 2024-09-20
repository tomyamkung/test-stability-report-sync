class TestResultFormatter {
  constructor() {
    this.postDataList = [];
  }
  format() {
    throw new Error("This method should be overridden by subclasses");
  }
}

module.exports = TestResultFormatter;
