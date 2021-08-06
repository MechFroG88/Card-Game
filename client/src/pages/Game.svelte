<script>
  import { Event } from '../../../types/dist/Event';
  import { State } from '../../../types/dist/State';
  import Card from '../component/Card.svelte';
  import Role from '../component/Role.svelte';
  import Timer from '../component/Timer.svelte';

  // icons
  import Fa from 'svelte-fa';
  import { faHeart, faCoins, faStoreAlt, faSkull } from '@fortawesome/free-solid-svg-icons';
  import { UsersIcon, CheckIcon, XIcon } from 'svelte-feather-icons';
  import Poker from '../svg/poker.svg';
  import Dices from '../svg/dices.svg';
  
  export let room;
  export let socket;
  export let self;
  export let timer;

  let state;
  let shopResult = [];

  socket.on(Event.error, data => {
    console.log(data);
  })

  const getReady = () => {
    socket.emit(Event.getReady);
  }

  const pick = () => {
    socket.emit(Event.pick, self.play);
  }

  const bid = () => {
    socket.emit(Event.bid, self.bids);
  }

</script>

<div class='content'>
  <div class='sidebar'>
    <div class='self'>
      <div class='title'>
        <Role role={self.role}/>{self.name}
      </div>
      <div class='body'>
        <div class='stats'>
          {#if self.isDeath}
            <Fa icon={faSkull}/>
          {:else}
            <div class='heart'><Fa icon={faHeart}/></div> {self.health}
          {/if}
        </div>
        <div class='stats'>
          <div class='coin'><Fa icon={faCoins}/></div>
          {self.coin}
        </div>
      </div>
    </div>
    <div class='players'>
      <Timer self={self} timer={timer}/>
      <div class='title'>
        <UsersIcon size='24'/> Players
      </div>
      <div class='body'>
        {#each room.players || [] as player}
          <div class='player {player.isDeath ? 'death' : player.ready ? 'ready' : ''}'>
            <div class='role'>
              <Role role={player.role}/>
            </div>
            <div class='data'>
              <div class='name'>
                {player.name}
              </div>
              <div class='stats'>
                {#if player.isDeath}
                  <Fa icon={faSkull}/>
                {:else}
                  <div class='heart'><Fa icon={faHeart}/></div> {player.health}
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
    
  <div class='board'>
    {#if room.end !== ''}
      <div class='title'><Role role={room.end}/>{room.end} win the game!</div>
    {/if}
    {#if room.state == State.shop || room.state == State.shopResult}
      <div class='title'><Fa icon={faStoreAlt}/>{room.state}</div>
    {:else}
      <div class='title'><Dices width=48/>{room.state}</div>
    {/if}
    <div class='deck'>
      <Card room={room} self={self} state={room.state} bid={bid} pick={pick}/>
    </div>
    {#if !self.isDeath}
      <div class='action'>
        {#if self.ready}
          <button on:click={getReady} class='unready'><XIcon size="18"/>Unready</button>
        {:else}
          <button on:click={getReady} class='ready'><CheckIcon size="18"/>Ready</button>
        {/if}
      </div>
    {/if}
    <div class='title'><Poker width=36/>Cards</div>
    <div class='deck'>
      {#if self.hand.length == 0}
        <div class='subtitle'>No cards yet :(</div>
      {:else}
      <Card room={room} self={self} bid={bid}/>
      {/if}
    </div>
  </div>
</div>

<style lang='scss'>

  .heart {
    color: #FF4848;
  }

  .coin {
    color: #F0C929;
  }

  .content {
    display: grid;
    grid-template-columns: 300px auto;
    padding: 1em;
    column-gap: 1em;
  }

  .sidebar {
    padding: 0 1em 1em 0;
    .self {
      border-bottom-style: solid;
      border-bottom-color: #aaa;
      border-bottom-width: 2px;
      padding: 1em;
      margin: 1em;
      .title {
        display: grid;
        grid-auto-flow: column;
        column-gap: 8px;
        justify-content: center;
        margin: .5em;
        text-align: center;
        font-size: 32px;
      }
      .body {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 18px;
        align-items: center;
        justify-content: center;
        .stats {
          font-size: 24px;
          display: grid;
          align-items: center;
          grid-auto-flow: column;
          column-gap: 6px;
        }
      }
    }

    .players {
      .title {
        margin: .5em;
        text-align: center;
        font-size: 32px;
      }
      .body {
        display: grid;
        align-items: center;
        justify-content: center;
        row-gap: 18px;
        overflow-y: auto;

        .ready {
          background-color: #99F3BD !important;
        }

        .death {
          background-color: #CDBBA7 !important;
        }

        .player {
          font-weight: 500;
          padding: .5em 1em;
          border-radius: 12px;
          display: grid;
          grid-template-columns: 40px 100px;
          align-items: center;
          justify-content: center;
          grid-auto-flow: column;
          column-gap: 18px;
          color: #424874;
          background-color: white;
          .role {
            text-align: center;
            font-size: 46px;
          }
          .data {
            .name {
              font-size: 18px;
            }
            .stats {
              display: flex;
              align-items: center;
              font-size: 18px;
              .heart {
                width : 1em;
                margin-right: .4em;
              }
            }
          }
        }
      }
    }
  }
  .board {
    fill: #424874;
    color: #424874;
    .title {
      display: grid;
      grid-auto-flow: column;
      column-gap: 8px;
      justify-content: center;
      align-items: center;
      margin: .5em;
      text-align: center;
      font-size: 32px;
    }
    .deck {
      display: grid;
      align-items: center;
      justify-content: center;
      grid-template-columns: auto auto auto auto;
      min-width: 500px;
      padding: 1em 1em 1em 1em;

      .subtitle {
        font-size: 24px;
      }
    }
    .action {
      display: grid;
      column-gap: 12px;
      grid-auto-flow: column;
      justify-content: center;
      .unready {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: center;
        column-gap: 4px;
        background-color: #FFB740;
      }
      .unready:not(:disabled):active {
        background-color: #FF7600;
      }
      .ready {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: center;
        column-gap: 4px;
        background-color: #99F3BD;
      }
      .ready:not(:disabled):active {
        background-color: #28DF99;
      }
    }
  }
</style>