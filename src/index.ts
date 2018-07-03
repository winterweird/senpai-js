import { Stage, IStageProps } from "./view/Stage";
import { loadCheckbox, ICheckbox } from "./view/Checkbox";
import * as Matrix from "./matrix/index";
import { easeInSin } from "./ease";

const config = require("../application.config");

const props: IStageProps = {
  width: config.window.width,
  height: config.window.height,
  selector: "body"
};
const stage = new Stage(props);

loadCheckbox("test").then((test: ICheckbox) => {
  const position = new Float64Array(6);
  Matrix.set(position, Matrix.Identity);
  Matrix.translate(100, 100, position, position);
  Matrix.scale(2, 2, position, position);
  Matrix.rotate(Math.PI * 0.5, position, position);
  test
    .move(position)
    .over(10000);
  test.ease = easeInSin;
  test.text = "Hello World!";
  test.font = config.ui.font;
  test.fontColor = config.ui.fontColor;
  stage.addSprite(test);
});


function frame() {
  requestAnimationFrame(frame);
  stage
    .update()
    .render();
}

requestAnimationFrame(frame);
