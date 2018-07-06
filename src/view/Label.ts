import { Sprite, ISprite, ISpriteProps } from "./Sprite";

export interface ILabel extends ISprite {
  text: string;
  font: string;
  fontSize: number;
  fontColor: string;
};

export interface ILabelProps extends ISpriteProps {
  text?: string;
  font?: string;
  fontSize?: number;
  fontColor?: string;
};

const tempctx = document.createElement("canvas").getContext("2d");

export class Label extends Sprite implements ILabel {
  text: string = "";
  font: string = "monospace";
  fontSize: number = 12;
  fontColor: string = "black";

  constructor(props: ILabelProps) {
    super(props);
    this.text = props.text || this.text;
    this.font = props.font || this.font;
    this.fontSize = props.fontSize || this.fontSize;
    this.fontColor = props.fontColor || this.fontColor;
  }
  update() {
    this.height = this.fontSize;
    tempctx.font = `${this.fontSize}px ${this.font}`;
    this.width = tempctx.measureText(this.text).width;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.texture.width * 0.5, this.texture.height * 0.5);
    ctx.textBaseline = "hanging";
    ctx.textAlign = "left";
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text, 0, 0);
  }
};