import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { loadImage, ITextureMap, ILoadProps } from "../util";

const assert = require("assert");

export interface IButton extends ISprite {
  selected: boolean;
  font: string;
  fontColor: string;
  text: string;
};

export interface IButtonProps extends ISpriteProps {
  selected?: boolean;
  font?: string;
  fontColor?: string;
  text?: string;
};

export class Button extends Sprite implements IButton {
  selected: boolean = false;
  font: string = "monospace";
  fontColor: string = "black";
  text: string =  ""

  constructor(props: IButtonProps) {
    super(props);
    this.selected = props.selected || false;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.text = props.text || this.text;
  }
  update() {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    const selected = this.selected ? "Selected" : "Unselected";
    this.setTexture(`${active}_${hover}_${selected}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }
  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    ctx.translate(this.texture.width * 0.5, this.texture.height * 0.5);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${this.texture.height * 0.5}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text, 0, 0);
  }
};

export interface ILoadButtonProps extends IButtonProps, ILoadProps {

};

export async function loadButton(props: ILoadButtonProps): Promise<IButton> {
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
      ["Selected", "Unselected"].forEach(selected => {
        assert(textures[`${active}_${hover}_${selected}`]);
      });
    });
  });

  props.textures = textures;
  const button = new Button(props);
  
  return button;
};