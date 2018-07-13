import * as ease from "../src/ease"

export index = ->

  a = await Character
    name: "aya"
    displayName: "Aya Shameimaru"
    color: "red"
    ease: ease.easeInCub
    animationLength: 400

  tb = await Textbox
    id: "tb"
    font: "Puritain-Bold"
    fontSize: 20
    padding:
      top: 44
      left: 8
      right: 10
      bottom: 10

  sb = await Label
    id: "sb"
    font: "Puritain-Bold"
    fontSize: 20

  show a,
    x: 100
    y: 100
    z: 0
  show tb,
    y: 400
    z: 100
  show sb,
    x: 10
    y: 410
    z: 101

  a"""
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lorem leo, pulvinar eget ornare non, efficitur vitae eros. Integer egestas iaculis vestibulum. Vivamus at dui rhoncus, lobortis massa id, tincidunt justo. Duis sapien nibh, scelerisque imperdiet dignissim non, ullamcorper sed ante. Mauris suscipit euismod ligula.
  """

  move a,
    ease: "easeInCub"
    animationLength: 400
    x: 200
  a"""
  Aenean semper, orci nec vestibulum feugiat, diam ipsum faucibus turpis, eget maximus ipsum neque ut augue. Sed vitae nunc vestibulum, laoreet tellus at, congue dolor. Vestibulum gravida sed nibh in sollicitudin. Aliquam facilisis ante et viverra ultrices. In hac habitasse platea dictumst. Donec non elit aliquet, viverra enim non, molestie arcu. Sed id lorem ut mi tristique semper.
  """
  null