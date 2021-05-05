import { Player } from "./Player";

export interface Card {
  player : Player;
  target : Player[]; 

  isTargetable : boolean;

  play() : void;
}
