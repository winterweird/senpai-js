
import { Character, ICharacter } from "./Character";
import { Identity } from "./Matrix";

export interface IPoint {
  x: number;
  y: number;
};

export interface ISize {
  width: number;
  height: number;
};

export interface ISpriteSheetSize {
  w: number;
  h: number;
};

export interface ISpriteSheetMeta {
  app: string;
  version: string;
  image: string;
  size: ISpriteSheetSize;
  scale: number;
};

export interface ISpriteSheetPoint {
  x: number;
  y: number;
};

export interface ISpriteSheetFrame {
  frame: ISpriteSheetPoint & ISpriteSheetSize;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: ISpriteSheetPoint & ISpriteSheetSize;
  sourceSize: ISpriteSheetSize;
};

export interface ISpriteSheetFrameMap {
  [frame: string]: ISpriteSheetFrame;
};

export interface ISpriteSheet {
  frames: ISpriteSheetFrameMap;
  meta: ISpriteSheetMeta;
};

export interface IInteractionPoint extends IPoint {
  id: string;
  type: "Touch" | "Mouse";
  down: boolean;
};

export interface IKeyState {
  key: string;
  down: boolean;
};

export interface IKeyData {
  getKey(key: string): IKeyState;
};

export interface IKeyDataIndex {
  [key: string]: IKeyState;
};

export class KeyState implements IKeyState {
  constructor(key: string) {
    this.key = key;
  }
  key: string = "";
  down: boolean = false;
};

export class KeyData implements IKeyData {
  constructor() { }
  keys: IKeyDataIndex = {};
  getKey(key: string): IKeyState {
    if (!this.keys.hasOwnProperty(key)) {
      this.keys[key] = new KeyState(key);
    }
    return this.keys[key];
  }
};

export interface ITextureMap {
  [texture: string]: ImageBitmap;
};

export async function loadCharacter(name: string): ICharacter {
  const img = loadImage(`./assets/characters/${name}/spritesheet.png`);
  const definition: ISpriteSheet = require(`../../assets/characters/${name}/index.json`);
  const moods: ITextureMap = {};
  await Promise.all(
    Object.entries(definition.frames).map(async function([mood, moodDefintion], i) {
      moods[mood] = await createImageBitmap(
        await img,
        moodDefintion.frame.x,
        moodDefintion.frame.y,
        moodDefintion.frame.w,
        moodDefintion.frame.h
      );
    })
  );
  const character = new Character({
    name,
    moods,
    position: Identity,
  });
  return character;
};

export async function loadImage(src: string): Promise<ImageBitmap> {
  const res = await fetch(src);
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob);
  return bmp;
};

export async function loadSoundBuffer(source: Promise<Response>, start: number, finish: number) {
  const res = await source;
  const buffer = await res.arrayBuffer();
};