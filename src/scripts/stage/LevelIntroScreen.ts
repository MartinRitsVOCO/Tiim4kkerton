import * as me from "melonjs";
import game from "./game";
import Countdown from "../utils/Countdown";

export default class LevelIntroScreen extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "tehnika" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(me.state.PLAY, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}