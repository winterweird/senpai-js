import { Sprite, ISpriteProps, ISprite } from "./Sprite";
import { ITextureMap, ISpriteSheet, loadImage, ILoadProps } from "../util";
import * as Matrix from "../matrix";
const images = require("../../assets/characters/**/*.png");
const json = require("../../assets/characters/**/*.json");
const assert = require("assert");


export interface ICharacterProps extends ISpriteProps {
  name: string;
};

export interface ICharacter extends ISprite {
  name: string;
};

export class Character extends Sprite implements ICharacter {
  name: string = "";

  constructor(props: ICharacterProps) {
    super(props);
    this.name = props.name;
    super.setTexture("Neutral");
  }
};

export interface ILoadCharacterProps extends ICharacterProps, ILoadProps {

}
export async function loadCharacter(props: ILoadCharacterProps): Promise<ICharacter> {
  const img = loadImage(props.src);
  const textures: ITextureMap = {};
  await Promise.all(
    Object.entries(props.definition.frames).map(async function([desc, mood], i) {
      textures[desc] = await createImageBitmap(
        await img,
        mood.frame.x,
        mood.frame.y,
        mood.frame.w,
        mood.frame.h,
      );
    })
  );

  assert(textures.Neutral);
  props.textures = textures;
  const character = new Character(props);

  return character;
};

