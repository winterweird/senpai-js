import { ICreateLabelEvent } from "../events/ICreateLabelEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareText, IText } from "./Text";
import { compareActors, createPosition, IVirtualActor } from "./VirtualActor";

export interface IVirtualLabel extends IVirtualActor, IText {
  type: "label";
}

export function compareLabels(before: IVirtualLabel, after: IVirtualLabel, events: IWorkerEvent[]): void {

  // label creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        font: after.font,
        fontColor: after.fontColor,
        fontSize: after.fontSize,
        id: after.id,
        parent: after.parent,
        position: createPosition(after),
        text: after.text,
        textures: null,
        z: after.z,
      },
      type: "create-label",
    } as ICreateLabelEvent);
  }

  compareText(before, after, events);

  // label move
  return compareActors(before, after, events);
}
