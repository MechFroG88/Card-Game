import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Pray implements Card {

  cardType = CardType.single;
  cost = 1;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player[]) : void { 
    this.target = target;
  }

  setOwner(owner : Player) : Card {
    let card = new Pray();
    card.owner = owner;
    return card;
  }

  play(room : Room) : void {
    if (this.target[0].isNullify()) return;
    this.target[0].restoreHealth(2);
  }

  toJson() {
    return {
      title : "Pray",
      cost : this.cost,
      description : "Choose a player and restore 2 health",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}