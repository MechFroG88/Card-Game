import { Card } from './Card';

/*** Start of type and namespace imports ***/

import InputTypes = Phaser.Types.Input;

/*** End of type and namespace imports ***/

// Custom type for the options for CardGroup
type CardGroupOptions = {

  // The amount of spacing between Cards initially
  space : number;

  // The amount of shift of Cards in front of the Card you are hovering over
  shift : number;

  // The amount of popup of the Card you are hovering over
  popup : number;

};

/**
 * A class that extends the Card base class for customizations of a Card in CardGroup.
 */
class PlayCard extends Card {
  constructor(scene : Phaser.Scene, x : number, y : number, config ?: InputTypes.InputConfiguration) {
    super(scene, x, y, config);
  }
}

/**
 * CardGroup class to encapsulate the creation of multiple Cards.
 * Abstracts the handlers of removing and adding Cards into the CardGroup.
 *
 * The addCard() method is still yet to be implemented.
 */
export class CardGroup {
  // Number of Cards currently in the CardGroup.
  private count : number;

  // Coordinates for the center of the CardGroup.
  private centerX : number;
  private centerY : number;

  // Options for the interaction of Cards in this CardGroup.
  private options : CardGroupOptions;

  // Array of Cards.
  private cards : PlayCard[];

  /**
   * Constructor for a CardGroup.
   *
   * @param {Phaser.Scene} scene - The scene to render this CardGroup in.
   * @param {number} x - The X-coordinates of CardGroup. (positioned at the center of the CardGroup)
   * @param {number} y - The Y-coordinates of CardGroup. (positioned at the center of the CardGroup)
   * @param {number} count - Number of cards in the CardGroup initially.
   * @param {CardGroupOptions} opt - Options for the interaction of Cards in this CardGroup.
   */
  constructor(scene : Phaser.Scene, x : number, y : number, count : number, opt : CardGroupOptions) {
    // Initialize and presetting the fields
    this.centerX = x;
    this.centerY = y;
    this.count = count;
    this.options = opt;
    this.cards = [];

    // Leftmost X offset
    let currX = x - (count - 1)/2 * opt.space;

    for (let n = 0; n < count; currX += opt.space, n++) {
      // Create a new Card
      let current : PlayCard = new PlayCard(scene, currX, y);

      current.setDefaultStyle();

      // Define the pointerover (hover) behaviour
      current.on('pointerover', (pointer, x, y, event) => {
        current.setHoverStyle();
        current.translateFromOrigin(0, -1 * opt.popup);
        for (let i = n + 1; i < this.count; i++) {
          let currentCardToMove : Card = this.cards[i];
          currentCardToMove.translateFromOrigin(opt.shift, 0);
        }
      });

      // Define the pointerout (end hover) behaviour
      current.on('pointerout', (pointer, x, y, event) => {
        current.setDefaultStyle();
        current.translateFromOrigin(0, 0);
        for (let i = n + 1; i < this.count; i++) {
          let currentCardToMove : Card = this.cards[i];
          currentCardToMove.translateFromOrigin(0, 0);
        }
      });

      // Define the pointerdown (click / tap) behaviour
      current.on('pointerdown', () => {
        this.removeCard(n);
      });

      // Add current Card to the Card array
      this.cards.push(current);
    }
  }

  /**
   * Removes the Card at a certain index in the Card array.
   *
   * @param {number} index - Index of the card to be removed. (must be a valid index)
   */
  public removeCard(index : number) : void {
    if (index < 0 || index >= this.count) {
      // Invalid parameter
      return;
    }

    // Decrement count and remove from Card array
    this.count--;
    let [ removed ] = this.cards.splice(index, 1);

    // Animate the removed Card
    removed.animate({
      y: removed.y - 100,
      alpha: 0,
      duration: 500
    });

    // Leftmost X offset of the new CardGroup
    let currX = this.centerX - (this.count - 1)/2 * this.options.space;

    for (let n = 0; n < this.count; currX += this.options.space, n++) {
      let current : Card = this.cards[n];
      // Move the card's center to the new position
      current.moveCenter(currX, this.centerY, { delay: 500, duration: 300 });

      // Redefine new pointerdown event for the new indices
      current.off('pointerdown');
      current.on('pointerdown', () => {
        this.removeCard(n);
      });
    }
  }
}
