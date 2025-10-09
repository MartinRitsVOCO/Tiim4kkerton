import * as me from "melonjs";
import game from "./game";
import Countdown from "../utils/Countdown";
import { TURISMKYSIMUS } from "../..";

export default class ToitVale extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "toit_3" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(125, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}