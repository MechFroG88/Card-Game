import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Torture implements Card {

  cardType = CardType.single;
  cost = 1;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Torture();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    if (this.target[0].isNullify()) return;
    this.target[0].takeDamage(this.owner.dealDamage(3));
  }

  toJson() {
    return {
      title : "Torture",
      cost : this.cost,
      description : "Choose a player and deal 3 damage",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}