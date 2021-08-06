import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Rain implements Card {

  cardType = CardType.multiple;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Rain();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    this.target.forEach(
      target => {
        if (target.isNullify()) return;
        target.restoreHealth(1);
      }
    );
  }

  toJson() {
    return {
      title : "Rain",
      cost : this.cost,
      description : "Restore 1 health to all players",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}