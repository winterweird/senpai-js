import { StageManager, IStageManagerProps } from "./StageManager";

import config from "../../application.config";

const props: IStageManagerProps = {
  audioContext: new AudioContext,
  width: config.window.height,
  height: config.window.height,
  selector: "body",
};

const sm = new StageManager(props);
const worker = new Worker("../worker/index.ts");

worker.addEventListener("message",
  e => sm.handle(e.data)
    .then(callback => console.log("handled", e.data))
    .catch(error => console.log("Error handling", e.data, error))
);

function frame() {
  requestAnimationFrame(frame);
  sm.update().render();
}

requestAnimationFrame(frame);