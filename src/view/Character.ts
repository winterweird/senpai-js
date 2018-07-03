import { Sprite, ISpriteProps, ISprite } from "./Sprite";
import { ITextureMap, ISpriteSheet, IInteractionPoint } from "./util";
import * as Matrix from "../matrix";
const images = require("../../assets/characters/**/*.png");
const json = require("../../assets/characters/**/*.json");
const assert = require("assert");


export interface ICharacterProps extends ISpriteProps {
  name: string;
};

export interface ICharacter extends ISprite {
  name: string;
  on(event: "click" | "point-move" | "mood-change", callback: Function): this;
  once(event: "click" | "point-move" | "mood-change", callback: Function): this;
};

export class Character extends Sprite implements ICharacter {
  name: string = "";

  constructor(props: ICharacterProps) {
    super(props);
    this.name = props.name;
    super.setTexture("Neutral");
  }
};

export async function loadCharacter(name: string): Promise<ICharacter> {
  const img = fetch(images[name].spritesheet).then(e => e.blob());
  const definition: ISpriteSheet = json[name].index;
  const textures: ITextureMap = {};
  await Promise.all(
    Object.entries(definition.frames).map(async function([desc, mood], i) {
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

  const character = new Character({
    id: name,
    name,
    textures,
    position: Matrix.Identity,
  });
  return character;
};

