const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unified = require("unified");
const markdown = require("remark-parse");
const transform = require("./build/md-transformer");
const visitor = require("./build/md-visitor");
const frontmatter = require("remark-frontmatter");
const yaml = require("remark-parse-yaml");

function pause(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, time);
  });
}

(async function() {
  while (true) {
    const contents = await readFile("./script/index.md");
    const tree = unified()
      .use(markdown, { gfm: true, footnotes: true, yaml: true })
      .use(frontmatter)
      .use(yaml)
      .parse(contents);

    const result = transform(tree, visitor);
    await writeFile("./output.js", result, { encoding: "utf8" });
    await pause(4000);
  }
}());
