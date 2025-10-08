import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import BlockerEntity from "../entities/blocker";
import ScrollingBackground from "../renderables/background";
import spawnCollectable from "../util/spawnCollectable";

// Define a new state to switch to when the game is over. 
// Assuming you have a MENU state, or you could define a dedicated GAME_OVER state.
// If you don't have a MENU state, you must set one up in your game's initialization.
// const GAME_FINISH_STATE = me.state.MENU;

const GAME_DURATION_MS = 4500; // 45 seconds in milliseconds

class PlayScreen extends me.Stage {
    // Property to hold the ID of the timeout so we can cancel it if needed
    private finishTimerId: number | null = null;
    private gameSpeed: number = 2;

    onCollection(type: string) {
        console.log(type)
    }

    private timerId: number | null = null;


    /**
     *  action to perform on state change
     */

    onResetEvent() {
        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;

        // add a color layer background to the default Stage
        me.game.world.addChild(new me.ColorLayer("background", "#b82e2eff"), -1);

        // background images
        const imagePool = [];
        // Default 'empty' background:
        imagePool.push(me.loader.getImage("bg-it-IT-akadeemia-tühi-taust") as HTMLImageElement);

        // Background variations:
        imagePool.push(me.loader.getImage("bg-it-IT-akadeemia-taust-postrite-sein") as HTMLImageElement);
        imagePool.push(me.loader.getImage("bg-it-IT-akadeemia-taust-arvutiklass") as HTMLImageElement);
        imagePool.push(me.loader.getImage("bg-it-IT-akadeemia-taust-3D-printer") as HTMLImageElement);

        const background = new ScrollingBackground(viewportWidth, viewportHeight, imagePool, this.gameSpeed);

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

        const blocker = new BlockerEntity(viewportWidth / 2, groundYPosition - 40, this.gameSpeed, 160, 24);
        me.game.world.addChild(blocker, 30);

        // Stage Time
        this.finishTimerId = me.timer.setTimeout(() => {
            console.log("45 seconds passed. Finishing stage.");
            // Stop the game and switch to the defined finish state
            // me.state.change(GAME_FINISH_STATE);
        }, GAME_DURATION_MS)
        this.timerId = me.timer.setInterval(() => {
            spawnCollectable(["tireBad", "dryerBad", "portfolioBad", "bunBad", "cameraBad", "hammerBad"], groundHeight, this.gameSpeed, this.onCollection)
        }, 3000, true);
    }

    onDestroyEvent(...args: any[]): void {
        if (this.finishTimerId !== null) {
            me.timer.clearTimeout(this.finishTimerId);
            this.finishTimerId = null;
        }

        if (this.timerId !== null) {
            me.timer.clearInterval(this.timerId);
            this.timerId = null;
        }
        super.onDestroyEvent(...args);
    }
};

export default PlayScreen;
