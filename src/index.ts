import { Stage, IStageProps } from "./view/Stage";
import * as m from "./matrix";
import config from "../application.config";
import { loadSlider } from "./view/Slider";
import { loadButton } from "./view/Button";
import { loadCheckbox } from "./view/Checkbox";
import { loadFonts } from "./view/fonts";
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

  const slider = await loadSlider(
    "test",
    require("../assets/slider/spritesheet.png"),
    require("../assets/slider/index.json"),
  );

  slider.position[6] = 1;
  m.chain(slider.position)
    .translate(100, 100)
    .set(slider.previousPosition);
  slider.max = 1;
  slider.min = 0;
  slider.width = 100;

  const button = await loadButton(
    "test-button",
    require("../assets/button/spritesheet.png"),
    require("../assets/button/index.json"),
  );
  button.position[6] = 1;
  m.chain(button.position)
    .translate(100, 200)
    .set(button.previousPosition);
  button.on("click", e => button.selected = !button.selected);
  button.text = "testing";
  button.fontColor = "green";
  button.font = "Puritain-Bold";

  const cb = await loadCheckbox(
    "text-cb",
    require("../assets/checkbox/spritesheet.png"),
    require("../assets/checkbox/index.json"),
  );
  cb.position[6] =1;
  m.chain(cb.position)
    .translate(100, 300)
    .set(cb.previousPosition);

  stage.addSprite(button);
  stage.addSprite(slider);
  stage.addSprite(cb);
}());

function frame() {
  requestAnimationFrame(frame);
  stage
    .update()
    .render();
}

requestAnimationFrame(frame);
