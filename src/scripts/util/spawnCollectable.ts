import * as me from "melonjs";
import Collectable from "../entities/collectable";
import collectables from "../constants/collectables";
type collectTypes = keyof typeof collectables;

const spawnCollectable = (collectableType: collectTypes, groundHeight: number, speed: number, onCollection: Function) => {

  const viewportWidth = me.game.viewport.width;
  const viewportHeight = me.game.viewport.height;
  const groundYPosition = viewportHeight - groundHeight;

  const collectable = new Collectable(viewportWidth, groundYPosition - 120, speed, collectableType, onCollection)

  me.game.world.addChild(collectable, 40);
}

export default spawnCollectable;