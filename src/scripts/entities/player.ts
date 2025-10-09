import * as me from "melonjs";
import ResponseObject from "melonjs/dist/types/physics/response";
import { texture } from "../../index";

class PlayerEntity extends me.Entity {

    public static PLAYER_HEIGHT = 64;
    public static PLAYER_WIDTH = 48;
    public static JUMP_VELOCITY = -20;
    public static DUCK_HEIGHT = 32;
    public static MAX_JUMP_DURATION = 250;

    private image: me.Sprite;
    // private sprite: me.Sprite
    // private texture: me.TextureAtlas;

    private gravity: number = 0.9;
    private maxFallSpeed: number = 20;

    private isJumping: boolean = false;
    private jumpTimer: number = 0;
    private isDucking: boolean = false;

    private groundY: number = 0;
    private startX: number = 0;

    private scaleX: number;
    private scaleY: number;

    constructor(x: number, groundY: number) {
        super(x / 2, groundY / 2, { width: PlayerEntity.PLAYER_WIDTH, height: PlayerEntity.PLAYER_HEIGHT, name: "player" });
        this.groundY = groundY / 2;
        this.startX = x / 2;

        // // Player sprite
        // const SVGimage = me.loader.getImage("player-texture");

        // const scaleFactor = 4;

        // // Offscreen canvas at high resolution
        // const offscreenCanvas = document.createElement("canvas");
        // offscreenCanvas.width = this.width * scaleFactor;
        // offscreenCanvas.height = this.height * scaleFactor;

        // const ctx = offscreenCanvas.getContext("2d")!;
        // ctx.imageSmoothingEnabled = true;

        // // Draw the SVG at 4× resolution
        // ctx.drawImage(SVGimage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // // Create a final canvas at your target size
        // const finalCanvas = document.createElement("canvas");
        // finalCanvas.width = this.width * 2;
        // finalCanvas.height = this.height * 2;

        // const finalCtx = finalCanvas.getContext("2d")!;
        // finalCtx.imageSmoothingEnabled = true;

        // // Draw the high-res offscreen canvas scaled down to final size
        // finalCtx.drawImage(offscreenCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

        // // Create a sprite from the final canvas
        // this.image = new me.Sprite(-27, -28, { image: finalCanvas });

        this.image = new me.Sprite(-27, 20, { image: me.loader.getImage("Sideview") });

        this.renderable = this.image;

        this.scaleX = PlayerEntity.PLAYER_WIDTH / this.image.width * 1.1;
        this.scaleY = PlayerEntity.PLAYER_HEIGHT / this.image.height * 1.1;

        this.renderable.scale(this.scaleX, this.scaleY);

        // // -------------

        // this.texture = texture;

        // // set a renderable
        // this.sprite = this.texture.createAnimationFromName([
        //     "Hyppamineohus.png",
        //     "Hyppekorgeim.png",
        //     "Kykislidelyhem.png",
        //     "Kykislidepikem.png",
        //     "Kykisolek.png",
        //     "paremjalgyleval.png",
        //     "Sideview.png",
        //     "vasakjalgyleval.png"
        // ]);

        // this.sprite.addAnimation("walk", [{ name: "Sideview.png", delay: 100 }, { name: "paremjalgyleval.png", delay: 100 }, { name: "Sideview.png", delay: 100 }, { name: "vasakjalgyleval.png", delay: 100 }]);

        // // this.scaleX = PlayerEntity.PLAYER_WIDTH / originalWidth;
        // // this.scaleY = PlayerEntity.PLAYER_HEIGHT / originalHeight;

        // // // walking
        // // const rightLegImage = me.loader.getImage("player-rightleg");
        // // const leftLegImage = me.loader.getImage("player-leftleg");

        // // // Create sprite with right leg image as placeholder
        // // const sprite = new me.Sprite(0, 0, { image: rightLegImage });

        // // // Define walking animation
        // // sprite.addAnimation("walk", [
        // //     { name: "player-rightleg", delay: 100 },
        // //     { name: "player-leftleg", delay: 100 },
        // // ]);

        // // Set default animation
        // this.sprite.setCurrentAnimation("walk");

        // // Assign the sprite to the renderable property
        // this.renderable = this.sprite;

        // -------------

        this.body.setMaxVelocity(15, this.maxFallSpeed);
        this.body.setFriction(0.5, 0);

        this.body.setCollisionMask(me.collision.types.ALL_OBJECT);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.body.removeShapeAt(0);
        this.body.addShape(new me.Rect(0, 0, this.width / 2, this.height / 2));
        this.body.gravityScale = this.gravity;
        this.alwaysUpdate = true;

        this.anchorPoint.set(0.5, 0);
    }

    private jump() {
        if (!this.isDucking && (Math.abs(this.body.vel.y!) < 0.9)) {
            this.isJumping = true;

            // setanim jump

            this.jumpTimer = 0;
            this.body.force.y = PlayerEntity.JUMP_VELOCITY / 4;
        }
    }

    private duckStart() {
        if ((Math.abs(this.body.vel.y!) > 0.9)) {
            return;
        }
        this.isDucking = true;

        this.height = PlayerEntity.DUCK_HEIGHT;
        this.body.removeShapeAt(0);
        const shape = new me.Rect(0, 0, this.width / 2, this.height / 2);
        this.body.addShape(shape);
        this.pos.y! += (PlayerEntity.PLAYER_HEIGHT - PlayerEntity.DUCK_HEIGHT) / 2;

        if (this.pos.x! - this.startX < 250) {
            this.body.force.x = 15;
        }
    }

    private checkOverhead(): boolean {
        const vectorStart = new me.Vector2d(this.pos.x, this.pos.y)
        const vectorEnd = new me.Vector2d(this.pos.x! + 10, this.pos.y! - (PlayerEntity.PLAYER_HEIGHT - PlayerEntity.DUCK_HEIGHT) / 2)
        const collisionResults = me.collision.rayCast(new me.Line(0, 0, [vectorStart, vectorEnd]))
        for (const res of collisionResults) {
            if (res.body.collisionType == me.collision.types.WORLD_SHAPE) {
                return true;
            }
        }

        return false;
    }

    private checkUnder(): boolean {
        const vectorStart = new me.Vector2d(this.pos.x, this.pos.y)
        const vectorEnd = new me.Vector2d(this.pos.x, this.pos.y! + this.height / 2)
        const collisionResults = me.collision.rayCast(new me.Line(0, 0, [vectorStart, vectorEnd]))
        for (const res of collisionResults) {
            if (res.body.collisionType == me.collision.types.WORLD_SHAPE) {
                return true;
            }
        }

        return false;
    }

    private duckEnd() {
        if (this.checkOverhead()) {
            return;
        }

        this.isDucking = false;
        this.height = PlayerEntity.PLAYER_HEIGHT;
        this.body.removeShapeAt(0);
        const shape = new me.Rect(0, 0, this.width / 2, this.height / 2);
        this.body.addShape(shape);
        this.pos.y! -= (PlayerEntity.PLAYER_HEIGHT - PlayerEntity.DUCK_HEIGHT) / 2;
    }

    public update(dt: number): boolean {
        if (me.input.isKeyPressed("jump")) {
            if (!this.isJumping) {
                this.jump();
            } else if (this.body.vel.y! <= 0.9 && this.jumpTimer < PlayerEntity.MAX_JUMP_DURATION) {
                this.jumpTimer += dt;
                if (this.jumpTimer <= PlayerEntity.MAX_JUMP_DURATION) {
                    this.body.force.y! = (PlayerEntity.JUMP_VELOCITY * (dt / 1000) * 4);
                }
            }
        } else if (this.body.vel.y! <= 0.9) {
            this.jumpTimer = PlayerEntity.MAX_JUMP_DURATION;
        }

        if (me.input.isKeyPressed("duck")) {
            if (!this.isDucking) {
                this.duckStart();
                // setanim ducking
            }
        } else if (this.isDucking) {
            this.duckEnd();
            // setanim walk to end duck
        }

        if (this.pos.y! > this.groundY - this.height / 2) {
            this.isJumping = false;
            this.pos.y = this.groundY - this.height / 2;
            this.body.vel.y = 0;
            // setanim walk for jump end
        } else if (this.pos.y! < 1) {
            if (this.body.vel.y! < 1) {
                this.body.vel.y = 1;
            } else {
                this.body.force.y = 1
            }
        } else if (this.isJumping && this.checkUnder() && (Math.abs(this.body.vel.y!) < 0.9)) {
            this.isJumping = false;
            // setanim walk for jump end
        }

        if (this.pos.x! - this.startX < -3) {
            this.body.force.x = 1
        } else if (this.pos.x! - this.startX > 3 && !this.isDucking) {
            this.body.force.x = -1
        }

        return true;
    }

    onCollision(response: ResponseObject, other: me.Entity): boolean {
        if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {

            return true;
        }

        return false;
    }

    public draw(renderer: me.WebGLRenderer) {

        // let color = new me.Color(0, 255, 0);
        // if (this.isDucking) {
        //     color.setColor(0, 0, 255);
        // } else if (this.isJumping) {
        //     color.setColor(255, 0, 0);
        // }

        // renderer.currentColor = color;

        // const rect: me.Rect = new me.Rect(
        //     this.pos.x ? this.pos.x : 0,
        //     this.pos.y ? this.pos.y : 0,
        //     this.width,
        //     this.height
        // );

        // renderer.stroke(rect, true);

        if (this.image) {

            renderer.save();

            renderer.translate(this.pos.x ?? 0, this.pos.y ?? 0);

            renderer.scale(this.scaleX, this.scaleY);

            // renderer.translate(20, -20);

            this.image.draw(renderer);

            renderer.restore();
        }
    }

    public destroy(...args: any[]): void {
        super.destroy(...args);
    }
};

export default PlayerEntity;
