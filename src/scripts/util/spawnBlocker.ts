import * as me from "melonjs";
import BlockerEntity from "../entities/blocker";
import blockers from "../constants/blockers";

const spawnBlocker = (groundHeight: number, speed: number) => {

  const viewportWidth = me.game.viewport.width;
  const viewportHeight = me.game.viewport.height;
  const groundYPosition = viewportHeight - groundHeight;

  const blockerKeys = Object.keys(blockers) as (keyof typeof blockers)[]
  const randomIndex = Math.floor(Math.random() * blockerKeys.length)

  const blocker = new BlockerEntity(viewportWidth, groundYPosition, speed, blockerKeys[randomIndex])

  me.game.world.addChild(blocker, 30);
}

export default spawnBlocker;