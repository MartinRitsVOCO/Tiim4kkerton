import * as me from "melonjs";
import ResponseObject from "melonjs/dist/types/physics/response";

class PlayerEntity extends me.Entity {

    public static PLAYER_HEIGHT = 64;
    public static PLAYER_WIDTH = 48;
    public static JUMP_VELOCITY = -20;
    public static DUCK_HEIGHT = 32;

    private image: me.Sprite;

    private gravity: number = 0.9;
    private maxFallSpeed: number = 20;

    private isJumping: boolean = false;
    private isDucking: boolean = false;

    private groundY: number = 0;

    constructor(x: number, groundY: number) {
        super(x / 2, groundY / 2, { width: PlayerEntity.PLAYER_WIDTH, height: PlayerEntity.PLAYER_HEIGHT, name: "player" });
        this.groundY = groundY / 2;

        // Player sprite
        const SVGimage = me.loader.getImage("player-texture");

        const scaleFactor = 4;

        // Offscreen canvas at high resolution
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = this.width * scaleFactor;
        offscreenCanvas.height = this.height * scaleFactor;

        const ctx = offscreenCanvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;

        // Draw the SVG at 4× resolution
        ctx.drawImage(SVGimage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // Create a final canvas at your target size
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = this.width * 2;
        finalCanvas.height = this.height * 2;

        const finalCtx = finalCanvas.getContext("2d")!;
        finalCtx.imageSmoothingEnabled = true;

        // Draw the high-res offscreen canvas scaled down to final size
        finalCtx.drawImage(offscreenCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

        // Create a sprite from the final canvas
        this.image = new me.Sprite(-27, -28, { image: finalCanvas });

        this.body.setMaxVelocity(0, this.maxFallSpeed);
        this.body.setFriction(0, 0);

        this.body.setCollisionMask(me.collision.types.ALL_OBJECT);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.body.removeShapeAt(0);
        this.body.addShape(new me.Rect(0, 0, this.width / 2, this.height / 2));
        this.body.gravityScale = this.gravity;
        this.alwaysUpdate = true;

        this.anchorPoint.set(0.5, 0);
    }

    private jump() {
        if (!this.isDucking) {
            this.isJumping = true;
            this.body.force.y = PlayerEntity.JUMP_VELOCITY;
        }
    }

    private duckStart() {
        this.isDucking = true;

        this.height = PlayerEntity.DUCK_HEIGHT;
        this.body.removeShapeAt(0);
        const shape = new me.Rect(0, 0, this.width / 2, this.height / 2);
        this.body.addShape(shape);
        this.pos.y! += (PlayerEntity.PLAYER_HEIGHT - PlayerEntity.DUCK_HEIGHT) / 2;
    }

    private duckEnd() {
        this.isDucking = false;

        this.height = PlayerEntity.PLAYER_HEIGHT;
        this.body.removeShapeAt(0);
        const shape = new me.Rect(0, 0, this.width / 2, this.height / 2);
        this.body.addShape(shape);
        this.pos.y! -= (PlayerEntity.PLAYER_HEIGHT - PlayerEntity.DUCK_HEIGHT) / 2;
    }

    public update(dt: number): boolean {
        if (me.input.isKeyPressed("jump")) {
            this.jump();
        }
        if (me.input.isKeyPressed("duck")) {
            if (!this.isJumping && !this.isDucking) {
                this.duckStart();
            }
        } else if (this.isDucking) {
            this.duckEnd();
        }

        if (this.pos.y! > this.groundY - this.height / 2) {
            this.isJumping = false;
            this.pos.y = this.groundY - this.height / 2;
            this.body.vel.y = 0;
        } else if (this.pos.y! < 1) {
            this.body.vel.y = 1;
        }

        return true;
    }

    onCollision(response: ResponseObject, other: me.Entity): boolean {
        if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
            if (
                // Shortest overlap would move the player upward
                (response.overlapV.y! > 0) &&
                // The velocity is reasonably fast enough to have penetrated to the overlap depth
                (~~this.body.vel.y! >= ~~response.overlapV.y!)
            ) {
                // Disable collision on the x axis
                // response.overlapV.x = 0;
                // Repond to the platform (it is solid)
                return true;
            }

            return false;
        }

        return false;
    }

    public draw(renderer: me.WebGLRenderer) {

        let color = new me.Color(0, 255, 0);
        if (this.isDucking) {
            color.setColor(0, 0, 255);
        } else if (this.isJumping) {
            color.setColor(255, 0, 0);
        }

        renderer.currentColor = color;

        const rect: me.Rect = new me.Rect(
            this.pos.x ? this.pos.x : 0,
            this.pos.y ? this.pos.y : 0,
            this.width,
            this.height
        );

        //renderer.stroke(rect, true);

        if (this.image) {

            renderer.save();

            renderer.translate(this.pos.x ?? 0, this.pos.y ?? 0);

            this.image.draw(renderer);

            renderer.restore();
        }
    }

    public destroy(...args: any[]): void {
        super.destroy(...args);
    }
};

export default PlayerEntity;
