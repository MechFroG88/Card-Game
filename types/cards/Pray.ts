import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class Pray implements Card {

  cardType = CardType.self;
  cost = 1;

  owner !: Player;
  target !: Player[];

  setTarget(target : Player) : void { }

  setOwner(owner : Player) : Card {
    let card = new Pray();
    card.owner = owner;
    return card;
  }

  play(): string {
    this.owner.addHealth(2);
    return `${this.owner.name} uses Pray`;
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