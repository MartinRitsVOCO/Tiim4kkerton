import * as me from "melonjs";

// Define a type for the image resources to include their native width
type BackgroundImage = {
    key: string; // The resource key (e.g., "bg_image_1")
    image: HTMLImageElement; // The loaded image element
    width: number; // The native width of the image
    height: number; // The native height of the image
};

// Define a structure to hold a sprite instance along with its calculated width
type ManagedSprite = {
    sprite: me.Sprite;
    scaledWidth: number; // The width of the sprite instance after scaling
};

class ScrollingBackground extends me.Container {
    private speed: number;
    private viewportHeight: number;
    private baseScaleFactor: number;
    private backgroundImages: BackgroundImage[]; // Pool of images
    private managedSprites: ManagedSprite[] = []; // Array to manage sprites and their widths

    // Define the overlap amount (2 pixels)
    private static OVERLAP_AMOUNT = 2; 

    // Define the maximum number of sprites to use
    private static MAX_SPRITES = 4;
    // Define the chance (0.0 to 1.0) of selecting an alternate image
    private static VARIATION_CHANCE = 0.40;

    constructor(viewportWidth: number, viewportHeight: number, imagePool: HTMLImageElement[], speed: number) {
        // --- 1. Calculate properties using local variables before super() ---

        // Assume the first image in the pool is the "default" for height scaling
        const defaultImage = imagePool[0]; 
        const defaultNativeHeight = defaultImage.height;

        // Calculate the base scale factor to fit the viewport height
        const scaleFactor = viewportHeight / defaultNativeHeight;

        // Populate the typed image pool using local variables
        const localBackgroundImages: BackgroundImage[] = imagePool.map((img, index) => ({
            key: `bg_image_${index}`,
            image: img,
            width: img.width,
            height: img.height,
        }));

        // Find the maximum possible width for container sizing
        const maxNativeWidth = Math.max(...localBackgroundImages.map(img => img.width));
        const maxScaledWidth = maxNativeWidth * scaleFactor;
        
        // --- 2. Call super() ---
        
        // The container needs to be wide enough to potentially hold all 4 widest sprites
        super(0, 0, maxScaledWidth * ScrollingBackground.MAX_SPRITES, viewportHeight);

        // --- 3. Assign properties to 'this.*' after super() ---
        
        this.viewportHeight = viewportHeight;
        this.baseScaleFactor = scaleFactor;
        this.speed = speed;
        this.backgroundImages = localBackgroundImages; // Assign the local pool to the instance property


        // --- Initial Sprite Creation ---

        // The starting X position for the next sprite placement
        let currentX = 0;
        const defaultImageObject = this.backgroundImages[0]; // The fixed default image object

        for (let i = 0; i < ScrollingBackground.MAX_SPRITES; i++) {
            // Create a new sprite using the now-initialized helper method
            let newManagedSprite: ManagedSprite;

            // Sprites 1 and 2 (i=0 and i=1) use the default image (index 0)
            if (i < 1) {
                // Manually create the sprite using the default image object, bypassing the random logic
                const scaledWidth = defaultImageObject.width * this.baseScaleFactor;

                const sprite = new me.Sprite(currentX, 0, { 
                    image: defaultImageObject.image,
                    anchorPoint: new me.Vector2d(0, 0),
                });
                sprite.scale(this.baseScaleFactor, this.baseScaleFactor);

                newManagedSprite = {
                    sprite: sprite,
                    scaledWidth: scaledWidth,
                };

            } else {
                // Sprites 3 and 4 (i=2 and i=3) use the standard createNewSprite method
                // which includes the 10% chance for a variation.
                newManagedSprite = this.createNewSprite(currentX, 0);
            }
            
            this.managedSprites.push(newManagedSprite);
            this.addChild(newManagedSprite.sprite, 0);
            
            // Increment currentX by the *actual scaled width* of the created sprite
            currentX += newManagedSprite.scaledWidth - ScrollingBackground.OVERLAP_AMOUNT;
        }

        this.isPersistent = true;
    }

    private createNewSprite(x: number, y: number): ManagedSprite {
        let selectedImage: BackgroundImage;

        // 10% chance to select a random image from the entire pool
        if (Math.random() < ScrollingBackground.VARIATION_CHANCE) {
            // The pool of variation images starts at index 1
            const variationPool = this.backgroundImages.slice(1);

             // Check if there are any variation images available
            if (variationPool.length > 0) {
                // Select a random index within the variation pool
                const randomIndexInPool = Math.floor(Math.random() * variationPool.length);
                
                // Get the image from the variation pool
                selectedImage = variationPool[randomIndexInPool];
            } else {
                // Fallback: If no variations exist, use the default image
                selectedImage = this.backgroundImages[0];
            }
        } else {
            // Default to the first image (index 0)
            selectedImage = this.backgroundImages[0];
        }

        // Calculate the scaled width based on the selected image's native width
        const scaledWidth = selectedImage.width * this.baseScaleFactor;

        const sprite = new me.Sprite(x, y, { 
            image: selectedImage.image,
            anchorPoint: new me.Vector2d(0, 0), // Top-left anchor
        });

        // Apply scaling
        sprite.scale(this.baseScaleFactor, this.baseScaleFactor);

        return {
            sprite: sprite,
            scaledWidth: scaledWidth,
        };
    }

    public update(dt: number) : boolean {

        const dx = this.speed*2; // * (dt / 1000)

        // 1. Move all sprites
        for (const managedSprite of this.managedSprites) {
            managedSprite.sprite.pos.x! -= dx;
        }

        // 2. Recycling logic
        // Find the rightmost sprite's position (this will be the position where the recycled sprite should be placed)
        let rightmostEdgeX = -Infinity;

        // Determine the current rightmost edge
        for (const managedSprite of this.managedSprites) {
            const currentEdge = managedSprite.sprite.pos.x! + managedSprite.scaledWidth;
            if (currentEdge > rightmostEdgeX) {
                rightmostEdgeX = currentEdge;
            }
        }

        // Check if any sprite has moved completely off-screen to the left
        for (let i = 0; i < this.managedSprites.length; i++) {
            const managedSprite = this.managedSprites[i];
            const sprite = managedSprite.sprite;

            // Recycling condition: The right edge of the sprite is at or past the left edge of the viewport (x = 0)
            if (sprite.pos.x! + managedSprite.scaledWidth <= 0) {
                
                // --- Recycling and Replacement ---
                
                // 3a. Remove and destroy the old sprite instance
                this.removeChild(sprite, true); 

                // 3b. Create a brand new managed sprite (potentially with a new image/width)
                // Its new starting position is the found rightmostEdgeX - 2px overlap
                const newX = rightmostEdgeX - ScrollingBackground.OVERLAP_AMOUNT;
                const newManagedSprite = this.createNewSprite(newX, 0);

                // 3c. Update the array slot and container
                this.managedSprites[i] = newManagedSprite;
                this.addChild(newManagedSprite.sprite, 0);
                
                // 3d. Update the rightmost edge position for the next sprite that might recycle this frame
                // This ensures sprites line up correctly even if multiple recycle in one frame.
                rightmostEdgeX += newManagedSprite.scaledWidth;
            }
        }
        
        // Call the parent update to update the container's children
        super.update(dt);

        return true;
    }
}

export default ScrollingBackground;