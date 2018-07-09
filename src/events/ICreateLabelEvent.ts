import { IWorkerEvent } from "./IWorkerEvent";
import { ILabelProps } from "../view/Label";
import { IHasParent } from "../util";

export interface ICreateLabelEvent extends IWorkerEvent {
  type: "create-label";
  props: ILabelProps & IHasParent;
};