



import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import ScrollingBackground from "../renderables/background";
// test
import spawnBlocker from "../util/spawnBlocker";
import spawnCollectable from "../util/spawnCollectable";
import collectables from "../constants/collectables";
type collectTypes = keyof typeof collectables;

// Define a new state to switch to when the game is over. 
// Assuming you have a MENU state, or you could define a dedicated GAME_OVER state.
// If you don't have a MENU state, you must set one up in your game's initialization.
// const GAME_FINISH_STATE = me.state.MENU;

const GAME_DURATION_MS = 45000; // 45 seconds in milliseconds

const COLLECTABLE_SPAWN_DELAY_MS = 3000;

class PlayScreen extends me.Stage {
    // Property to hold the ID of the timeout so we can cancel it if needed
    private finishTimerId: number | null = null;
    private gameSpeed: number = 2;

    private maxSpawnDelay = COLLECTABLE_SPAWN_DELAY_MS * 1.5;
    private minSpawnDelay = COLLECTABLE_SPAWN_DELAY_MS * 0.66;

    private groundHeight = 45;

    //test
    private collectableTimerId: number | null = null;

    onCollection(type: string, wasGood: boolean, wasCollected: boolean) {
        console.log(type)
    }

    private timerId: number | null = null;


    /**
     *  action to perform on state change */

    private collectablePool: collectTypes[] = [
        "tireBad",
        "laptopGood",
    ];

    private spawnCollectablesLoop() {

        let newSpawnDelay = Math.floor(Math.random() * (this.maxSpawnDelay - this.minSpawnDelay + 1)) + this.minSpawnDelay;

        if (Math.random() < 0.5) {
            spawnBlocker(this.groundHeight, this.gameSpeed);
        }

        // 1. Call the utility function to spawn a collectable
        spawnCollectable(
            this.collectablePool,
            this.groundHeight,
            this.gameSpeed,
            this.onCollection.bind(this) // Pass the stage's handler function
        );

        // 2. Schedule the timer for the next spawn
        this.collectableTimerId = me.timer.setTimeout(
            () => this.spawnCollectablesLoop(),
            newSpawnDelay
        );
    }

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

        const groundYPosition = viewportHeight - this.groundHeight;

        // const ground = new me.Renderable(viewportWidth, viewportHeight, viewportWidth, this.groundHeight);
        // ground.alwaysUpdate = false;
        // ground.draw = function (renderer) {
        //     renderer.setColor("#444");
        //     renderer.fillRect(
        //         this.pos.x! - this.width / 2,
        //         this.pos.y! - this.height / 2,
        //         this.width,
        //         this.height);
        // };
        // me.game.world.addChild(ground, 1);

        const player = new PlayerEntity(viewportWidth / 5, groundYPosition);

        me.game.world.addChild(player, 50)

        this.spawnCollectablesLoop();

        // Stage Time
        this.finishTimerId = me.timer.setTimeout(() => {
            console.log("45 seconds passed. Finishing stage.");
            // Stop the game and switch to the defined finish state
            // me.state.change(GAME_FINISH_STATE);
        }, GAME_DURATION_MS)
    }

    onDestroyEvent(...args: any[]): void {
        if (this.finishTimerId !== null) {
            me.timer.clearTimeout(this.finishTimerId);
            this.finishTimerId = null;
        }

        super.onDestroyEvent(...args);
    }
};

export default PlayScreen;

