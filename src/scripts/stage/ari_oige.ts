import * as me from "melonjs";
import Countdown from "../utils/Countdown";
import { EHITUSKYSIMUS } from "../..";

export default class AriOige extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "ari_2" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(122, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }

  onDestroyEvent() {
    // No need to release pointer events for GUI_Object

    me.game.world.reset();
  }
}