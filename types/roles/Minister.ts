import { Role } from "../Role";
import { Room } from "../Room";

export class Minister implements Role {

  static Minister = new Minister();
  
  health = 15;
  visible = false;
  
  toString() : string {
    return "Minister";
  }

}