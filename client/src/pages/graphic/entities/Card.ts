/* Phaser Inputs */
import Input = Phaser.Input;
import Pointer = Input.Pointer;

/* Phaser Inputs Types */
import InputTypes = Phaser.Types.Input;
import InputEvent = InputTypes.EventData;

import Tween = Phaser.Tweens.Tween;

export class Card extends Phaser.GameObjects.Rectangle {
  // Default values for a card (might change to using sprites)
  public static width  : number = 80;
  public static height : number = 120;
  private static color  : number = 0xff0000;
  private originalX : number;
  private originalY : number;

  // Override the parent scene to be used in this class
  public scene : Phaser.Scene;

  // Tween used to animate the card
  private tweenConfig : object;
  private gameObj : Phaser.GameObjects.GameObject;

  // Animation duration in milliseconds
  private animationDuration : number = 150;

  // Default interactive configuration for a card
  private interactiveConfig : InputTypes.InputConfiguration = {
    draggable: false,
    useHandCursor: true
  };

  constructor(scene : Phaser.Scene, x : number, y : number, config ?: InputTypes.InputConfiguration) {
    super(scene, x, y, Card.width, Card.height, Card.color);

    this.scene = scene;
    this.originalX = x;
    this.originalY = y;

    // Override config if provided
    if (config !== undefined) { this.interactiveConfig = config; }

    // Make the card interactive
    super.setInteractive(this.interactiveConfig);

    this.gameObj = this.scene.add.existing(this);

    this.tweenConfig = {
      duration: this.animationDuration,
      ease: 'Sine.easeOut',
      targets: this.gameObj
    };
  }

  public translate(dx : number, dy : number) : void {
    this.scene.tweens.add({
      ...this.tweenConfig,
      x: this.x + dx,
      y: this.y + dy
    });
  }

  public translateFromOrigin(dx : number, dy : number) : void {
    this.scene.tweens.add({
      ...this.tweenConfig,
      x: this.originalX + dx,
      y: this.originalY + dy
    });
  }
}

type CardGroupOptions = {
  space : number;
  shift : number;
  popup : number;
};

export class CardGroup {
  private count : number;
  private centerX : number;
  private centerY : number;
  private cards : Card[];

  constructor(scene : Phaser.Scene, x : number, y : number, count : number, opt : CardGroupOptions) {
    this.count = count;
    this.cards = [];
    for (let currX = x - (count - 1)/2 * opt.space, n = 0; n < count; currX += opt.space, n++) {
      let current : Card = new Card(scene, currX, y);

      current.setStrokeStyle(3, 0);

      current.on('pointerover', (pointer, x, y, event) => {
        current.setStrokeStyle(3, 0x10e0ff);
        current.setFillStyle(0xff5050);
        current.translateFromOrigin(0, -1 * opt.popup);
        for (let i = n + 1; i < count; i++) {
          let currentCardToMove : Card = this.cards[i];
          currentCardToMove.translateFromOrigin(opt.shift, 0);
        }
      });

      current.on('pointerout', (pointer, x, y, event) => {
        current.setStrokeStyle(3, 0);
        current.setFillStyle(0xff0000);
        current.translateFromOrigin(0, 0);
        for (let i = n + 1; i < count; i++) {
          let currentCardToMove : Card = this.cards[i];
          currentCardToMove.translateFromOrigin(0, 0);
        }
      });

      this.cards.push(current);
    }
  }
}
