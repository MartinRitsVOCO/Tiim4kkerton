import * as me from "melonjs";
import game from "./game";
import Countdown from "../utils/Countdown";
import { TURISMKYSIMUS } from "../..";

export default class ToitOige extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "toit_2" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(125, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }

  onDestroyEvent() {
    // No need to release pointer events for GUI_Object

    me.game.world.reset();
  }
}