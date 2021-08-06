import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Alchemy implements Card {

  cardType = CardType.self;
  cost = 0;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Alchemy();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.coin *= 2;
  }

  toJson() {
    return {
      title : "Alchemy",
      cost : this.cost,
      description : "Multiply your coins by 2",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}