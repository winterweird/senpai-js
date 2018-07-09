import { IWorkerEvent } from "./IWorkerEvent";
import { ILoadCloseProps } from "../view/Close";
import { IHasParent } from "../util";

export interface ICreateCloseEvent extends IWorkerEvent {
  type: "create-close";
  props: ILoadCloseProps & IHasParent;
}
