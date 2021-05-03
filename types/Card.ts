import { Player } from "./player";

export interface Card {
  user ?: Player;
  target ?: Player[]; 
  play() : void;
}
