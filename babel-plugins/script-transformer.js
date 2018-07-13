const actor = require("./src/actor");
const go = require("./src/go");
const load = require("./src/load");
const generator = require("./src/generator");
const show = require("./src/show");
const hide = require("./src/hide");
const say = require("./src/say");
const move = require("./src/move");

const { relative } = require("path");
const use = (...plugins) => function(path, state) {
  const val = relative(__dirname, state.file.opts.filename);
  for (const plugin of plugins) {
    if (plugin.debug && plugin.debug(path)) {
      console.log(path.node, val);
    }
    if (val.startsWith("..\\script\\") && plugin.check(path, state)) {
      plugin.transform(path, state);
    }
  }
}

module.exports = function(babel) {
  return {
    visitor: {
      Function: {
        exit: use(generator),
      },
      NewExpression: use(actor),
      CallExpression: use(actor, go, load, show, hide, move),
      TaggedTemplateExpression: use(say),
    }
  };
};