import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class BlackDeath implements Card {

  cardType = CardType.multiple;
  cost = 0;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new BlackDeath();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room): void {
    if (this.owner.isNullify()) return;
    let owner = <Player> this.owner;
    this.target.forEach(
      target => {
        if (target.isNullify()) return;
        if (target.isReflecting()) {
          this.owner.takeDamage(this.owner.dealDamage(5));
          return;
        }
        target.takeDamage(this.owner.dealDamage(5))
      }
    );
  }

  toJson() {
    return {
      title : "Black Death",
      cost : this.cost,
      description : "Deal 5 damage to all players",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}