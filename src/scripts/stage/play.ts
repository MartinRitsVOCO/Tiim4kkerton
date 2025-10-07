import * as me from "melonjs";
import PlayerEntity from "../renderables/player";

class PlayScreen extends me.Stage {
    private background: me.Sprite | null = null;

    /**
     *  action to perform on state change
     */
    onResetEvent() {
        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;

        // add a gray background to the default Stage
        me.game.world.addChild(new me.ColorLayer("background", "#202020"), -1);

        // create a sprite for the background
        const image = me.loader.getImage("background");
        this.background = new me.Sprite(0, 0, { 
            image: image,
            framewidth: image.width,
            frameheight: image.height 
        });

        

        // scale so height matches viewport, keeping aspect ratio
        const scaleFactor = viewportHeight / (image.height);
        


        this.background.pos.set(image.width*scaleFactor/2, image.height*scaleFactor/2);
        this.background.scale(scaleFactor, scaleFactor);


        // console.log("Background image size:", image.width, image.height);
        // console.log("Background position:", this.background.pos.x, this.background.pos.y);

        // add to world behind player
        me.game.world.addChild(this.background, 0);
        
        // player
        const groundHeight = 15;
        const groundYPosition = viewportHeight - groundHeight;
        const ground = new me.Renderable(viewportWidth, viewportHeight, viewportWidth, groundHeight);
        ground.alwaysUpdate = false;
        // ground.draw = function (renderer) {
        //     renderer.setColor("#444");
        //     renderer.fillRect(
        //         this.pos.x! - this.width / 2,
        //         this.pos.y! - this.height / 2,
        //         this.width,
        //         this.height);
        // };
        // me.game.world.addChild(ground, 2);

        const player = new PlayerEntity(viewportWidth / 7, groundYPosition);

        me.game.world.addChild(player, 1)
    }
};

export default PlayScreen;
