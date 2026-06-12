module.exports = {
  /**
   * @param {string} prefixPath
   */
  prefixUploadPath(prefixPath) {
    return function (req, res, next) {
      req.prefixPath = prefixPath;
      next();
    };
  },
};
