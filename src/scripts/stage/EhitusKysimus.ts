import * as me from "melonjs";
import { EHITUSOIGE, EHITUSVALE } from "../..";

export default class EhitusKysimus extends me.Stage {
    private yesBtn!: me.GUI_Object;
    private noBtn!: me.GUI_Object;

    onResetEvent() {
        const bg = new me.Sprite(609, 281, { image: me.loader.getImage("ehitus_1") });
        me.game.world.addChild(bg);

        this.yesBtn = new (class extends me.GUI_Object {
            constructor() {
                super(220, 440, {
                    image: me.loader.getImage("ehitus_oigevastus"),
                    width: me.loader.getImage("ehitus_oigevastus").width,
                    height: me.loader.getImage("ehitus_oigevastus").height,
                });
            }
            onClick() {
                console.log("vastus õige");
                me.state.change(EHITUSOIGE, false);
                return false;
            }
        })();

        this.noBtn = new (class extends me.GUI_Object {
            constructor() {
                super(620, 440, {
                    image: me.loader.getImage("ehitus_valevastus"),
                    width: me.loader.getImage("ehitus_valevastus").width,
                    height: me.loader.getImage("ehitus_valevastus").height,
                });
            }
            onClick() {
                console.log("vastus vale");
                me.state.change(EHITUSVALE, false);
                return false;
            }
        })();

        me.game.world.addChild(this.yesBtn as any);
        me.game.world.addChild(this.noBtn as any);
    }

    onDestroyEvent() {
        // No need to release pointer events for GUI_Object

        me.game.world.reset();
    }
}
