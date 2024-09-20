const JSONFileLoader = require("./load_file/json_file_loader");
const XMLFileLoader = require("./load_file/xml_file_loader");

function getFileLoader(extension, testFramework) {
  switch (extension) {
    case ".json":
      return new JSONFileLoader(testFramework);
    case ".xml":
      return new XMLFileLoader(testFramework);
    default:
      throw new Error("Unsupported file type");
  }
}

module.exports = { getFileLoader };
