import { IWorkerEvent } from "./IWorkerEvent";
import { IHasParent } from "../util";
import { ILoadTextboxProps } from "../view/Textbox";

export interface ICreateTextboxEvent extends IWorkerEvent {
  type: "create-textbox";
  props: ILoadTextboxProps & IHasParent;
}
