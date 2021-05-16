import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class Pray implements Card {

  cardType = CardType.self;
  cost = 1;

  owner !: Player;

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Pray();
    card.owner = owner;
    return card;
  }

  play(): string {
    this.owner.addHealth(2);
    return `${this.owner.name} uses Pray`;
  }

  toJson() {
    return {
      title : "Pray",
      cost : 1,
      description : "Choose a player and restore 2 health",
      cardType : this.cardType,
    };
  }
  
}