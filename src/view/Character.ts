import { Sprite, ISpriteProps, ISprite } from "./Sprite";
import { ITextureMap, loadImage, ISpriteSheet, IInteractionPoint } from "./util";
import { EventEmitter } from "events";
import { Identity } from "./Matrix";

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
    this.setMood("Default");
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

export async function loadCharacter(name: string): Promise<ICharacter> {
  const img = loadImage(`./assets/characters/${name}/spritesheet.png`);
  const definition: ISpriteSheet = require(`../../assets/characters/${name}/index.json`);
  const moods: ITextureMap = {};
  await Promise.all(
    Object.entries(definition.frames).map(async function([mood, moodDefintion], i) {
      moods[mood] = await createImageBitmap(
        await img,
        moodDefintion.frame.x,
        moodDefintion.frame.y,
        moodDefintion.frame.w,
        moodDefintion.frame.h,
      );
    })
  );
  const character = new Character({
    name,
    moods,
    position: Identity,
  });
  return character;
};