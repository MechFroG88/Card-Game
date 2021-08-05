import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class Torture implements Card {

  cardType = CardType.single;
  cost = 1;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Torture();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(): string {
    this.target[0].takeDamage(this.owner.dealDamage(2));
    return `${this.owner.name} uses Torture on ${this.target[0].name}`;
  }

  toJson() {
    return {
      title : "Torture",
      cost : this.cost,
      description : "Choose a player and deal 2 damage",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}