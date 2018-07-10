/* tslint:disable:no-console */

import { IStageManagerProps, StageManager } from "./StageManager";

import config from "../../application.config";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { ICreateCloseEvent } from "../events/ICreateCloseEvent";
import { ICreateButtonEvent } from "../events/ICreateButtonEvent";
import { ILoadFontsEvent } from "../events/ILoadFontsEvent";
import { EDEADLK } from "constants";

const props: IStageManagerProps = {
  audioContext: new AudioContext(),
  height: config.window.height,
  selector: "body",
  width: config.window.width,
};

const sm = new StageManager(props);
const worker = new Worker("../worker/index.ts");

let handling: Promise<void> = Promise.resolve();

worker.addEventListener("message",
  (e) => handling = handling
    .then(() => sm.handle(e.data as IWorkerEvent))
    .catch((error) => console.log("error", error, e.data)),
);

function frame() {
  requestAnimationFrame(frame);
  sm.update()
    .render();
}

requestAnimationFrame(frame);

async function startup() {
  await sm.handle({
    props: {},
    type: "load-fonts",
  } as ILoadFontsEvent);

  await sm.handle({
    props: {
      alpha: 1,
      definition: null,
      id: "close",
      parent: null,
      position: [1, 0, 0, 1, 100, 100],
      src: null,
      textures: null,
      z: 0,
    },
    type: "create-close",
  } as ICreateCloseEvent);

  await sm.handle({
    props: {
      alpha: 1,
      definition: null,
      font: "Puritain-Bold",
      fontColor: "black",
      fontSize: 16,
      id: "button",
      parent: null,
      position: [1, 0, 0, 1, 100, 200],
      selected: false,
      src: null,
      text: "test",
      textures: null,
      z: 1,
    },
    type: "create-button",
  } as ICreateButtonEvent);
}

startup().then(x => console.log("Done!"));
