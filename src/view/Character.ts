import { Sprite, ISpriteProps, ISprite } from "./Sprite";
import { ITextureMap } from "./util";
import { EventEmitter } from "events";

export interface ICharacterProps extends ISpriteProps {
  name: string;
  moods: ITextureMap;
};

export interface ICharacter extends ISprite {
  name: string;
  moods: ITextureMap;
  mood: string;
  setMood(mood: string): ICharacter;
};

export class Character extends Sprite implements ICharacter {
  name: string = "";
  moods: ITextureMap = {};
  mood: string = "neutral";

  constructor(props: ICharacterProps) {
    super(props);
    this.name = props.name;
    this.moods = props.moods;
  }
  setMood(mood: string) {
    const moodTexture = this.moods[mood];
    if (!moodTexture) {
      throw new Error(`Mood (${mood}) not found for character (${this.name}).`);
    }
    this.width = moodTexture.width;
    this.height = moodTexture.height;
    EventEmitter.prototype.emit.call(this, "mood-change", this);
    return this;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.moods[this.mood], 0, 0);
  }
};