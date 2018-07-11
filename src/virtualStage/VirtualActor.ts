import { ISpriteMoveEvent } from "../events/ISpriteMoveEvent";
import { ISpriteRemoveEvent } from "../events/ISpriteRemoveEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import * as m from "../matrix";
import { compareProps } from "../util";

export interface IVirtualActor {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  centerX: number;
  centerY: number;
  alpha: number;
  z: number;
  ease: string;
  timespan: number;
  wait: number;
  parent: string;
}

const actorProps = [
  "x",
  "y",
  "rotation",
  "scaleX",
  "scaleY",
  "centerX",
  "centerY",
  "alpha",
  "z",
  "ease",
  "timespan",
  "wait",
];

export function compareActors(before: IVirtualActor, after: IVirtualActor, events: IWorkerEvent[]): void {
  if (before && after && compareProps(before, after, actorProps)) {
    events.push(
      {
        props: {
          alpha: after.alpha,
          ease: after.ease,
          id: after.id,
          position: createPosition(after),
          timespan: after.timespan,
          wait: after.wait,
          z: after.z,
        },
        type: "sprite-move",
      } as ISpriteMoveEvent,
    );
  }

  if (before && !after) {
    events.push(
      {
        props: {
          id: before.id,
        },
        type: "sprite-remove",
      } as ISpriteRemoveEvent,
    );
  }
}

export function createPosition(actor: IVirtualActor): number[] | Float64Array {
  return m.chain()
  .translate(actor.x, actor.y)
  .scale(actor.scaleX, actor.scaleY)
  .rotate(actor.rotation)
  .translate(-actor.centerX, -actor.centerY)
  .value;
}
