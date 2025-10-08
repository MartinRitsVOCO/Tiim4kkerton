import * as me from "melonjs";

export default class ClickableSprite extends me.Sprite {
  constructor(x: number, y: number, settings: any, onClick?: () => void) {
    super(x, y, settings);

    if (onClick) {
      me.input.registerPointerEvent("pointerdown", this, () => {
        onClick();
        return false;
      });
    }
  }

  onDestroyEvent() {
    me.input.releasePointerEvent("pointerdown", this);
  }
}