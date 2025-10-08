import { audio, loader, state, device, video, plugin, pool, input } from "melonjs";
import TitleScreen from "./scripts/stage/title.js";
import PlayScreen from "./scripts/stage/play.js";
import PlayerEntity from "./scripts/entities/player.js";
import DataManifest from "./manifest.js";
import "./index.scss"




device.onReady(() => {

  // initialize display canvas
  if (!me.video.init(1218, 562, { parent: "screen", scale: "auto" })) {
    alert("Sinu brauser ei toeta HTML5 canvas't");
    return;
  }

  // initialize audio
  me.audio.init("mp3,ogg");

  // allow cross-origin for images
  me.loader.setOptions({ crossOrigin: "anonymous" });

  // bind keys
    me.input.bindKey(me.input.KEY.UP, "jump", true);
    me.input.bindKey(me.input.KEY.UP, "jump", false);
    me.input.bindKey(me.input.KEY.DOWN, "duck", true);
    me.input.bindKey(me.input.KEY.DOWN, "duck", false);

    // set and load all resources.
    loader.preload(DataManifest, function () {
        // set the user defined game stages
        state.set(state.MENU, new TitleScreen());
        state.set(state.PLAY, new PlayScreen());

        // add our player entity in the entity pool
        pool.register("mainPlayer", PlayerEntity);

        // Start the game.
        state.change(state.PLAY, false);
    });
  } */


})});