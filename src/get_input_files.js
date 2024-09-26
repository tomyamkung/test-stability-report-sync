const glob = require("@actions/glob");

async function getInputFiles(inputFilePath) {
  try {
    const globber = await glob.create(inputFilePath);
    const files = await globber.glob();

    if (files.length === 0) {
      throw new Error(`No files found for pattern: ${inputFilePath}`);
    }
    return files;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { getInputFiles };
