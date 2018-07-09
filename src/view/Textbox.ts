import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { IPadding, ILoadProps, loadImage, ITextureMap, createTextureMap } from "../util";
import splitToWords from "split-to-words";
import assert from "assert";

const tempctx = document.createElement("canvas").getContext("2d");

export interface ITextbox extends ISprite {
  text: string;
  textSpeed: number;
  textIndex: number;
  padding: IPadding;
  fontSize: number;
  font: string;
  fontColor: string;
  lineHeight: number;

  setText(text: string): this;
  appendText(text: string): this;
}

export interface ITextboxProps extends ISpriteProps {
  text?: string;
  textSpeed?: number;
  textIndex?: number;
  padding?: IPadding;
  fontSize?: number;
  font?: string;
  fontColor?: string;
  lineHeight?: number;
}

export class Textbox extends Sprite implements ITextbox {
  public text: string = "";
  public textSpeed: number = 1;
  public textIndex: number = 0;
  public padding: IPadding = {
    bottom: 5,
    left: 5,
    right: 5,
    top: 5,
  };
  public fontSize: number = 12;
  public font: string = "monospace";
  public fontColor: string = "black";
  public lineHeight: number = 16;

  private interpolatedText: string[] = [""];

  constructor(props: ITextboxProps) {
    super(props);
    this.text = props.text || this.text;
    this.textSpeed = props.textSpeed || this.textSpeed;
    if (props.hasOwnProperty("textIndex")) {
      this.textIndex = props.textIndex;
    }
    this.padding = props.padding || this.padding;
    this.fontSize = props.fontSize || this.fontSize;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.lineHeight = props.lineHeight || this.lineHeight;

    this.setTexture("Texture");
  }

  public update() {
    const maxWidth = this.texture.width - this.padding.left - this.padding.right;
    this.textIndex = Math.min(this.text.length, this.textIndex + this.textSpeed);
    const words = splitToWords(this.text.slice(0, Math.floor(this.textIndex)));
    this.interpolatedText = [""];

    let line: string = "";
    let measurement: TextMetrics;

    tempctx.font = `${this.fontSize}px ${this.font}`;

    for (const word of words) {
      line = this.interpolatedText[this.interpolatedText.length - 1] + " " + word;
      measurement = tempctx.measureText(line);
      if (measurement.width > maxWidth) {
        this.interpolatedText.push(word);
      } else {
        this.interpolatedText[this.interpolatedText.length - 1] = line;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    const maxHeight = this.texture.height - this.padding.top;
    let height = this.padding.top;

    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.textBaseline = "hanging";
    ctx.textAlign = "left";

    for (const line of this.interpolatedText) {
      if (height + this.fontSize > maxHeight) {
        break;
      }

      ctx.fillText(line, this.padding.left, height);
      height += this.lineHeight;
    }
  }

  public setText(text: string): this {
    this.text = text;
    this.interpolatedText = [""];
    this.textIndex = 0;
    return this;
  }

  public appendText(text: string): this {
    this.text += text;
    return this;
  }
}

export interface ILoadTextboxProps extends ITextboxProps, ILoadProps {

}

export async function loadTextbox(props: ILoadTextboxProps): Promise<ITextbox> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  assert(textures.Texture);

  props.textures = textures;
  const textbox = new Textbox(props);

  return textbox;
}
