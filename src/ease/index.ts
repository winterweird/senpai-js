/****
 * Custom ease functions, designed with functional programming concepts.
 */
import { TAU, PI } from './consts';

function inverse(inFunc: Function): Function {
  return function outFunc(d: number): number {
    return 1 - inFunc(1 - d);
  };
}

function inOut(inFunc: Function): Function {
  const outFunc = inverse(inFunc);
  return function(d: number): number {
    return d < 0.5 ? 0.5 * inFunc(d * 2) : 0.5 + 0.5 * outFunc(2 * d - 1);
  };
}

export const easeLinear: Function = function linear(d: number): number {
  return d;
};

export const easeInQuad: Function = function easeInQuad(d: number): number {
    return d * d;
  },
  easeOutQuad: Function = inverse(easeInQuad),
  easeInOutQuad: Function = inOut(easeInQuad);

export const easeInCub: Function = function easeInCub(d: number): number {
    return d * d * d;
  },
  easeOutCub = inverse(easeInCub),
  easeInOutCub = inOut(easeInCub);

export const easeInQuart: Function = function easeInQuart(d: number): number {
    return d * d * d * d;
  },
  easeOutQuart = inverse(easeInQuart),
  easeInOutQuart = inOut(easeInQuart);

export const easeInQuint: Function = function easeInQuint(d: number): number {
    return d * d * d * d * d;
  },
  easeOutQuint = inverse(easeInQuint),
  easeInOutQuint = inOut(easeInQuint);

export const easeOutSin: Function = function easeInSin(d: number): number {
    return Math.sin(d * PI * 0.5);
  },
  easeInSin = inverse(easeOutSin),
  easeInOutSin = inOut(easeInSin);


const p = 0.3;
export const easeOutElastic: Function = function easeOutElastic(d: number): number {
    return Math.pow(2, -10 * d) * Math.sin((d - p / 4) * TAU / p) + 1;
  },
  easeInElastic = inverse(easeOutElastic),
  easeInOutElastic = inOut(easeInElastic);
