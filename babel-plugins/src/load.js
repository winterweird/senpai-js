const types = require("babel-types");
const template = require("babel-template");

const t = template(`(function(){
  const args = ARGS;
  return sm.load(...args);
}())`);


module.exports = {
  check(path) {
    return types.isIdentifier(path.node.callee) && path.node.callee.name === "load";
  },
  transform(path) {
    const { expression } = t({
      ARGS: types.arrayExpression(path.node.arguments),
    });
    return path.replaceWith(
      types.yieldExpression(expression, false)
    );
  },
};
