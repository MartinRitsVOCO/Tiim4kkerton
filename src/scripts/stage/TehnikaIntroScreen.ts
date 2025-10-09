import * as me from "melonjs";
import Countdown from "../utils/Countdown";
import AriKysimus from "./AriKysimus";
import { ARIKYSIMUS } from "../..";

export default class TehnikaIntroScreen extends me.Stage {
  onResetEvent() {
    const bg = new me.Sprite(609, 281, { image: "tehnika" });
    me.game.world.addChild(bg);



    const countdown = new Countdown(3, () => {
      me.state.change(121, false); // viib järgmisse ekraani (küsimus või mäng)
    });
  }
}