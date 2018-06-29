const glob = require("glob-promise");
const path = require("path");
const Bundler = require("parcel-bundler");

(async function() {
  const plugins = await glob("./plugins/parcel-plugin-*.js");
  const file = path.join(__dirname, "./index.html");
  const b = new Bundler(file, {
    publicUrl: './',
    target: 'electron',
  });
  for (let plugin of plugins) {
    require(plugin)(b);
  }
  b.bundle();
}());