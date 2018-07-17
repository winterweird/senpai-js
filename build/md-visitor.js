const yaml = require("js-yaml");
const yamlDirective = require("./md-yaml-directive");
const toIdentifier = e => e
  .replace(/[^$_0-9a-zA-Z]/g, c => c.charCodeAt(0))

const nodeToString = e => {

  const result = e.children
    ? e.children
      .map(nodeToString)
      .join("")
    : e.value;
  if (e.type === "emphasis") {
    return `$e+${result}$e-`;
  }
  if (e.type === "strong") {
    return `$s+${result}$s-`
  }
  if (e.type === "code") {
    return `\$\{${result}\}`;
  }
  return result;
};

module.exports = {
  thematicBreak(node, children) {
    return `yield sm.firstDown();`;
  },
  heading(node, children) {
    const value = nodeToString(node);
    if (node.depth === 1) {
      const id = toIdentifier(value);
      return {
        type: "export",
        value: `export async function* ${id}() {\n  let __speaker;\nSTATEMENTS\n}`.trim(),
      };
    }

    if (node.depth === 2) {
      return `sm.scene(\`${value}\`);`;
    }

    if (node.depth === 3) {
      const id = toIdentifier(value);
      return `__speaker = ${id};`;
    }
  },
  list(node, children) {

  },
  code(node, children) {
    if (node.lang === "yaml") {
      const doc = yaml.safeLoad(node.value);
      return yamlDirective(node, children, doc);
    }
    return node.value;
  },
  text(node, children) {
    return node;
  },
  emphasis(node, children) {
    return node;
  },
  strong(node, children) {
    return node;
  },
  paragraph(node, children) {
    const str = nodeToString(node);
    return `sm.say(__speaker, \`${str}\`); yield sm.firstDown();`;
  },
  listItem(node, children) {
    return JSON.stringify({
      node,
      children,
    });
  },
  root(node, children) {
    const topLevelStatements = [];
    let workingStatements = [];
    let exporting = null;
    for (const child of children.filter(Boolean)) {
      if (child.type === "export") {
        if (exporting) {
          topLevelStatements.push(exporting.value.replace("STATEMENTS", workingStatements.join("\n")));
        }
        workingStatements = [];
        exporting = child;
        continue;
      }
      if (exporting) {
        workingStatements.push(
          "  " + child.split("\n").join("\n  ")
        );
      } else {
        topLevelStatements.push(child);
      }
    }
    if (exporting) {
      topLevelStatements.push(exporting.value.replace("STATEMENTS", workingStatements.join("\n")))
    }
    return topLevelStatements.join("\n");
  }
}