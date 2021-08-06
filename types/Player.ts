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
  private _isDeath !: boolean;
  private health !: number;
  private _coin !: number;
  private _bids !: number [];
  private coinIncrement !: number;
  private damage !: number[];
  private defence !: number;
  private roundDefence !: number;
  private roundDamage !: number;
  private roundNullify !: boolean;
  private amplify !: number;
  private nullify !: boolean;
  private reflect !: boolean;

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
    this.isDeath = false;
    this.health = role.health;
    this.coin = 5;
    this.coinIncrement = 2;
    this.damage = [];
    this.defence = 0;
    this.roundDefence = 0;
    this.roundDamage = 0;
    this.amplify = 0;
    this.nullify = false;
    this.roundNullify = false;
    this.reflect = false;
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
      handcount : this.hand.length,
      play : this.play,
      coin : this.coin,
      role : this.role.toString(),
    };
  }

  publicData(visible = false) {
    visible = visible || this.role.visible || this.isDeath;
    return {
      name : this.name,
      ready : this.ready,
      position : this.position,
      health : this.health,
      defence : this.defence,
      isDeath : this.isDeath,
      handcount : this.hand.length,
      role : visible ? this.role.toString() : "?",
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
    for (let damage of this.damage) {
      let finalDamage = Math.max(damage - this.defence - this.roundDefence, 0);
      this.health -= finalDamage;
      this.roundDamage += finalDamage;
    }
    if (this.health <= 0) {
      this.isDeath = true;
    }
  }

  startTurn () : void {
    this.nullify = false;
    this.reflect = false;
    this.damage = [];
    this.defence = 0;
  }

  clearHand () : void {
    let hand = [];
    let indices = this.play.map(x => x.index);
    for (let i = 0; i < this.hand.length; i++) {
      if (indices.includes(i)) continue;
      hand.push(this.hand[i]); 
    }
    this.hand = hand;
    this.play = [];
  }

  startRound () : void {
    this.amplify = 0;
    this.roundDefence = 0;
    this.roundDamage = 0;
    this.roundNullify = false;
  }

  useCoin (coin : number) : void {
    this.coin -= coin;
  }

  takeDamage(damage : number) : void {
    this.damage.push(damage);
  }

  dealDamage(damage : number) : number {
    return damage + this.amplify;
  }

  amplifyDamage(damage : number) : void {
    this.amplify += damage;
  }

  increaseDefence(defence : number) : void {
    this.defence += defence;
  }

  decreaseRoundDefence(defence : number) : void {
    this.roundDefence -= defence;
  }

  increaseRoundDefence(defence : number) : void {
    this.roundDefence += defence;
  }

  restoreHealth(health : number) : void {
    this.health = Math.min(this.health + health, this.role.health);
  }

  makeNullify() : void {
    this.nullify = true;
  }

  makeRoundNullify() : void {
    this.roundNullify = true;
  }

  getRoundDamage() : number {
    return this.roundDamage;
  }

  isNullify() : boolean {
    return this.nullify || this.roundNullify;
  }

  isReflecting() : boolean {
    return this.reflect;
  }

  makeReflect() : void {
    this.reflect = true;
  }

  addHand(card : Card) : void {
    this.hand.push(card.setOwner(this));
  }

  stealHand() : Card {
    let index = Math.floor(Math.random()*this.hand.length);
    let card = this.hand[index];
    this.hand.splice(index, 1);
    return card;
  }
  
}
