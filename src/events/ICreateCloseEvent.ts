import { IHasParent } from "../util";
import { ILoadCloseProps } from "../view/Close";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateCloseEvent extends IWorkerEvent {
  type: "create-close";
  props: ILoadCloseProps & IHasParent;
}
