import { Card } from "./Card";
import { Role } from "./Role";

export class Player {

  private _id !: string;
  private _name !: string;
  private _socketId !: string;
  
  private _position !: number;
  private role !: Role;
  private _hand !: Card [];
  private _play !: Array<{index : number, target : number}>;
  private active !: Card [];
  private _isDeath !: boolean;
  private health !: number;
  private coin !: number;
  private coinBid !: number;
  private coinIncrement !: number;
  private damage !: number;
  private defence !: number;
  private roundDamage !: number;
  private amplify !: number;
  private immune !: boolean;

  get id() : string { return this._id }
  set id(_id : string) { this._id = _id }; 

  get name() : string { return this._name }
  set name(_name : string) { this._name = _name }; 
  
  get socketId() : string { return this._socketId }
  set socketId(_socketId : string) { this._socketId = _socketId };

  get position() : number { return this._position }
  set position(_position : number) { this._position = _position };

  get hand() : Card[] { return this._hand }
  set hand(_hand : Card[]) { this._hand = _hand };

  get play() : Array<{index : number, target : number}> { return this._play }
  set play(_play : Array<{index : number, target : number}>) { this._play = _play };

  get isDeath() : boolean { return this._isDeath }
  set isDeath(_isDeath : boolean) { this._isDeath = _isDeath };

  constructor(id : string, name : string, socketId : string) {
    this.id = id;
    this.name = name;
    this.socketId = socketId;
  }

  initialize(role : Role, position : number) {
    this.position = position;
    this.role = role;
    this.hand = [];
    this.play = Array(3).fill(0).map(x => {return {index : -1, target : -1}; });
    this.active = [];
    this.isDeath = false;
    this.health = role.health;
    this.coin = 5;
    this.coinBid = 0;
    this.coinIncrement = 2;
    this.damage = 0;
    this.defence = 0;
    this.roundDamage = 0;
    this.amplify = 0;
    this.immune = false;
  }

  privateData() {
    return {
      name : this.name,
      position : this.position,
      health : this.health,
      defence : this.defence,
      isDeath : this.isDeath,
      hand : this.hand.map(card => card.toJson()),
      play : this.play,
      coin : this.coin,
      coinBid : this.coinBid,
      role : this.role.toString(),
      active : this.active.map(card => card.toJson()),
    };
  }

  publicData() {
    if (this.isDeath) {
      return this.privateData();
    }
    return {
      name : this.name,
      position : this.position,
      health : this.health,
      defence : this.defence,
      isDeath : this.isDeath,
      role : this.role.visible ? this.role.toString() : "?",
      active : this.active.map(card => card.toJson()),
    };
  }

  shopStart () : void {
    this.coin += this.coinIncrement;
  }

  shopEnd () : void {
    this.coinBid = 0;
  }

  endTurn () : void {
    this.health -= this.damage;
    if (this.health < 0) {
      this.isDeath = true;
    }
    this.defence = 0;
  }

  endRound () : void {
    let hand = [];
    let indices = this.play.map(x => x.index);
    for (let i = 0; i < this.hand.length; i++) {
      if (i in indices) continue;
      hand.push(this.hand[i]); 
    }
    this.hand = hand;
    this.play = Array(3).fill(0).map(x => { return {index : -1, target : -1}; });
  }

  useCoin (coin : number) : void {
    this.coin -= coin;
  }

  bid (coin : number) : boolean {
    if (coin > this.coin) return false;
    this.coinBid = coin;
    return true;
  }

  takeDamage(damage : number) : void {
    if (this.isImmune()) return;
    damage -= this.defence;
    damage = Math.max(damage, 0);
    this.health -= damage;
    this.roundDamage += damage;
  }

  dealDamage(damage : number) : number {
    return damage + this.amplify || 0;
  }

  increaseDefence(defence : number) : void {
    this.defence += defence;
  }

  addHealth(health : number) : void {
    this.health += health;
  }

  isImmune() : boolean {
    return this.immune;
  }

  addActive(card : Card) : void {
    this.active.push(card);
  }

  addHand(card : Card) : void {
    this.hand.push(card.setOwner(this));
  }
  
}
