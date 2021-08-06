import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Business implements Card {

  cardType = CardType.self;
  cost = 0;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Business();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.coin += 10;
  }

  toJson() {
    return {
      title : "Business",
      cost : this.cost,
      description : "Earn 10 coins",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}