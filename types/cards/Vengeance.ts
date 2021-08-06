import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Vengeance implements Card {

  cardType = CardType.single;
  cost = 4;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Vengeance();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    if (this.target[0].isNullify()) return;
    if (this.target[0].isReflecting()) {
      this.owner.takeDamage(this.owner.dealDamage(this.owner.getRoundDamage()));
      return;
    } 
    this.target[0].takeDamage(this.owner.dealDamage(this.owner.getRoundDamage()));
  }

  toJson() {
    return {
      title : "Vengeance",
      cost : this.cost,
      description : "Choose a player and deal damage base on your damage taken on the previous turns",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}