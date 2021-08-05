import { Card } from "./Card";
import { Role } from "./Role";

export class Player {

  private _id !: string;
  private _name !: string;
  private _socketId !: string;
  private _ready !: boolean;
  private _position !: number;
  
  
  private _role !: Role;
  private _hand !: Card [];
  private _play !: Array<{index : number, target : number}>;
  private active !: Card [];
  private _isDeath !: boolean;
  private health !: number;
  private _coin !: number;
  private _bids !: number [];
  private coinIncrement !: number;
  private damage !: number;
  private defence !: number;
  private roundDamage !: number;
  private amplify !: number;
  private immune !: boolean;

  get id() : string { return this._id }
  set id(_id : string) { this._id = _id }; 

  get role() : Role { return this._role }
  set role(_role : Role) { this._role = _role }; 

  get name() : string { return this._name }
  set name(_name : string) { this._name = _name }; 

  get bids() : number [] { return this._bids }
  set bids(_bids : number []) { this._bids = _bids };

  get coin() : number { return this._coin}
  set coin(_coin : number) { this._coin = _coin };
  
  get socketId() : string { return this._socketId }
  set socketId(_socketId : string) { this._socketId = _socketId };

  get ready() : boolean { return this._ready }
  set ready(_ready : boolean) { this._ready = _ready };

  get position() : number { return this._position }
  set position(_position : number) { this._position = _position };

  get hand() : Card[] { return this._hand }
  set hand(_hand : Card[]) { this._hand = _hand };

  get play() : Array<{index : number, target : number}> { return this._play }
  set play(_play : Array<{index : number, target : number}>) { this._play = _play };

  get isDeath() : boolean { return this._isDeath }
  set isDeath(_isDeath : boolean) { this._isDeath = _isDeath };

  constructor(id : string, name : string, socketId : string, position : number) {
    this.id = id;
    this.name = name;
    this.socketId = socketId;
    this.ready = false;
    this.position = position;
  }

  initialize(role : Role) {
    this.role = role;
    this.hand = [];
    this.play = [];
    this.active = [];
    this.isDeath = false;
    this.health = role.health;
    this.coin = 5;
    this.coinIncrement = 2;
    this.damage = 0;
    this.defence = 0;
    this.roundDamage = 0;
    this.amplify = 0;
    this.immune = false;
  }

  basicData() {
    return {
      name : this.name,
      position : this.position,
      ready : this.ready
    }
  }

  privateBasicData() {
    return {
      name : this.name,
      id : this.id,
      position : this.position,
      ready : this.ready
    }
  }

  privateData() {
    return {
      name : this.name,
      ready : this.ready,
      position : this.position,
      health : this.health,
      defence : this.defence,
      isDeath : this.isDeath,
      bids : this.bids,
      hand : this.hand.map(card => card.toJson()),
      play : this.play,
      coin : this.coin,
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
      ready : this.ready,
      position : this.position,
      health : this.health,
      defence : this.defence,
      isDeath : this.isDeath,
      role : this.role.visible ? this.role.toString() : "?",
      active : this.active.map(card => card.toJson()),
    };
  }

  shopStart (noOfCards : number) : void {
    this.coin += this.coinIncrement;
    this.bids = Array(noOfCards).fill(0);
  }

  shopEnd () : void {
    this.bids = [];
  }

  pickStart () : void {
    this.play = Array(3).fill(0).map(x => {return {index : -1, target : -1}; });
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
      if (indices.includes(i)) continue;
      hand.push(this.hand[i]); 
    }
    this.hand = hand;
    this.play = [];
  }

  useCoin (coin : number) : void {
    this.coin -= coin;
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
