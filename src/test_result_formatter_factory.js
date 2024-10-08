const JUnitFormatter = require("./test_result_formatter/junit_formatter");
const NodejsPlaywrightFormatter = require("./test_result_formatter/nodejs_playwright_formatter");
const PytestFormatter = require("./test_result_formatter/pytest_formatter");
const PytestPlaywrightFormatter = require("./test_result_formatter/pytest_playwright_formatter");
const MagicPodFormatter = require("./test_result_formatter/magicpod_formatter");
const MablDeployEventFormatter = require("./test_result_formatter/mabl_deploy_event_formatter");

function getTestResultFormatter(testFramework) {
  switch (testFramework.toLowerCase()) {
    case "junit":
      return new JUnitFormatter();
    case "nodejs-playwright":
      return new NodejsPlaywrightFormatter();
    case "pytest":
      return new PytestFormatter();
    case "pytest-playwright":
      return new PytestPlaywrightFormatter();
    case "mabl-deploy-event":
      return new MablDeployEventFormatter();
    case "magicpod":
      return new MagicPodFormatter();
    default:
      throw new Error("Unsupported test framework");
  }
}

module.exports = { getTestResultFormatter };
