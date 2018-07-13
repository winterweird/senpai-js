import * as ease from "../src/ease"

export index = ->
  s = await Slider
    id: "test"
    width: 1000
    max: 1
    min: 0
    value: 1

  tb = await Textbox
    id: "tb"

  lb = await Label
    id: "lb"

  use tb, lb

  show s,
    x: 100
    y: 100

  yield new Promise((reject, resolve) -> null)
  null