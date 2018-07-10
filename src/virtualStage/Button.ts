import { IButtonSelectedEvent } from "../events/IButtonSelected";
import { ICreateButtonEvent } from "../events/ICreateButtonEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareActors, createPosition, IActor } from "./Actor";
import { compareText, IText } from "./Text";

export interface IButton extends IActor, IText {
  type: "button";
  selected: boolean;
}

export function compareButtons(before: IButton, after: IButton, events: IWorkerEvent[]): void {

  // button creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        definition: null,
        font: after.font,
        fontColor: after.fontColor,
        fontSize: after.fontSize,
        id: after.id,
        parent: after.parent,
        position: createPosition(after),
        selected: after.selected,
        src: null,
        text: after.text,
        textAlign: after.textAlign,
        textBaseline: after.textBaseline,
        textures: null,
        z: after.z,
      },
      type: "create-button",
    } as ICreateButtonEvent);
  }

  compareText(before, after, events);

  // button selected change
  if (before && after && before.selected !== after.selected) {
    events.push({
      props: {
        id: after.id,
        selected: after.selected,
      },
      type: "button-selected",
    } as IButtonSelectedEvent);
  }

  // button move
  return compareActors(before, after, events);
}
