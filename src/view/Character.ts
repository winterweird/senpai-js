import assert from "assert";
import { createTextureMap, ILoadProps, loadImage } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ICharacterProps extends ISpriteProps {
  name: string;
}

export interface ICharacter extends ISprite {
  name: string;
}

export class Character extends Sprite implements ICharacter {
  public name: string = "";

  constructor(props: ICharacterProps) {
    super(props);
    this.name = props.name;
    super.setTexture("Neutral");
  }
}

export interface ILoadCharacterProps extends ICharacterProps, ILoadProps {

}

export async function loadCharacter(props: ILoadCharacterProps): Promise<ICharacter> {
  const img = loadImage(props.src);
  const textures = await createTextureMap(props.definition, img);

  assert(textures.Neutral);
  props.textures = textures;
  const character = new Character(props);

  return character;
}
