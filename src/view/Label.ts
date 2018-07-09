import { Sprite, ISprite, ISpriteProps } from "./Sprite";

export interface ILabel extends ISprite {
  text: string;
  font: string;
  fontSize: number;
  fontColor: string;
  textBaseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
  textAlign: "left" | "right" | "center" | "start" | "end";
}

export interface ILabelProps extends ISpriteProps {
  text?: string;
  font?: string;
  fontSize?: number;
  fontColor?: string;
  textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
  textAlign?: "left" | "right" | "center" | "start" | "end";
}

const tempctx = document.createElement("canvas").getContext("2d");

export class Label extends Sprite implements ILabel {
  public text: string = "";
  public font: string = "monospace";
  public fontSize: number = 12;
  public fontColor: string = "black";
  public textBaseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom" = "hanging";
  public textAlign: "left" | "right" | "center" | "start" | "end" = "start";

  constructor(props: ILabelProps) {
    super(props);
    this.text = props.text || this.text;
    this.font = props.font || this.font;
    this.fontSize = props.fontSize || this.fontSize;
    this.fontColor = props.fontColor || this.fontColor;
    this.textBaseline = props.textBaseline || this.textBaseline;
    this.textAlign = props.textAlign || this.textAlign;
  }

  public update(): void {
    this.height = this.fontSize;
    tempctx.font = `${this.fontSize}px ${this.font}`;
    this.width = tempctx.measureText(this.text).width;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.texture.width * 0.5, this.texture.height * 0.5);
    ctx.textBaseline = this.textBaseline;
    ctx.textAlign = this.textAlign;
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text, 0, 0);
  }
}

export async function loadLabel(props: ILabelProps): Promise<ILabel> {
  const label = new Label(props);
  return label;
}
