import * as me from "melonjs";
import Countdown from "../utils/Countdown";

export default class ItVale extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "it_3" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(127, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}