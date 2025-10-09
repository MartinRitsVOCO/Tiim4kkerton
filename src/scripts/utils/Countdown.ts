import * as me from "melonjs";

export default class Countdown extends me.Renderable {
  private count: number;
  private timer: number;
  private onFinish: () => void;

  constructor(start: number, onFinish: () => void) {
    super(0, 0, me.game.viewport.width, me.game.viewport.height);
    this.count = start;
    this.onFinish = onFinish;

    this.timer = window.setInterval(() => {
      this.count--;
      if (this.count <= 0) {
        clearInterval(this.timer);
        this.onFinish();
      }
    }, 1000);
  }

  draw(renderer: any) {
    renderer.setColor("#ffffff");
    renderer.setFont("Arial", 96, "bold");
    renderer.drawText(this.count.toString(), me.game.viewport.width / 2, me.game.viewport.height / 2);
  }

  onDestroyEvent() {
    clearInterval(this.timer);
  }
}
