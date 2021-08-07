<script>
  import { Event } from '../../../types/dist/Event';
  import { navigate } from "svelte-routing";
  import { SettingsIcon, PlusIcon, MinusIcon, UsersIcon, LogOutIcon, AwardIcon, CheckIcon, XIcon, BookOpenIcon } from 'svelte-feather-icons'
  import Timer from '../component/Timer.svelte';
  import Logo from '../svg/castle.svg';
  import Role from '../component/Role.svelte';
  import CardIcon from '../component/CardIcon.svelte';
  import Dices from '../svg/dices.svg';

  import Fa from 'svelte-fa';
  import { faStoreAlt, faUserTag } from '@fortawesome/free-solid-svg-icons';

  export let room;
  export let socket;
  export let self;
  export let timer;

  let sampleBid = 0;

  const changeConfig = () => {
    socket.emit(Event.changeConfig, 
      {
        rebel : room.rebel, 
        minister : room.minister, 
        traitor : room.traitor
      }
    );
  }

  const getReady = () => {
    socket.emit(Event.getReady);
  }

  const leaveRoom = () => {
    socket.emit(Event.leaveRoom);
    navigate(`/`);
  }

  const plus = () => {
    sampleBid++;
  }

  const minus = () => {
    sampleBid--;
    sampleBid = Math.max(0, sampleBid);
  }

</script>
  
<div class='navbar'>
  <div class='title'>
    <Logo width=32/> The Revolution
  </div>
</div>
<div class='room'>
  {room.id}
</div>
{#if room !== undefined}
  <div class='timer'><Timer self={self} timer={timer}/></div>
  <div class='waiting'>
    <div class='config'>
      <div class='title'>
        <SettingsIcon size='24'/>
        Settings
      </div>
        <div class='row'>
          <span class='first'>Rebel</span>
          <button class='minus' on:click={() => {room.rebel--;room.rebel = Math.max(0,room.rebel);changeConfig();}}><MinusIcon size='16'/></button>
          <span class='middle'>{room.rebel}</span>
          <button class='plus' on:click={() => {room.rebel++;changeConfig();}}><PlusIcon size='16'/></button>
        </div>
        <div class='row'>
          <span class='first'>Minister</span>
          <button class='minus' on:click={() => {room.minister--;room.minister = Math.max(0,room.minister);changeConfig();}}><MinusIcon size='16'/></button>
          <span class='middle'>{room.minister}</span>
          <button class='plus' on:click={() => {room.minister++;changeConfig();}}><PlusIcon size='16'/></button>
        </div>
        <div class='row'>
          <span class='first'>Traitor</span>
          <button class='minus' on:click={() => {room.traitor--;room.traitor = Math.max(0,room.traitor);changeConfig();}}><MinusIcon size='16'/></button>
          <span class='middle'>{room.traitor}</span>
          <button class='plus' on:click={() => {room.traitor++;changeConfig();}}><PlusIcon size='16'/></button>
        </div>
        <div class='footer'>
            {#if room.minister + room.traitor + room.rebel > room.playerCount - 1}
                Pick {room.minister + room.traitor + room.rebel - (room.playerCount - 1)} less roles
            {:else if room.minister + room.traitor + room.rebel < room.playerCount - 1}
                Pick {(room.playerCount - 1) - room.minister + room.traitor + room.rebel} more roles
            {/if}
        </div>
    </div>
    <div class='player'>
      <div class='title'><UsersIcon size='24'/> Players</div>
      <div class='namelist'>
        {#each room.players as player}
          {#if player.position == room.roomMaster}
            <div class='name {player.ready ? 'ready' : ''}'><AwardIcon size='24'/>{player.name}</div>
          {:else}
            <div class='name {player.ready ? 'ready' : ''}'>{player.name}</div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
  <div class='action'>
    {#if self.ready}
      <button on:click={getReady} class='unready'><XIcon size="18"/>Unready</button>
    {:else}
      <button on:click={getReady} class='ready'><CheckIcon size="18"/>Ready</button>
    {/if}
    <button on:click={leaveRoom} class='leave'><LogOutIcon size="18"/>Leave</button>
  </div>
{/if}
<div class='rule'>
  <div class='section'>
    <div class='head'><Fa icon={faUserTag}/> Roles</div>
    <div class='content'>
      <div class='text'>Only King is visible to all players!</div>
    </div>
    <div class='role'>
      <div class='icon'><Role role='King'/></div> 
      <div class='description'>
        <div class='title'>King</div>
        <div class='body'>Kill all Rebels and Traitors to win</div>
      </div>
    </div>
    <div class='role'>
      <div class='icon'><Role role='Minister'/></div>
      <div class='description'>
        <div class='title'>Minister</div>
        <div class='body'>Kill all Rebels and Traitors to win</div>
      </div>
    </div>
    <div class='role'>
      <div class='icon'><Role role='Rebel'/></div>
      <div class='description'>
        <div class='title'>Rebel</div>
        <div class='body'>Kill the king to win</div>
      </div>
    </div>
    <div class='role'>
      <div class='icon'><Role role='Traitor'/></div>
      <div class='description'>
        <div class='title'>Traitor</div>
        <div class='body'>Kill all Rebels and the King</div>
      </div>
    </div>
    <div class='role'>
      <div class='icon'><Role role='???'/></div>
      <div class='description'>
        <div class='title'>Unknown</div>
        <div class='body'>Unknown role</div>
      </div>
    </div>
    <div class='content'>
      <div class='text'>Player's role will be revealed to everyone after death</div>
    </div>
  </div>
  <div class='section'>
    <div class='head'><Fa icon={faStoreAlt} style='font-size: 28'/> Auction</div>
    <div class='content'>
      <div class='text'>Free 2 coins at the start of auction</div>
      <div class='text'>Bid the cards to secure them</div>
      <div class='card1'>
        <div class='cost'>1</div>
        <div class='icon'><CardIcon title='Alchemy'/></div>
        <div class='title'>Alchemy</div>
        <div class='description'>Multiply your coins by 2</div>
        {#if !self.isDeath}
          <div class='footer-shop'>
            <button class='minus' on:click={() => minus()}><MinusIcon size='18'/></button>
            <span class='middle'>{sampleBid}</span>
            <button class='plus' on:click={() => plus()}><PlusIcon size='18'/></button>
          </div>
        {/if}
      </div>
      <div class='text'>The number on top left part of the card indicate the minimum bid.</div>
      <div class='text'>No one wins the card if there are multiple person with the highest bid</div>
    </div>
  </div>
  <div class='section'>
    <div class='head'><Dices width=48/>Play</div>
    <div class='content'>
      <div class='text'>Free Attack & Defence card at the start of play phase!</div>
      <div class='card1 pick'>
        <div class='cost'>0</div>
        <div class='icon'><CardIcon title='Defence'/></div>
        <div class='title'>Defence</div>
        <div class='description'>Reduce 1 damage from all attacks</div>
      </div>
      <div class='text'>Choose card to play at each turn</div>
    </div>
  </div>
  
</div>

<style lang='scss'>

  .pick {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
  .pick:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }

  .heart {
    color: #FF4848;
  }

  .coin {
    color: #F0C929;
  }

  .handcount {
    fill: #7C83FD;
    display: grid;
    grid-auto-flow: column;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .rule {
    display: grid;
    gap: 3em;
    grid-template-columns: 400px;
    justify-content: center;
    padding: 1em;
    .head {
      color: #424874;
      fill: #424874;
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 36px;
      text-align: center;
    }
    .subtitle {
      font-size: 24px;
    }
    .content {
      font-size: 24px;
      display: grid;
      justify-content: center;
      color: #424874;
      fill: #424874;
      .text {
        text-align: center;
        margin-top: .5em;
      }
    }
    .role {
      display: grid;
      align-items: center;
      grid-template-columns: 60px auto;
      background-color: white;
      padding: 1em 1.5em;
      margin: 1em;
      column-gap: 12px;
      border-radius: 12px;
      .icon {
        font-size: 60px;
      }
      .description {
        display: grid;
        gap: 4px;
        .title {
          font-size: 32px;
        }
      }
    }
  }

  .waiting {
    display: flex;
    justify-content: center;
    padding: 1em 2em 2em 2em;

    .config {
      padding: 1em;
      margin-right: 3em;
      width: 200px;

      .title {
        font-size: 32px;
        margin-bottom: .5em;
      }

      .row {
        display: grid;
        grid-template-columns: 100px 30px 30px 30px;
        grid-template-rows: 30px;
        margin-bottom: 10px;
        align-items: center;
        text-align: center;
        
        .first {
          font-size: 20px;
        }
        .minus {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          height: 30px;
          border-radius: 50% 0 0 50%;
          background-color: #DCD6F7;
        }
        .minus:hover{
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        }

        .middle {
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #DCD6F7;
          z-index: -1;
        }
        
        .plus {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          height: 30px;
          border-radius: 0 50% 50% 0;
          background-color: #DCD6F7;
        }
        .plus:hover{
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        }
      }

      .footer {
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #DA0037;
      }

    }
    .player {
      padding: 1em;
      
      .title {
        font-size: 32px;
        margin-bottom: 12px;
      }
      
      .namelist {
        display: grid;
        grid-template-columns: auto auto auto;
        align-items: center;
        justify-content: center;
        column-gap: 12px;
        .name {
          display:flex;
          align-items: center;
          justify-content: center;
          padding: 1em;
          margin: .5em;
          border-radius: 12px;
          background-color: white;
        }
        .ready {
          background-color: #99F3BD;
        }
      }
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
    .leave {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      justify-content: center;
      column-gap: 4px;
      background-color: #FFB0B0;
    }
    .leave:not(:disabled):active {
      background-color: #DA0037;
    }
  }

  .card1 {
    background-color: white;
    display: grid;
    justify-content: center;
    align-items: center;
    row-gap: 0px;
    padding: 0;
    margin: auto;
    margin-top: 1em;
    margin-bottom: 1em;
    border-radius: 12px;
    min-height: 275px;
    .icon {
      margin: auto;
    }
    .title {
      font-size: 32px;
      margin: 0 1em 0 1em;
      text-align: center;
    }
    .cost {
      padding: 0.5em 0 0 0.5em;
      font-size: 32px;
    }
    .description{
      text-align: center;
      padding: 10px 20px 10px 20px;
      margin: auto;
      width: 180px;
      word-wrap : break-word;
    }
    .footer-target {
      text-align: center;
      height: 40px;
      fill: #DA0037;
      color: #DA0037;
    }
    .footer-result {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      .win {
        display: flex;
        align-items: center;
        text-align: center;
        fill: #16C79A;
        color: #16C79A;
      }
      .lose {
        fill: #DA0037;
        color: #DA0037;
      }
    }
    .footer-shop {
      display: grid;
      grid-template-columns: 60px auto 60px;
      align-items: center;
      text-align: center;
      
      .minus {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        height: 40px;
        border-radius: 0 0 0 12px;
        background-color: inherit;
      }
      .minus:hover{
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      }
      .middle {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .plus {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        border-radius: 0 0 12px 0;
        background-color: inherit;
      }
      .plus:hover{
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      }
    }
  }
</style>