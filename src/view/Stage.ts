
import { transformPoint } from "../matrix";
import { IInteractionPoint } from "../util";
import { ISoundSprite } from "./SoundSprite";
import { ISprite } from "./Sprite";
import { IStageInteractionManagerProps, StageInteractionManager } from "./StageInteractionManager";

export interface IStageProps extends IStageInteractionManagerProps {
  audioContext: AudioContext;
}

export interface IStage {
  sprites: ISprite[];

  addSprite(sprite: ISprite): this;
  removeSprite(sprite: ISprite): this;
  addSoundSprite(sprite: ISoundSprite): this;
  removeSoundSprite(sprite: ISoundSprite): this;
  skipAnimations(): this;
  update(): this;
  render(): this;
}

const sortZ = (a: ISprite, b: ISprite): number => a.z - b.z;

export class Stage extends StageInteractionManager {
  public sprites: ISprite[] = [];
  public audioContext: AudioContext = null;
  public gain: GainNode = null;
  private ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
  private soundSprites: ISoundSprite[] = [];

  constructor(props: IStageProps) {
    super(props);
    this.audioContext = props.audioContext;
    this.gain = this.audioContext.createGain();
    this.gain.connect(this.audioContext.destination);
  }

  public addSprite(sprite: ISprite): this {
    if (!this.sprites.includes(sprite)) {
      this.sprites.push(sprite);
      super.emit("sprite-add", sprite);
    }
    return this;
  }

  public removeSprite(sprite: ISprite): this {
    if (this.sprites.includes(sprite)) {
      const index = this.sprites.indexOf(sprite);
      this.sprites.splice(index, 1);
      super.emit("sprite-remove", sprite);
    }
    return this;
  }

  public removeSoundSprite(sprite: ISoundSprite): this {
    if (!this.soundSprites.includes(sprite)) {
      const index = this.soundSprites.indexOf(sprite);
      this.soundSprites.splice(index, 1);
      sprite.gain.disconnect(this.gain);
      super.emit("sound-sprite-remove", sprite);
    }
    return this;
  }

  public addSoundSprite(sprite: ISoundSprite): this {
    if (!this.soundSprites.includes(sprite)) {
      this.soundSprites.push(sprite);
      sprite.gain.connect(this.gain);
      super.emit("sound-sprite-add", sprite);
    }
    return this;
  }

  public skipAnimations(): this {
    for (const sprite of this.sprites) {
      sprite.skipAnimation();
    }
    return this;
  }

  public update(): this {
    let sprite: ISprite;
    let point: IInteractionPoint;
    super.emit("pre-stage-update");
    const now: number = Date.now();

    super.emit("pre-interpolate");
    for (sprite of this.sprites) {
      sprite.interpolate(now);
    }
    this.sprites.sort(sortZ);
    super.emit("post-interpolate");

    super.emit("pre-collision");

    // points that are active
    for (point of this.points) {
      if (point.active) {
        sprite = point.active;
        sprite.down = false;
        sprite.clicked = false;
        sprite.hover = false;
        transformPoint(point, sprite.inverse);
        point.captured = true;
        if (sprite.broadPhase(point) && sprite === sprite.narrowPhase(point)) {
          sprite.hover = true;
          sprite.emit("point-move", sprite, point);
          sprite.pointCollision(point);
        }
      }
    }

    for (let i = this.sprites.length - 1; i >= 0; i--) {
      sprite = this.sprites[i];
      if (sprite.active) {
        continue;
      }

      sprite.down = false;
      sprite.clicked = false;
      sprite.hover = false;

      for (point of this.points) {
        if (point.captured) {
          continue;
        }

        if (point.firstDown) {
          super.emit("firstdown", point);
        }
        transformPoint(point, sprite.inverse);

        if (sprite.broadPhase(point)) {
          sprite = sprite.narrowPhase(point);
          if (!sprite) {
            continue;
          }

          if (point.firstDown) {
            sprite.active = true;
            point.active = sprite;
            sprite.emit("active", sprite, point);
          }

          point.captured = true;
          sprite.hover = true;
          sprite.emit("point-move", sprite, point);
          sprite.pointCollision(point);
          sprite.down = point.down;
          break;
        }
      }

      // capture uncaptured points and emit point-move events
      for (point of this.points) {
        if (point.captured) {
          continue;
        }
        super.emit("point-move", null, point);
      }
    }
    super.emit("post-collision");

    super.emit("pre-update");
    for (sprite of this.sprites) {
      sprite.update();
    }
    super.emit("post-update");

    super.emit("post-stage-update");
    this.cleanUp();
    return this;
  }
  public cleanUp(): void {
    for (const sprite of this.sprites) {
      sprite.clicked = false;
    }
    super.cleanUp();
  }
  public dispose() {
    super.dispose();
  }
  public render(): this {
    super.emit("pre-render");
    let sprite: ISprite;
    let pointer: boolean = false;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (sprite of this.sprites) {
      ctx.save();
      ctx.setTransform(
        sprite.interpolatedPosition[0],
        sprite.interpolatedPosition[1],
        sprite.interpolatedPosition[2],
        sprite.interpolatedPosition[3],
        sprite.interpolatedPosition[4],
        sprite.interpolatedPosition[5],
      );
      ctx.globalAlpha = sprite.interpolatedPosition[6];
      sprite.render(ctx);
      ctx.restore();
      pointer = pointer || (sprite.hover && sprite.cursor === "pointer");
    }

    this.canvas.style.cursor = pointer ? "pointer" : "default";

    super.emit("post-render");
    return this;
  }
}
