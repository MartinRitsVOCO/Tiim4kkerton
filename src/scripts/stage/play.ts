import * as me from "melonjs";
import PlayerEntity from "../renderables/player";

class PlayScreen extends me.Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        // add a gray background to the default Stage
        me.game.world.addChild(new me.ColorLayer("background", "#202020"));

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

        me.game.world.addChild(player, 2)
    }
};

export default PlayScreen;
