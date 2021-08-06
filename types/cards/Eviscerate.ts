import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Eviscerate implements Card {

  cardType = CardType.single;
  cost = 3;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Eviscerate();
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
      this.owner.takeDamage(this.owner.dealDamage(5));
      return;
    }
    this.target[0].takeDamage(this.owner.dealDamage(5));
  }

  toJson() {
    return {
      title : "Eviscerate",
      cost : this.cost,
      description : "Choose a player and deal 5 damage",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}