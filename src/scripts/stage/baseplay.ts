import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import ScrollingBackground from "../renderables/background";
import { StageConfig } from "../constants/stage_data";

// Define a new state to switch to when the game is over. 
// Assuming you have a MENU state, or you could define a dedicated GAME_OVER state.
// If you don't have a MENU state, you must set one up in your game's initialization.
// const GAME_FINISH_STATE = me.state.MENU;

const GAME_TRANSITION_DELAY_MS = 2000; 

const GAME_DURATION_MS = 45000; // 45 seconds in milliseconds

class BasePlayScreen extends me.Stage {
    protected config: StageConfig;
    protected finishTimerId: number | null = null;

    // References to moving objects
    protected scrollingBackground: ScrollingBackground | null = null;

    constructor(config: StageConfig) {
        super();
        this.config = config;
    }

    // Common event handler for collecting items
    // onCollection(type: string) {
    //     console.log(`Collected item of type: ${type}`);
    // }

    /**
     * action to perform on state change (stage start)
     */
    onResetEvent() {
        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;
        const gameSpeed = this.config.gameSpeed;
        

        // --- Stage Setup ---
        me.game.world.addChild(new me.ColorLayer("background", "#b82e2eff"), -1);

        // Map the image keys to actual HTMLImageElement objects using me.loader.getImage()
        const backgroundKeys = this.config.backgroundKeys;
        const imagePool: HTMLImageElement[] = backgroundKeys.map(key => 
            me.loader.getImage(key) as HTMLImageElement
        );

        const background = new ScrollingBackground(viewportWidth, viewportHeight, imagePool, gameSpeed);
        this.scrollingBackground = background; // Store reference
        me.game.world.addChild(background, 0);

        const groundHeight = 15;
        const groundYPosition = viewportHeight - groundHeight;

        // --- Ground ---
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

        // --- Entities ---
        const player = new PlayerEntity(viewportWidth / 5, groundYPosition);
        me.game.world.addChild(player, 50);

        // --- Stage Time and Finish Logic ---
        this.finishTimerId = me.timer.setTimeout(() => {
            console.log(`Stage finished: ${this.config.name}.`);
            
            // 2. Transition state after a short delay
            // me.timer.setTimeout(() => {
            //     me.state.change(GAME_FINISH_STATE);
            // }, GAME_TRANSITION_DELAY_MS); 

        }, GAME_DURATION_MS); // Using the hardcoded constant
    }

    /**
     * action to perform when leaving this screen (state change)
     */
    onDestroyEvent(...args: any[]): void {
        // Clear the timer
        if (this.finishTimerId !== null) {
            me.timer.clearTimeout(this.finishTimerId);
            this.finishTimerId = null;
        }

        // Clear object references
        this.scrollingBackground = null;

        super.onDestroyEvent(...args);
    }
};

export default BasePlayScreen;
