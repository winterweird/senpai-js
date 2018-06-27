const grammar = require('./grammar.js');
const nearley = require('nearley');
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed(`
script test (){
  show Aya invisible, stageLeft;
  Aya says \`hello world!\`;
  move Aya center, visible, quadInOut;
  addsay \`This is a test.\`;
  
}
`)

console.log(parser.results);

const fs = require("fs");

fs.writeFileSync("results.json", JSON.stringify(parser.results[0], null, 2), 'utf-8');