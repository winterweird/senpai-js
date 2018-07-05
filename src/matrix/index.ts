import { IInteractionPoint } from "../util";

export interface IMatrix {
  translate(x: number, y: number): this;
  scale(x: number, y: number): this;
  rotate(angle: number): this;
  skewX(angle: number): this;
  skewY(angle: number): this;
  transform(props: Float64Array | number[] | Matrix): this;
  value: number[] | Float64Array;
};

export class Matrix implements IMatrix {
  value: number[] | Float64Array = Identity;
  constructor(value?: number[] | Float64Array) {
    this.value = value || this.value;
  }

  translate(x: number, y: number): this {
    translate(x, y, this.value, this.value);
    return this;
  }
  scale(x: number, y: number): this {
    scale(x, y, this.value, this.value);
    return this;
  }
  rotate(angle: number): this {
    rotate(angle, this.value, this.value);
    return this;
  }
  skewX(angle: number): this {
    skewX(angle, this.value, this.value);
    return this;
  }
  skewY(angle: number): this {
    skewY(angle, this.value, this.value);
    return this;
  }
  transform(props: Float64Array | number[]): this {
    transform(this.value, props, this.value);
    return this;
  }
};

export function inverse(
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const a:number = matrix[0],
    b: number = matrix[1],
    c: number = matrix[2],
    d: number = matrix[3],
    e: number = matrix[4],
    f: number = matrix[5],
    det: number = 1 / (a * d - c * b);

  setMatrix[0] = d * det;
  setMatrix[1] = -b * det;
  setMatrix[2] = -c * det;
  setMatrix[3] = a * det;
  setMatrix[4] = (c * f - e * d) * det;
  setMatrix[5] = (e * b - a * f) * det;
};

export const Identity = new Float64Array([1, 0, 0, 1, 0, 0]);

export function translate(
  x: number,
  y: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  setMatrix[0] = matrix[0];
  setMatrix[1] = matrix[1];
  setMatrix[2] = matrix[2];
  setMatrix[3] = matrix[3];
  setMatrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
  setMatrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
};

export function scale(
  x: number,
  y: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  setMatrix[0] = matrix[0] * x;
  setMatrix[1] = matrix[1] * x;
  setMatrix[2] = matrix[2] * y;
  setMatrix[3] = matrix[3] * y;
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
};

export function rotate(
  angle: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const cos = Math.cos(angle),
    sin = Math.sin(angle),
    a = matrix[0],
    b = matrix[1],
    c = matrix[2],
    d = matrix[3];

  setMatrix[0] = a * cos + c * sin;
  setMatrix[1] = b * cos + d * sin;
  setMatrix[2] = c * cos - a * sin;
  setMatrix[3] = d * cos - b * sin;
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
};

export function skewX(
  angle: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const tan = Math.tan(angle);

  setMatrix[0] = matrix[0];
  setMatrix[1] = matrix[1];
  setMatrix[2] = matrix[2] + matrix[0] * tan;
  setMatrix[3] = matrix[3] + matrix[1] * tan;
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
};

export function skewY(
  angle: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const tan = Math.tan(angle);

  setMatrix[0] = matrix[0] + matrix[2] * tan;
  setMatrix[1] = matrix[1] + matrix[3] * tan;
  setMatrix[2] = matrix[2];
  setMatrix[3] = matrix[3];
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
};

export function transform(
  matrix: Float64Array | number[],
  props: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  //props values
  const pa = props[0],
    pb = props[1],
    pc = props[2],
    pd = props[3],
    pe = props[4],
    pf = props[5];

  //matrix values
  const ma = matrix[0],
    mb = matrix[1],
    mc = matrix[2],
    md = matrix[3],
    me = matrix[4],
    mf = matrix[5];

  setMatrix[0] = ma * pa + mc * pb;
  setMatrix[1] = mb * pa + md * pb;
  setMatrix[2] = ma * pc + mc * pd;
  setMatrix[3] = mb * pc + md * pd;
  setMatrix[4] = ma * pe + mc * pf + me;
  setMatrix[5] = mb * pe + md * pf + mf;
};

export function transformPoints(
  points: IInteractionPoint[],
  matrix: Float64Array | number[],
): void {
  const a: number = matrix[0],
    b: number = matrix[1],
    c: number = matrix[2],
    d: number = matrix[3],
    e: number = matrix[4],
    f: number = matrix[5];

  let point: IInteractionPoint;
  for (let i = 0; i < points.length; i++) {
    point = points[i];
    point.tx = a * point.x + c * point.y + e;
    point.ty = b * point.x + d * point.y + f;
  }
};

export function set(
  target: Float64Array | number[],
  source: Float64Array | number[],
): void {
  for (let i = 0; i < target.length && i < source.length; i++) {
    target[i] = source[i];
  }
};

export function chain(value: Float64Array | number[]): IMatrix {
  return new Matrix(value);
};