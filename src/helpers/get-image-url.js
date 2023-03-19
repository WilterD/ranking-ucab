const { imgRelativeDir } = require('./fileManager');

/**
 * It takes an image name and returns the image's URL.
 * @param imageName - the name of the image file
 * @returns The image url.
 */
function getImageUrl(imageName) {
  const imgRelativeDirWithoutBarrasVeganas = '/' + imgRelativeDir.replace('\\', '/') + '/';
  return `${process.env.DOMAIN}${imgRelativeDirWithoutBarrasVeganas}${imageName}`;
}

module.exports = getImageUrl;
