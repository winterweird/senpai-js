import { IHasParent } from "../util";
import { ILoadButtonProps } from "../view/Button";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateButtonEvent extends IWorkerEvent {
  type: "create-button";
  props: ILoadButtonProps & IHasParent;
}
