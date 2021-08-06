import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Bloodletting implements Card {

  cardType = CardType.self;
  cost = 1;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Bloodletting();
    card.owner = owner;
    return card;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    this.owner.takeDamage(this.owner.dealDamage(2));
  }

  toJson() {
    return {
      title : "Bloodletting",
      cost : this.cost,
      description : "Deal 2 damage to yourself",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}