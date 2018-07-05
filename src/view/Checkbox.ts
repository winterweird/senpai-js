import { Sprite, ISprite, ISpriteProps } from "./Sprite";
import { ITextureMap, ISpriteSheet, IInteractionPoint, loadImage } from "../util/index";
import * as Matrix from "../matrix";


const assert = require("assert");

export interface ICheckbox extends ISprite {
  checked: boolean;
  text: string;
  font: string;
  fontColor: string;
  toggle(): this;
};

export interface ICheckboxProps extends ISpriteProps {
  checked?: boolean;
  text?: string;
  font?: string;
  fontColor?: string;
};

export class Checkbox extends Sprite implements ICheckbox {
  checked: boolean = false;
  text: string = "";
  font: string = "monospace";
  fontColor: string = "black";

  constructor(props: ICheckboxProps) {
    super(props);
    this.checked = Boolean(props.checked) || false;
    this.text = props.text || this.text;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
  }
  toggle(): this {
    this.checked = !this.checked;
    return this;
  }
  pointCollision(point: IInteractionPoint): boolean {
    if (point.clicked && point.active === this) {
      this.toggle();
      this.emit("toggle", point);
    }
    return super.pointCollision(point);
  }
  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    ctx.translate(this.width * 1.1, this.height / 2);
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.fontColor;
    ctx.font = `${this.height * 0.5}px ${this.font}`;
    ctx.fillText(this.text, 0, 0);
  }
  update() {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    const checked = this.checked ? "Checked" : "Unchecked";
    this.setTexture(`${active}_${hover}_${checked}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }
};

export async function loadCheckbox(id: string, src: string, definition: ISpriteSheet): Promise<ICheckbox> {
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
      ["Checked", "Unchecked"].forEach(checked => {
        assert(textures[`${active}_${hover}_${checked}`]);
      });
    });
  });

  const checkbox = new Checkbox({
    id,
    textures,
    position:  Matrix.Identity,
  });

  return checkbox;
};