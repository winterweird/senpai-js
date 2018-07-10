import { IHasParent } from "../util";
import { ILoadCharacterProps } from "../view/Character";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateCharacterEvent extends IWorkerEvent {
  type: "create-character";
  props: ILoadCharacterProps & IHasParent;
}
