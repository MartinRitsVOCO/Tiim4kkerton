import * as me from "melonjs";
import game from "./game";
import Countdown from "../utils/Countdown";

export default class FeedbackScreen extends me.Stage {
  onResetEvent() {
    const isCorrect = game.data.answers.at(-1);
    const text = isCorrect ? "Õige!" : "Vale!";

    const bg = new me.ColorLayer("bg", isCorrect ? "#228833" : "#883333", 0);
    me.game.world.addChild(bg);

    const message = new me.Text(0, 0, {
      font: "Arial",
      size: 48,
      fillStyle: "#fff",
      text,
      textAlign: "center",
    });
    message.pos.set(me.game.viewport.width / 2, 200);
    me.game.world.addChild(message);

    const countdown = new Countdown(3, () => {
      if (game.data.level > 7) {
        me.state.change(me.state.CREDITS, false);
      } else {
        me.state.change(me.state.USER, false);
      }
    });
    me.game.world.addChild(countdown);
  }
}
