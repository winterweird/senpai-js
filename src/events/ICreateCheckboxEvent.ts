import { IWorkerEvent } from "./IWorkerEvent";
import { ILoadCheckboxProps } from "../view/Checkbox";
import { IHasParent } from "../util";

export interface ICreateCheckboxEvent extends IWorkerEvent {
  type: "create-checkbox";
  props: ILoadCheckboxProps & IHasParent;
}
