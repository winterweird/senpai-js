import { IWorkerEvent } from "./IWorkerEvent";
import { ILoadSoundSpriteProps } from "../view/SoundSprite";

export interface ICreateSoundSpriteEvent extends IWorkerEvent {
  type: "create-sound-sprite";
  props: ILoadSoundSpriteProps;
}
