/* tslint:disable:no-console */

import { IStageManagerProps, StageManager } from "./StageManager";

import config from "../../application.config";
import { IWorkerEvent } from "../events/IWorkerEvent";

const props: IStageManagerProps = {
  audioContext: new AudioContext(),
  height: config.window.height,
  selector: "body",
  width: config.window.width,
};

const sm = new StageManager(props);
const worker = new Worker("../worker/index.ts");

worker.addEventListener("message",
  (e) => sm.handle(e.data as IWorkerEvent)
    .then(
      (callback) => console.log("handled", e.data),
    )
    .catch(
      (error) => console.log("Error handling", e.data, error),
    ),
);

function frame() {
  requestAnimationFrame(frame);
  sm.update()
    .render();
}

requestAnimationFrame(frame);
