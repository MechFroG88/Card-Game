import { Card, CardType } from '../Card'
import { Player } from '../Player';

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

  play(): string {
    let owner = <Player> this.owner;
    this.target.forEach(
      target => target.takeDamage(owner.dealDamage(5))
    );
    return `${this.owner.name} uses Black Death`;
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