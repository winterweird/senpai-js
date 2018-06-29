export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IInteractionPoint extends IPoint {
  id: string;
  type: "Touch" | "Mouse";
  down: boolean;
}

export interface IKeyState {
  key: string;
  down: boolean;
}

export interface IKeyData {
  getKey(key: string): IKeyState;
}

export interface IKeyDataIndex {
  [key: string]: IKeyState;
}

export class KeyState implements IKeyState {
  constructor(key: string) {
    this.key = key;
  }
  key: string = "";
  down: boolean = false;
}

export class KeyData implements IKeyData {
  constructor() { }
  keys: IKeyDataIndex = {};
  getKey(key: string): IKeyState {
    if (!this.keys.hasOwnProperty(key)) {
      this.keys[key] = new KeyState(key);
    }
    return this.keys[key];
  }
}