import { IWorkerEvent } from "./IWorkerEvent";

export interface ITextureChangeEvent extends IWorkerEvent {
  type: "texture-change";
  props: {
    id: string;
    texture: string;
  };
}
