import { IWorkerEvent } from "./IWorkerEvent";
import { ILoadPanelProps } from "../view/Panel";
import { IHasParent } from "../util";

export interface ICreatePanelEvent extends IWorkerEvent {
  type: "create-character";
  props: ILoadPanelProps & IHasParent;
}
