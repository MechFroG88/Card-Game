import { Card, CardType } from '../Card'
import { Player } from '../Player';
import { Room } from '../Room';

export class Festival implements Card {

  cardType = CardType.room;
  cost = 4;

  owner !: Player;
  target !: Player[];

  setOwner(owner : Player) : Card {
    let card = new Festival();
    card.owner = owner;
    return card;
  }

  setTarget(target : Player[]) : void { }

  play(room : Room) : void {
    let players = Object.values(room.players);
    for (let player of players) {
      if (player.isDeath) continue;
      player.makeNullify();
    }
  }

  toJson() {
    return {
      title : "Festival",
      cost : this.cost,
      description : "Nullify all cards",
      cardType : this.cardType,
      owner : this.owner?.publicData(),
      target : this.target?.map(target => target.publicData())
    };
  }
  
}