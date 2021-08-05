import { Role } from "../Role";
import { Room } from "../Room";

export class King implements Role {

  static King = new King();

  health = 20;
  visible = true;
  
  toString() : string {
    return "King";
  }

}