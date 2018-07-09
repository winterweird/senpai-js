import { IWorkerEvent } from "./IWorkerEvent";
import { IHasParent } from "../util";
import { ILoadSliderProps } from "../view/Slider";

export interface ICreateSliderEvent extends IWorkerEvent {
  type: "create-slider";
  props: ILoadSliderProps & IHasParent;
}
