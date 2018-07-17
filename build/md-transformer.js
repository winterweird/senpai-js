const types = require("babel-types");
module.exports = function visit(mdast, visitor) {
  const children = mdast.children ? mdast.children.map(child => visit(child, visitor)) : null;
  if (visitor[mdast.type]) {
    return visitor[mdast.type](mdast, children);
  } else {
    console.log("No visitor for type", mdast.type);
  }
};