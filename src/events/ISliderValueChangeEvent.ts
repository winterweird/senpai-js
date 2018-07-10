import { IWorkerEvent } from "./IWorkerEvent";

export interface ISliderValueChangeEvent extends IWorkerEvent {
  type: "slider-value-change";
  props: {
    id: string;
    min: number;
    max: number;
    value: number;
    width: number;
  };
}
