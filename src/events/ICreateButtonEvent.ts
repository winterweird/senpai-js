import { IWorkerEvent } from "./IWorkerEvent";
import { ILoadButtonProps } from "../view/Button";
import { IHasParent } from "../util";

export interface ICreateButtonEvent extends IWorkerEvent {
  type: "create-button";
  props: ILoadButtonProps & IHasParent;
}
