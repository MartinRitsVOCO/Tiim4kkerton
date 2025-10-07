import * as me from "melonjs";
import ResponseObject from "melonjs/dist/types/physics/response";

export default class BlockerEntity extends me.Entity {
  public startX: number = 0;
  public constructor(x: number, y: number, speed: number) {
    super(x, y / 2 - 24, {
      width: 96,
      height: 24,
      name: "blocker",
    });
    this.startX = x;
    this.anchorPoint.set(1, 0);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
    this.body.collisionMask = me.collision.types.PLAYER_OBJECT;
    this.body.setFriction(0, 0);
    this.body.ignoreGravity = true;
    this.body.vel.x = -speed;
    this.alwaysUpdate = true;
  }

  update(dt: any): boolean {
    if (this.pos.x! + this.width < 0) {
      this.pos.x = this.startX;
    }

    return true
  }

  draw(renderer: me.CanvasRenderer | me.WebGLRenderer, viewport?: any): void {
    let color = new me.Color(255, 255, 0);

    renderer.currentColor = color;

    const rect: me.Rect = new me.Rect(
      this.pos.x ? this.pos.x : 0,
      this.pos.y ? this.pos.y : 0,
      this.width * 2,
      this.height * 2
    );

    renderer.stroke(rect, true);
  }
}