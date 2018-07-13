const types = require("babel-types");
const template = require("babel-template");

const t = template(`(function(){
  const __speaker = SPEAKER;
  const __says = SAYS;
  const __color = __speaker.color;
  const __name = __speaker.displayName;
  return sm.says(__says, __name, __color);
}())`);


module.exports = {
  check(path) {
    return path.get("tag").isIdentifier();
  },
  transform(path) {
    const { expression } = t({
      SPEAKER: path.node.tag,
      SAYS: path.node.quasi,
    });
    return path.replaceWith(
      types.yieldExpression(expression)
    );
  },
};
