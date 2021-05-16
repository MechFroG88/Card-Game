import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class Torture implements Card {

  cardType = CardType.single;
  cost = 1;

  owner !: Player;
  target !: Player;

  setOwner(owner : Player) : Card {
    let card = new Torture();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player) : void {
    this.target = target;
  }

  play(): string {
    this.target?.takeDamage(this.owner.dealDamage(2));
    return `${this.owner.name} uses Torture on ${this.target.name}`;
  }

  toJson() {
    return {
      title : "Torture",
      cost : 1,
      description : "Choose a player and deal 2 damage",
      cardType : this.cardType,
    };
  }
  
}