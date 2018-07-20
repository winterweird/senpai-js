import register from "babel-core/register";
import polyfill from "babel-polyfill";
import regeneratorRuntime from "regenerator-runtime";
import config from "../application.config";
import { IStageManager, IStageManagerProps, StageManager } from "./manager/StageManager";
import * as m from "./matrix";
console.log(register, polyfill, regeneratorRuntime);

const props: IStageManagerProps = {
  audioContext: new AudioContext(),
  canvas: document.querySelector("canvas"),
  height: config.window.height,
  width: config.window.width,
};

const sm: IStageManager = new StageManager(props);

function frame() {
  requestAnimationFrame(frame);
  sm.update()
    .render();
}

requestAnimationFrame(frame);

(async function() {
  await sm.loadFonts();
  const button = await sm.createButton({
    id: "btn",
    text: "Click Me!",
    font: "Puritain-Bold",
    fontSize: 16,
    fontColor: "black",
    position: [1, 0, 0, 1, 100, 100],
  });
  sm.addSprite(button);
}());