import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { loadImage, ITextureMap, ISpriteSheet, ILoadProps } from "../util";
import * as Matrix from "../matrix";

const assert = require("assert");

export interface IClose extends ISprite {
};

export interface ICloseProps extends ISpriteProps {
};

export class Close extends Sprite implements IClose {
  constructor(props: ICloseProps) {
    super(props);
  }
  update() {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    this.setTexture(`${active}_${hover}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }
};

export interface ILoadCloseProps extends ICloseProps, ILoadProps {
  
}

export async function loadClose(props: ILoadCloseProps): Promise<IClose> {
  const img = loadImage(props.src);
  const textures: ITextureMap = {};

  await Promise.all(
    Object.entries(props.definition.frames).map(async function([desc, state], i) {
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
      assert(textures[`${active}_${hover}`]);
    });
  });

  props.textures = textures;
  const button = new Close(props);
  
  return button;
};