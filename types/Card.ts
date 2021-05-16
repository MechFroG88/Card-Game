import { Player } from './Player';

export enum CardType {
  self = "self", // self card
  single = "single", // single target card
  multiple = "multiple" // multiple targets card
}

export interface Card {

  /**
   * The Type of the card
   */
  cardType : CardType;

  /**
   * The starting bid cost of the card
   */
  cost : number;

  /**
   * The play action for the card
   */
  play() : string;

  /**
   * Set the owner of the card
   * 
   * @param owner The owner of the card
   */
  setOwner(owner : Player) : Card;

  /**
   * Set the card's target player
   * 
   * @param target The targeted player(s)
   */
  setTarget(target : Player | Player[]) : void;

  /**
   * Return json that describe the cards
   * 
   * @return The description of the card
   */
  toJson() : {title : string, cost : number, description : string, cardType : CardType};

}
