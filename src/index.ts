import { audio, loader, state, device, video, plugin, pool, input } from "melonjs";
import * as me from "melonjs";
import TitleScreen from "./scripts/stage/title.js";
import PlayScreen from "./scripts/stage/play.js";
import PlayerEntity from "./scripts/entities/player.js";
import DataManifest from "./manifest.js";
import "./index.scss";
import HomeScreen from "./scripts/stage/HomeScreen.js";
import InstructionsScreen from "./scripts/stage/InstructionsScreen.js";
import TehnikaIntroScreen from "./scripts/stage/TehnikaIntroScreen.js";
import AriKysimus from "./scripts/stage/AriKysimus.js";
import FeedbackScreen from "./scripts/stage/FeedbackScreen.js";
import FinalScreen from "./scripts/stage/FinalScreen.js";
import AriOige from "./scripts/stage/ari_oige.js";
import AriVale from "./scripts/stage/ari_vale.js";
import EhitusKysimus from "./scripts/stage/EhitusKysimus.js";
import EhitusOige from "./scripts/stage/ehitus_oige.js";
import EhitusVale from "./scripts/stage/ehitus_vale.js";
import ItKysimus from "./scripts/stage/ItKysimus.js";
import ItOige from "./scripts/stage/it_oige.js";
import ItVale from "./scripts/stage/it_vale.js";
import TurismVale from "./scripts/stage/turism_vale.js";
import TurismOige from "./scripts/stage/turism_oige.js";
import TurismKysimus from "./scripts/stage/TurismKysimus.js";
import ToitVale from "./scripts/stage/toit_vale.js";
import ToitOige from "./scripts/stage/toit_oige.js";
import ToitKysimus from "./scripts/stage/ToitKysimus.js";
import IluVale from "./scripts/stage/ilu_vale.js";
import IluOige from "./scripts/stage/ilu_oige.js";
import IluKysimus from "./scripts/stage/IluKysimus.js";

// --- Custom state constants ---
export const TEHNIKAINTRO = 100;
export const ARIKYSIMUS = 101;
export const ARIOIGE = 102;
export const ARIVALE = 103;
export const EHITUSKYSIMUS = 104;
export const EHITUSOIGE = 105;
export const EHITUSVALE = 106;
export const ILUKYSIMUS = 107;
export const ILUOIGE = 108;
export const ILUVALE = 109;
export const TOITKYSIMUS = 110;
export const TOITOIGE = 111;
export const TOITVALE = 112;
export const TURISMKYSIMUS = 113;
export const TURISMOIGE = 114;
export const TURISMVALE = 115;
export const ITKYSIMUS = 116;
export const ITOIGE = 117;
export const ITVALE = 118;

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
  // initialize display canvas
  if (!video.init(1218, 562, { parent: "screen", scale: "auto" })) {
    alert("Sinu brauser ei toeta HTML5 canvas't");
    return;
  }

  // initialize audio
  audio.init("mp3,ogg");

  // allow cross-origin for images
  loader.setOptions({ crossOrigin: "anonymous" });

  // bind keys
  input.bindKey(input.KEY.UP, "jump", true);
  input.bindKey(input.KEY.DOWN, "duck", true);

  // set and load all resources.
  loader.preload(DataManifest, function () {
    // esileht
    state.set(state.MENU, new HomeScreen());

    // õpetus
    state.set(state.READY, new InstructionsScreen());

    // tehnika 
    state.set(TEHNIKAINTRO, new TehnikaIntroScreen());
    state.set(121, new Stage1Screen());

    // äri
    state.set(ARIKYSIMUS, new AriKysimus());
    state.set(ARIOIGE, new AriOige());
    state.set(ARIVALE, new AriVale());
    state.set(122, new Stage2Screen());
    
    // ehitus
    state.set(EHITUSKYSIMUS, new EhitusKysimus());
    state.set(EHITUSOIGE, new EhitusOige());
    state.set(EHITUSVALE, new EhitusVale());
    state.set(123, new Stage3Screen());

    // ilu
    state.set(ILUKYSIMUS, new IluKysimus());
    state.set(ILUOIGE, new IluOige());
    state.set(ILUVALE, new IluVale());
    state.set(124, new Stage4Screen());

    // toit
    state.set(TOITKYSIMUS, new ToitKysimus());
    state.set(TOITOIGE, new ToitOige());
    state.set(TOITVALE, new ToitVale());
    state.set(125, new Stage5Screen());

    // turism
    state.set(TURISMKYSIMUS, new TurismKysimus());
    state.set(TURISMOIGE, new TurismOige());
    state.set(TURISMVALE, new TurismVale());
    state.set(126, new Stage6Screen());

    // it
    state.set(ITKYSIMUS, new ItKysimus());
    state.set(ITOIGE, new ItOige());
    state.set(ITVALE, new ItVale());
    state.set(127, new Stage7Screen());

    state.set(state.GAMEOVER, new FinalScreen());
    //state.set(state.CREDITS, new FinalScreen());

    // add our player entity in the entity pool
    pool.register("mainPlayer", PlayerEntity);

    // Start the game at MENU
    state.change(state.MENU, false);
  });
});