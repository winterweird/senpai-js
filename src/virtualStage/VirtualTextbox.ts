import { ICreateTextboxEvent } from "../events/ICreateTextbox";
import { ITextboxChangeEvent } from "../events/ITextboxChangeEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareProps, IPadding } from "../util";
import { compareText, IText } from "./Text";
import { compareActors, createPosition, IVirtualActor } from "./VirtualActor";

export interface IVirtualTextbox extends IVirtualActor, IText {
  type: "textbox";
  textSpeed: number;
  padding: IPadding;
  lineHeight: number;
}

const textboxProps = [
  "lineHeight",
  ["padding", "bottom"],
  ["padding", "left"],
  ["padding", "right"],
  ["padding", "top"],
  "textSpeed",
];

export function compareTextboxes(before: IVirtualTextbox, after: IVirtualTextbox, events: IWorkerEvent[]): void {

  // textbox creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        definition: null,
        font: after.font,
        fontColor: after.fontColor,
        fontSize: after.fontSize,
        id: after.id,
        lineHeight: after.lineHeight,
        padding: after.padding,
        parent: after.parent,
        position: createPosition(after),
        src: null,
        text: after.text,
        textAlign: after.textAlign,
        textBaseline: after.textBaseline,
        textIndex: null,
        textSpeed: after.textSpeed,
        textures: null,
        z: after.z,
      },
      type: "create-textbox",
    } as ICreateTextboxEvent);
  }

  compareText(before, after, events);

  // button selected change
  if (before && after && compareProps(before, after, textboxProps)) {
    events.push({
      props: {
        id: after.id,
        lineHeight: after.lineHeight,
        padding: after.padding,
        textSpeed: after.textSpeed,
      },
      type: "textbox-change",
    } as ITextboxChangeEvent);
  }

  // button move
  return compareActors(before, after, events);
}
