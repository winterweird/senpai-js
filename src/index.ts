import { Stage, IStageProps } from "./view/Stage";
import { loadCheckbox, ICheckbox } from "./view/Checkbox";
import * as m from "./matrix";
import { easeInSin } from "./ease";
import config from "../application.config";


const props: IStageProps = {
  width: config.window.width,
  height: config.window.height,
  selector: "body",
  audioContext: new AudioContext,
};
const stage = new Stage(props);

(async function() {
  const test = await loadCheckbox(
    "test",
    require("../assets/checkbox/spritesheet.png"),
    require("../assets/checkbox/index.json"),
  );
  const position = new m.Matrix();
  position
    .translate(100, 100)
    .scale(2, 2)
    .rotate(Math.PI * 0.5);
  test
    .move(position.value)
    .over(10000, easeInSin);
  test.text = "Hello World!";
  test.font = config.ui.font;
  test.fontColor = config.ui.fontColor;
  stage.addSprite(test);
}());

function frame() {
  requestAnimationFrame(frame);
  stage
    .update()
    .render();
}

requestAnimationFrame(frame);
