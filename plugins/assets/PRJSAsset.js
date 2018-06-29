const grammar = require('./prjs-grammar.js');
const nearley = require('nearley');


module.exports = class PRJSAsset extends Asset {
  constructor(...props) {
    super(...props);
    this.type = 'js';
  }
  async parse(code) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
    return parser.results[0];
  }
  generate() {
    return [
      {
        type: 'js',
        value: `module.exports = ${JSON.stringify(this.ast)}`
      }
    ]
  }
}