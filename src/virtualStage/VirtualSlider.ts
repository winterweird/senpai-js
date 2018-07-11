import { ICreateSliderEvent } from "../events/ICreateSliderEvent";
import { ISliderValueChangeEvent } from "../events/ISliderValueChangeEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareProps } from "../util";
import { compareActors, createPosition, IVirtualActor } from "./VirtualActor";

export interface IVirtualSlider extends IVirtualActor {
  type: "slider";
  value: number;
  max: number;
  min: number;
  width: number;
}

const sliderProps = [
  "max",
  "min",
  "value",
  "width",
];

export function compareSliders(before: IVirtualSlider, after: IVirtualSlider, events: IWorkerEvent[]): void {

  // character creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        definition: null,
        id: after.id,
        max: after.max,
        min: after.min,
        parent: after.parent,
        position: createPosition(after),
        src: null,
        textures: null,
        value: after.value,
        width: after.width,
        z: after.z,
      },
      type: "create-slider",
    } as ICreateSliderEvent);
  }

  // character mood change
  if (before && after && compareProps(before, after, sliderProps)) {
    events.push({
      props: {
        id: after.id,
        max: after.max,
        min: after.min,
        value: after.value,
        width: after.width,
      },
      type: "slider-value-change",
    } as ISliderValueChangeEvent);
  }

  // slider move
  return compareActors(before, after, events);
}
