import { ISprite, Sprite, ISpriteProps } from "./Sprite";
import { loadImage, ITextureMap, ILoadProps, IInteractionPoint, createTextureMap } from "../util";
import { transformPoint } from "../matrix";

const sortZ = (a: ISprite, b: ISprite): number => a.z - b.z;

const assert = require("assert");

export interface IPanel extends ISprite {
  addSprite(sprite: ISprite): this;
  removeSprite(sprite: ISprite): this;
  sprites: ISprite[];
};

export interface IPanelProps extends ISpriteProps {
  sprites?: ISprite[];
};

export class Panel extends Sprite implements IPanel {
  sprites: ISprite[] = [];

  constructor(props: IPanelProps) {
    super(props);
    this.sprites = props.sprites || this.sprites;

    this.setTexture("Texture");
  }
  addSprite(sprite: ISprite): this {
    sprite.parent = this;
    this.sprites.push(sprite);
    return this;
  }
  interpolate(now: number) {
    if (now <= this.lastInterpolated) {
      return;
    }
    super.interpolate(now);
    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].interpolate(now);
    }
  }
  removeSprite(sprite: ISprite): this {
    if (this.sprites.includes(sprite)) {
      this.sprites.splice(this.sprites.indexOf(sprite), 1);
      sprite.parent = null;
    }
    return this;
  }
  broadPhase(point: IInteractionPoint): boolean {
    let sprite: ISprite = null;
    this.sprites.sort(sortZ);

    for (let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];

      sprite.down = false;
      sprite.clicked = false;
      sprite.hover = false;
    }
    return super.broadPhase(point);
  }
  narrowPhase(point: IInteractionPoint): ISprite {
    let sprite: ISprite = null,
      collision: ISprite = null;
    for (let i = this.sprites.length - 1; i >= 0; i--) {
      sprite = this.sprites[i];

      //the sprites inverse has already been calculated relative to the parent
      transformPoint(point, sprite.inverse);

      if (!sprite.broadPhase(point)) {
        continue;
      }

      collision = sprite.narrowPhase(point);
      if (collision) {
        return collision;
      }
    }
    return this;
  }
  update() {
    let sprite: ISprite;
    this.hover = false;
    for (let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];

      sprite.update();
      if (sprite.hover) {
        this.hover = sprite.hover;
        this.cursor = sprite.cursor;
      }
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    let sprite: ISprite;
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();

    for(let i = 0; i < this.sprites.length; i++) {
      sprite = this.sprites[i];
      ctx.save();
      ctx.transform(
        sprite.interpolatedPosition[0],
        sprite.interpolatedPosition[1],
        sprite.interpolatedPosition[2],
        sprite.interpolatedPosition[3],
        sprite.interpolatedPosition[4],
        sprite.interpolatedPosition[5],
      );
      ctx.globalAlpha *= sprite.interpolatedAlpha;
      sprite.render(ctx);
      ctx.restore();
    }
  }
  skipAnimation(): void {
    super.skipAnimation();
    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].skipAnimation();
    }
  }
};

export interface ILoadPanelProps extends IPanelProps, ILoadProps {

};

export async function loadPanel(props: ILoadPanelProps): Promise<IPanel> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  assert(textures.Texture);

  props.textures = textures;
  const textbox = new Panel(props);
  
  return textbox;
};