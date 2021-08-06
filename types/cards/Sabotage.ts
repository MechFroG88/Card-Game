import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';
import { Sleep } from './Sleep';

export class Sabotage implements Card {

  cardType = CardType.single;
  cost = 5;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Sabotage();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void {
    this.target = target;
  }

  play(room : Room) : void {
    if (this.owner.isNullify()) return;
    if (this.target[0].isNullify()) return;
    let turn = room.getCurrentTurn() + 1;
    while (turn < 3) {
      for (let index = 0; index < room.turn[turn].length; index++) {
        let card = room.turn[turn][index];
        if (card.owner == this.target[0]) {
          room.turn[turn][index] = new Sleep().setOwner(this.target[0]);
        }
      }
      turn += 1;
    }
  }

  toJson() {
    return {
      title : "Sabotage",
      cost : this.cost,
      description : "Choose a player and change the player’s cards for the following turns to sleep",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}