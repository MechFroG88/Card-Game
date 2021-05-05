/* Phaser Inputs */
import Input = Phaser.Input;
import Pointer = Input.Pointer;

/* Phaser Inputs Types */
import InputTypes = Phaser.Types.Input;
import InputEvent = InputTypes.EventData;

import Tween = Phaser.Tweens.Tween;

export class Card extends Phaser.GameObjects.Rectangle {
  // Default values for a card (might change to using sprites)
  private static width  : number = 100;
  private static height : number = 150;
  private static color  : number = 0xff0000;
  private originalX : number;
  private originalY : number;

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

  public moveCenter(x : number, y : number, conf ?: object) : void {
    this.moveTo(x, y, conf);
    this.originalX = x;
    this.originalY = y;
  }

  public moveTo(x : number, y : number, conf ?: object) : void {
    this.animate({x, y, ...conf});
  }

  public translate(dx : number, dy : number, conf ?: object) : void {
    this.moveTo(this.x + dx, this.y + dy, conf);
  }

  public translateFromOrigin(dx : number, dy : number, conf ?: object) : void {
    this.moveTo(this.originalX + dx, this.originalY + dy, conf);
  }

  public animate(conf : object) : void {
    this.scene.tweens.add({
      ...this.tweenConfig,
      ...conf
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
  private options : CardGroupOptions;
  private cards : Card[];

  constructor(scene : Phaser.Scene, x : number, y : number, count : number, opt : CardGroupOptions) {
    this.centerX = x;
    this.centerY = y;
    this.count = count;
    this.options = opt;
    this.cards = [];

    let currX = x - (count - 1)/2 * opt.space;

    for (let n = 0; n < count; currX += opt.space, n++) {
      let current : Card = new Card(scene, currX, y);

      current.setStrokeStyle(3, 0);

      current.on('pointerover', (pointer, x, y, event) => {
        current.setStrokeStyle(3, 0x10e0ff);
        current.setFillStyle(0xff5050);
        current.translateFromOrigin(0, -1 * opt.popup);
        for (let i = n + 1; i < this.count; i++) {
          let currentCardToMove : Card = this.cards[i];
          currentCardToMove.translateFromOrigin(opt.shift, 0);
        }
      });

      current.on('pointerout', (pointer, x, y, event) => {
        current.setStrokeStyle(3, 0);
        current.setFillStyle(0xff0000);
        current.translateFromOrigin(0, 0);
        for (let i = n + 1; i < this.count; i++) {
          let currentCardToMove : Card = this.cards[i];
          currentCardToMove.translateFromOrigin(0, 0);
        }
      });

      current.on('pointerdown', () => {
        this.removeCard(n);
      });

      this.cards.push(current);
    }
  }

  public removeCard(index : number) : void {
    if (index < 0 || index >= this.count) {
      // Invalid parameter
      return;
    }

    this.count--;
    let [removed] = this.cards.splice(index, 1);

    removed.animate({
      y: removed.y - 100,
      alpha: 0,
      duration: 500
    });

    let currX = this.centerX - (this.count - 1)/2 * this.options.space;

    for (let n = 0; n < this.count; currX += this.options.space, n++) {
      let current : Card = this.cards[n];
      current.moveCenter(currX, this.centerY, { delay: 500, duration: 300 });

      current.off('pointerdown');
      current.on('pointerdown', () => {
        this.removeCard(n);
      });
    }
  }
}
