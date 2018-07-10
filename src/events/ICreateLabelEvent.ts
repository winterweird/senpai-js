import { IHasParent } from "../util";
import { ILabelProps } from "../view/Label";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateLabelEvent extends IWorkerEvent {
  type: "create-label";
  props: ILabelProps & IHasParent;
}
