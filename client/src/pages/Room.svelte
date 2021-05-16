<script>
  import { io } from 'socket.io-client';
  import { Event } from '../../../types/dist/Event';
  import { State } from '../../../types/dist/State';
  import { Time } from '../../../types/dist/Time';
  import { navigate } from "svelte-routing";
  import Cookies from 'js-cookie';
  
  export let roomId;

  let room;
  let name = Cookies.get("name") || "Player";
  let userId = Cookies.get("userId");

  let roomMaster = false;
  let state = State.wait;
  let shop = [];
  let shopResult = [];

  let gameState = {};
  let self = {};

  let log = [];

  let timer;
  let interval;

  const socket = io("localhost:3000", {
    query: {
      "roomId" : roomId,
      "userId" : userId,
      "name" : name
    }
  });

  socket.on(Event.connection, data => {
    Cookies.set("name", data.name);
    Cookies.set("userId", data.id);
    roomMaster = data.roomMaster;
  });

  socket.on(Event.error, data => {
    console.log(data);
  })

  socket.on(Event.getRoom, data => {
    room = data;
  })

  socket.on(Event.startGame, data => {
    gameState = data;
  }) 

  socket.on(Event.endGame, () => {
    state = State.wait;
  }) 

  socket.on(Event.shopStart, data => {
    socket.emit(Event.getSelf);
    shop = data;
    shop.bid = 0;
    state = State.shop;
    timer = Time.shop / 1000;
    interval = setInterval(() => {
      timer -= 1;
    }, 1000);
  })

  socket.on(Event.shopEnd, data => {
    shopResult = data;
    clearInterval(interval);
  })

  socket.on(Event.pickStart, data => {
    gameState = data;
    state = State.pick;
    timer = Time.pick / 1000;
    interval = setInterval(() => {
      timer -= 1;
    }, 1000);
    socket.emit(Event.getSelf);
  })

  socket.on(Event.pickEnd, data => {
    log = data;
    gameState = data[2].game;
    console.log(data);
    clearInterval(interval);
  })

  socket.on(Event.getSelf, data => {
    self = data;
    console.log(self);
  })

  const changeName = () => {
    Cookies.set("name", name);
    socket.emit(Event.changeName, {"name" : name});
  };

  const startGame = () => {
    socket.emit(Event.startGame);
  }

  const leaveRoom = () => {
    socket.emit(Event.leaveRoom);
    navigate(`/`);
  }

  const bid = () => {
    socket.emit(Event.bid, shop.map(x => x.bid || 0));
  }

  const pick = () => {
    socket.emit(Event.pick, self.play);
  }

</script>

<style>
  .btn {
    display: grid;
    padding: 0.5em 1em 0.5em 1em;
    border-style: solid;
    border-width: 0.05em;
    border-color: #999;
    width: fit-content;
    justify-content: center;
    margin: auto;
    margin-top: 1em;
  }

  .header {
    display: flex;
    justify-content: center;
  }

  .content {
    margin : 0 3rem 3rem 3rem;
    padding : 3rem;
    border-style: solid;
    border-width: 0.05rem;
    border-color: #999;
  }

  .title {
    font-size: large;
    font-weight: bold;
  }

  hr {
    margin-top: 2rem;
  }
</style>

<h1 class='header'>
  The Revolution
</h1>

{#if state == State.wait}
  <div class='card'>
    Room : {roomId}
    {#if room !== undefined}
      <ol>
        {#each room.players as player}
          <li>{player}</li>
        {/each}
      </ol>
    {/if}
    <div>
    {#if roomMaster}
      <button on:click={startGame}>Start Game</button>
    {/if}
      <button on:click={leaveRoom}>Leave Room</button>
    </div>
    <div>
      <input bind:value={name}>
      <button on:click={changeName}> Change name</button>
    </div>
  </div>
{:else}
  <h2 class='header'>
    Round {gameState.roundCounter} -- {state} -- {timer}s
  </h2>
  <div class='content'>
    <h2>{name} </h2>
    <div>Role : {self.role}</div>
    <div>Health : {self.health} </div>
    <div>Coin : {self.coin} </div>
    <h3>Cards</h3>
    <div class='grid-container'>
      {#each self.hand || [] as card}
        <div class='card'>
          <div>Title : {card.title}</div>
          <div>Cost : {card.cost}</div>
          <div>Description : {card.description}</div>
        </div>
      {/each}
    </div>
    <hr>
    <h2>Players</h2>
    <div class='grid-container'>
      {#each gameState.players || [] as player}
        <div class='card'>
          <div class='title'>
            {player.name} ({player.role}) {#if player.isDeath} Death {/if}
          </div>
          <div>
            Health : {player.health}
          </div>
        </div>
      {/each}
    </div>
    {#if log.length != 0}
      <hr>
      {#each Array(3) as _,turn}
        <h3>Turn {turn}</h3>
        <ol>
          {#each log[turn].log as history}
            <li>{history}</li>
          {/each}
        </ol>
        <div class='grid-container'>
          {#each log[turn].game.players as player}
          <div class='card'>
            <div class='title'>
              {player.name} ({player.role}) {#if player.isDeath} Death {/if}
            </div>
            <div> Health : {player.health} </div>
          </div>
          {/each}
        </div>
      {/each}
    {/if} 
    <hr>
    {#if state == State.shop}
      <h2>Shop</h2>
      <div>Available Coin : {self.coin - self.coinBid}</div>
      <div class='grid-container'>
      {#each shop || [] as card, index}
        <div class='card'>
          <div>Title : {card.title}</div>
          <div>Cost : {card.cost}</div>
          <div>Description : {card.description}</div>
          <div>Your Bid : {card.bid || 0}</div>
          <div>
          </div>
          <input bind:value={card.bid} type=number>
        </div>
      {/each}
      </div>
      <button on:click={() => bid()} class='btn'>Submit Bid</button>
    {:else if state == State.pick}
      <h2>Bidding Result</h2>
      {#each shopResult as result}
        <div>
          {result.name} -- {result.card.title}
        </div>
      {/each} 
      <h2>Picking phase</h2>
      <div class='grid-container'>
        {#each Array(3) as _,turn}
          <div class='card'>
            <div class='title'>Turn {turn}</div>
            <select bind:value={self.play[turn].index}>
              <option value={-1}>Sleep</option>
              {#each self.hand as hand,i}
                {#if self.play[turn].index == i || !(self.play.map(x => x.index).includes(i))}
                  <option value={i}>{hand.title}</option>
                {/if}
              {/each}
            </select>
            {#if self.play[turn].index >= 0 && self.hand[self.play[turn].index].cardType == 'single'}
              <select bind:value={self.play[turn].target}>
                <option value={-1}>Choose Target</option>
                {#each gameState.players as player}
                  <option value={player.position}>{player.name}</option>
                {/each}
              </select>
            {/if}
          </div>
        {/each}
      </div>
      <button on:click={() => pick()} class='btn'>Submit Pick</button>
    {/if}
  </div>
{/if}
<div style='color:white'>
  a
</div>