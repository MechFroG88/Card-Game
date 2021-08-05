import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class Sleep implements Card {

  cardType = CardType.self;
  cost = 0;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Sleep();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {}

  play(): string {
    return `${this.owner.name} sleeps`;
  }

  toJson() {
    return {
      title : "Sleep",
      cost : this.cost,
      description : "Do nothing",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}