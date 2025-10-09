import { audio, loader, state, device, video, plugin, pool, input } from "melonjs";
import * as me from "melonjs";
import TitleScreen from "./scripts/stage/title.js";
import PlayScreen from "./scripts/stage/play.js";
import PlayerEntity from "./scripts/entities/player.js";
import DataManifest from "./manifest.js";
import "./index.scss"

// Test stage1.ts jaoks
import Stage1Screen from "./scripts/stage/stage1.js";
import Stage2Screen from "./scripts/stage/stage2.js";
import Stage3Screen from "./scripts/stage/stage3.js";
import Stage4Screen from "./scripts/stage/stage4.js";
import Stage5Screen from "./scripts/stage/stage5.js";
import Stage6Screen from "./scripts/stage/stage6.js";
import Stage7Screen from "./scripts/stage/stage7.js";

export let texture: me.TextureAtlas;

device.onReady(() => {

    // initialize the display canvas once the device/browser is ready
    if (!video.init(1218, 562, { parent: "screen", scale: "auto" })) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // Initialize the audio.
    audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    loader.setOptions({ crossOrigin: "anonymous" });

    // initialize the debug plugin in development mode.
    if (process.env.NODE_ENV === 'development') {
        import("@melonjs/debug-plugin").then((debugPlugin) => {
            // automatically register the debug panel
            plugin.register(new debugPlugin.DebugPanelPlugin, "debugPanel");
        });
    }

    input.bindKey(input.KEY.UP, "jump", true);
    input.bindKey(input.KEY.UP, "jump", false);
    input.bindKey(input.KEY.DOWN, "duck", true);
    input.bindKey(input.KEY.DOWN, "duck", false);


    // set and load all resources.
    loader.preload(DataManifest, function () {


        texture = new me.TextureAtlas(
            me.loader.getJSON("texture"),
            me.loader.getImage("texture")
        );

        // set the user defined game stages
        state.set(state.MENU, new TitleScreen());
        state.set(state.PLAY, new PlayScreen());


        //Tehnika
        state.set(101, new Stage1Screen());
        // ...

        // äri
        state.set(102, new Stage2Screen());
        // ...
        /*
        state.set(103, new Stage3Screen());
        state.set(104, new Stage4Screen());
        state.set(105, new Stage5Screen());
        state.set(106, new Stage6Screen());
        state.set(107, new Stage7Screen());
        */

        // add our player entity in the entity pool
        pool.register("mainPlayer", PlayerEntity);

        // Start the game.
        state.change(state.PLAY, false);
        // state.change(101, false); // <--- Starts on Stage 1
    });
});