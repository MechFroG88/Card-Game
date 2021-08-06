import * as Cards from "./cards";
import * as Roles from "./roles";
import { Card, CardType } from "./Card";
import { Player } from "./Player";
import { Role } from "./Role";
import { State } from "./State";

export class Room {
  private id : string;
  private _players : { [key : string]: Player; } = {};
  private roomMaster !: Player;
  private state : State;
  private _countdown : any;

  set countdown ( _countdown : any ) { this._countdown = _countdown; }
  get countdown () : any { return this._countdown; }

  set players ( _players : { [key : string] : Player } ) { this._players = _players; }
  get players () :  { [key : string] : Player } { return this._players; }

  private _counter : number = 0;

  get counter () :  number { return this._counter; }
  set counter ( _counter : number ) { this._counter = _counter; }

  private playerCount : number = 0;
  private king : number = 0;
  private minister : number = 0;
  private rebel : number = 0;
  private traitor : number = 0;

  private end : string = '';
  private kingPlayer !: Player;

  private roundCounter : number = 0;

  private shopCards !: Card[];
  private shopResult !: String[];

  private log : Array<Array<Card>> = [];

  private deck: Card[] = [
    new Cards.BlackDeath(),
    new Cards.Pray(),
    new Cards.Torture()
  ];
  
  private _defaultCards: Card[] = [
    new Cards.Attack(),
    new Cards.Defence()
  ];

  get defaultCards() : Card[] {
    return this._defaultCards;
  }

  constructor (id : string) {
    this.id = id;
    this.state = State.wait;
  }

  /**
   * Set the Default Roles
   */
  setRole() : void {
    this.king = 1;
    this.traitor = this.playerCount > 4 ? (this.playerCount > 7 ? 2 : 1) : 0;
    this.rebel = Math.floor(this.playerCount / 2);
    this.minister = this.playerCount - this.king - this.traitor - this.rebel;
  }

  changeConfig(traitor : number, rebel : number, minister : number) : void {
    this.traitor = traitor;
    this.rebel = rebel;
    this.minister = minister; 
  }

  wait() : boolean {
    return this.state == State.wait;
  }

  ready() : boolean {
    let ready = this.playerCount == this.king + this.minister + this.rebel + this.traitor;
    for (const id in this.players) {
      ready &&= this.players[id].ready;
    }
    return ready
  }

  nextState() : void {
    if (this.end !== '') {
      this.unready(true);
      this.state = State.wait;
      this.end = '';
    } else if (this.state == State.wait) {
      this.unready();
      this.startGame();
      this.newShop();
      this.state = State.shop;
    } else if (this.state == State.shop) {
      this.unready();
      this.endShop();
      this.state = State.shopResult;
    } else if (this.state == State.shopResult) {
      this.unready();
      this.startPick();
      this.state = State.pick;
    } else if (this.state == State.pick) {
      this.unready();
      this.startTurn(0);
      this.state = State.turn1;
      this.checkWin();
    } else if (this.state == State.turn1) {
      this.unready();
      this.startTurn(1);
      this.state = State.turn2;
      this.checkWin();
    } else if (this.state == State.turn2) {
      this.unready();
      this.startTurn(2);
      this.state = State.turn3;
      this.checkWin();
    } else if (this.state == State.turn3) {
      this.unready();
      this.endRound();
      this.newShop();
      this.state = State.shop;
    }
  }

  /**
   * Create a new Game instance
   */
  startGame () : void {
    let roles = this.shuffleRole();
    let index = 0;
    for (const id in this.players) {
      this.players[id].initialize(roles[index]);
      if (this.players[id].role.toString() === Roles.King.King.toString()) {
        this.kingPlayer = this.players[id];
      }
      index++;
    }
  }

  /**
   * Add the player to the room
   * 
   * @param player
   */
  addPlayer (player : Player) : void {
    if (player.id in this.players) return;
    // if there is no roomMaster
    if (this.roomMaster === undefined) {
      this.roomMaster = player;
    }
    this.players[player.id] = player;
    this.playerCount += 1;
    this.setRole();
  }

  /**
   * Remove the player from the room
   * 
   * @param id 
   */
  removePlayer (id : string) : void {
    if (!(id in this.players)) return;
    this.playerCount -= 1;
    this.setRole();
    if (this.roomMaster?.id == id) {
      this.roomMaster = Object.values(this.players)[0];
    }
    delete this.players[id];
  }

  /**
   * Find if the player is in the room
   * 
   * @param id The id of the player
   * @returns The player
   */
  findPlayer (id : string) : Player | undefined {
    return this.players[id];
  }

  /**
   * Check if a player is the room master
   * 
   * @param player The player
   * @returns true if the player] is the room master, else false.
   */
  isRoomMaster (player : Player) : boolean {
    if (this.roomMaster === undefined) return false;
    if (player === undefined) return false;
    return this.roomMaster.id === player.id;
  }

  /**
   * Method for player to bid for cards
   * 
   * @param id player id
   * @param bids player bids
   */
  bid (id : string, bids : number[]) : void {
    if (!(id in this.players)) return;

    // check if player has enough money to bid
    let sum = bids.reduce((a, b) => a + b);
    if (sum > this.players[id].coin) return;

    this.players[id].bids = bids;
    this.players[id].ready = false;
  }

  /**
   * Method for player to play
   * 
   * @param id player id
   * @param bids player bids
   */
  play (id : string, play : Array<{index : number, target : number}>) : void {
    if (!(id in this.players)) return;
    if (play.length != 3) return;

    let player = this.findPlayer(id);
    if (player === undefined) return;

    let arr : Number [] = [];

    for (let i = 0; i < 3; i++) {
      if (play[i].index == -1) continue;
      if (play[i].index >= player.hand.length) return;
      if (play[i].target != -1 && this.findByPosition(play[i].target) === undefined) return;
      if (arr.includes(play[i].index)) return;
      arr.push(play[i].index);
    }

    player.play = play;
    player.ready = false;
  }

  /**
   * Return the general json data of the room
   * 
   * @returns The general json data of the room
   */
  toJson () {
    let players = Object.values(this.players);
    return {
      id : this.id,
      end : this.end,
      state : this.state,
      roomMaster : this.roomMaster.position,
      playerCount : this.playerCount,
      king : this.king,
      minister : this.minister,
      rebel : this.rebel,
      traitor : this.traitor,
      shop : this.getShop(),
      shopResult : this.shopResult,
      log : this.log,
      roundCounter : this.roundCounter,
      players : this.state == State.wait ? 
        players.map(player => player.basicData()) : 
        players.map(player => player.publicData(this.end !== ''))
    };
  }

  private checkWin() : void {

    if (this.kingPlayer.isDeath) {
      let players = Object.values(this.players);
      let traitor = false;
      for (let player of players) {
        if (player.isDeath) continue;
        if (player.role.toString() == Roles.Rebel.Rebel.toString()) {
          this.end = Roles.Rebel.Rebel.toString();
          return;
        }
        if (player.role.toString() == Roles.Traitor.Traitor.toString()) {
          traitor = true;
        }
      }
      if (traitor) {
        this.end = Roles.Traitor.Traitor.toString();
      } else {
        this.end = 'Nobody';
      }
    } else {
      let players = Object.values(this.players);
      for (let player of players) {
        if (player.isDeath) continue;
        if (player.role.toString() == Roles.Rebel.Rebel.toString() || 
            player.role.toString() == Roles.Traitor.Traitor.toString()) {
          return;
        }
      }
      this.end = Roles.King.King.toString();
    }
  }

  /**
   * Find if the player is in the room
   * 
   * @param pos The position of the player
   * @returns The player
   */
  private findByPosition (pos : number) : Player | undefined {
    let players = Object.values(this.players);
    for (let player of players) {
      if (player.isDeath) continue;
      if (player.position === pos) return player;
    }
  }

  private unready(force = false) : void {
    let players = Object.values(this.players);
    for (let player of players) {
      if (force) {
        player.ready = false;
      }
      if (player.isDeath) continue;
      player.ready = false;
    }
  }

  /**
   * Start Shop phase
   */
  private newShop() : void {
    this.shopCards = [];
    for (let i = 0; i < this.playerCount; i++) {
      this.shopCards.push(this.deck[this.randomInteger(0, this.deck.length - 1)]);
    }

    let players = Object.values(this.players);
    players.forEach(player => player.shopStart(this.playerCount));
  }

  /**
   * Return the cards in the shop
   * 
   * @returns The cards in the shop
   */
  private getShop() {
    return this.shopCards?.map(card => card.toJson());
  }

  /**
   * End the shop phase and return the bidding result
   * 
   * @returns the bidding result
   */
  private endShop() {
    this.shopResult = [];
    // Give the cards to the highest bidder
    for (let i = 0; i < this.shopCards.length; i++) {
      let maxBid = this.shopCards[i].cost;
      let maxPlayer = undefined;

      for (const [id, player] of Object.entries(this.players)) {
        // same maxBid, no one gets the card
        let bid = player.bids[i];
        if (bid == maxBid) {
          maxPlayer = undefined;
        }
        else if (bid > maxBid) {
          maxBid = bid;
          maxPlayer = id;
        }
      }
      if (maxPlayer === undefined) {
        this.shopResult.push('');
        continue;
      }

      // add to hand
      this.players[maxPlayer].addHand(this.shopCards[i]);

      // use the bidding coin
      this.players[maxPlayer].useCoin(maxBid);

      // append to result
      this.shopResult.push(this.players[maxPlayer].name);
    }

    let players = Object.values(this.players);
    players.forEach(player => player.shopEnd());
  }

  /**
   * Start Picking phase
   */
  private startPick() : void {
    let players = Object.values(this.players);
    players.forEach(player => player.pickStart());
    for (const card of this.defaultCards) {
      players.forEach(player => player.addHand(card));
    }
  }

  private endRound() : void {
    let players = Object.values(this.players);
    players.forEach(player => player.endRound());
  }

  /**
   * Start turn
   */
  private startTurn(turn : number) : void {
    let players = Object.values(this.players);
    let log = [];
    for (let player of players) {
      // Death player die
      if (player.isDeath) continue;
      
      let index = player.play[turn].index;

      // ignore sleep
      if (index < 0) {
        log.push(new Cards.Sleep().setOwner(player).toJson());
        continue;
      }

      // Card logic
      let card = player.hand[index];
      let cardType = card.cardType;
      if (cardType === CardType.self) {
        card.play();
      } else if (cardType === CardType.multiple) {
        card.setTarget(players);
        card.play();
      } else if (cardType === CardType.single) {
        if (player.play[turn].target === -1) continue;
        let target = players.findIndex(x => x.position == player.play[turn].target);
        card.setTarget([players[target]]);
        card.play();
      }

      log.push(card.toJson());
    }
    players.map(player => player.endTurn());
    this.log.push(log);
  }

  /**
   * Generate random integer in range [min, max]
   * 
   * @param min minumum number
   * @param max maximum number
   * @returns randomly generated integer in range [min, max]
   */
  private randomInteger(min : number, max : number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle array
   * 
   * @param array Array to be shuffled
   * @returns The shuffled array
   */
  private shuffle(array : any) : any {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  /**
   * Generate shuffled roles
   * 
   * @returns Shuffled roles
   */
  private shuffleRole() : Role[] {
    let roles : Role[] = [];
    roles.push(...Array<Role>(this.king).fill(Roles.King.King));
    roles.push(...Array<Role>(this.minister).fill(Roles.Minister.Minister));
    roles.push(...Array<Role>(this.rebel).fill(Roles.Rebel.Rebel));
    roles.push(...Array<Role>(this.traitor).fill(Roles.Traitor.Traitor));
    this.shuffle(roles);
    return roles;
  }

}
