import * as me from "melonjs";
import ResponseObject from "melonjs/dist/types/physics/response";
import collectables from "../constants/collectables";
type collectTypes = keyof typeof collectables;

class Collectable extends me.Entity {
  public type: collectTypes;
  public speed: number;
  private onCollect: Function;
  private imageSprite: me.Sprite; // Added internal sprite instance

  private scaleX: number;
  private scaleY: number;
  private originalWidth: number;
  private originalHeight: number;

  constructor(x: number, y: number, speed: number, type: collectTypes, onCollect: Function) {
    super(x / 2, y / 2, { width: collectables[type].width, height: collectables[type].height, name: "player" })

    this.type = type;
    this.speed = speed;
    this.onCollect = onCollect;

    // Initialize the internal sprite using the image key (no width/height in settings)
    this.imageSprite = new me.Sprite(0, 0, {
      image: collectables[type].image,
    });

    // 1. Get the image to determine the original size.
    const targetWidth = collectables[type].width;
    const targetHeight = collectables[type].height;
     
    const image = me.loader.getImage(collectables[type].image) as HTMLImageElement;
    const originalWidth = image.width;
    const originalHeight = image.height;

    // Store original dimensions
    this.originalWidth = originalWidth;
    this.originalHeight = originalHeight;

    // 2. Calculate the scaling factors.
    this.scaleX = targetWidth / originalWidth * 4;
    this.scaleY = targetHeight / originalHeight * 4;

    // Ensure the sprite's anchor matches the entity's anchor
    this.imageSprite.anchorPoint.set(0.5, 0.5); 

    this.anchorPoint.set(1, 0);

    this.body.addShape(new me.Rect(0, 0, collectables[type].width, collectables[type].height));
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    this.body.collisionMask = me.collision.types.PLAYER_OBJECT;
    this.body.setFriction(0, 0);
    this.body.ignoreGravity = true;
    this.body.vel.x = -speed;
  }

  update(dt: any): boolean {
    // Update the parent entity logic
    super.update(dt);
    // Update the internal sprite (necessary for animations/frame changes if they existed)
    this.imageSprite.update(dt);

    if (this.pos.x! + this.width < 5) {
      this.onCollect(this.type, collectables[this.type].good, false)
      me.game.world.removeChild(this)
    }
    return true
  }

  draw(renderer: me.CanvasRenderer | me.WebGLRenderer): void {
    // let color = new me.Color(0, 255, 255);

    // renderer.currentColor = color;

    // const rect: me.Rect = new me.Rect(
    //   this.pos.x ? this.pos.x : 0,
    //   this.pos.y ? this.pos.y : 0,
    //   this.width * 2,
    //   this.height * 2
    // );

    // renderer.stroke(rect, true);

    // Manually draw the internal sprite at the entity's current position
    renderer.save();
    // Translate the renderer's context to the entity's position
    renderer.translate(this.pos.x!, this.pos.y!);

    // Apply a manual translation offset to shift the sprite 
    renderer.translate(-24, -24);

    // Render at the correct scale
    renderer.scale(this.scaleX, this.scaleY); 
    
    // Draw the sprite (which is positioned at 0,0 relative to the translated context)
    this.imageSprite.draw(renderer);


    renderer.restore();
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