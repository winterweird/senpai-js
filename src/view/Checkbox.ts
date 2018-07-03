import { Sprite, ISprite, ISpriteProps } from "./Sprite";
import images from "../../assets/characters/**/*.png";
import json from "../../assets/characters/**/*.json";

interface ICheckbox extends ISprite {

}

interface ICheckboxProps extends ISpriteProps {

}

export class Checkbox extends Sprite implements ICheckbox {
  constructor(props: ICheckboxProps) {
    super(props);
  }
}

export async function loadCharacter(name: string): Promise<ICheckbox> {
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