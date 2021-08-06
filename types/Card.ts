import { Player } from './Player';
import { Room } from './Room';

export enum CardType {
  room = "room", // room card
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
   * Owner of card
   */
  owner : Player;

  /**
   * Target of card;
   */
  target : Player[];

  /**
   * The play action for the card
   */
  play(room : Room) : void;

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
  toJson() : any;

}
