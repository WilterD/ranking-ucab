const path = require('path');
const fse = require('fs-extra');

const currentDir = path.dirname(__filename);
const srcDir = path.join(currentDir, '..');
const uploadsDir = path.join(srcDir, 'public', 'uploads');
const uploadsRelativeDir = path.relative(srcDir, uploadsDir);
const imgDir = path.join(uploadsDir, 'img');
const imgRelativeDir = path.relative(srcDir, imgDir);

/* Creating a directory called uploads in the root directory of the project. */
async function initFileManager() {
  try {
    await fse.ensureDir(uploadsDir);
    console.log("uploads created!");
    await fse.ensureDir(imgDir);
    console.log("uploads/img created!");
  } catch (err) {
    console.error(err);
  }
}

const deleteFile = async (path, filename) => {
  try {
    await fse.remove(path);
    console.log(`${filename} file deleted!`);
  } catch (err) {
    console.log(err);
  }
}

initFileManager();

module.exports = {
  deleteFile, uploadsRelativeDir,
  imgRelativeDir, uploadsDir, imgDir
}
