import {  IStage, IStageProps, Stage } from "../view/Stage";
import { loadCharacter } from "../view/Character";
import { ISpriteSheet } from "../util";
import { IPanel, loadPanel } from "../view/Panel";
import { ISprite, loadSprite } from "../view/Sprite";
import { loadCheckbox, ICheckbox } from "../view/Checkbox";
import { IWorkerEvent } from "../events/IWorkerEvent";
import { IBatchEvent } from "../events/IBatchEvent";
import { IButtonSelectedEvent } from "../events/IButtonSelected";
import { IButton, loadButton } from "../view/Button";
import { ICheckboxCheckedEvent } from "../events/ICheckboxCheckedEvent";
import { ICreateButtonEvent } from "../events/ICreateButtonEvent";
import { loadTextbox, ITextbox } from "../view/Textbox";
import { ICreateCharacterEvent } from "../events/ICreateCharacterEvent";
import { ICreateCheckboxEvent } from "../events/ICreateCheckboxEvent";
import { ICreateCloseEvent } from "../events/ICreateCloseEvent";
import { loadClose } from "../view/Close";
import { ICreateLabelEvent } from "../events/ICreateLabelEvent";
import { loadLabel, ILabel } from "../view/Label";
import { ICreatePanelEvent } from "../events/ICreatePanelEvent";
import { ICreateSliderEvent } from "../events/ICreateSlider";
import { loadSlider } from "../view/Slider";
import { ICreateSpriteEvent } from "../events/ICreateSpriteEvent";
import { ICreateTextboxEvent } from "../events/ICreateTextbox";
import { ISpriteMoveEvent } from "../events/ISpriteMoveEvent";
import { ISpriteRemoveEvent } from "../events/ISpriteRemove";
import { ITextboxAppendEvent } from "../events/ITextboxAppendEvent";
import { ITextChangeEvent } from "../events/ITextChangeEvent";
import { ITextureChangeEvent } from "../events/ITextureChangeEvent";
import * as easeFuncs from "../ease";
import { ISkipAnimationEvent } from "../events/ISkipAnimationEvent";

export interface ISpriteSheetMap {
  [name: string]: { index: ISpriteSheet };
}

export interface ICharacterSource {
  [name: string]: { "spritesheet.png": string; };
}

export interface IStageManagerProps extends IStageProps {

}

export interface ISpriteIndex {
  [id: string]: ISprite;
}

export interface IStageManager extends IStage {
  handle(event: IWorkerEvent): Promise<void>;
}

export class StageManager extends Stage implements IStageManager {
  private static CharacterDefinitions: ISpriteSheetMap = require("../../assets/characters/**/*.json");
  private static CharacterSources: ICharacterSource = require("../../assets/characters/**/*.png");
  private static SpriteDefinitions: ISpriteSheetMap = require("../../assets/characters/**/*.json");
  private static SpriteSources: ICharacterSource = require("../../assets/characters/**/*.png");

  private index: ISpriteIndex = {};

  constructor(props: IStageManagerProps) {
    super(props);
  }

  public async handle(event: IWorkerEvent): Promise<void> {
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

    if (event.type === "textbox-append") {
      await this.handleTextboxAppend(event as ITextboxAppendEvent);
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
  }

  private async handleBatch(event: IBatchEvent): Promise<void> {
    for (const child of event.props.events) {
      await this.handle(child);
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

    c.on("toggle", e => this.emit("toggle", c));

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

    s.on("value-change", e => this.emit("value-change", s));

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
      .over(props.timespan, easeFuncs[props.ease] as (ratio: number) => number)
      .setAlpha(props.alpha)
      .setZ(props.z);
  }

  private async handleSpriteRemove(event: ISpriteRemoveEvent): Promise<void> {
    const sprite: ISprite = this.index[event.props.id];
    const target: IPanel | IStage = sprite.parent as IPanel || this;
    target.removeSprite(sprite);
    delete this.index[event.props.id];
  }

  private async handleTextboxAppend(event: ITextboxAppendEvent): Promise<void> {
    const t: ITextbox = this.index[event.props.id] as ITextbox;
    t.appendText(event.props.append);
  }

  private async handleTextChange(event: ITextChangeEvent): Promise<void> {
    const t: ILabel | ITextbox | IButton | ICheckbox
      = this.index[event.props.id] as ILabel | ITextbox | IButton | ICheckbox;
    t.text = event.props.text;
    t.font = event.props.font;
    t.fontColor = event.props.fontColor;
    t.fontSize = event.props.fontSize;
  }

  private async handleTextureChange(event: ITextureChangeEvent): Promise<void> {
    const t: ISprite = this.index[event.props.id];
    t.setTexture(event.props.texture);
  }

  private indexAndAdd(sprite: ISprite, parent: string): void {
    this.index[sprite.id] = sprite;

    sprite.on("click", e => this.emit("click", sprite))
      .on("texture-change", e => this.emit("texture-change", sprite))
      .on("point-move", e => this.emit("point-move", sprite));

    const target: IStage | IPanel = (this.index[parent] as IPanel) || this;
    target.addSprite(sprite);
  }
}
