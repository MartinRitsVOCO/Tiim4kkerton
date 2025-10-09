import * as me from "melonjs";
import { TOITOIGE, TOITVALE } from "../..";

export default class ToitKysimus extends me.Stage {
    private yesBtn!: me.GUI_Object;
    private noBtn!: me.GUI_Object;

    onResetEvent() {
        const bg = new me.Sprite(609, 281, { image: me.loader.getImage("toit_1") });
        me.game.world.addChild(bg);

        this.yesBtn = new (class extends me.GUI_Object {
            constructor() {
                super(220, 440, {
                    image: me.loader.getImage("toit_oigevastus"),
                    width: me.loader.getImage("toit_oigevastus").width,
                    height: me.loader.getImage("toit_oigevastus").height,
                });
            }
            onClick() {
                console.log("vastus õige");
                me.state.change(TOITOIGE, false);
                return false;
            }
        })();

        this.noBtn = new (class extends me.GUI_Object {
            constructor() {
                super(620, 440, {
                    image: me.loader.getImage("toit_valevastus"),
                    width: me.loader.getImage("toit_valevastus").width,
                    height: me.loader.getImage("toit_valevastus").height,
                });
            }
            onClick() {
                console.log("vastus vale");
                me.state.change(TOITVALE, false);
                return false;
            }
        })();

        me.game.world.addChild(this.yesBtn as any);
        me.game.world.addChild(this.noBtn as any);
    }

    onDestroyEvent() {
        // No need to release pointer events for GUI_Object
    }
}
