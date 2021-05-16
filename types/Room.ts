import * as Cards from "./cards";
import * as Roles from "./roles";
import { Card, CardType } from "./Card";
import { Player } from "./Player";
import { Role } from "./Role";
import { State } from "./State";

export class Room {
  private id : string;
  private _players : { [key : string]: Player; } = {};
  private roomMaster ?: Player;
  private state : State;

  set players ( _players : { [key : string] : Player } ) { this._players = _players; }
  get players () :  { [key : string] : Player } { return this._players; }
  
  private playerCount : number = 0;
  private king : number = 0;
  private minister : number = 0;
  private rebel : number = 0;
  private traitor : number = 0;

  private roundCounter : number = 0;

  private shopCards !: Card[];
  private shopBids !: Array<{ [key : string] : number }>;

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

  /**
   * Create a new Game instance
   */
  startGame () : void {
    let roles = this.shuffleRole();
    let position = 0;
    for (const id in this.players) {
      this.players[id].initialize(roles[position], position);
      position++;
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
   * Return the general json data of the room
   * 
   * @returns The general json data of the room
   */
  toJson () {
    let players = Object.values(this.players);
    return {
      id : this.id,
      playerCount : this.playerCount,
      king : this.king,
      minister : this.minister,
      rebel : this.rebel,
      traitor : this.traitor,
      roundCounter : this.roundCounter,
      players : players.map(player => player.name)
    };
  }

  /**
   * returns the game state of the room
   * 
   * @returns The game state
   */
  gameState () {
    let players = Object.values(this.players);
    return {
      id : this.id,
      state : this.state,
      playerCount : this.playerCount,
      king : this.king,
      minister : this.minister,
      rebel : this.rebel,
      traitor : this.traitor,
      roundCounter : this.roundCounter,
      players : players.map(x => x.publicData())
    };
  }

  /**
   * Start Shop phase
   */
  newShop() : void {
    this.shopCards = [];
    for (let i = 0; i < this.playerCount; i++) {
      this.shopCards.push(this.deck[this.randomInteger(0, this.deck.length - 1)]);
    }
    this.shopBids = new Array(this.playerCount).fill(0).map(() => ({}));
    this.state = State.shop;

    let players = Object.values(this.players);
    players.forEach(player => player.shopStart());
  }

  /**
   * Return the cards in the shop
   * 
   * @returns The cards in the shop
   */
  getShop() {
    if (this.state != State.shop) return;
    return this.shopCards.map(card => card.toJson());
  }

  /**
   * End the shop phase and return the bidding result
   * 
   * @returns the bidding result
   */
  endShop() {
    if (this.state != State.shop) return;
    let result = [];
    // Give the cards to the highest bidder
    for (let i = 0; i < this.shopBids.length; i++) {
      let maxBid = -1;
      let maxPlayer = undefined;

      for (const [player, bid] of Object.entries(this.shopBids[i])) {
        // same maxBid, no one gets the card
        if (bid == maxBid) {
          maxPlayer = undefined;
        }
        else if (bid > maxBid) {
          maxBid = bid;
          maxPlayer = player;
        }
      }
      if (maxPlayer === undefined) continue;

      // add to hand
      this.players[maxPlayer].addHand(this.shopCards[i]);

      // use the bidding coin
      this.players[maxPlayer].useCoin(maxBid);

      // append to result
      result.push({
        name : this.players[maxPlayer].name,
        card : this.shopCards[i].toJson()
      });
    }

    let players = Object.values(this.players);
    players.forEach(player => player.shopEnd());

    return result;
  }

  /**
   * Method for player to bid for cards
   * 
   * @param id player id
   * @param bids player bids
   */
  bid (id : string, bids : number[]) : void {
    if (this.state != State.shop) return;
    if (!(id in this.players)) return;

    // check if player has enough money to bid
    let sum = bids.reduce((a, b) => a + b);
    if (!(this.players[id].bid(sum))) return;


    // assign the player bid value
    for (let i = 0; i < this.shopBids.length; i++) {
      this.shopBids[i][id] = bids[i];
    }
  }

  /**
   * Start Picking phase
   */
  startPick() : void {
    this.state = State.pick;
    let players = Object.values(this.players);
    for (const card of this.defaultCards) {
      players.forEach(player => player.addHand(card));
    }
  }

  /**
   * End the picking phase and return the result of picking phase
   * 
   * @returns The result of picking phase
   */
  endPick() : Array<{log : string[], game : any}> {
    let result = [];
    let players = Object.values(this.players);
    for (let turn = 0; turn < 3; turn++) {
      let log : string[] = [];
      for (let player of players) {
        if (player.isDeath) continue;
        let index = player.play[turn].index;
        if (index < 0) continue;
        let card = player.hand[index];
        let cardType = card.cardType;
        if (cardType === CardType.self) {
          log.push(card.play());
        } else if (cardType === CardType.multiple) {
          card.setTarget(players);
          log.push(card.play());
        } else if (cardType === CardType.single) {
          if (player.play[turn].target === -1) continue;
          let target = players.findIndex(x => x.position == player.play[turn].target);
          card.setTarget(players[target]);
          log.push(card.play());
        }
      }
      players.forEach(player => player.endTurn());
      result.push({log : log, game : this.gameState()});
    }
    players.forEach(player => player.endRound());
    this.roundCounter += 1;
    return result;
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
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
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
    return this.shuffle(roles);
  }

}
