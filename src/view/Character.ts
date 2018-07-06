import { Sprite, ISpriteProps, ISprite } from "./Sprite";
import { loadImage, ILoadProps, createTextureMap } from "../util";
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
  
  const textures = await createTextureMap(props.definition, img);

  assert(textures.Neutral);
  props.textures = textures;
  const character = new Character(props);

  return character;
};

