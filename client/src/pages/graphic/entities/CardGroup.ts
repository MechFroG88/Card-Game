import { Card } from './Card';

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
export class PlayCard extends Card {
}

/**
 * CardGroup class to encapsulate the creation of multiple Cards.
 * Abstracts the handlers of removing and adding Cards into the CardGroup.
 *
 * The addCard() method is still yet to be implemented.
 */
export class CardGroup {
  // The Scene that this CardGroup is in.
  private scene : Phaser.Scene;

  // Number of Cards currently in the CardGroup.
  private count : number;

  // Coordinates for the center of the CardGroup.
  private centerX : number;
  private centerY : number;

  // Options for the interaction of Cards in this CardGroup.
  private options : CardGroupOptions;

  // Array of Cards.
  private cards : Card[];

  // Default animation duration for Card repositioning
  private animationDuration : number = 300;

  /**
   * Constructor for a CardGroup.
   *
   * @param {Phaser.Scene} scene The scene to render this CardGroup in.
   * @param {number} x The X-coordinates of CardGroup. (positioned at the center of the CardGroup)
   * @param {number} y The Y-coordinates of CardGroup. (positioned at the center of the CardGroup)
   * @param {number} count Number of cards in the CardGroup initially.
   * @param {CardGroupOptions} opt Options for the interaction of Cards in this CardGroup.
   */
  constructor(scene : Phaser.Scene, x : number, y : number, count : number, opt : CardGroupOptions) {
    // Initialize and presetting the fields
    this.scene = scene;

    this.centerX = x;
    this.centerY = y;

    this.count = count;
    this.cards = [];

    this.options = opt;

    // Current X coordinate is set to the leftmost X offset
    let currX = x - (count - 1)/2 * opt.space;

    for (let n = 0; n < count; currX += opt.space, n++) {
      // Create a new Card
      let current : Card = new PlayCard(scene, currX, y);

      // Add current Card to the Card array
      this.cards.push(current);
    }

    this.adjustCardPosition();
  }

  /**
   * Removes the Card at a certain index in the Card array.
   *
   * @param {number} index Index of the card to be removed. (must be a valid index)
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
      y: removed.y - 120,
      alpha: 0,
      duration: this.animationDuration
    });

    // Adjust Card positions after 500ms delay
    this.adjustCardPosition(300);
  }

  /**
   * Add a card to the specified index in the CardGroup.
   *
   * @param {number} index Index of the Card upon inserting.
   * @param {Card} card The Card object to be added.
   */
  public addCard(index : number) : void {
    if (index < 0 || index > this.count) {
      // Invalid index or null card
      return;
    }

    // Increment card count and insert an empty card at that index
    this.count++;
    this.cards.splice(index, 0, null);

    // Move existing cards to their new position
    this.adjustCardPosition();

    // X coordinate of new Card
    let x = this.centerX + (index - (this.count - 1) / 2) * this.options.space;

    // Create a new Card at that index with the correct X coord but slightly higher in Y
    this.cards[index] = new PlayCard(this.scene, x, this.centerY - 150);
    
    // Initialize the Card to transparent
    this.cards[index].setAlpha(0);

    // Adjust the center and depth of the new Card with this method call
    this.adjustCardPosition(this.animationDuration);

    // Fade the Card in
    this.cards[index].animate({
      alpha: 1,
      delay: this.animationDuration,
      duration: 200
    });
  }

  /**
   * Permute the Cards according to the permutation given.
   *
   * @param {number[]} perm Permutation array that describes how to permute the Cards.
   */
  public permuteCards(perm : number[]) : void {
    if (perm.length != this.count) {
      // Invalid perm
      return;
    }

    this.cards = perm.map(newInd => this.cards[newInd]);

    this.adjustCardPosition();
  }

  /**
   * Adjust the position of Cards according to the contents of the cards field.
   * This method also handles the updating of Card events, as well as other fields
   * such as depth value.
   *
   * @param {number} [delay] Optional delay for animation.
   */
  private adjustCardPosition(delay ?: number) : void {
    if (delay === null) delay = 0;

    // Leftmost X offset of the new CardGroup
    let currX = this.centerX - (this.count - 1)/2 * this.options.space;

    for (let i = 0; i < this.count; currX += this.options.space, i++) {
      let current : Card = this.cards[i];

      // Skip empty cards
      if (current === null) continue;


      // Move the card's center to the new position
      current.moveCenter(currX, this.centerY, { delay, duration: this.animationDuration });

      setTimeout(() => {
        current.setDepth(i);
        current.setDefaultStyle();
      }, delay);

      // Define the pointerover (hover) behaviour
      current.off('pointerover');
      current.on('pointerover', (pointer, x, y, event) => {
        current.setHoverStyle();
        current.translateFromOrigin(0, -1 * this.options.popup);
        for (let j = i + 1; j < this.count; j++) {
          let currentCardToMove : Card = this.cards[j];
          currentCardToMove.translateFromOrigin(this.options.shift, 0);
        }
      });

      // Define the pointerout (end hover) behaviour
      current.off('pointerout');
      current.on('pointerout', (pointer, x, y, event) => {
        current.setDefaultStyle();
        current.translateFromOrigin(0, 0);
        for (let j = i + 1; j < this.count; j++) {
          let currentCardToMove : Card = this.cards[j];
          currentCardToMove.translateFromOrigin(0, 0);
        }
      });


      // Redefine new pointerdown event for the new indices
      current.off('pointerdown');
      current.on('pointerdown', () => {
        this.removeCard(i);
      });
    }
  }
}
