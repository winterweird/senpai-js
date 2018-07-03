import { Stage, IStageProps } from "./view/Stage";
import { loadCharacter, Character, ICharacter } from "./view/Character";
import * as ease from "./ease/index";
const config = require("../application.config");

const props: IStageProps = {
  width: config.window.width,
  height: config.window.height,
  selector: "body"
};
const stage = new Stage(props);
let Aya: ICharacter;

loadCharacter("aya").then(a => {
  Aya = a;
  stage.addSprite(Aya);
  Aya.move([1, 0, 0, 1, 100, 100, 1, 0]);
  Aya.ease = ease.easeInCub;
  Aya.animationLength = 2000;
  Aya.animationStart = Date.now();
  Aya.once("click", e => {
    Aya.setMood("Grin");
    Aya.animationStart = Date.now();
    Aya.move([0.5, 0, 0, 0.5, 50, 50, 0.75, 1]);
  });
});

function frame() {
  requestAnimationFrame(frame);
  stage
    .update()
    .render();
}

requestAnimationFrame(frame);
