import * as me from "melonjs";
import PlayerEntity from "../renderables/player";

class PlayScreen extends me.Stage {
    private background: me.Renderable | null = null;

    /**
     *  action to perform on state change
     */

    onResetEvent() {
        const viewportWidth = me.game.viewport.width;
        const viewportHeight = me.game.viewport.height;

        // add a gray background to the default Stage
        me.game.world.addChild(new me.ColorLayer("background", "#202020"), -2);

        // Defines an inner class 'ScrollingBackground' for handling the visual, moving background.
        // It extends 'me.Renderable', meaning it can be drawn on the screen and updated each frame.
        class ScrollingBackground extends me.Renderable {
            private image: HTMLImageElement;
            private offsetX = 0;
            private speed = 2; // pixels per frame, seda saab muuta, et tempot kiirendada/vähendada
            private scaledWidth: number;
            private scaledHeight: number;

            constructor() {
                super(0, 0, viewportWidth, viewportHeight);
                // Retrieves the loaded image resource named "background" from the melonJS asset loader in 'manifest.ts'.
                this.image = me.loader.getImage("background");

                // Calculates the aspect ratio (width / height) of the original image.
                const aspect = this.image.width / this.image.height;

                // Sets the scaled height of the background to match the viewport height.
                this.scaledHeight = viewportHeight;

                // Calculates the scaled width based on the aspect ratio and the scaled height, maintaining proportions.
                this.scaledWidth = viewportHeight * aspect;
            }

            // Defines the 'update' method, which is called every frame to handle logic.
            // dt : The delta time, the time elapsed since the last frame (in milliseconds).
            update(dt: number) {
                // Increases the X offset by the defined scrolling speed, causing the background to move left (negative scroll effect).
                this.offsetX += this.speed;

                // Checks if the offset has exceeded the scaled width of the image (meaning one full scroll cycle is complete).
                if (this.offsetX >= -this.scaledWidth) {
                    // Resets the offset by subtracting the scaled width, creating a seamless loop/tiling effect.
                    this.offsetX -= this.scaledWidth;
                }
                return true;
            }

            draw(renderer: me.Renderer) {
                // Gets the underlying HTML5 Canvas 2D rendering context from the melonJS renderer.
                const ctx = renderer.getContext();
                // Performs a type check to ensure 'ctx' exists and is a 2D rendering context before proceeding.
                if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return;
            
                // Calculates the Y position to draw the image, anchoring it near the bottom of the viewport.
                // The +280 is a manual offset to adjust the vertical position of the background art relative to the viewport bottom.
                const drawY = viewportHeight - this.scaledHeight + 280;
                // Calculates the effective offset for the pattern tiling, ensuring it wraps correctly within one image width.
                const patternOffset = this.offsetX % this.scaledWidth;

                // Calculates the starting X position for the first tile of the background.
                // -patternOffset ensures the scrolling effect; -800 is an additional manual offset.
                const tile1_startX = -patternOffset - 800;

                // Draws the first instance of the background image (the first tile).
                ctx.drawImage(
                    this.image,
                    tile1_startX,
                    drawY, // Using the bottom-anchored Y position
                    this.scaledWidth,
                    this.scaledHeight
                );

                // Calculates the starting X position for the second tile, placing it immediately to the right of the first tile.
                const tile2_startX = tile1_startX + this.scaledWidth;

                // Defines a small overlap value to ensure there are no visible seams between the two tiles.
                const overlap = 1;

                // Calculates the final starting X position for the second tile, applying the small overlap correction.
                const tile2_fixed_startX = tile2_startX - overlap; 
                
                // Draws the second instance of the background image (the second tile).
                // This tile is what creates the seamless infinite horizontal scrolling effect.
                ctx.drawImage(
                    this.image,
                    tile2_fixed_startX,
                    drawY, 
                    this.scaledWidth,
                    this.scaledHeight
                );
            }
        }

        this.background = new ScrollingBackground();
        me.game.world.addChild(this.background, 0);

        const groundHeight = 15;
        const groundYPosition = viewportHeight - groundHeight;
        const player = new PlayerEntity(viewportWidth / 7, groundYPosition);
        me.game.world.addChild(player, 1);

    }
};

export default PlayScreen;
