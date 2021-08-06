import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class HolyWater implements Card {

  cardType = CardType.self;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new HolyWater();
    card.owner = owner;
    return card;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    this.owner.restoreHealth(4);
  }

  toJson() {
    return {
      title : "Holy Water",
      cost : this.cost,
      description : "Heal yourself for 4 health",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}