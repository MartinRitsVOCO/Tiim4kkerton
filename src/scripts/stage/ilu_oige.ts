import * as me from "melonjs";
import game from "./game";
import Countdown from "../utils/Countdown";
import { TOITKYSIMUS } from "../..";

export default class IluOige extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "ilu_2" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(124, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}