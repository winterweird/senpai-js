import { Stage, IStage, IStageProps } from "../view/Stage";
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
  [name: string]: { index: ISpriteSheet }
};

export interface ICharacterSource {
  [name: string]: { "spritesheet.png": string; }
};

export interface IStageManagerProps extends IStageProps {

};

export interface ISpriteIndex {
  [id: string]: ISprite;
};

export interface IStageManager extends IStage {
  index: ISpriteIndex;
}

export class StageManager extends Stage implements IStageManager {
  index: ISpriteIndex = {};

  constructor(props: IStageManagerProps) {
    super(props);
  }

  async handle(event: IWorkerEvent) {
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

  async handleBatch(event: IBatchEvent) {
    for (let i = 0; i < event.props.events.length; i++) {
      await this.handle(event.props.events[i]);
    }
  }

  async handleButtonSelected(event: IButtonSelectedEvent) {
    const button: IButton = this.index[event.props.id] as IButton;
    button.selected = event.props.selected;
  }

  async handleCheckboxChecked(event: ICheckboxCheckedEvent) {
    const checkbox: ICheckbox = this.index[event.props.id] as ICheckbox;
    checkbox.checked = event.props.checked;
  }

  async handleCreateButton(event: ICreateButtonEvent) {
    event.props.src = require("../../assets/button/spritesheet.png");
    event.props.definition = require("../../assets/button/index.json");
    const b = await loadButton(event.props);
    return this.indexAndAdd(b, event.props.parent);
  }

  //must import references to character spritesheets and sources
  private static CharacterDefinitions: ISpriteSheetMap = require("../../assets/characters/**/*.json");
  private static CharacterSources: ICharacterSource = require("../../assets/characters/**/*.png");
  async handleCreateCharacter(event: ICreateCharacterEvent) {
    event.props.src = StageManager.CharacterSources[event.props.name]["spritesheet.png"];
    event.props.definition = StageManager.CharacterDefinitions[event.props.name].index;
    const b = await loadCharacter(event.props);
    return this.indexAndAdd(b, event.props.parent);
  }

  async handleCreateCheckbox(event: ICreateCheckboxEvent) {
    event.props.src = require("../../assets/checkbox/spritesheet.png");
    event.props.definition = require("../../assets/checkbox/index.json");
    const c = await loadCheckbox(event.props);
    return this.indexAndAdd(c, event.props.parent);
  }

  async handleCreateClose(event: ICreateCloseEvent) {
    event.props.src = require("../../assets/close/spritesheet.png");
    event.props.definition = require("../../assets/close/index.json");
    const b = await loadClose(event.props);
    return this.indexAndAdd(b, event.props.parent);
  }

  async handleCreateLabel(event: ICreateLabelEvent) {
    const l = await loadLabel(event.props);
    return this.indexAndAdd(l, event.props.parent);
  }

  async handleCreatePanel(event: ICreatePanelEvent) {
    event.props.src = require("../../assets/panel/spritesheet.png");
    event.props.definition = require("../../assets/panel/index.json");
    const p = await loadPanel(event.props);
    return this.indexAndAdd(p, event.props.parent);
  }

  async handleCreateSlider(event: ICreateSliderEvent) {
    event.props.src = require("../../assets/slider/spritesheet.png");
    event.props.definition = require("../../assets/slider/index.json");
    const s = await loadSlider(event.props);
    return this.indexAndAdd(s, event.props.parent);
  }

  private static SpriteDefinitions: ISpriteSheetMap = require("../../assets/characters/**/*.json");
  private static SpriteSources: ICharacterSource = require("../../assets/characters/**/*.png");
  async handleCreateSprite(event: ICreateSpriteEvent) {
    event.props.src = StageManager.SpriteSources[event.props.name]["spritesheet.png"];
    event.props.definition = StageManager.SpriteDefinitions[event.props.name].index;
    const s = await loadSprite(event.props);
    return this.indexAndAdd(s, event.props.parent);
  }

  async handleCreateTextbox(event: ICreateTextboxEvent) {
    event.props.src = require("../../assets/textbox/spritesheet.png");
    event.props.definition = require("../../assets/textbox/index.json");
    const p = await loadTextbox(event.props);
    return this.indexAndAdd(p, event.props.parent);
  }

  async handleSkipAnimation(event: ISkipAnimationEvent) {
    this.skipAnimations();
  }

  async handleSpriteMove(event: ISpriteMoveEvent) {
    const props = event.props;
    const sprite: ISprite = this.index[props.id];

    sprite
      .move(props.position)
      .over(props.timespan, easeFuncs[props.ease] as Function)
      .setAlpha(props.alpha)
      .setZ(props.z);
  }

  async handleSpriteRemove(event: ISpriteRemoveEvent) {
    const sprite: ISprite = this.index[event.props.id];
    const target: IPanel | IStage = sprite.parent as IPanel || this;
    target.removeSprite(sprite);
    delete this.index[event.props.id];
  }

  async handleTextboxAppend(event: ITextboxAppendEvent) {
    const t: ITextbox = this.index[event.props.id] as ITextbox;
    t.appendText(event.props.append);
  }

  async handleTextChange(event: ITextChangeEvent) {
    const t: ILabel | ITextbox | IButton | ICheckbox 
      = this.index[event.props.id] as ILabel | ITextbox | IButton | ICheckbox;
    t.text = event.props.text;
    t.font = event.props.font;
    t.fontColor = event.props.fontColor;
    t.fontSize = event.props.fontSize;
  }

  async handleTextureChange(event: ITextureChangeEvent) {
    const t: ISprite = this.index[event.props.id];
    t.setTexture(event.props.texture);
  }

  indexAndAdd(sprite: ISprite, parent: string) {
    this.index[sprite.id] = sprite;
    const target: IStage | IPanel = (this.index[parent] as IPanel) || this;
    target.addSprite(sprite);
  }
  
};