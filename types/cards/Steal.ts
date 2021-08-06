import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Steal implements Card {

  cardType = CardType.single;
  cost = 3;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Steal();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    if (this.target[0].isNullify()) return;
    this.owner.addHand(this.target[0].stealHand());
  }

  toJson() {
    return {
      title : "Steal",
      cost : this.cost,
      description : "Choose a player and steal a random card from their hand",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}