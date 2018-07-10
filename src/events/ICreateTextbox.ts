import { IHasParent } from "../util";
import { ILoadTextboxProps } from "../view/Textbox";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateTextboxEvent extends IWorkerEvent {
  type: "create-textbox";
  props: ILoadTextboxProps & IHasParent;
}
