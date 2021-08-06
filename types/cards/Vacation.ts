import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Vacation implements Card {

  cardType = CardType.self;
  cost = 5;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Vacation();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {}

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.makeRoundNullify();
  }

  toJson() {
    return {
      title : "Vacation",
      cost : this.cost,
      description : "Nullify all card effects on you and your action card for the following turns",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}