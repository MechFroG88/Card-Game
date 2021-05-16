import { Role } from "../Role";
import { Room } from "../Room";

export class Traitor implements Role {

  static Traitor = new Traitor();
  
  health = 15;
  visible = false;

  win(game: Room): boolean {
    throw new Error("Method not implemented.");
  }
  
  toString() : string {
    return "Traitor";
  }

}