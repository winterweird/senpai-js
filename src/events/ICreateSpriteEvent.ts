import { IHasParent } from "../util";
import { ILoadSpriteProps } from "../view/Sprite";
import { IWorkerEvent } from "./IWorkerEvent";

interface IHasName {
  name: string;
}

export interface ICreateSpriteEvent extends IWorkerEvent {
  type: "create-sprite";
  props: ILoadSpriteProps & IHasParent & IHasName;
}
