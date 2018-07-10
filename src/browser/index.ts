import config from "../../application.config";
import { ICreateButtonEvent } from "../events/ICreateButtonEvent";
import { ICreateCloseEvent } from "../events/ICreateCloseEvent";
import { ILoadFontsEvent } from "../events/ILoadFontsEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IStageManagerProps, StageManager } from "./StageManager";

const props: IStageManagerProps = {
  audioContext: new AudioContext(),
  height: config.window.height,
  selector: "body",
  width: config.window.width,
};

const sm = new StageManager(props);
const worker = new Worker("../worker/index.ts");

worker.addEventListener("message",
  (e) => sm.handle(e.data as IWorkerEvent),
);

function frame() {
  requestAnimationFrame(frame);
  sm.update()
    .render();
}

requestAnimationFrame(frame);

function startup(): Promise<void[]> {
  return Promise.all([
    sm.handle({
      props: {},
      type: "error",
    }),

    sm.handle({
      props: {},
      type: "load-fonts",
    } as ILoadFontsEvent),

    sm.handle({
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
    } as ICreateCloseEvent),

    sm.handle({
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
    } as ICreateButtonEvent),
  ]);
}

startup().then(x => console.log("Done!"));
