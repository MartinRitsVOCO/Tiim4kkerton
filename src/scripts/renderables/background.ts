import * as me from "melonjs";

class ScrollingBackground extends me.Container {
    private imageWidth: number;
    private speed: number;
    private sprite1: me.Sprite;
    private sprite2: me.Sprite;

    constructor(viewportWidth: number, viewportHeight: number, image: HTMLImageElement, speed: number) {

        const imageNativeWidth = image.width;
        const imageNativeHeight = image.height;

        const scaleFactor = viewportHeight / imageNativeHeight;
        const scaledWidth = imageNativeWidth * scaleFactor;
        const scaledHeight = viewportHeight;

        // Check if the image is too small to tile (optional check)
        if (scaledWidth < viewportWidth) {
            console.warn("Scaled background image is narrower than the viewport. Consider a wider image resource.");
        }

        // Now use the scaled width as the image width for the container and scrolling logic
        const containerWidth = scaledWidth; 

        // Set the container size to be twice the image width to hold both sprites.
        super(0, 0, containerWidth * 2, viewportHeight);

        // Store configuration
        this.imageWidth = containerWidth;
        this.speed = speed;

        // Create Sprite 1: Starts at (0, 0)
        this.sprite1 = new me.Sprite(0, 0, { 
            image: image,
            anchorPoint: new me.Vector2d(0, 0), // Top-left anchor
        });

        // Create Sprite 2: Starts immediately to the right of Sprite 1
        this.sprite2 = new me.Sprite(this.imageWidth, 0, { 
            image: image,
            anchorPoint: new me.Vector2d(0, 0),
        });

        this.sprite1.scale(scaleFactor, scaleFactor);
        this.sprite2.scale(scaleFactor, scaleFactor);

        // Add both sprites as children to the container
        this.addChild(this.sprite1, 0);
        this.addChild(this.sprite2, 0);

        this.isPersistent = true;
    }

    public update(dt: number) : boolean {

        const dx = this.speed*2; // * (dt / 1000)

        this.sprite1.pos.x! -= dx;
        this.sprite2.pos.x! -= dx;

        // If Sprite 1 moves off-screen (pos.x is less than or equal to negative image width)
        if (this.sprite1.pos.x! <= -this.imageWidth) {
            // Place Sprite 1 immediately to the right of Sprite 2
            this.sprite1.pos.x = this.sprite2.pos.x! + this.imageWidth;
        }

        // If Sprite 2 moves off-screen
        if (this.sprite2.pos.x! <= -this.imageWidth) {
            // Place Sprite 2 immediately to the right of Sprite 1
            this.sprite2.pos.x = this.sprite1.pos.x! + this.imageWidth;
        }
        
        // Call the parent update to update the container's children
        super.update(dt);

        return true;
    }
}

export default ScrollingBackground;