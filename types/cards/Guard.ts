import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Guard implements Card {

  cardType = CardType.self;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Guard();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.increaseDefence(4);
  }

  toJson() {
    return {
      title : "Guard",
      cost : this.cost,
      description : "Reduce 4 damage from all attacks",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}