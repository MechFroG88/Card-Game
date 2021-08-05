import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class Defence implements Card {

  cardType = CardType.self;
  cost = 0;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Defence();
    card.owner = owner;
    return card;
  }

  play(): string {
    this.owner.increaseDefence(1);
    return `${this.owner.name} uses Defence`;
  }

  toJson() {
    return {
      title : "Defence",
      cost : this.cost,
      description : "Reduce 1 damage from all attacks",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}