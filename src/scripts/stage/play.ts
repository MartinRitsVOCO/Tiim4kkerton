import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import BlockerEntity from "../entities/blocker";

class PlayScreen extends me.Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        me.game.world.addChild(new me.ColorLayer("background", "#b82e2eff"));

        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;
        const groundHeight = 50;
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

        const blocker = new BlockerEntity(viewportWidth / 2, groundYPosition - 40, 2, 160, 24);
        me.game.world.addChild(blocker, 30);
    }
};

export default PlayScreen;
