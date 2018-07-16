import { EventEmitter } from "events";
import { IInteractionPoint } from "../util";
import { ISoundSprite } from "./SoundSprite";
import { ISprite } from "./Sprite";

export interface IContainer {
  sprites: ISprite[];
  soundSprites: ISoundSprite[];
  points: IInteractionPoint[];
  audioContext: AudioContext;

  addSprite(sprite: ISprite): this;
  removeSprite(sprite: ISprite): this;
  addSoundSprite(sprite: ISoundSprite): this;
  removeSoundSprite(sprite: ISoundSprite): this;
  addPoint(point: IInteractionPoint): this;
  removePoint(point: IInteractionPoint): this;
}

export interface IContainerProps {
  audioContext: AudioContext;
}

export class Container extends EventEmitter implements IContainer {

  public sprites: ISprite[] = [];
  public soundSprites: ISoundSprite[] = [];
  public points: IInteractionPoint[] = [];
  public audioContext: AudioContext = null;

  constructor(props: IContainerProps) {
    super();
    this.audioContext = props.audioContext || new AudioContext();
  }

  public addSprite(sprite: ISprite): this {
    if (!this.sprites.includes(sprite)) {
      this.sprites.push(sprite);
    }
    return this;
  }

  public removeSprite(sprite: ISprite): this {
    if (this.sprites.includes(sprite)) {
      this.sprites.splice(this.sprites.indexOf(sprite), 1);
    }
    return this;
  }

  public addSoundSprite(sprite: ISoundSprite): this {
    if (!this.soundSprites.includes(sprite)) {
      this.soundSprites.push(sprite);
      sprite.gain.connect(this.audioContext.destination);
    }
    return this;
  }

  public removeSoundSprite(sprite: ISoundSprite): this {
    if (this.soundSprites.includes(sprite)) {
      this.soundSprites.splice(this.soundSprites.indexOf(sprite), 1);
      sprite.gain.disconnect(this.audioContext.destination);
    }
    return this;
  }

  public addPoint(point: IInteractionPoint): this {
    if (!this.points.includes(point)) {
      this.points.push(point);
    }
    return this;
  }

  public removePoint(point: IInteractionPoint): this {
    if (this.points.includes(point)) {
      this.points.splice(this.points.indexOf(point), 1);
    }
    return this;
  }
}
