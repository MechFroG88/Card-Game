import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Armour implements Card {

  cardType = CardType.self;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Armour();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.increaseRoundDefence(1);
  }

  toJson() {
    return {
      title : "Armour",
      cost : this.cost,
      description : "Reduce your damage taken in current and following turns by 1",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}