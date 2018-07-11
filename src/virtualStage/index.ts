import { EventEmitter } from "events";
import find from "lodash.find";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IVirtualActor } from "./VirtualActor";
import { compareButtons, IVirtualButton } from "./VirtualButton";
import { compareCharacters, IVirtualCharacter } from "./VirtualCharacter";
import { compareCheckboxes, IVirtualCheckbox } from "./VirtualCheckbox";
import { compareClose, IVirtualClose } from "./VirtualClose";
import { compareLabels, IVirtualLabel } from "./VirtualLabel";
import { compareSliders, IVirtualSlider } from "./VirtualSlider";
import { compareTextboxes, IVirtualTextbox } from "./VirtualTextbox";
import { comparePanels, IVirtualPanel } from "./VirutalPanel";

export interface IActorIndex {
  [id: string]: IVirtualActor;
}

export interface IVirtualStage {
  actorIndex: IActorIndex;
  actors: IVirtualActor[];

  addActor(actor: IVirtualActor): this;
  removeActor(actor: IVirtualActor): this;
  copyActors(): IVirtualActor[];
  loadActors(actors: IVirtualActor[]): this;
}

export class VirtualStage extends EventEmitter implements IVirtualStage {
  public actors: IVirtualActor[] = [];
  public actorIndex: IActorIndex = {};

  constructor() {
    super();
  }

  public addActor(actor: IVirtualActor): this {
    this.actors.push(actor);
    this.actorIndex[actor.id] = actor;
    return this;
  }

  public removeActor(actor: IVirtualActor): this {
    if (this.actors.includes(actor)) {
      this.actors.splice(this.actors.indexOf(actor), 1);
      delete this.actorIndex[actor.id];
    }
    return this;
  }

  public copyActors(): IVirtualActor[] {
    const result = [];
    for (const actor of this.actors) {
      result.push(
        Object.assign({}, actor),
      );
    }

    return result;
  }

  public loadActors(actors: IVirtualActor[]) {
    this.actors = actors;
    this.actorIndex = {};
    for (const actor of actors) {
      this.actorIndex[actor.id] = actor;
    }

    return this;
  }

  public compareActorsTo(actors: IVirtualActor[]): IWorkerEvent[] {
    const handled: string[] = [];
    const events: IWorkerEvent[] = [];
    for (const actor of actors) {
      if (handled.includes(actor.id)) {
        continue;
      }
      handled.push(actor.id);
      this.compare(find(this.actors, ["id", actor.id]), actor, events);
    }

    for (const actor of this.actors) {
      if (handled.includes(actor.id)) {
        continue;
      }
      handled.push(actor.id);
      this.compare(actor, find(actors, ["id", actor.id]), events);
    }

    return events;
  }

  public compare(before: IVirtualActor, after: IVirtualActor, events: IWorkerEvent[]): void {
    const type: string = (before && before.type) || (after && after.type);

    if (type === "button") {
      return compareButtons(before as IVirtualButton, after as IVirtualButton, events);
    }

    if (type === "character") {
      return compareCharacters(before as IVirtualCharacter, after as IVirtualCharacter, events);
    }

    if (type === "checkbox") {
      return compareCheckboxes(before as IVirtualCheckbox, after as IVirtualCheckbox, events);
    }

    if (type === "close") {
      return compareClose(before as IVirtualClose, after as IVirtualClose, events);
    }

    if (type === "label") {
      return compareLabels(before as IVirtualLabel, after as IVirtualLabel, events);
    }

    if (type === "panel") {
      return comparePanels(before as IVirtualPanel, after as IVirtualPanel, events);
    }

    if (type === "slider") {
      return compareSliders(before as IVirtualSlider, after as IVirtualSlider, events);
    }
    if (type === "textbox") {
      return compareTextboxes(before as IVirtualTextbox, after as IVirtualTextbox, events);
    }

    throw new Error(`Virtual control type ${type} is not comparable.`);
  }
}
