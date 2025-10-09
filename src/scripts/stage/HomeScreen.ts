import * as me from "melonjs";

export default class HomeScreen extends me.Stage {
  private btn!: me.GUI_Object;

  onResetEvent() {
    const image = me.loader.getImage("avataust");
    const btnImage = me.loader.getImage("tatsunupp");

    const viewportWidth = me.game.viewport.width;
    const viewportHeight = me.game.viewport.height;
    
    const imageNativeWidth = image.width;
    const imageNativeHeight = image.height;
    
    const scaleFactor = viewportHeight / imageNativeHeight;
    const scaledWidth = imageNativeWidth * scaleFactor;
    const scaledHeight = viewportHeight;
    
    const backgroundImage = new me.Sprite(0, 0, { image: image, anchorPoint: new me.Vector2d(0, 0) });
    backgroundImage.scale(scaleFactor, scaleFactor);
    me.game.world.addChild(backgroundImage, -2);

    // Create a GUI_Object for the button
    const btnX = 600 // horisontaalne keskele
    const btnY = 400; // vertikaalne alumisele neljandikule

    this.btn = new (class extends me.GUI_Object {
      constructor() {
        super(btnX, btnY, {
          image: btnImage,
          width: btnImage.width,
          height: btnImage.height,
        });
      }
      // Called when the button is clicked
      onClick(event: any) {
        console.log("Nupp vajutatud!");
        me.state.change(me.state.READY, false);
        return false;
      }
    })();

  me.game.world.addChild(this.btn as any, 10); // kindla layeriga
  }

  /*  onDestroyEvent() {
        //  EEMALDA KLIKISÜNDMUS ET MÄLU EI LEKIKS
        me.input.releasePointerEvent("pointerdown", this.btn);
    } */
}
