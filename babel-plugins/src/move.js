const types = require("babel-types");
const template = require("babel-template");

const t = template(`(function() {
  const __args = ARGS;
  return sm.move(...__args);
}())`);


module.exports = {
  check(path) {
    return path.get("callee").isIdentifier({
      name: "move"
    });
  },
  transform(path) {
    const { expression } = t({
      ARGS: types.arrayExpression(path.node.arguments)
    });
    return path.replaceWith(expression);
  },
};
