import { IWorkerEvent } from "./IWorkerEvent";
import { IHasParent } from "../util";
import { ILoadSpriteProps } from "../view/Sprite";

interface IHasName {
  name: string;
}

export interface ICreateSpriteEvent extends IWorkerEvent {
  type: "create-sprite";
  props: ILoadSpriteProps & IHasParent & IHasName;
};