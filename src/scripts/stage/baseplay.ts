import * as me from "melonjs";
import PlayerEntity from "../entities/player";
import ScrollingBackground from "../renderables/background";
import { StageConfig } from "../constants/stage_data";
import { ARIKYSIMUS, EHITUSKYSIMUS, ILUKYSIMUS, TOITKYSIMUS, TURISMKYSIMUS, ITKYSIMUS } from "../..";
import spawnBlocker from "../util/spawnBlocker";
import spawnCollectable from "../util/spawnCollectable";
import collectables from "../constants/collectables";
type collectTypes = keyof typeof collectables;

// Define a new state to switch to when the game is over. 
// Assuming you have a MENU state, or you could define a dedicated GAME_OVER state.
// If you don't have a MENU state, you must set one up in your game's initialization.
// const GAME_FINISH_STATE = me.state.MENU;

const GAME_TRANSITION_DELAY_MS = 2000;
const COLLECTABLE_SPAWN_DELAY_MS = 5000;

// const GAME_DURATION_MS = 45000; // 45 seconds in milliseconds
const GAME_DURATION_MS = 10000;
type StageConstructor = new () => me.Stage;

class BasePlayScreen extends me.Stage {
    protected config: StageConfig;
    protected finishTimerId: number | null = null;
    protected nextStageId?: number; // hoiab järgmise stage state ID

    protected maxSpawnDelay = COLLECTABLE_SPAWN_DELAY_MS * 1.5;
    protected minSpawnDelay = COLLECTABLE_SPAWN_DELAY_MS * 0.75;

    protected groundHeight = 45;
    protected collectableTimerId: number | null = null;

    // References to moving objects
    protected scrollingBackground: ScrollingBackground | null = null;
    protected ground: me.Renderable | null = null;
    protected player: PlayerEntity | null = null

    protected collectablePool: collectTypes[];

    onCollection(type: string, wasGood: boolean, wasCollected: boolean) {
        console.log(type)
    }

    private spawnCollectablesLoop() {

        let newSpawnDelay = Math.floor(Math.random() * (this.maxSpawnDelay - this.minSpawnDelay + 1)) + this.minSpawnDelay;

        if (Math.random() < 0.5) {
            spawnBlocker(this.groundHeight, this.config.gameSpeed);
        }

        // 1. Call the utility function to spawn a collectable
        spawnCollectable(
            this.collectablePool,
            this.groundHeight,
            this.config.gameSpeed,
            this.onCollection.bind(this) // Pass the stage's handler function
        );

        // 2. Schedule the timer for the next spawn
        this.collectableTimerId = me.timer.setTimeout(
            () => this.spawnCollectablesLoop(),
            newSpawnDelay
        );
    }

    constructor(config: StageConfig, collectablePool: collectTypes[], nextStageId?: number) {
        super();
        this.config = config;
        this.nextStageId = nextStageId;
        this.collectablePool = collectablePool;
    }
    preload() {
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
        let backgroundKeys = this.config.backgroundKeys;
        let imagePool: HTMLImageElement[] = backgroundKeys.map(key =>
            me.loader.getImage(key) as HTMLImageElement
        );

        // --- Scrolling Background ---
        // Create the scrolling background here (after viewport sizes and loader are available)
        // if (imagePool.length > 0) {
        this.scrollingBackground = new ScrollingBackground(viewportWidth, viewportHeight, imagePool, gameSpeed);
        me.game.world.addChild(this.scrollingBackground, 0);
        // } else {
        //     console.warn("No background images available for this stage.");
        // }

        // --- Ground ---
        const groundHeight = 45;
        const groundYPosition = viewportHeight - groundHeight;

        // this.ground = new me.Renderable(viewportWidth, viewportHeight, viewportWidth, groundHeight);
        // this.ground.alwaysUpdate = false;
        // this.ground.draw = function (renderer) {
        //     renderer.setColor("#444");
        //     renderer.fillRect(
        //         this.pos.x! - this.width / 2,
        //         this.pos.y! - this.height / 2,
        //         this.width,
        //         this.height);
        // };
        // me.game.world.addChild(this.ground, 1);

        // --- Entities ---
        this.player = new PlayerEntity(viewportWidth / 5, groundYPosition);
        me.game.world.addChild(this.player, 50);

        this.spawnCollectablesLoop();

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
                    this.scrollingBackground = null;
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

        if (this.collectableTimerId) {
            me.timer.clearTimeout(this.collectableTimerId);
            this.collectableTimerId = null;
        }

        // Clear object references

        // for (let child in me.game.world.children) {
        //     me.game.world.removeChild(child);
        // }
        this.scrollingBackground = null;
        this.player = null as any;
        this.ground = null as any;

        me.game.world.reset()

        super.onDestroyEvent(...args);
    }
};

export default BasePlayScreen;