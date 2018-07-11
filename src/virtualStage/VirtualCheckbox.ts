import { ICheckboxCheckedEvent } from "../events/ICheckboxCheckedEvent";
import { ICreateCheckboxEvent } from "../events/ICreateCheckboxEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareText, IText } from "./Text";
import { compareActors, createPosition, IVirtualActor } from "./VirtualActor";

export interface IVirtualCheckbox extends IVirtualActor, IText {
  type: "checkbox";
  checked: boolean;
}

export function compareCheckboxes(before: IVirtualCheckbox, after: IVirtualCheckbox, events: IWorkerEvent[]): void {

  // character creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        checked: after.checked,
        definition: null,
        font: after.font,
        fontColor: after.fontColor,
        fontSize: after.fontSize,
        id: after.id,
        parent: after.parent,
        position: createPosition(after),
        src: null,
        text: after.text,
        textures: null,
        z: after.z,
      },
      type: "create-checkbox",
    } as ICreateCheckboxEvent);
  }

  compareText(before, after, events);

  // character mood change
  if (before && after && before.checked !== after.checked) {
    events.push({
      props: {
        checked: after.checked,
        id: after.id,
      },
      type: "checkbox-checked",
    } as ICheckboxCheckedEvent);
  }

  // character move
  return compareActors(before, after, events);
}
