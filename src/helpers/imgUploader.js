const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { imgDir } = require('./fileManager')
const mimetypes = ['image/jpeg', 'image/png'];

const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgDir);
  },
  filename: (req, file, cb) => {
    let { name, ext } = path.parse(file.originalname);
    if (!ext || ext == '')
      ext = file.mimetype.split('/')[1]; 
    cb(null, name.replace(/\s/g, '-') + '-' + uuidv4() + ext);
  }
});

const imgUploader = multer({
  storage: imgStorage,
  fileFilter: (req, file, cb) => {
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
  limits: {
    fieldSize: 15000000,
    fileSize: 10000000
  }
});

const uploadImg = imgUploader.single('file');
const makeUploadImg = (fileName) => {
  return imgUploader.single(fileName);
}

module.exports = { uploadImg, makeUploadImg };
