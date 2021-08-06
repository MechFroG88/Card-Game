import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Attack implements Card {

  cardType = CardType.single;
  cost = 0;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Attack();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    if (this.target[0].isNullify()) return;
    if (this.target[0].isReflecting()) {
      this.owner.takeDamage(this.owner.dealDamage(1));
      return;
    } 
    this.target[0].takeDamage(this.owner.dealDamage(1));
  }

  toJson() {
    return {
      title : "Attack",
      cost : this.cost,
      description : "Deal 1 damage to a target",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}