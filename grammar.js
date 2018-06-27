// Generated automatically by nearley, version 2.13.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const keywords = [
    "script",
    "say",
    "addsay",
    "actor",
    "pause",
    "show",
    "hide",
    "move",
	"center",
	"invisible",
	"stageLeft",
    "left2" , "left3" , "right2"
			, "right3" , "stageRight" , "visible"

  ]
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Entry", "symbols": ["_", "ModuleList", "_"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Program",
            type: "Program",
            location,
            props: {
              modules: d[1]
            }
          };
        }
        },
    {"name": "ModuleList$macrocall$2", "symbols": ["Script"]},
    {"name": "ModuleList$macrocall$3", "symbols": ["_"]},
    {"name": "ModuleList$macrocall$1$ebnf$1", "symbols": []},
    {"name": "ModuleList$macrocall$1$ebnf$1$subexpression$1", "symbols": ["ModuleList$macrocall$3", "ModuleList$macrocall$2"]},
    {"name": "ModuleList$macrocall$1$ebnf$1", "symbols": ["ModuleList$macrocall$1$ebnf$1", "ModuleList$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ModuleList$macrocall$1", "symbols": ["ModuleList$macrocall$2", "ModuleList$macrocall$1$ebnf$1"], "postprocess": d => [d[0][0], ...d[1].map(e => e[1][0])]},
    {"name": "ModuleList", "symbols": ["ModuleList$macrocall$1"], "postprocess": d => d[0]},
    {"name": "Script$string$1", "symbols": [{"literal":"s"}, {"literal":"c"}, {"literal":"r"}, {"literal":"i"}, {"literal":"p"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Script$macrocall$2", "symbols": [{"literal":"("}, "_"]},
    {"name": "Script$macrocall$3$ebnf$1", "symbols": ["ParameterList"], "postprocess": id},
    {"name": "Script$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$macrocall$3", "symbols": ["Script$macrocall$3$ebnf$1"]},
    {"name": "Script$macrocall$4", "symbols": ["_", {"literal":")"}]},
    {"name": "Script$macrocall$1", "symbols": ["Script$macrocall$2", "Script$macrocall$3", "Script$macrocall$4"], "postprocess": d => d[1][0]},
    {"name": "Script$macrocall$6", "symbols": [{"literal":"{"}, "_"]},
    {"name": "Script$macrocall$7$ebnf$1", "symbols": ["StatementList"], "postprocess": id},
    {"name": "Script$macrocall$7$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$macrocall$7", "symbols": ["Script$macrocall$7$ebnf$1"]},
    {"name": "Script$macrocall$8", "symbols": ["_", {"literal":"}"}]},
    {"name": "Script$macrocall$5", "symbols": ["Script$macrocall$6", "Script$macrocall$7", "Script$macrocall$8"], "postprocess": d => d[1][0]},
    {"name": "Script", "symbols": ["Script$string$1", "__", "Identifier", "_", "Script$macrocall$1", "_", "Script$macrocall$5"], "postprocess": 
        function(d, location) {
          const [,,name,,parameters,,statements] = d;
          return {
            nodeType: "Script",
            type: "Module",
            location,
            props: { name, parameters, statements }
          };
        }
          },
    {"name": "ParameterList$macrocall$2", "symbols": ["Identifier"]},
    {"name": "ParameterList$macrocall$3", "symbols": ["_", {"literal":","}, "_"]},
    {"name": "ParameterList$macrocall$1$ebnf$1", "symbols": []},
    {"name": "ParameterList$macrocall$1$ebnf$1$subexpression$1", "symbols": ["ParameterList$macrocall$3", "ParameterList$macrocall$2"]},
    {"name": "ParameterList$macrocall$1$ebnf$1", "symbols": ["ParameterList$macrocall$1$ebnf$1", "ParameterList$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ParameterList$macrocall$1", "symbols": ["ParameterList$macrocall$2", "ParameterList$macrocall$1$ebnf$1"], "postprocess": d => [d[0][0], ...d[1].map(e => e[1][0])]},
    {"name": "ParameterList", "symbols": ["ParameterList$macrocall$1"], "postprocess": d => d[0]},
    {"name": "StatementList$macrocall$2", "symbols": ["Statement"]},
    {"name": "StatementList$macrocall$3", "symbols": ["_"]},
    {"name": "StatementList$macrocall$1$ebnf$1", "symbols": []},
    {"name": "StatementList$macrocall$1$ebnf$1$subexpression$1", "symbols": ["StatementList$macrocall$3", "StatementList$macrocall$2"]},
    {"name": "StatementList$macrocall$1$ebnf$1", "symbols": ["StatementList$macrocall$1$ebnf$1", "StatementList$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StatementList$macrocall$1", "symbols": ["StatementList$macrocall$2", "StatementList$macrocall$1$ebnf$1"], "postprocess": d => [d[0][0], ...d[1].map(e => e[1][0])]},
    {"name": "StatementList", "symbols": ["StatementList$macrocall$1"], "postprocess": d => d[0]},
    {"name": "Identifier$ebnf$1", "symbols": []},
    {"name": "Identifier$ebnf$1", "symbols": ["Identifier$ebnf$1", /[a-zA-Z_$0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Identifier", "symbols": [/[a-zA-Z_$]/, "Identifier$ebnf$1"], "postprocess": 
        function(d, location, reject) {
          const value = d[0] + d[1].join('');
        
          return keywords.includes(value) ? reject : {
            nodeType: "Identifier",
            type: "Identifier",
            location,
            props: { value  }
          };
        }
        },
    {"name": "Statement$subexpression$1", "symbols": ["AddSay"]},
    {"name": "Statement$subexpression$1", "symbols": ["Say"]},
    {"name": "Statement$subexpression$1", "symbols": ["Pause"]},
    {"name": "Statement$subexpression$1", "symbols": ["Show"]},
    {"name": "Statement$subexpression$1", "symbols": ["Hide"]},
    {"name": "Statement$subexpression$1", "symbols": ["Move"]},
    {"name": "Statement$subexpression$1", "symbols": ["JS"]},
    {"name": "Statement", "symbols": ["Statement$subexpression$1"], "postprocess": d => d[0]},
    {"name": "Pause$string$1", "symbols": [{"literal":"p"}, {"literal":"a"}, {"literal":"u"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Pause$ebnf$1", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "Pause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Pause", "symbols": ["Pause$string$1", "_", "Pause$ebnf$1"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Statement",
            type: "Pause",
            location,
            props: { }
          };
        }
        },
    {"name": "AddSay$string$1", "symbols": [{"literal":"a"}, {"literal":"d"}, {"literal":"d"}, {"literal":"s"}, {"literal":"a"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AddSay$ebnf$1", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "AddSay$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "AddSay", "symbols": ["AddSay$string$1", "__", "String", "_", "AddSay$ebnf$1"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Statement",
            type: "AddSay",
            location,
            props: { value: d[2] }
          };
        }
        },
    {"name": "Say$string$1", "symbols": [{"literal":"s"}, {"literal":"a"}, {"literal":"y"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Say$ebnf$1", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "Say$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Say", "symbols": ["Identifier", "__", "Say$string$1", "__", "String", "_", "Say$ebnf$1"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Statement",
            type: "Say",
            location,
            props: { whom: d[0], value: d[4] }
          };
        }
        },
    {"name": "Show$string$1", "symbols": [{"literal":"s"}, {"literal":"h"}, {"literal":"o"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Show$macrocall$2", "symbols": ["Modifier"]},
    {"name": "Show$macrocall$3", "symbols": ["_", {"literal":","}, "_"]},
    {"name": "Show$macrocall$1$ebnf$1", "symbols": []},
    {"name": "Show$macrocall$1$ebnf$1$subexpression$1", "symbols": ["Show$macrocall$3", "Show$macrocall$2"]},
    {"name": "Show$macrocall$1$ebnf$1", "symbols": ["Show$macrocall$1$ebnf$1", "Show$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Show$macrocall$1", "symbols": ["Show$macrocall$2", "Show$macrocall$1$ebnf$1"], "postprocess": d => [d[0][0], ...d[1].map(e => e[1][0])]},
    {"name": "Show$ebnf$1", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "Show$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Show", "symbols": ["Show$string$1", "__", "Identifier", "__", "Show$macrocall$1", "_", "Show$ebnf$1"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Statement",
            type: "Show",
            location,
            props: { whom: d[2], modifiers: d[4] }
          };
        }
        },
    {"name": "Move$string$1", "symbols": [{"literal":"m"}, {"literal":"o"}, {"literal":"v"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Move$macrocall$2", "symbols": ["Modifier"]},
    {"name": "Move$macrocall$3", "symbols": ["_", {"literal":","}, "_"]},
    {"name": "Move$macrocall$1$ebnf$1", "symbols": []},
    {"name": "Move$macrocall$1$ebnf$1$subexpression$1", "symbols": ["Move$macrocall$3", "Move$macrocall$2"]},
    {"name": "Move$macrocall$1$ebnf$1", "symbols": ["Move$macrocall$1$ebnf$1", "Move$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Move$macrocall$1", "symbols": ["Move$macrocall$2", "Move$macrocall$1$ebnf$1"], "postprocess": d => [d[0][0], ...d[1].map(e => e[1][0])]},
    {"name": "Move$ebnf$1", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "Move$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Move", "symbols": ["Move$string$1", "__", "Identifier", "__", "Move$macrocall$1", "_", "Move$ebnf$1"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Statement",
            type: "Move",
            location,
            props: { whom: d[2], modifiers: d[4] }
          };
        }
        },
    {"name": "Hide$string$1", "symbols": [{"literal":"h"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Hide$macrocall$2", "symbols": ["Modifier"]},
    {"name": "Hide$macrocall$3", "symbols": ["_", {"literal":","}, "_"]},
    {"name": "Hide$macrocall$1$ebnf$1", "symbols": []},
    {"name": "Hide$macrocall$1$ebnf$1$subexpression$1", "symbols": ["Hide$macrocall$3", "Hide$macrocall$2"]},
    {"name": "Hide$macrocall$1$ebnf$1", "symbols": ["Hide$macrocall$1$ebnf$1", "Hide$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Hide$macrocall$1", "symbols": ["Hide$macrocall$2", "Hide$macrocall$1$ebnf$1"], "postprocess": d => [d[0][0], ...d[1].map(e => e[1][0])]},
    {"name": "Hide$ebnf$1", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "Hide$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Hide", "symbols": ["Hide$string$1", "__", "Identifier", "__", "Hide$macrocall$1", "_", "Hide$ebnf$1"], "postprocess": 
        function(d, location) {
          return {
            nodeType: "Statement",
            type: "Hide",
            location,
            props: { whom: d[2], modifiers: d[4] }
          };
        }
        },
    {"name": "JS$macrocall$2$string$1", "symbols": [{"literal":"{"}, {"literal":"@"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "JS$macrocall$2", "symbols": ["JS$macrocall$2$string$1", "_"]},
    {"name": "JS$macrocall$3$ebnf$1", "symbols": []},
    {"name": "JS$macrocall$3$ebnf$1", "symbols": ["JS$macrocall$3$ebnf$1", "CodeCharacter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "JS$macrocall$3", "symbols": ["JS$macrocall$3$ebnf$1"]},
    {"name": "JS$macrocall$4$string$1", "symbols": [{"literal":"@"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "JS$macrocall$4", "symbols": ["_", "JS$macrocall$4$string$1"]},
    {"name": "JS$macrocall$1", "symbols": ["JS$macrocall$2", "JS$macrocall$3", "JS$macrocall$4"], "postprocess": d => d[1][0]},
    {"name": "JS", "symbols": ["JS$macrocall$1"], "postprocess": 
        function(d, location) {
          const code = d[0].join('');
          return {
            nodeType: "Statement",
            type: "JS",
            location,
            props: { code }
          };
        }
        },
    {"name": "CodeCharacter$string$1", "symbols": [{"literal":"@"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CodeCharacter", "symbols": ["CodeCharacter$string$1"], "postprocess": (d, l, reject) => reject},
    {"name": "CodeCharacter", "symbols": [/./], "postprocess": d => d[0]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\t\r\n ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [/[\t\r\n ]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\t\r\n ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "String$ebnf$1", "symbols": []},
    {"name": "String$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"\\"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "String$ebnf$1$subexpression$1", "symbols": ["String$ebnf$1$subexpression$1$string$1"]},
    {"name": "String$ebnf$1$subexpression$1", "symbols": [/[^`]/]},
    {"name": "String$ebnf$1", "symbols": ["String$ebnf$1", "String$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "String", "symbols": [{"literal":"`"}, "String$ebnf$1", {"literal":"`"}], "postprocess": 
        function(d, location) {
          const value = d[1].join('');
          return {
            nodeType: "Expression",
            type: "String",
            location,
            props: { value }
          };
        }
        },
    {"name": "Modifier$subexpression$1$string$1", "symbols": [{"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$1"]},
    {"name": "Modifier$subexpression$1$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"v"}, {"literal":"i"}, {"literal":"s"}, {"literal":"i"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$2"]},
    {"name": "Modifier$subexpression$1$string$3", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"g"}, {"literal":"e"}, {"literal":"L"}, {"literal":"e"}, {"literal":"f"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$3"]},
    {"name": "Modifier$subexpression$1$string$4", "symbols": [{"literal":"l"}, {"literal":"e"}, {"literal":"f"}, {"literal":"t"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$4"]},
    {"name": "Modifier$subexpression$1$string$5", "symbols": [{"literal":"l"}, {"literal":"e"}, {"literal":"f"}, {"literal":"t"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$5"]},
    {"name": "Modifier$subexpression$1$string$6", "symbols": [{"literal":"r"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$6"]},
    {"name": "Modifier$subexpression$1$string$7", "symbols": [{"literal":"r"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$7"]},
    {"name": "Modifier$subexpression$1$string$8", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"g"}, {"literal":"e"}, {"literal":"R"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$8"]},
    {"name": "Modifier$subexpression$1$string$9", "symbols": [{"literal":"v"}, {"literal":"i"}, {"literal":"s"}, {"literal":"i"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Modifier$subexpression$1", "symbols": ["Modifier$subexpression$1$string$9"]},
    {"name": "Modifier$subexpression$1", "symbols": ["Identifier"]},
    {"name": "Modifier", "symbols": ["Modifier$subexpression$1"], "postprocess": d => d[0]}
]
  , ParserStart: "Entry"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
