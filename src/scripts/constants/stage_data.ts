// Define the structure for a single stage's configuration
export interface StageConfig {
    name: string;
    // durationMs removed as all stages will use the default duration set in BasePlayScreen
    backgroundKeys: string[]; // Keys for background scrolling images
    gameSpeed: number; // Initial speed for this stage
}

// Define the configuration for all 7 stages
export const STAGE_CONFIGS: StageConfig[] = [
    // Stage 1: Tehnika
    {
        name: "Stage 1: Tehnikakool",
        gameSpeed: 1,
        backgroundKeys: [
            "bg-tehnika-Tehnikakooli-tuhi-taust",
            "bg-tehnika-Tehnikakool-1osa",
            "bg-tehnika-Tehnikakool-2osa",
            "bg-tehnika-Tehnikakooli-motoka-taust",
        ],
    },
    // Stage 2: Business
    {
        name: "Stage 2: Ärikool",
        gameSpeed: 2,
        backgroundKeys: [
            "bg-business-Arikooli-tuhi-taust",
            "bg-business-Arikool-1osa",
            "bg-business-Arikool-2osa",
            "bg-business-Arikool-3osa",
        ],
    },
    // Stage 3: Ehitus
    {
        name: "Stage 3: Ehitus",
        gameSpeed: 3,
        backgroundKeys: [
            "bg-ehitus-Ehituse-tuhi-taust",
            "bg-ehitus-Ehituse-taust-1osa",
            "bg-ehitus-Ehituse-taust-2osa",
            "bg-ehitus-Ehituse-taust-3osa",
            "bg-ehitus-Ehituse-taust-4osa",
        ],
    },
    // Stage 4: Ilu
    {
        name: "Stage 4: Ilukool",
        gameSpeed: 4,
        backgroundKeys: [
            "bg-ilu-Ilukooli-tuhitaust",
            "bg-ilu-Ilukooli-juuksur-tatsu",
            "bg-ilu-Ilukooli-meikarid",
            "bg-ilu-Ilukooli-omblusosak",
        ],
    },
    // Stage 5: Toidu
    {
        name: "Stage 5: Toidukool",
        gameSpeed: 5,
        backgroundKeys: [
            "bg-toidu-Toidukooli-tuhi-taust",
            "bg-toidu-Toidukool-kohvimasina-osa",
            "bg-toidu-Toidukool-labipaistvad-uksed-osa",
            "bg-toidu-Toidukool-toidukapiga-osa",
        ],
    },
    // Stage 6: Turism
    {
        name: "Stage 6: Turismikool",
        gameSpeed: 6,
        backgroundKeys: [
            "bg-turism-Turismikooli-tuhi-taust",
            "bg-turism-Turismikool-taust-2",
            "bg-turism-Turismikool-taust-lennukiga",
            "bg-turism-Turismikool-taust-riiuliga",
        ],
    },
    // Stage 7: IT Akadeemia
    {
        name: "Stage 7: IT Akadeemia",
        gameSpeed: 7,
        backgroundKeys: [
            "bg-it-IT-akadeemia-tuhi-taust", 
            "bg-it-IT-akadeemia-taust-postrite-sein",
            "bg-it-IT-akadeemia-taust-arvutiklass",
            "bg-it-IT-akadeemia-taust-3D-printer",
        ],
    },
];

// Helper function to easily get the config by index
export function getStageConfig(index: number): StageConfig | undefined {
    return STAGE_CONFIGS[index];
}
