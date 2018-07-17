const glob = require("glob-promise");
const unified = require("unified");
const markdown = require("remark-parse");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const transform = require("./md-transformer.js");
const difference = require("lodash.difference");
const isEqual = require("lodash.isequal");
const yaml = require("remark-parse-yaml");
const visitor = require("./md-visitor.js");

function pollInterval(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, time);
  });
}

(async function() {
  let files = [], oldFiles = [], remove, add;
  const index = {};
  const watchers = {};
  const working = {};
  const code = {};

  function end(file) {
    if (watchers[file]) {
      watchers[file].close();
    }
    delete index[file];
    delete watchers[file];
    delete working[file];
    delete code[file];
  }

  async function processFile(file) {
    if (working[file]) {
      return working[file] = working[file].then(e => run(file));
    }
    return working[file] = run(file);
  }

  async function run(file) {
    const contents = await readFile(file, { encoding: "utf8" });
    const tree = unified()
      .use(markdown)
      .parse(contents);
    if (!isEqual(tree, index[file])) {
      index[file] = tree;
      const transformed = transform(tree, visitor);
      code[file] = transformed; //generate.default();
      
    }
  }


  while (true) {
    oldFiles = files;
    files = await glob("./script/**/*.md");
    remove = difference(oldFiles, files);
    add = difference(files, oldFiles);

    if (remove.length) {
      console.log("removing", remove);
    }
    remove.forEach(end);

    add.forEach(function(file) {
      watchers[file] = fs.watch(
        file,
        { encoding: "utf8" },
        function(eventType, filename) {
          if (eventType === "close" || eventType === "error") {
            console.log(file, "eventType:", eventType);
            end(file);
            return;
          }

          if (eventType === "change") {
            processFile(file);
          }
        }
      );
    });
    if (add.length) {
      console.log("adding", add);
    }
    await Promise.all(add.map(processFile))

    await pollInterval(3000);
  }
}());