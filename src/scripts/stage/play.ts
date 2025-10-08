import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import BlockerEntity from "../entities/blocker";
import ScrollingBackground from "../renderables/background";
import Collectable from "../entities/collectable";

class PlayScreen extends me.Stage {
    onCollection(type: string) {
        console.log(type)
    }


    /**
     *  action to perform on state change
     */

    onResetEvent() {
        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;

        const speed = 1;

        // add a color layer background to the default Stage
        me.game.world.addChild(new me.ColorLayer("background", "#b82e2eff"), -1);

        const image = me.loader.getImage("background") as HTMLImageElement;

        const background = new ScrollingBackground(viewportWidth, viewportHeight, image, speed);

        me.game.world.addChild(background, 0);

        const groundHeight = 15;
        const groundYPosition = viewportHeight - groundHeight;

        const ground = new me.Renderable(viewportWidth, viewportHeight, viewportWidth, groundHeight);
        ground.alwaysUpdate = false;
        ground.draw = function (renderer) {
            renderer.setColor("#444");
            renderer.fillRect(
                this.pos.x! - this.width / 2,
                this.pos.y! - this.height / 2,
                this.width,
                this.height);
        };
        me.game.world.addChild(ground, 1);

        const player = new PlayerEntity(viewportWidth / 5, groundYPosition);

        me.game.world.addChild(player, 50)

        const blocker = new BlockerEntity(viewportWidth / 2, groundYPosition - 40, speed, 160, 24);
        me.game.world.addChild(blocker, 30);

        const collectable = new Collectable(viewportWidth, groundYPosition - 120, 1, "hammerBad", this.onCollection)
        me.game.world.addChild(collectable, 40);
    }
};

export default PlayScreen;
