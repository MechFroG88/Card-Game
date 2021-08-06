import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Propaganda implements Card {

  cardType = CardType.single;
  cost = 2;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Propaganda();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.target[0].isNullify()) return;
    this.target[0].decreaseRoundDefence(1);
  }

  toJson() {
    return {
      title : "Propaganda",
      cost : this.cost,
      description : "Choose a player Increase the damage deal to the player for the current and following turns by 1",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}