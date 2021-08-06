import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Sword implements Card {

  cardType = CardType.self;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Sword();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.amplifyDamage(1);
  }

  toJson() {
    return {
      title : "Sword",
      cost : this.cost,
      description : "Increase your damage deal in the following turns by 1",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}