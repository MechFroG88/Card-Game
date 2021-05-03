import { Player } from "./Player";

export abstract class Card {
  player : Player;
  target : Player[]; 

  isTargetable : boolean;

  play() : void;
}
