import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Dummy implements Card {

  cardType = CardType.self;
  cost = 1;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Dummy();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.makeNullify();
  }

  toJson() {
    return {
      title : "Dummy",
      cost : this.cost,
      description : "Nullify all card effects on you",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}