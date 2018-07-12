const types = require("babel-types");
const template = require("babel-template");
const getAPIIdentifier = require("./getAPIIdentifier");
const t = template(`(function(){
  const args = ARGS;
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, args[0]);
  });
}())`);


module.exports = {
  check(path) {
    return types.isIdentifier(path.node.callee) && path.node.callee.name === "wait";
  },
  transform(path) {
    const { expression } = t({
      ARGS: types.arrayExpression(path.node.arguments[0]),
    });
    return path.replaceWith(
      types.yieldExpression(expression, true)
    );
  },
};
