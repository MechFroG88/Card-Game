/*** Start of type and namespace imports ***/

import InputTypes = Phaser.Types.Input;

/*** End of type and namespace imports ***/

/**
 * A Card class for the skeleton of a Card object.
 *
 * Might be changed to support images instead of rectangles.
 */
export class Card extends Phaser.GameObjects.Rectangle {
  // Default values for a card (might change to using sprites)
  private static width  : number = 100;
  private static height : number = 150;

  // X and Y coordinates of the Card
  private originalX : number;
  private originalY : number;

  // Tween config used to animate the card
  private tweenConfig : object;

  // GameObject of the Card
  private gameObj : Phaser.GameObjects.GameObject;

  // Animation duration in milliseconds
  private animationDuration : number = 150;

  // Default interactive configuration for a card
  private interactiveConfig : InputTypes.InputConfiguration = {
    draggable: false,
    useHandCursor: true
  };

  /**
   * Constructor for a Card object.
   *
   * @param {Phaser.Scene} scene Phaser scene object to add the Card to.
   * @param {number} x X-coordinate of the Card. (coordinates taken at the center of the Card)
   * @param {number} y Y-coordinate of the Card. (coordinates taken at the center of the Card)
   * @param {InputTypes.InputConfiguration} [config] - Configuration for the Card's interactivity.
   */
  constructor(scene : Phaser.Scene, x : number, y : number, config ?: InputTypes.InputConfiguration) {
    super(scene, x, y, Card.width, Card.height);

    // Store constructor information in fields for references in other methods
    this.scene = scene;
    this.originalX = x;
    this.originalY = y;

    // Override config if provided
    if (config !== undefined) { this.interactiveConfig = config; }

    // Make the card interactive
    super.setInteractive(this.interactiveConfig);

    // Add game object to scene
    this.gameObj = this.scene.add.existing(this);

    // Default animation (tween) configuration
    this.tweenConfig = {
      duration: this.animationDuration,
      ease: 'Sine.easeOut',
      targets: this.gameObj
    };
  }

  /**
   * Method to set the default style of the Card.
   * Override this if there are custom styles.
   * Note: Use absolute stylings, relative stylings like setScale() might give
   * unexpected behaviours.
   */
  public setDefaultStyle() {
    this.setStrokeStyle(3, 0);
    this.setFillStyle(0xff0000);
  }

  /**
   * Method to set the style of the Card during pointerover event.
   * Override this if there are custom styles.
   * Note: Use absolute stylings, relative stylings like setScale() might give
   * unexpected behaviours.
   */
  public setHoverStyle() {
    this.setStrokeStyle(3, 0x10e0ff);
    this.setFillStyle(0xff5050);
  }

  /**
   * Moves the Card and its center to the absolute coordinates on the canvas.
   *
   * @param {number} x New X-coordinate of Card.
   * @param {number} y New Y-coordinate of Card.
   * @param {object} [conf] Configuration for animating the movement of the Card.
   */
  public moveCenter(x : number, y : number, conf ?: object) : void {
    this.moveTo(x, y, conf);
    this.originalX = x;
    this.originalY = y;
  }

  /**
   * Moves Card to the absolute coordinates on the canvas.
   *
   * @param {number} x New X-coordinate of Card.
   * @param {number} y New Y-coordinate of Card.
   * @param {object} [conf] Configuration for animating the movement of the Card.
   */
  public moveTo(x : number, y : number, conf ?: object) : void {
    this.animate({x, y, ...conf});
  }

  /**
   * Translates Card relative to current position.
   *
   * @param {number} dx Distance in X direction.
   * @param {number} dy Distance in Y direction.
   * @param {object} [conf] Configuration for animating the movement of the Card.
   */
  public translate(dx : number, dy : number, conf ?: object) : void {
    this.moveTo(this.x + dx, this.y + dy, conf);
  }

  /**
   * Translates Card relative to original center.
   *
   * @param {number} dx Distance in X direction.
   * @param {number} dy Distance in Y direction.
   * @param {object} [conf] Configuration for animating the movement of the Card.
   */
  public translateFromOrigin(dx : number, dy : number, conf ?: object) : void {
    this.moveTo(this.originalX + dx, this.originalY + dy, conf);
  }

  /**
   * Animate Card using the configuration passed in.
   *
   * @param {object} conf Configuration for the animation.
   */
  public animate(conf : object) : void {
    this.scene.tweens.add({
      ...this.tweenConfig,
      ...conf
    });
  }
}

