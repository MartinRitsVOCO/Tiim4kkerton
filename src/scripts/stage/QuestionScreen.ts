import * as me from "melonjs";

export default class QuestionScreen extends me.Stage {
    private yesBtn!: me.Sprite;
    private noBtn!: me.Sprite;

  onResetEvent() {
    const bg = new me.Sprite(0, 0, { image : "ari",
    });
    me.game.world.addChild(bg);

    this.yesBtn = new me.Sprite(400, 300, { image: "ari_jah" });
    this.noBtn = new me.Sprite(800, 300, { image: "ari_ei" });


    me.game.world.addChild(this.yesBtn);
    me.game.world.addChild(this.noBtn);

    //  Register pointer event for click
    me.input.registerPointerEvent("pointerdown", this.yesBtn, () => {
        console.log("Vastus jah, vastus vale")
      me.state.change(me.state.GAMEOVER, false);
      return false;
    });

        me.input.registerPointerEvent("pointerdown", this.noBtn, () => {
        console.log("Vastus ei, vastus õige")
      me.state.change(me.state.GAMEOVER, false);
      return false;
    });
  }


  onDestroyEvent() {
    me.input.releasePointerEvent("pointerdown", this.yesBtn);
    me.input.releasePointerEvent("pointerdown", this.noBtn);
  }
}

