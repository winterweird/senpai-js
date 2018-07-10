import { ICreateCharacterEvent } from "../events/ICreateCharacterEvent";
import { ITextureChangeEvent } from "../events/ITextureChangeEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { compareActors, createPosition, IActor } from "./Actor";

export interface ICharacter extends IActor {
  type: "character";
  name: string;
  texture: string;
}

export function compareCharacters(before: ICharacter, after: ICharacter, events: IWorkerEvent[]): void {

  // character creation
  if (!before && after) {
    events.push({
      props: {
        alpha: after.alpha,
        definition: null,
        id: after.id,
        name: after.name,
        parent: after.parent,
        position: createPosition(after),
        src: null,
        textures: null,
        z: after.z,
      },
      type: "create-character",
    } as ICreateCharacterEvent);
  }

  // character mood change
  if (before && after && before.texture !== after.texture) {
    events.push({
      props: {
        id: after.id,
        texture: after.texture,
      },
      type: "texture-change",
    } as ITextureChangeEvent);
  }

  // character move
  return compareActors(before, after, events);
}