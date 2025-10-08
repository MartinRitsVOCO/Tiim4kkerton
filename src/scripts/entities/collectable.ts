import * as me from "melonjs";
import ResponseObject from "melonjs/dist/types/physics/response";
import collectables from "../constants/collectables";
type collectTypes = keyof typeof collectables;

class Collectable extends me.Entity {
  public type: collectTypes;
  public speed: number;
  private onCollect: Function;

  constructor(x: number, y: number, speed: number, type: collectTypes, onCollect: Function) {
    super(x / 2, y / 2, { width: collectables[type].width, height: collectables[type].height, name: "player" })

    this.type = type;
    this.speed = speed;
    this.onCollect = onCollect;

    this.anchorPoint.set(1, 0);
    this.body.addShape(new me.Rect(0, 0, collectables[type].width, collectables[type].height));
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    this.body.collisionMask = me.collision.types.PLAYER_OBJECT;
    this.body.setFriction(0, 0);
    this.body.ignoreGravity = true;
    this.body.vel.x = -speed;
  }

  update(dt: any): boolean {
    if (this.pos.x! + this.width < 5) {
      this.onCollect(this.type, collectables[this.type].good, false)
      me.game.world.removeChild(this)
    }
    return true
  }

  draw(renderer: me.CanvasRenderer | me.WebGLRenderer): void {
    let color = new me.Color(0, 255, 255);

    renderer.currentColor = color;

    const rect: me.Rect = new me.Rect(
      this.pos.x ? this.pos.x : 0,
      this.pos.y ? this.pos.y : 0,
      this.width * 2,
      this.height * 2
    );

    renderer.stroke(rect, true);
  }

  onCollision(response: ResponseObject): boolean {
    if (response.b.body.collisionType == me.collision.types.PLAYER_OBJECT) {
      this.onCollect(this.type, collectables[this.type].good, true)
      me.game.world.removeChild(this)
    }

    return false;
  }
}

export default Collectable;