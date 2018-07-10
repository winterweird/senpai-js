import { ILoadSoundSpriteProps } from "../view/SoundSprite";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateSoundSpriteEvent extends IWorkerEvent {
  type: "create-sound-sprite";
  props: ILoadSoundSpriteProps;
}
