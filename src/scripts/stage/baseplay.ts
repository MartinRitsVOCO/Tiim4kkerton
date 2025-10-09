import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import ScrollingBackground from "../renderables/background";
import { StageConfig } from "../constants/stage_data";
import { ARIKYSIMUS, EHITUSKYSIMUS, ILUKYSIMUS, TOITKYSIMUS, TURISMKYSIMUS, ITKYSIMUS } from "../..";

// Define a new state to switch to when the game is over. 
// Assuming you have a MENU state, or you could define a dedicated GAME_OVER state.
// If you don't have a MENU state, you must set one up in your game's initialization.
// const GAME_FINISH_STATE = me.state.MENU;

const GAME_TRANSITION_DELAY_MS = 2000;

const GAME_DURATION_MS = 45000; // 45 seconds in milliseconds
type StageConstructor = new () => me.Stage;

class BasePlayScreen extends me.Stage {
    protected config: StageConfig;
    protected finishTimerId: number | null = null;
    protected nextStageId?: number; // hoiab järgmise stage state ID

    // References to moving objects
    protected scrollingBackground: ScrollingBackground | null = null;
    protected ground: me.Renderable | null = null;
    protected player: PlayerEntity | null = null;

    constructor(config: StageConfig, nextStageId?: number) {
        super();
        this.config = config;
        this.nextStageId = nextStageId;
    }
    preload(){
    // Intentionally left empty: resource loading should happen in onResetEvent
    }

    // Common event handler for collecting items
    // onCollection(type: string) {
    //     console.log(`Collected item of type: ${type}`);
    // }

    /**
     * action to perform on state change (stage start)
     */
    onResetEvent() {
        // --- Stage Setup ---
        me.game.world.addChild(new me.ColorLayer("background", "#b82e2eff"), -1);

        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;
        const gameSpeed = this.config.gameSpeed;

        // Map the image keys to actual HTMLImageElement objects using me.loader.getImage()
        const backgroundKeys = this.config.backgroundKeys;
        const imagePool: HTMLImageElement[] = backgroundKeys.map(key =>
            me.loader.getImage(key) as HTMLImageElement
        );

        // --- Scrolling Background ---
        // Create the scrolling background here (after viewport sizes and loader are available)
        if (imagePool.length > 0) {
            this.scrollingBackground = new ScrollingBackground(viewportWidth, viewportHeight, imagePool, gameSpeed);
            me.game.world.addChild(this.scrollingBackground, 0);
        } else {
            console.warn("No background images available for this stage.");
        }

        // --- Ground ---
        const groundHeight = 15;
        const groundYPosition = viewportHeight - groundHeight;

        this.ground = new me.Renderable(viewportWidth, viewportHeight, viewportWidth, groundHeight);
        this.ground.alwaysUpdate = false;
        this.ground.draw = function (renderer) {
            renderer.setColor("#444");
            renderer.fillRect(
                this.pos.x! - this.width / 2,
                this.pos.y! - this.height / 2,
                this.width,
                this.height);
        };
        me.game.world.addChild(this.ground, 1);

        // --- Entities ---
        this.player = new PlayerEntity(viewportWidth / 5, groundYPosition);
        me.game.world.addChild(this.player, 50);

        




        // --- Stage Time and Finish Logic ---
        this.finishTimerId = me.timer.setTimeout(() => {
            console.log(`Stage finished: ${this.config.name}.`);

            // Map play state IDs (121..127) to the next question state IDs
            const playToNext: Record<number, number> = {
                121: ARIKYSIMUS,       // after Stage1 (Tehnika) -> Ari kysimus
                122: EHITUSKYSIMUS,    // after Stage2 (Business) -> Ehitus kysimus
                123: ILUKYSIMUS,       // after Stage3 (Ehitus) -> Ilu kysimus
                124: TOITKYSIMUS,      // after Stage4 (Ilu) -> Toit kysimus
                125: TURISMKYSIMUS,    // after Stage5 (Toit) -> Turism kysimus
                126: ITKYSIMUS,        // after Stage6 (Turism) -> IT kysimus
                127: me.state.GAMEOVER // after Stage7 (IT) -> final screen
            };

            // Find which play state is currently active and transition
            let transitioned = false;
            for (const [playIdStr, nextState] of Object.entries(playToNext)) {
                const playId = Number(playIdStr);
                if (me.state.isCurrent(playId)) {
                    console.log(`Changing state from play ${playId} to ${nextState}`);
                    me.state.change(nextState, false);
                    transitioned = true;
                    break;
                }
            }

            // Fallback if we couldn't detect the current play state
            if (!transitioned) {
                console.warn("Could not determine current play state; falling back to MENU.");
                me.state.change(me.state.MENU, false);
            }

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
        if (this.scrollingBackground) {
            me.game.world.removeChild(this.scrollingBackground); // eemalda vana
            this.scrollingBackground = null;
        }
        if (this.player) {
            me.game.world.removeChild(this.player);
            this.player = null as any;
        }

        if (this.ground) {
            me.game.world.removeChild(this.ground);
            this.ground = null as any;
        }

        super.onDestroyEvent(...args);
    }
};

export default BasePlayScreen;