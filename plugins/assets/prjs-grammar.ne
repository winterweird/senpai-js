@preprocessor typescript
@{%
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
    "left2",
    "left3",
    "right2",
    "right3" ,
    "stageRight",
    "visible",
    "right",
    "top",
    "left",
  ]
%}


List[Of, Seperator] -> $Of ($Seperator $Of):* {% d => [d[0][0], ...d[1].map(e => e[1][0])] %}
Terminated[Of, Terminator] -> $Of $Terminated {% d => d[0][0] %}
Prepended[Prepend, Of] -> $Prepend $Of {% d => d[1][0] %}
Wrapped[Before, Of, After] -> $Before $Of $After {% d => d[1][0] %}

Entry -> _ ModuleList _ {%
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
%}

ModuleList -> List[Script, _] {% d => d[0] %}

Script -> "script" __ Identifier
  _ Wrapped["(" _, ParameterList:?, _ ")"]
  _ Wrapped["{" _, StatementList:?, _ "}"]
  {%
    function(d, location) {
      const [,,name,,parameters,,statements] = d;
      return {
        nodeType: "Script",
        type: "Module",
        location,
        props: { name, parameters, statements }
      };
    }
  %}

ParameterList -> List[Identifier, _ "," _] {% d => d[0] %}
StatementList -> List[Statement, _] {% d => d[0] %}

Identifier -> [a-zA-Z_$] [a-zA-Z_$0-9]:* {%
  function(d, location, reject) {
    const value = d[0] + d[1].join('');

    return keywords.includes(value) ? reject : {
      nodeType: "Identifier",
      type: "Identifier",
      location,
      props: { value  }
    };
  }
%}

Statement -> (AddSay | Say | Pause | Show | Hide | Move | JS) {% d => d[0] %}

Pause -> "pause" _ ";":? {%
  function(d, location) {
    return {
      nodeType: "Statement",
      type: "Pause",
      location,
      props: { }
    };
  }
%}

AddSay -> "addsay" __ String _ ";":? {%
  function(d, location) {
    return {
      nodeType: "Statement",
      type: "AddSay",
      location,
      props: { value: d[2] }
    };
  }
%}

Say -> Identifier __ "says" __ String _ ";":? {%
  function(d, location) {
    return {
      nodeType: "Statement",
      type: "Say",
      location,
      props: { whom: d[0], value: d[4] }
    };
  }
%}

Show -> "show" __ Identifier __ List[Modifier, _ "," _] _ ";":? {%
  function(d, location) {
    return {
      nodeType: "Statement",
      type: "Show",
      location,
      props: { whom: d[2], modifiers: d[4] }
    };
  }
%}

Move -> "move" __ Identifier __ List[Modifier, _ "," _] _ ";":? {%
  function(d, location) {
    return {
      nodeType: "Statement",
      type: "Move",
      location,
      props: { whom: d[2], modifiers: d[4] }
    };
  }
%}

Hide -> "hide" __ Identifier __ List[Modifier, _ "," _] _ ";":? {%
  function(d, location) {
    return {
      nodeType: "Statement",
      type: "Hide",
      location,
      props: { whom: d[2], modifiers: d[4] }
    };
  }
%}

JS -> Wrapped["{@" _, CodeCharacter:*,_ "@}"] {%
  function(d, location) {
    const code = d[0].join('');
    return {
      nodeType: "Statement",
      type: "JS",
      location,
      props: { code }
    };
  }
%}

CodeCharacter -> "@}" {% (d, l, reject) => reject %}
               | . {% d => d[0] %}

_ -> [\t\r\n ]:*
__ -> [\t\r\n ]:+

String -> "`" ("\\`" | [^`]):* "`" {%
  function(d, location) {
    const value = d[1].join('');
    return {
      nodeType: "Expression",
      type: "String",
      location,
      props: { value }
    };
  }
%}

Modifier -> ("center" | "invisible" | "stageLeft"
          | "left2" | "left3" | "right2"
			    | "right3" | "stageRight" | "visible"
			    | "top" | "right" | "left"
          | Identifier ) {% d => d[0] %}
