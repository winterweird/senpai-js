# Architecture

## ./babel-plugins

This folder contains some ideas I've been tweaking with in terms of babel-plugins. Ignore this directory for now.

## script

This folder contains all the downstream developer generated content for game scripts that run inside the engine. The proposal so far for script files will support the following file types:

- .md (Markdown files)
- .js, .ts, .cs,  (things that transpile to js inside parcel)
- .json, .yaml, (static file formats)
- .aml (archieml possibly)
- .senpaijs (a dsl that compiles to a .js file state machine)

## src

This folder contains all the source for the engine

### ease

This folder contains an `index.ts` file for all the ease functions. Props to `b-fuze` for helping increase ease precision. Ease functions have a typescript signature like this:

```ts
type EaseFunction = (value: number /* range: [0-100] */) => number; /* range: [0-100] */
```

The `value` parameter is a `Float` ratio that represents the linear length of time that has past relative to how long the animation needs to take. For instance, if the animation just started, `value` should be `0`. If the animation has completed, it should return `100`.  A quadratic ease function would return a `value` distribution that is curved quadratically.

### manager

This folder contains a class that has knowledge of how the project is structured, how sprites are setup, and works with the `Stage` class in the `./src/view` folder. It's sole responsibility is to create `Sprite`s and `SoundSprites`.

### matrix

This folder contains a whole framework for modifying 2d transforms. Each function accepts either a `Float64Array` or `number[]` of length 6, and the numbers map to the following matrix elements. `[aa, ab, ba, bb, ca, cb]`