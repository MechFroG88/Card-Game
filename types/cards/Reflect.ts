import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Reflect implements Card {

  cardType = CardType.self;
  cost = 5;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Reflect();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.makeReflect();
  }

  toJson() {
    return {
      title : "Reflect",
      cost : this.cost,
      description : "Reflect all the damage back to the damage dealer",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}