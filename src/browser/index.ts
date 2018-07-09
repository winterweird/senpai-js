import { StageManager, IStageManagerProps } from "./StageManager";

import config from "../../application.config";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IBatchEvent } from "../events/IBatchEvent";
import { ICreateCharacterEvent } from "../events/ICreateCharacterEvent";

const props: IStageManagerProps = {
  audioContext: new AudioContext,
  width: config.window.height,
  height: config.window.height,
  selector: "body",
};

const sm = new StageManager(props);
const worker = new Worker("../worker/index.ts");

async function handleEvent(event:  IWorkerEvent) {
  const { type } = event;

  if (type === "batch") {
    const { props } = event as IBatchEvent;
    for (let i = 0; i < props.events.length; i++) {
      await handleEvent(props.events[i]);
    }
    return;
  }


}

worker.addEventListener("message", e => handleEvent(e.data));

function frame() {
  requestAnimationFrame(frame);
  sm.update().render();
}

requestAnimationFrame(frame);