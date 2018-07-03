import { Sprite, ISpriteProps, ISprite } from "./Sprite";
import { ITextureMap, ISpriteSheet, IInteractionPoint } from "./util";
import { Identity } from "./Matrix";
import images from "../../assets/characters/**/*.png";
import json from "../../assets/characters/**/*.json";


export interface ICharacterProps extends ISpriteProps {
  name: string;
  moods: ITextureMap;
};

export interface ICharacter extends ISprite {
  name: string;
  moods: ITextureMap;
  mood: string;
  move(position: number[] | Float64Array): ISprite;
  setMood(mood: string): ICharacter;
  on(event: "click" | "point-move" | "mood-change", callback: Function): this;
  once(event: "click" | "point-move" | "mood-change", callback: Function): this;
};

export class Character extends Sprite implements ICharacter {
  name: string = "";
  moods: ITextureMap = {};
  mood: string = "Neutral";

  constructor(props: ICharacterProps) {
    super(props);
    this.name = props.name;
    this.moods = props.moods;
    this.setMood("Neutral");
  }
  move(position: number[] | Float64Array): ISprite {
    return super.move(position);
  }
  setMood(mood: string): ICharacter {
    const moodTexture = this.moods[mood];
    if (!moodTexture) {
      throw new Error(`Mood (${mood}) not found for character (${this.name}).`);
    }
    this.width = moodTexture.width;
    this.height = moodTexture.height;
    this.mood = mood;
    super.emit("mood-change", this);
    return this;
  }
  narrowPhase(point: IInteractionPoint) {
    return true;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.moods[this.mood], 0, 0);
  }
};

export async function loadCharacter(name: string): Promise<ICharacter> {
  const img = fetch(images[name].spritesheet).then(e => e.blob());
  const definition: ISpriteSheet = json[name].index;
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

