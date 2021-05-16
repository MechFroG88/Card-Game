import { Card, CardType } from '../Card'
import { Player } from '../Player';

export class BlackDeath implements Card {

  cardType = CardType.multiple;
  cost = 0;

  owner !: Player;
  targets !: Player[];

  setOwner(owner : Player) : Card {
    let card = new BlackDeath();
    card.owner = owner;
    return card;
  }

  setTarget(targets : Player[]) : void {
    this.targets = targets;
  }

  play(): string {
    let owner = <Player> this.owner;
    this.targets.forEach(
      target => target.takeDamage(owner.dealDamage(5))
    );
    return `${this.owner.name} uses Black Death`;
  }

  toJson() {
    return {
      title : "Black Death",
      cost : 0,
      description : "Deal 5 damage to all players",
      cardType : this.cardType,
    };
  }
  
}