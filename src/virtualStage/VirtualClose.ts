import { ICreateCloseEvent } from "../events/ICreateCloseEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareActors, createPosition, IVirtualActor } from "./VirtualActor";

export interface IVirtualClose extends IVirtualActor {
  type: "close";
}

export function compareClose(before: IVirtualClose, after: IVirtualClose, events: IWorkerEvent[]): void {

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
