import { ITextChangeEvent } from "../events/ITextChangeEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareProps, TextAlign, TextBaseline } from "../util";

export interface IText {
  id: string;
  font: string;
  fontColor: string;
  fontSize: number;
  text: string;
  textAlign: TextAlign;
  textBaseline: TextBaseline;
}

export const textProps = [
  "font",
  "fontColor",
  "fontSize",
  "text",
  "textAlign",
  "textBaseline",
];

export function compareText(before: IText, after: IText, events: IWorkerEvent[]) {
  if (before && after && compareProps(before, after, textProps)) {
    events.push({
      props: {
        font: after.font,
        fontColor: after.fontColor,
        fontSize: after.fontSize,
        id: after.id,
        text: after.text,
        textAlign: after.textAlign,
        textBaseline: after.textBaseline,
      },
      type: "text-change",
    } as ITextChangeEvent);
  }
}
