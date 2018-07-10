import { IHasParent } from "../util";
import { ILoadCheckboxProps } from "../view/Checkbox";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateCheckboxEvent extends IWorkerEvent {
  type: "create-checkbox";
  props: ILoadCheckboxProps & IHasParent;
}
