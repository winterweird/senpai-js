import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { IPadding, ILoadProps, loadImage, ITextureMap } from "../util";
import splitToWords from "split-to-words";

const assert = require("assert");
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
};

export interface ITextboxProps extends ISpriteProps {
  text?: string;
  textSpeed?: number;
  textIndex?: number;
  padding?: IPadding;
  fontSize?: number;
  font?: string;
  fontColor?: string;
  lineHeight?: number;
};

export class Textbox extends Sprite implements ITextbox {
  text: string = "";
  textSpeed: number = 1;
  textIndex: number = 0;
  padding: IPadding = {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5
  };
  fontSize: number = 12;
  font: string = "monospace";
  fontColor: string = "black";
  lineHeight: number = 16;

  constructor(props: ITextboxProps) {
    super(props);
    this.text = props.text || this.text;
    this.textSpeed = props.textSpeed || this.textSpeed;
    if (props.hasOwnProperty('textIndex')) {
      this.textIndex = props.textIndex;
    }
    this.padding = props.padding || this.padding;
    this.fontSize = props.fontSize || this.fontSize;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.lineHeight = props.lineHeight || this.lineHeight;

    this.setTexture("Textbox");
  }
  private interpolatedText: Array<string> = [""];

  update() {
    const maxWidth = this.texture.width - this.padding.left - this.padding.right;
    this.textIndex += this.textSpeed;

    const words = splitToWords(this.text.slice(0, Math.floor(this.textIndex)));
    this.interpolatedText = [""];

    let line: string = "",
      measurement: TextMetrics;

    tempctx.font = `${this.fontSize}px ${this.font}`;

    for(let word of words) {
      line = this.interpolatedText[this.interpolatedText.length - 1] + " " + word;
      measurement = tempctx.measureText(line);
      if (measurement.width > maxWidth) {
        this.interpolatedText.push(word);
      } else {
        this.interpolatedText[this.interpolatedText.length - 1] = line;
      }
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    const maxHeight = this.texture.height - this.padding.top;
    let height = this.padding.top;

    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.textBaseline = "hanging";
    ctx.textAlign = "left";

    for(let i = 0; i < this.interpolatedText.length; i++) {
      if (height + this.fontSize > maxHeight) {
        break;
      }

      ctx.fillText(this.interpolatedText[i], this.padding.left, height);
      height += this.lineHeight;
    }
  }
  setText(text: string): this {
    this.text = text;
    this.interpolatedText = [""];
    this.textIndex = 0;
    return this;
  }
  appendText(text: string): this {
    this.text += text;
    return this;
  }
};

export interface ILoadTextboxProps extends ITextboxProps, ILoadProps {

};

export async function loadButton(props: ILoadTextboxProps): Promise<ITextbox> {
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

  assert(textures.Texture);

  props.textures = textures;
  const textbox = new Textbox(props);
  
  return textbox;
};