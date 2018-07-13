const types = require("babel-types");
const functions = [
  "go",
  "wait",
  "waitFor",
]
module.exports = {
  check(path, state) {
    let parentPath = path.parentPath;

    while (parentPath && !parentPath.isFunction() && !parentPath.isExportNamedDeclaration()) {
      parentPath = parentPath.parentPath;
    }

    const parentPathContainsExport = parentPath && parentPath.isExportNamedDeclaration();

    if(!parentPathContainsExport) {
      return false;
    }

    const isGenerator = path.isFunction({
      generator: true
    });

    if (isGenerator) {
      return false;
    }

    let hasTranspilableDeclarations = false;
    path.traverse({
      CallExpression(subpath, substate) {
        const isIdentifier = types.isIdentifier(subpath.node.callee);
        if (isIdentifier) {
          const matched = functions.includes(subpath.node.callee.name);
          if (matched) {
            hasTranspilableDeclarations = true;
            subpath.stop();
          }
        }
      }
    });

    if (hasTranspilableDeclarations) {
      return true;
    }
  },
  transform(path, state) {
    const node = path.isStatement()
      ? types.functionDeclaration(
          path.node.id,
          path.node.params,
          path.node.body,
          true,
          path.node.async,
        )
      : types.functionExpression(
          path.node.id,
          path.node.params,
          path.node.body,
          true,
          path.node.async
        );
    return path.replaceWith(node);
  }
}