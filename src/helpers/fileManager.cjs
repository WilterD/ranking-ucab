const path = require('path');
const fse = require('fs-extra');

const currentDir = path.dirname(__filename);
const srcDir = path.join(currentDir, '..');
const publicDir = path.join(srcDir, 'public');
const publicRelativeDir = path.relative(srcDir, publicDir);

const uploadsDir = path.join(srcDir, 'public', 'uploads');
const uploadsRelativeDir = path.relative(publicDir, uploadsDir);
const imgDir = path.join(uploadsDir, 'img');
const imgRelativeDir = path.relative(publicDir, imgDir);

/* Creating a directory called uploads in the root directory of the project. */
async function initFileManager() {
  try {
    await fse.ensureDir(publicDir);
    await fse.ensureDir(uploadsDir);
    await fse.ensureDir(imgDir);
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
  deleteFile: deleteFile,
  uploadsRelativeDir: uploadsRelativeDir,
  imgRelativeDir: imgRelativeDir,
  uploadsDir: uploadsDir,
  imgDir: imgDir,
  publicDir,
  publicRelativeDir
}
