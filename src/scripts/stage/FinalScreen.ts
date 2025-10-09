
import * as me from "melonjs";
import game from "./game";

export default class FinalScreen extends me.Stage {
  onResetEvent() {
    const bg = new me.ColorLayer("bg", "#111122", 0);
    me.game.world.addChild(bg);

    const title = new me.Text(609, 220, {
      font: "Arial",
      size: 48,
      fillStyle: "#fff",
      text: "Mäng läbi!",
      textAlign: "center",
    });
    title.pos.set(me.game.viewport.width / 2, 150);
    me.game.world.addChild(title);

    const scoreText = new me.Text(609, 300, {
      font: "Arial",
      size: 24,
      fillStyle: "#fff",
      text: `Sinu tulemus: ${game.data.answers.filter(a => a).length} / 6`,
      textAlign: "center",
    });
    scoreText.pos.set(me.game.viewport.width / 2, 250);
    me.game.world.addChild(scoreText);
  }

  onDestroyEvent() {
    // No need to release pointer events for GUI_Object

    me.game.world.reset();
  }
}
