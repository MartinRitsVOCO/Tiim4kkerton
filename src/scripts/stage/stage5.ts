import BasePlayScreen from "./baseplay";
import { getStageConfig } from "../constants/stage_data";

const STAGE_CONFIG = getStageConfig(4);

// Ensure the config exists before attempting to use it
if (!STAGE_CONFIG) {
    throw new Error("Stage 1 configuration is missing in stage_data.");
}

/**
 * Stage1Screen extends the BasePlayScreen, initializing it with
 * the specific background keys, speed, and duration for Stage 1.
 */
class Stage5Screen extends BasePlayScreen {
    // saab muuta kas on tohkem või vähem collectable
    // private uniqueSpawnDelay: number;

    constructor() {
        // 1. Pass the STAGE_CONFIG (IT Academy data) up to the BasePlayScreen constructor.
        // This is where the BasePlayScreen receives the configuration for the ScrollingBackground.
        super(STAGE_CONFIG!);

        // this.uniqueSpawnDelay = 3000; 
    
        console.log(`Initialized Stage 1: ${this.config.name}`);
    }
    
}

export default Stage5Screen;