import * as easeFuncs from "../ease";
import { IBatchEvent } from "../events/IBatchEvent";
import { IButtonSelectedEvent } from "../events/IButtonSelected";
import { ICheckboxCheckedEvent } from "../events/ICheckboxCheckedEvent";
import { ICreateButtonEvent } from "../events/ICreateButtonEvent";
import { ICreateCharacterEvent } from "../events/ICreateCharacterEvent";
import { ICreateCheckboxEvent } from "../events/ICreateCheckboxEvent";
import { ICreateCloseEvent } from "../events/ICreateCloseEvent";
import { ICreateLabelEvent } from "../events/ICreateLabelEvent";
import { ICreatePanelEvent } from "../events/ICreatePanelEvent";
import { ICreateSliderEvent } from "../events/ICreateSliderEvent";
import { ICreateSoundSpriteEvent } from "../events/ICreateSoundSpriteEvent";
import { ICreateSpriteEvent } from "../events/ICreateSpriteEvent";
import { ICreateTextboxEvent } from "../events/ICreateTextbox";
import { ILoadFontsEvent } from "../events/ILoadFontsEvent";
import { IPauseSoundEvent } from "../events/IPauseSoundEvent";
import { IPlaySoundEvent } from "../events/IPlaySoundEvent";
import { ISkipAnimationEvent } from "../events/ISkipAnimationEvent";
import { ISliderValueChangeEvent } from "../events/ISliderValueChangeEvent";
import { ISpriteMoveEvent } from "../events/ISpriteMoveEvent";
import { ISpriteRemoveEvent } from "../events/ISpriteRemoveEvent";
import { IStopSoundEvent } from "../events/IStopSoundEvent";
import { ITextboxChangeEvent } from "../events/ITextboxChangeEvent";
import { ITextChangeEvent } from "../events/ITextChangeEvent";
import { ITextureChangeEvent } from "../events/ITextureChangeEvent";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IInteractionPoint, ISpriteSheet } from "../util";
import { IButton, loadButton } from "../view/Button";
import { loadCharacter } from "../view/Character";
import { ICheckbox, loadCheckbox } from "../view/Checkbox";
import { loadClose } from "../view/Close";
import { loadFonts } from "../view/fonts";
import { ILabel, loadLabel } from "../view/Label";
import { IPanel, loadPanel } from "../view/Panel";
import { ISlider, loadSlider } from "../view/Slider";
import { ISoundSprite, ISoundSpriteSheet, loadSoundSprite } from "../view/SoundSprite";
import { ISprite, loadSprite } from "../view/Sprite";
import { IStage, IStageProps, Stage } from "../view/Stage";
import { ITextbox, loadTextbox } from "../view/Textbox";

export interface ISpriteSheetMap {
  [name: string]: { index: ISpriteSheet };
}

export interface ICharacterSourceMap {
  [name: string]: { "spritesheet.png": string; };
}

export interface ISoundSourceMap {
  [name: string]: string;
}

export interface IStageManagerProps extends IStageProps {

}

export interface ISpriteIndex {
  [id: string]: ISprite;
}

export interface ISoundSpriteIndex {
  [id: string]: ISoundSprite;
}

export interface ISoundSpriteSheetIndex {
  [id: string]: ISoundSpriteSheet;
}

export interface IStageManager extends IStage {
  handle(event: IWorkerEvent): Promise<void>;
}

export class StageManager extends Stage implements IStageManager {
  private static CharacterDefinitions: ISpriteSheetMap = require("../../assets/characters/**/*.json");
  private static CharacterSources: ICharacterSourceMap = require("../../assets/characters/**/*.png");
  private static SpriteDefinitions: ISpriteSheetMap = require("../../assets/characters/**/*.json");
  private static SpriteSources: ICharacterSourceMap = require("../../assets/characters/**/*.png");
  private static mp3s: ISoundSourceMap = require("../../assets/sound/*.mp3");
  private static oggs: ISoundSourceMap = require("../../assets/sound/*.ogg");
  private static flacs: ISoundSourceMap = require("../../assets/sound/*.flac");
  private static wavs: ISoundSourceMap = require("../../assets/sound/*.wav");
  private static SoundDefinitions: ISoundSpriteSheetIndex = require("../../assets/sound/*.json");
  private handling: Promise<void> = Promise.resolve();

  private index: ISpriteIndex = {};
  private soundIndex: ISoundSpriteIndex = {};

  constructor(props: IStageManagerProps) {
    super(props);
  }

  public handle(event: IWorkerEvent): Promise<void> {
    return this.handling = this.handling
      .then(
        () => this.handleEvent(event),
      )
      .catch(
        (error) => console.error(error),
      );
  }

  private async handleEvent(event: IWorkerEvent): Promise<void> {
    if (event.type === "batch") {
      await this.handleBatch(event as IBatchEvent);
      return;
    }

    if (event.type === "button-selected") {
      await this.handleButtonSelected(event as IButtonSelectedEvent);
      return;
    }

    if (event.type === "checkbox-checked") {
      await this.handleCheckboxChecked(event as ICheckboxCheckedEvent);
      return;
    }

    if (event.type === "create-button") {
      await this.handleCreateButton(event as ICreateButtonEvent);
      return;
    }

    if (event.type === "create-character") {
      await this.handleCreateCharacter(event as ICreateCharacterEvent);
      return;
    }

    if (event.type === "create-checkbox") {
      await this.handleCreateCheckbox(event as ICreateCheckboxEvent);
      return;
    }

    if (event.type === "create-close") {
      await this.handleCreateClose(event as ICreateCloseEvent);
      return;
    }

    if (event.type === "create-label") {
      await this.handleCreateLabel(event as ICreateLabelEvent);
      return;
    }

    if (event.type === "create-panel") {
      await this.handleCreatePanel(event as ICreatePanelEvent);
      return;
    }

    if (event.type === "create-slider") {
      await this.handleCreateSlider(event as ICreateSliderEvent);
      return;
    }

    if (event.type === "create-sprite") {
      await this.handleCreateSprite(event as ICreateSpriteEvent);
      return;
    }

    if (event.type === "create-textbox") {
      await this.handleCreateTextbox(event as ICreateTextboxEvent);
      return;
    }

    if (event.type === "skip-animation") {
      await this.handleSkipAnimation(event as ISkipAnimationEvent);
      return;
    }

    if (event.type === "sprite-move") {
      await this.handleSpriteMove(event as ISpriteMoveEvent);
      return;
    }

    if (event.type === "sprite-remove") {
      await this.handleSpriteRemove(event as ISpriteRemoveEvent);
      return;
    }

    if (event.type === "text-change") {
      await this.handleTextChange(event as ITextChangeEvent);
      return;
    }

    if (event.type === "texture-change") {
      await this.handleTextureChange(event as ITextureChangeEvent);
      return;
    }

    if (event.type === "create-sound-sprite") {
      await this.handleCreateSound(event as ICreateSoundSpriteEvent);
      return;
    }

    if (event.type === "play-sound") {
      await this.handlePlaySound(event as IPlaySoundEvent);
      return;
    }

    if (event.type === "pause-sound") {
      await this.handlePauseSound(event as IPauseSoundEvent);
      return;
    }

    if (event.type === "stop-sound") {
      await this.handleStopSound(event as IStopSoundEvent);
      return;
    }

    if (event.type === "load-fonts") {
      await this.handleLoadFonts(event as ILoadFontsEvent);
      return;
    }

    if (event.type === "slider-value-change") {
      await this.handleSliderValueChange(event as ISliderValueChangeEvent);
      return;
    }

    if (event.type === "textbox-change") {
      await this.handleTextboxChange(event as ITextboxChangeEvent);
    }
    throw new Error(`Event unhandled: ${event.type}.`);
  }

  private async handleBatch(event: IBatchEvent): Promise<void> {
    for (const child of event.props.events) {
      await this.handleEvent(child);
    }
  }

  private async handleButtonSelected(event: IButtonSelectedEvent): Promise<void> {
    const button: IButton = this.index[event.props.id] as IButton;
    button.selected = event.props.selected;
  }

  private async handleCheckboxChecked(event: ICheckboxCheckedEvent): Promise<void> {
    const checkbox: ICheckbox = this.index[event.props.id] as ICheckbox;
    checkbox.checked = event.props.checked;
  }

  private async handleCreateButton(event: ICreateButtonEvent): Promise<void> {
    event.props.src = require("../../assets/button/spritesheet.png");
    event.props.definition = require("../../assets/button/index.json");
    const b = await loadButton(event.props);
    return this.indexAndAdd(b, event.props.parent);
  }

  // must import references to character spritesheets and sources
  private async handleCreateCharacter(event: ICreateCharacterEvent): Promise<void> {
    event.props.src = StageManager.CharacterSources[event.props.name]["spritesheet.png"];
    event.props.definition = StageManager.CharacterDefinitions[event.props.name].index;
    const b = await loadCharacter(event.props);
    return this.indexAndAdd(b, event.props.parent);
  }

  private async handleCreateCheckbox(event: ICreateCheckboxEvent): Promise<void> {
    event.props.src = require("../../assets/checkbox/spritesheet.png");
    event.props.definition = require("../../assets/checkbox/index.json");
    const c = await loadCheckbox(event.props);

    c.on("toggle", () => {
      this.emit("toggle", c);
    });

    return this.indexAndAdd(c, event.props.parent);
  }

  private async handleCreateClose(event: ICreateCloseEvent): Promise<void> {
    event.props.src = require("../../assets/close/spritesheet.png");
    event.props.definition = require("../../assets/close/index.json");
    const b = await loadClose(event.props);
    return this.indexAndAdd(b, event.props.parent);
  }

  private async handleCreateLabel(event: ICreateLabelEvent): Promise<void> {
    const l = await loadLabel(event.props);
    return this.indexAndAdd(l, event.props.parent);
  }

  private async handleCreatePanel(event: ICreatePanelEvent): Promise<void> {
    event.props.src = require("../../assets/panel/spritesheet.png");
    event.props.definition = require("../../assets/panel/index.json");
    const p = await loadPanel(event.props);
    return this.indexAndAdd(p, event.props.parent);
  }

  private async handleCreateSlider(event: ICreateSliderEvent): Promise<void> {
    event.props.src = require("../../assets/slider/spritesheet.png");
    event.props.definition = require("../../assets/slider/index.json");
    const s = await loadSlider(event.props);

    s.on("value-change", () => {
      this.emit("value-change", s);
    });

    return this.indexAndAdd(s, event.props.parent);
  }

  private async handleCreateSprite(event: ICreateSpriteEvent): Promise<void> {
    event.props.src = StageManager.SpriteSources[event.props.name]["spritesheet.png"];
    event.props.definition = StageManager.SpriteDefinitions[event.props.name].index;
    const s = await loadSprite(event.props);
    return this.indexAndAdd(s, event.props.parent);
  }

  private async handleCreateTextbox(event: ICreateTextboxEvent): Promise<void> {
    event.props.src = require("../../assets/textbox/spritesheet.png");
    event.props.definition = require("../../assets/textbox/index.json");
    const p = await loadTextbox(event.props);
    return this.indexAndAdd(p, event.props.parent);
  }

  private async handleSkipAnimation(event: ISkipAnimationEvent): Promise<void> {
    this.skipAnimations();
  }

  private async handleSpriteMove(event: ISpriteMoveEvent): Promise<void> {
    const props = event.props;
    const sprite: ISprite = this.index[props.id];

    sprite
      .move(props.position)
      .over(props.timespan, props.wait, easeFuncs[props.ease] as (ratio: number) => number)
      .setAlpha(props.alpha)
      .setZ(props.z);
  }

  private async handleSpriteRemove(event: ISpriteRemoveEvent): Promise<void> {
    const sprite: ISprite = this.index[event.props.id];
    const target: IPanel | IStage = sprite.parent as IPanel || this;
    target.removeSprite(sprite);
    delete this.index[event.props.id];
    sprite.removeAllListeners("click")
      .removeAllListeners("point-move")
      .removeAllListeners("value-change")
      .removeAllListeners("texture-change")
      .removeAllListeners("toggle");
  }

  private async handleTextChange(event: ITextChangeEvent): Promise<void> {
    const t: ILabel | ITextbox | IButton | ICheckbox
      = this.index[event.props.id] as ILabel | ITextbox | IButton | ICheckbox;
    t.setText(event.props.text);
    t.font = event.props.font;
    t.fontColor = event.props.fontColor;
    t.fontSize = event.props.fontSize;
    t.textAlign = event.props.textAlign;
    t.textBaseline = event.props.textBaseline;
  }

  private async handleTextureChange(event: ITextureChangeEvent): Promise<void> {
    const t: ISprite = this.index[event.props.id];
    t.setTexture(event.props.texture);
  }

  private async handleCreateSound(event: ICreateSoundSpriteEvent): Promise<void> {
    const s: ISoundSprite = await loadSoundSprite({
      buffer: await fetch(
        StageManager.mp3s[`${event.props.id}.mp3`]
        || StageManager.oggs[`${event.props.id}.ogg`]
        || StageManager.flacs[`${event.props.id}.flac`]
        || StageManager.wavs[`${event.props.id}.wav`],
      ).then(e => e.arrayBuffer()),
      context: this.audioContext,
      definition: StageManager.SoundDefinitions[`${event.props.id}.json`] as ISoundSpriteSheet,
      id: event.props.id,
    });
    this.addSoundSprite(s);
    this.soundIndex[s.id] = s;
  }

  private async handlePlaySound(event: IPlaySoundEvent): Promise<void> {
    const s: ISoundSprite = this.soundIndex[event.props.id];
    if (s.playing) {
      s.stop();
    }

    s.sound = event.props.sound;
    s.play();
  }

  private async handlePauseSound(event: IPauseSoundEvent): Promise<void> {
    const s: ISoundSprite = this.soundIndex[event.props.id];
    if (s.playing && !s.paused) {
      s.pause();
    }
  }

  private async handleStopSound(event: IStopSoundEvent): Promise<void> {
    const s: ISoundSprite = this.soundIndex[event.props.id];
    if (s.playing) {
      s.stop();
    }
  }

  private async handleSliderValueChange(event: ISliderValueChangeEvent): Promise<void> {
    const s: ISlider = this.index[event.props.id] as ISlider;

    s.width = event.props.width;
    s.max = event.props.max;
    s.min = event.props.min;
    s.value = event.props.value;
  }

  private async handleLoadFonts(event: ILoadFontsEvent): Promise<void> {
    await loadFonts(require("../../assets/fonts/*.*"));
  }

  private async handleTextboxChange(event: ITextboxChangeEvent): Promise<void> {
    const s: ITextbox = this.index[event.props.id] as ITextbox;
    s.lineHeight = event.props.lineHeight;
    s.padding = event.props.padding;
    s.textSpeed = event.props.textSpeed;
  }

  private indexAndAdd(child: ISprite, parent: string): void {
    this.index[child.id] = child;

    child.on("click", () => {
      this.emit("click", child);
    });

    child.on("texture-change", () => {
      this.emit("texture-change", child);
    });

    child.on("point-move", (sprite: ISprite, point: IInteractionPoint) => {
      this.emit("point-move", sprite, point);
    });

    const target: IStage | IPanel = (this.index[parent] as IPanel) || this;
    target.addSprite(child);
  }
}
