import { Stage, IStageProps } from "./view/Stage";
import * as m from "./matrix";
import config from "../application.config";

import { loadButton } from "./view/Button";

import { loadFonts } from "./view/fonts";
import { loadPanel } from "./view/Panel";
const fonts = require("../assets/fonts/*.otf");

const props: IStageProps = {
  width: config.window.width,
  height: config.window.height,
  selector: "body",
  audioContext: new AudioContext,
};
const stage = new Stage(props);

(async function() {
  await loadFonts(fonts);
  const b = await loadButton({
    src: require("../assets/button/spritesheet.png"),
    definition: require("../assets/button/index.json"),
    id: "off-panel",
    position: m.chain().translate(50, 100).value,
    z: 3,
  });
  const b2 = await loadButton({
    src: require("../assets/button/spritesheet.png"),
    definition: require("../assets/button/index.json"),
    id: "on-panel",
    position: m.Identity,
    z: 1
  });
  const p = await loadPanel({
    src: require("../assets/panel/spritesheet.png"),
    definition: require("../assets/panel/index.json"),
    id: "panel",
    position: m.chain().translate(100, 100).value,
    z: 4
  });
  
  b.on("click", e => console.log("b was clicked"));
  b2.on("click", e => console.log("b2 was clicked"));

  p.addSprite(b2);
  stage
    .addSprite(b)
    .addSprite(p);
}());

function frame() {
  requestAnimationFrame(frame);
  stage
    .update()
    .render();
}

requestAnimationFrame(frame);
