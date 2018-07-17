const arrayify = obj => `[${
  obj.map(stringify).join(",")
},],`;

const stringify = obj => {
  const records = [];
  if (typeof obj === "number") {
    return obj;
  }

  if (typeof obj === "string") {
    return `\`${obj}\``;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      records.push(`[\`${key}\`]:\`${value}\`,`);
      continue;
    }
    if (typeof value === "number") {
      records.push(`[\`${key}\`]:${value},`);
      continue;
    }
    if (Array.isArray(value)) {
      records.push(
        `[\`${key}\`]:${arrayify(value)}`
      )
      continue;
    }
    if (typeof value === "object") {
      records.push(
        `[\`${key}\`]:` + stringify(value) + ","
      )
      continue;
    }
  }
  return "{" + records.join("") + "}";
}
module.exports = function(node, children, doc) {
  const docData = stringify(doc);
  switch (true) {
    case !!doc.button:
      return `await sm.createButton(${docData});`;
    case !!doc.character:
      return `await sm.createCharacter(${docData});`;
    case !!doc.checkbox:
      return `await sm.createCheckbox(${docData});`;
    case !!doc.choice:
      const choiceData = `{ ${Object.entries(doc).map(([key, value]) => `[\`${key}\`]: \`${value}\`` ).join(", ")} }`;
      return `yield sm.choices(\`${doc.choice}\`, ${choiceData});`;
    case !!doc.close:
      return `await sm.createClose(${docData});`;
    case !!doc.hide:
      return `sm.hide(\`${doc.hide}\`);`;
    case !!doc.label:
      return `await sm.createLabel(${docData});`;
    case !!doc.move:
      return `sm.move(\`${doc.move}\`, ${docData})`
    case !!doc.panel:
      return `await sm.createPanel(${docData});`;
    case !!doc.show:
      return `sm.show(\`${doc.show}\`, ${docData});`;
    case !!doc.slider:
      return `await sm.createSlider(${docData});`;
    case !!doc.sound:
      return `await sm.createSoundSprite(${docData});`;
    case !!doc.textbox:
      return `await sm.createTextbox(${docData});`;
    default:
      throw new Error("Invalid YAML directive at " + String(node) + ".");
  }
};