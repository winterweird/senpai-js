const actor = require("./src/actor");
const go = require("./src/go");
const generator = require("./src/generator");

const { relative } = require("path");
const use = (...plugins) => function(path, state) {
  const val = relative(__dirname, state.file.opts.filename);
  for (const plugin of plugins) {
    if (val.startsWith("..\\script\\") && plugin.check(path, state)) {
      plugin.transform(path, state);
    }
  }
}

module.exports = function(babel) {
  return {
    visitor: {
      ExportDeclaration: use(generator),
      NewExpression: use(actor),
      CallExpression: use(actor, go),
    }
  };
};