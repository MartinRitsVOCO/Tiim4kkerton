import * as me from "melonjs";
import ResponseObject from "melonjs/dist/types/physics/response";

class Collectable extends me.Entity {
  public type: string;
  public speed: number;
  private onCollect: Function;

  constructor(x: number, y: number, speed: number, type: string, onCollect: Function, width = 16, height = 16) {
    super(x / 2, y / 2, { width: width, height: height, name: "player" })

    this.type = type;
    this.speed = speed;
    this.onCollect = onCollect;

    this.anchorPoint.set(1, 0);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    this.body.collisionMask = me.collision.types.PLAYER_OBJECT;
    this.body.setFriction(0, 0);
    this.body.ignoreGravity = true;
    this.body.vel.x = -speed;
  }

  update(dt: any): boolean {

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
      this.onCollect(this.type)
      me.game.world.removeChild(this)
    }

    return false;
  }
}

export default Collectable;