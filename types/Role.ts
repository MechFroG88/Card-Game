import { Room } from "./Room";

export interface Role {

  health : number;
  visible : boolean;

  /**
   * Check if the role has acheived their win condition
   * 
   * @param game The game State
   */
  win(game : Room) : boolean;

  toString() : string;
}