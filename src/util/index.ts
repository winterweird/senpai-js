import { ISprite } from "../view/Sprite";


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
  clicked: boolean;
  captured: boolean;
  active: ISprite;
  firstDown: boolean;
  tx: number;
  ty: number;
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

export interface ILoadProps {
  src: string;
  definition: ISpriteSheet;
};

export interface IPadding {
  left: number;
  right: number;
  top: number;
  bottom: number;
};