
import * as eases from "../ease";
import { chain } from "../matrix";
import { ISpriteSheet } from "../util";
import { IButton, ILoadButtonProps, loadButton } from "../view/Button";
import { ICharacter, ILoadCharacterProps, loadCharacter } from "../view/Character";
import { ICheckbox, ILoadCheckboxProps, loadCheckbox } from "../view/Checkbox";
import { IClose, ILoadCloseProps, loadClose } from "../view/Close";
import { ILabel, ILabelProps, loadLabel } from "../view/Label";
import { ILoadPanelProps, IPanel, loadPanel } from "../view/Panel";
import { ILoadSliderProps, ISlider, loadSlider } from "../view/Slider";
import { ILoadSoundSpriteProps, ISoundSprite, ISoundSpriteSheet, loadSoundSprite } from "../view/SoundSprite";
import { ISprite } from "../view/Sprite";
import { IStage, IStageProps, Stage } from "../view/Stage";
import { ILoadTextboxProps, ITextbox, loadTextbox } from "../view/Textbox";

export interface ISpriteIndex {
  [id: string]: ISprite;
}

export interface ICharacterImportIndex {
  [name: string]: {
    index?: {
      json: ISpriteSheet;
      [fileType: string]: any;
    };
    [filename: string]: {
      json?: object;
      png?: string;
      [fileType: string]: any;
    };
  };
}

export interface IStageManagerProps extends IStageProps {

}

export interface IHistoryState {
  [id: string]: IPosition;
}
export interface IStageManager extends IStage {
  script: Generator;
  index: number;
  history: IHistoryState[];
  spriteIndex: ISpriteIndex;

  createButton(...props: ILoadButtonProps[]): Promise<IButton>;
  createCharacter(...props: ILoadCharacterProps[]): Promise<ICharacter>;
  createCheckbox(...props: ILoadCheckboxProps[]): Promise<ICheckbox>;
  createClose(...props: ILoadCloseProps[]): Promise<IClose>;
  createLabel(...props: ILabelProps[]): Promise<ILabel>;
  createPanel(...props: ILoadPanelProps[]): Promise<IPanel>;
  createSoundSprite(...props: ILoadSoundSpriteProps[]): Promise<ISoundSprite>;
  createSlider(...props: ILoadSliderProps[]): Promise<ISlider>;
  createTextbox(...props: ILoadTextboxProps[]): Promise<ITextbox>;
  getPosition(sprite: ISprite): IPosition;
  load(script: string, index: number): void;
  show(sprite: ISprite, ...positions): void;
  move(sprite: ISprite, ...positions): void;
}

export interface ISoundImportIndex {
  [name: string]: {
    mp3?: string;
    ogg?: string;
    wav?: string;
    flac?: string;
    json?: ISoundSpriteSheet;
  };
}

export interface IPosition {
  x?: number;
  y?: number;
  sx?: number;
  sy?: number;
  cx?: number;
  cy?: number;
  r?: number;
  a?: number;
  z?: number;
  animationLength?: number;
  ease?: string;
  wait: number;
}

export interface IScriptMap {
  [name: string]: () => Promise<any>;
}

export class StageManager extends Stage implements IStageManager {

  private static ButtonSpritesheet: ISpriteSheet = require("../../assets/button/index.json");
  private static ButtonImages: string =  require("../../assets/button/spritesheet.png");
  private static Characters: ICharacterImportIndex = require("../../assets/characters/*/*.*");
  private static CheckboxSpritesheet: ISpriteSheet = require("../../assets/checkbox/index.json");
  private static CheckboxImages: string = require("../../assets/checkbox/spritesheet.png");
  private static CloseImages: string = require("../../assets/close/spritesheet.png");
  private static CloseSpritesheet: ISpriteSheet = require("../../assets/close/index.json");
  private static PanelSpritesheet: ISpriteSheet = require("../../assets/panel/index.json");
  private static PanelImages: string = require("../../assets/panel/spritesheet.png");
  private static SliderSpritesheet: ISpriteSheet = require("../../assets/slider/index.json");
  private static SliderImages: string = require("../../assets/slider/spritesheet.png");
  private static TextboxSpritesheet: ISpriteSheet = require("../../assets/textbox/index.json");
  private static TextboxImages: string = require("../../assets/textbox/spritesheet.png");
  private static SoundsImports: ISoundImportIndex = require("../../assets/sound/*.*");
  private static Positions: WeakMap<ISprite, IPosition> = new WeakMap<ISprite, IPosition>();
  private static ScriptImports: IScriptMap = require("../../script");

  public script: Generator = null;
  public spriteIndex: ISpriteIndex = {};
  public index: number = 0;
  public history: IHistoryState[] = [];

  constructor(props: IStageManagerProps) {
    super(props);
    Object.defineProperty(window, "sm", {
      configurable: false,
      enumerable: false,
      value: this,
      writable: false,
    });
    this.load("index", 0);
  }

  public createButton(...props: ILoadButtonProps[]): Promise<IButton> {
    const options: ILoadButtonProps = Object.assign({}, ...props);
    options.definition = StageManager.ButtonSpritesheet;
    options.src = StageManager.ButtonImages;
    return loadButton(options);
  }

  public createCharacter(...props: ILoadCharacterProps[]): Promise<ICharacter> {
    const options: ILoadCharacterProps = Object.assign({}, ...props);
    options.definition = StageManager.Characters[options.name].index.json;
    options.src = StageManager.Characters[options.name].spritesheet.png;
    return loadCharacter(options);
  }

  public createCheckbox(...props: ILoadCheckboxProps[]): Promise<ICheckbox> {
    const options: ILoadCheckboxProps = Object.assign({}, ...props);
    options.definition = StageManager.CheckboxSpritesheet;
    options.src = StageManager.CheckboxImages;
    return loadCheckbox(options);
  }

  public createClose(...props: ILoadCloseProps[]): Promise<IClose> {
    const options: ILoadCloseProps = Object.assign({}, ...props);
    options.definition = StageManager.CloseSpritesheet;
    options.src = StageManager.CloseImages;
    return loadClose(options);
  }

  public createLabel(...props: ILabelProps[]): Promise<ILabel> {
    const options: ILabelProps = Object.assign({}, ...props);
    return loadLabel(options);
  }

  public createPanel(...props: ILoadPanelProps[]): Promise<IPanel> {
    const options: ILoadPanelProps = Object.assign({}, ...props);
    options.definition = StageManager.PanelSpritesheet;
    options.src = StageManager.PanelImages;
    return loadPanel(options);
  }

  public createSlider(...props: ILoadSliderProps[]): Promise<ISlider> {
    const options: ILoadSliderProps = Object.assign({}, ...props);
    options.definition = StageManager.SliderSpritesheet;
    options.src = StageManager.SliderImages;
    return loadSlider(options);
  }

  public async createSoundSprite(...props: ILoadSoundSpriteProps[]): Promise<ISoundSprite> {
    const options: ILoadSoundSpriteProps = Object.assign({}, ...props);
    options.src = StageManager.SoundsImports[options.name].mp3
      || StageManager.SoundsImports[options.name].ogg
      || StageManager.SoundsImports[options.name].wav
      || StageManager.SoundsImports[options.name].flac;
    options.definition = StageManager.SoundsImports[options.name].json;
    options.context = this.audioContext;
    return loadSoundSprite(options);
  }

  public createTextbox(...props: ILoadTextboxProps[]): Promise<ITextbox> {
    const options: ILoadTextboxProps = Object.assign({}, ...props);
    options.definition = StageManager.TextboxSpritesheet;
    options.src = StageManager.TextboxImages;
    return loadTextbox(options);
  }

  public addSprite(sprite: ISprite): this {
    this.assertPosition(sprite);
    this.spriteIndex[sprite.id] = sprite;
    return super.addSprite(sprite);
  }

  public getPosition(sprite: ISprite): IPosition {
    this.assertPosition(sprite);
    return StageManager.Positions.get(sprite);
  }

  public load(script: string, index: number = 0): this {
    for (const sprite of this.sprites) {
      for (const event of sprite.eventNames()) {
        sprite.removeAllListeners(event);
      }
      this.removeSprite(sprite);
    }

    this.index = index;
    this.history = [];
    this.spriteIndex = {};
    return this;
  }

  public show(sprite: ISprite, ...positions: IPosition[]): void {
    this.addSprite(sprite);
    this.move(sprite, ...positions);
  }

  public move(sprite: ISprite, ...positions): void {
    const position = this.getPosition(sprite);
    Object.assign(position, ...positions);
    this.updateSpritePosition(sprite);
  }

  public says(says: string, name: string, color: string): Promise<void> {
    const tb: ITextbox = this.spriteIndex.tb as ITextbox;
    const sb: ILabel = this.spriteIndex.sb as ILabel;
    if (tb) {
      tb.setText(says);
    }
    if (sb) {
      sb.setText(name);
      sb.fontColor = color;
    }
    return this.firstDownPromise();
  }

  private firstDownPromise(): Promise<void> {
    return new Promise(resolve => {
      const callback = e => {
        if (!this.skipAnimations()) {
          this.removeListener("firstdown", callback);
          resolve();
        }
      };
      this.on("firstdown", callback);
    });
  }

  private assertPosition(sprite: ISprite): void {
    if (!StageManager.Positions.has(sprite)) {
      const zs = this.sprites.map(e =>
        StageManager.Positions.has(sprite)
          ? StageManager.Positions.get(sprite).z
          : 0,
      );

      StageManager.Positions.set(sprite, {
        a: 1,
        animationLength: 0,
        cx: 0,
        cy: 0,
        ease: "linear",
        r: 0,
        sx: 1,
        sy: 1,
        wait: 0,
        x: 0,
        y: 0,
        z: Math.max(0, ...zs) + 1,
      });
    }
  }

  private updateSpritePosition(sprite: ISprite): void {
    const position: IPosition = StageManager.Positions.get(sprite);
    chain(sprite.position)
      .reset()
      .translate(position.x, position.y)
      .rotate(position.r)
      .scale(position.sx, position.sy)
      .translate(-position.cx, -position.cy);
    sprite
      .move(sprite.position)
      .over(
        position.hasOwnProperty("animationLength")
          ? position.animationLength
          : sprite.animationLength,
        position.wait || 0,
        position.hasOwnProperty("ease")
          ? eases[position.ease]
          : sprite.ease,
      );
  }

}
