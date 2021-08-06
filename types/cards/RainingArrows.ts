import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class RainingArrows implements Card {

  cardType = CardType.multiple;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new RainingArrows();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    let owner = <Player> this.owner;
    this.target.forEach(
      target => {
        if (target.isNullify()) return;
        if (target.isReflecting()) {
          this.owner.takeDamage(this.owner.dealDamage(2));
          return;
        }
        if (target != owner) target.takeDamage(owner.dealDamage(2));
      }
    );
  }

  toJson() {
    return {
      title : "Raining Arrows",
      cost : this.cost,
      description : "Deal 2 damage to all players except yourself",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}