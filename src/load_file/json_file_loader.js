const FileLoader = require("./file_loader");

class JSONFileLoader extends FileLoader {
  format(data) {
    return this.testFramework.format(JSON.parse(data));
  }
}

module.exports = JSONFileLoader;
