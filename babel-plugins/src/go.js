const types = require("babel-types");
const template = require("babel-template");

const t = template(`(function(){
  const callee = CALLEE;
  const args = ARGS;
  return callee(...args);
}())`);


module.exports = {
  check(path) {
    return types.isIdentifier(path.node.callee) && path.node.callee.name === "go";
  },
  transform(path) {
    const { expression } = t({
      CALLEE: path.node.arguments[0],
      ARGS: types.arrayExpression(path.node.arguments.slice(1)),
    });
    return path.replaceWith(
      types.yieldExpression(expression, true)
    );
  },
};
