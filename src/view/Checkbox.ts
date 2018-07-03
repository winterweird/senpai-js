import { Sprite, ISprite, ISpriteProps } from "./Sprite";
import { ITextureMap, ISpriteSheet, IInteractionPoint, loadImage } from "../util/index";
import { loadFonts } from "./fonts";
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
    const modifier = this.active
      ? (this.hover ? "_Active" : "_Inactive")
      : "";
    this.setTexture(
      this.checked
        ? `Checked${modifier}`
        : `Unchecked${modifier}`
    );

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }
};

export async function loadCheckbox(id: string): Promise<ICheckbox> {
  const definition: ISpriteSheet = require("../../assets/checkbox/index.json");
  const cbSource: string = require("../../assets/checkbox/spritesheet.png");
  const img = loadImage(cbSource);
  const textures: ITextureMap = {};
  const fonts = loadFonts();

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

  assert(textures.Unchecked_Inactive);
  assert(textures.Unchecked_Active);
  assert(textures.Unchecked);
  assert(textures.Checked_Inactive);
  assert(textures.Checked_Active);
  assert(textures.Checked);

  const checkbox = new Checkbox({
    id,
    textures,
    position:  Matrix.Identity,
  });

  await fonts;
  return checkbox;
};