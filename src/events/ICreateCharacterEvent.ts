import { IWorkerEvent } from "./IWorkerEvent";
import { ILoadCharacterProps } from "../view/Character";
import { IHasParent } from "../util";

export interface ICreateCharacterEvent extends IWorkerEvent {
  type: "create-character";
  props: ILoadCharacterProps & IHasParent;
}
