import * as me from "melonjs";

class PlayerEntity extends me.Renderable {

    private image: me.Sprite;

    public static PLAYER_HEIGHT = 64;
    public static PLAYER_WIDTH = 48;
    public static JUMP_VELOCITY = -25;
    public static DUCK_HEIGHT = 32;

    private gravity: number = 0.9;
    private maxFallSpeed: number = 30;
    private velocityY: number = 0;

    private isJumping: boolean = false;
    private isDucking: boolean = false;
    private isGrounded: boolean = false;

    private groundY: number = 0;

    constructor(x: number, groundY: number) {
        super(x, groundY, PlayerEntity.PLAYER_WIDTH, PlayerEntity.PLAYER_HEIGHT);
        this.groundY = groundY;

        this.anchorPoint.set(0.5, 1);

        // Player sprite
        const SVGimage = me.loader.getImage("player-texture");

        const scaleFactor = 4;

        // Offscreen canvas at high resolution
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = this.width * scaleFactor;
        offscreenCanvas.height = this.height * scaleFactor;

        const ctx = offscreenCanvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;

        // Draw the SVG at 4× resolution
        ctx.drawImage(SVGimage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // Create a final canvas at your target size
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = this.width*2;
        finalCanvas.height = this.height*2;

        const finalCtx = finalCanvas.getContext("2d")!;
        finalCtx.imageSmoothingEnabled = false;

        // Draw the high-res offscreen canvas scaled down to final size
        finalCtx.drawImage(offscreenCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

        // Create a sprite from the final canvas
        this.image = new me.Sprite(-27, -28, { image: finalCanvas });

    }

    private jump() {
        if (this.isGrounded && !this.isDucking) {
            this.velocityY = PlayerEntity.JUMP_VELOCITY;
            this.isJumping = true;
            this.isGrounded = false;
        }
    }

    private duckStart() {
        if (this.isGrounded && !this.isJumping) {
            this.isDucking = true;
            this.height = PlayerEntity.DUCK_HEIGHT;
            this.pos.y = this.groundY;
        }
    }

    private duckEnd() {
        if (this.isDucking) {
            this.isDucking = false;
            this.height = PlayerEntity.PLAYER_HEIGHT;
            this.pos.y = this.groundY;
        }
    }

    public update(dt: number): boolean {
        if (me.input.isKeyPressed("jump")) {
            this.jump();
        }
        if (me.input.isKeyPressed("duck")) {
            this.duckStart();
        } else {
            this.duckEnd();
        }

        if (!this.isGrounded && !this.isDucking) {
            this.velocityY += this.gravity;
            if (this.velocityY > this.maxFallSpeed) {
                this.velocityY = this.maxFallSpeed;
            }
            this.pos.y! += this.velocityY;

            if (this.pos.y! > this.groundY) {
                this.pos.y = this.groundY;
                this.velocityY = 0;
                this.isGrounded = true;
                this.isJumping = false;
            }
        }

        super.update(dt);

        return true;
    }

    public draw(renderer: me.CanvasRenderer | me.WebGLRenderer) {

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

        renderer.stroke(rect, true); // jätsin alles näidiseks

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
