import * as me from "melonjs";
import Countdown from "../utils/Countdown";
import { ITKYSIMUS } from "../..";

export default class TurismOige extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "turism_2" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(126, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}