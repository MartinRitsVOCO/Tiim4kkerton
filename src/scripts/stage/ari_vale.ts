import * as me from "melonjs";
import Countdown from "../utils/Countdown";
import { EHITUSKYSIMUS } from "../..";

export default class AriVale extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "ari_3" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(122, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}