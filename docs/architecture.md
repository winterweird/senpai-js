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

This folder contains a whole framework for modifying 2d transforms. Each function accepts either a `Float64Array` or `number[]` of length 6, and the numbers map to the following matrix elements. `[aa, ab, ba, bb, ca, cb]` See the following matrix representation for mapping.

```math
\begin{bmatrix}
   aa & ba & ca \\
   ab & bb & cb \\
   0  & 0  & 1
\end{bmatrix}
```

It contains a `chain(value: Float64Array|number[], immutable: boolean = false): IMatrix` function for chaining purposes.  If `immutable` is set to true, it will not modify the original matrix inline, and return a new `IMatrix` each time you chain a function.

### util

This folder contains a bunch of utility interfaces and classes. A lot of the utility interfaces that exist in the `./src/view` folder might be better placed in their own files inside this folder.

### view

This folder contains a set of controls that are used for drawing things to the canvas.

#### Container.ts

This file is the simple sprite and soundSprite container required for updating and rendering sprites, and stores the `AudioContext` used for playing music. It inherits the `EventEmitter` class for event purposes.

#### Sprite.ts

This is a parent class that is the basis for all sprites. It contains default drawing and collision logic for `IInteractionPoint` movement.

Notes on collision detection for sprites:

- `sprite.inverse` is calculated in the `interpolate(now: number)` function, and that happens once every time the sprite moves
- `inverse` is used to transform the mouse points toward the `ISprite`'s relative position. Imagine if we perform collision detection but the sprite is actually regularly shaped, and at `[0, 0]`

Each function performs the following operations:

- `ease`: The `EaseFunction` that controls the animation rate.
- `broadPhase`: Simple `aabb` collision detection. It uses the `tx` and `ty` properties and compares them to the `width` and `height` of the control
- narrowPhase: returns true unless it's overridden by a parent class
- `isHovering`: this is a function used by the `StageInteractionManager`