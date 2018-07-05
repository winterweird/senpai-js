/****
 * Custom ease functions, designed with functional programming concepts.
 */
import { TAU, PI } from './consts';

function inverse(inFunc: (ratio: number) => number): (ratio: number) => number {
  return function outFunc(ratio: number): number {
    return 1 - inFunc(1 - ratio);
  };
}

function inOut(inFunc: (ratio: number) => number): (ratio: number) => number {
  const outFunc = inverse(inFunc);
  return function(ratio: number): number {
    return ratio < 0.5 ? 0.5 * inFunc(ratio * 2) : 0.5 + 0.5 * outFunc(2 * ratio - 1);
  };
}

export const easeLinear: (ratio: number) => number = function linear(ratio: number): number {
  return ratio;
};

export const easeInQuad: (ratio: number) => number = function easeInQuad(ratio: number): number {
    return ratio * ratio;
  },
  easeOutQuad: (ratio: number) => number = inverse(easeInQuad),
  easeInOutQuad: (ratio: number) => number = inOut(easeInQuad);

export const easeInCub: (ratio: number) => number = function easeInCub(ratio: number): number {
    return ratio * ratio * ratio;
  },
  easeOutCub = inverse(easeInCub),
  easeInOutCub = inOut(easeInCub);

export const easeInQuart: (ratio: number) => number = function easeInQuart(ratio: number): number {
    return ratio * ratio * ratio * ratio;
  },
  easeOutQuart = inverse(easeInQuart),
  easeInOutQuart = inOut(easeInQuart);

export const easeInQuint: (ratio: number) => number = function easeInQuint(ratio: number): number {
    return ratio * ratio * ratio * ratio * ratio;
  },
  easeOutQuint = inverse(easeInQuint),
  easeInOutQuint = inOut(easeInQuint);

export const easeOutSin: (ratio: number) => number = function easeInSin(ratio: number): number {
    return Math.sin(ratio * PI * 0.5);
  },
  easeInSin = inverse(easeOutSin),
  easeInOutSin = inOut(easeInSin);


const p = 0.3;
export const easeOutElastic: (ratio: number) => number = function easeOutElastic(ratio: number): number {
    return Math.pow(2, -10 * ratio) * Math.sin((ratio - p / 4) * TAU / p) + 1;
  },
  easeInElastic = inverse(easeOutElastic),
  easeInOutElastic = inOut(easeInElastic);
