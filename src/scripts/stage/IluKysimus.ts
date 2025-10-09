import * as me from "melonjs";
import { ILUOIGE, ILUVALE } from "../..";

export default class IluKysimus extends me.Stage {
    private yesBtn!: me.GUI_Object;
    private noBtn!: me.GUI_Object;

    onResetEvent() {
        const bg = new me.Sprite(609, 281, { image: me.loader.getImage("ilu_1") });
        me.game.world.addChild(bg);

        this.yesBtn = new (class extends me.GUI_Object {
            constructor() {
                super(220, 440, {
                    image: me.loader.getImage("ilu_oigevastus"),
                    width: me.loader.getImage("ilu_oigevastus").width,
                    height: me.loader.getImage("ilu_oigevastus").height,
                });
            }
            onClick() {
                console.log("vastus õige");
                me.state.change(ILUOIGE, false);
                return false;
            }
        })();

        this.noBtn = new (class extends me.GUI_Object {
            constructor() {
                super(620, 440, {
                    image: me.loader.getImage("ilu_valevastus"),
                    width: me.loader.getImage("ilu_valevastus").width,
                    height: me.loader.getImage("ilu_valevastus").height,
                });
            }
            onClick() {
                console.log("vastus vale");
                me.state.change(ILUVALE, false);
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