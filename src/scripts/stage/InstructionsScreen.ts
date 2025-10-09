import * as me from "melonjs";


export default class InstructionsScreen extends me.Stage {
  private btn!: me.GUI_Object;

  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "juhised" });
    me.game.world.addChild(bg);

    const btnX = 1000;
    const btnY = 400;
    const btnImage = me.loader.getImage("jookse");
    this.btn = new (class extends me.GUI_Object {
      constructor() {
        super(btnX, btnY, {
          image: btnImage,
          width: btnImage.width,
          height: btnImage.height,
        });
      }
      onClick(event: any) {
        me.state.change(me.state.USER, false);
        return false;
      }
    })();
    me.game.world.addChild(this.btn as any);

    // Button click handled by GUI_Object onClick
  }

  onDestroyEvent() {
    // No need to release pointer events for GUI_Object

    me.game.world.reset();
  }
}

