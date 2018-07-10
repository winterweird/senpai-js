import { EventEmitter } from "events";
import { IActor } from "./Actor";

export interface IActorIndex {
  [id: string]: IActor;
}

export interface IVirtualStage {
  actorIndex: IActorIndex;
  actors: IActor[];

  addActor(actor: IActor): this;
  removeActor(actor: IActor): this;
  copyActors(): IActor[];
  loadActors(actors: IActor[]): this;
}

export class VirtualStage extends EventEmitter implements IVirtualStage {
  public actors: IActor[] = [];
  public actorIndex: IActorIndex = {};

  constructor() {
    super();
  }

  public addActor(actor: IActor): this {
    this.actors.push(actor);
    this.actorIndex[actor.id] = actor;
    return this;
  }

  public removeActor(actor: IActor): this {
    if (this.actors.includes(actor)) {
      this.actors.splice(this.actors.indexOf(actor), 1);
      delete this.actorIndex[actor.id];
    }
    return this;
  }

  public copyActors(): IActor[] {
    const result = [];
    for (const actor of this.actors) {
      result.push(
        Object.assign({}, actor),
      );
    }

    return result;
  }

  public loadActors(actors: IActor[]) {
    this.actors = actors;
    this.actorIndex = {};
    for (const actor of actors) {
      this.actorIndex[actor.id] = actor;
    }

    return this;
  }
}
