import config from "../../application.config";
import { IPointClickEvent } from "../events/IPointClickEvent";
import { IPointMoveEvent } from "../events/IPointMoveEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IInteractionPoint } from "../util";
import { ISprite } from "../view/Sprite";
import { IStageManagerProps, StageManager } from "./StageManager";

const props: IStageManagerProps = {
  audioContext: new AudioContext(),
  height: config.window.height,
  selector: "body",
  width: config.window.width,
};

const sm = new StageManager(props);
const worker = new Worker("../worker/index.js");

worker.addEventListener("message",
  (e) => sm.handle(e.data as IWorkerEvent),
);

sm.on("point-move", (target: ISprite, point: IInteractionPoint) => {
  const id: string = target ? target.id : null;
  worker.postMessage({
    props: {
      id,
      pointID: point.id,
      tx: point.tx,
      ty: point.ty,
      x: point.x,
      y: point.y,
    },
    type: "point-move",
  } as IPointMoveEvent);
});

sm.on("click", (target: ISprite, point: IInteractionPoint) => {
  const id: string = target ? target.id : null;
  worker.postMessage({
    props: {
      id,
      pointID: point.id,
      tx: point.tx,
      ty: point.ty,
      x: point.x,
      y: point.y,
    },
    type: "point-click",
  } as IPointClickEvent);
});

function frame() {
  requestAnimationFrame(frame);
  sm.update()
    .render();
}

requestAnimationFrame(frame);
