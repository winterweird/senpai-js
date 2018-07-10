import { IHasParent } from "../util";
import { ILoadPanelProps } from "../view/Panel";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreatePanelEvent extends IWorkerEvent {
  type: "create-panel";
  props: ILoadPanelProps & IHasParent;
}
