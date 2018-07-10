import { IHasParent } from "../util";
import { ILoadSliderProps } from "../view/Slider";
import { IWorkerEvent } from "./IWorkerEvent";

export interface ICreateSliderEvent extends IWorkerEvent {
  type: "create-slider";
  props: ILoadSliderProps & IHasParent;
}
