const types = require("babel-types");
module.exports = function(path) {
  path = path.parentPath;
  while (path && !path.isFunction({ generator: true })) {
    path = path.parentPath;
  }

  if (path && path.node.params) {
    return path.node.params[0];
  } else {
    return types.identifier("__api");
  }
};