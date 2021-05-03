import { Card } from "./Card";
import { Role } from "./Role";

export class Player extends Client {
  private role : Role;
  private hand : Card [];
  private play : Card [];
  private active : Card [];
  private field : {any:any};
}
