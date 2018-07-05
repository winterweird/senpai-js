import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface IButton extends ISprite {
  selected: boolean;
};

export interface IButtonProps extends ISpriteProps {
  selected?: boolean;
};

export class Button extends Sprite implements IButton {
  selected: boolean = false;

  constructor(props: IButtonProps) {
    super(props);
    this.selected = props.selected || false;
  }
  update() {
    let start = this.selected ? `Selected` : `Unselected`;
    let end = this.active
      ? `Active`
      : "Inactive";
    this.setTexture(`${start}${end}`)
  }
};

export async function loadButton() {
  
}