import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { loadImage, ITextureMap } from "../util";
import * as Matrix from "../matrix";
const assert = require("assert");

export interface IButton extends ISprite {
  selected: boolean;
};

export interface IButtonProps extends ISpriteProps {
  selected?: boolean;
};

export class Button extends Sprite implements IButton {
  selected: boolean = false;

  constructor(props: IButtonProps) {
    super(props);
    this.selected = props.selected || false;
  }
  update() {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    const selected = this.selected ? "Selected" : "Unselected";
    this.setTexture(`${active}_${hover}_${selected}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }
};

export async function loadButton(id: string, src: string, definition: ISpriteSheet): Promise<IButton> {
  const img = loadImage(src);
  const textures: ITextureMap = {};

  await Promise.all(
    Object.entries(definition.frames).map(async function([desc, state], i) {
      textures[desc] = await createImageBitmap(
        await img,
        state.frame.x,
        state.frame.y,
        state.frame.w,
        state.frame.h,
      );
    })
  );

  ["Active", "Inactive"].forEach(active => {
    ["Hover", "NoHover"].forEach(hover => {
      ["Selected", "Unselected"].forEach(selected => {
        assert(textures[`${active}_${hover}_${selected}`]);
      });
    });
  });

  const checkbox = new Button({
    id,
    textures,
    position:  Matrix.Identity,
  });
  
  return checkbox;
};