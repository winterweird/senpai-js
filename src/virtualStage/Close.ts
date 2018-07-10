import { ICreateCloseEvent } from "../events/ICreateCloseEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareActors, createPosition, IActor } from "./Actor";

export interface IClose extends IActor {
  type: "close";
  selected: boolean;
}

export function compareClose(before: IClose, after: IClose, events: IWorkerEvent[]): void {

  // character creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        definition: null,
        id: after.id,
        parent: after.parent,
        position: createPosition(after),
        src: null,
        textures: null,
        z: after.z,
      },
      type: "create-close",
    } as ICreateCloseEvent);
  }

  // close move
  return compareActors(before, after, events);
}
