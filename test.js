const grammar = require('./grammar.js');
const nearley = require('nearley');
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const fs = require("fs");

parser.feed(fs.readFileSync("./input.prjs", 'utf-8'));

fs.writeFileSync("results.json", JSON.stringify(parser.results[0], null, 2), 'utf-8');