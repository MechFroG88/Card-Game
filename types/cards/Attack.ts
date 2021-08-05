import { Card, CardType } from '../Card'
import { Player } from '../Player';

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

  play(): string {
    this.target[0].takeDamage(this.owner.dealDamage(1));
    return `${this.owner.name} uses Attack on ${this.target[0].name}`;
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