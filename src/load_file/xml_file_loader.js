const FileLoader = require("./file_loader");
const xml2js = require("xml2js");

class XMLFileLoader extends FileLoader {
  format(data) {
    const parsedData = xml2js.parseStringPromise(data, {
      explicitArray: true,
    });
    return parsedData.then((result) => this.testFramework.format(result));
  }
}

module.exports = XMLFileLoader;
