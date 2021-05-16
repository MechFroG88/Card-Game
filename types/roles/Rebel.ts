import { Role } from "../Role";
import { Room } from "../Room";

export class Rebel implements Role {

  static Rebel = new Rebel();
  
  health = 15;
  visible = false;

  win(game: Room): boolean {
    throw new Error("Method not implemented.");
  }

  toString() : string {
    return "Rebel";
  }

}