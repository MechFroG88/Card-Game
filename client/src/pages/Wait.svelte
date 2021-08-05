<script>
  import { Event } from '../../../types/dist/Event';
  import { navigate } from "svelte-routing";
  import { SettingsIcon, PlusIcon, MinusIcon, UsersIcon, LogOutIcon, AwardIcon, CheckIcon, XIcon } from 'svelte-feather-icons'
  import Timer from '../component/Timer.svelte';

  export let room;
  export let socket;
  export let self;
  export let timer;

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

</script>
  
<div class='navbar'>
  <div class='title'>
    The Revolution
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

<style lang='scss'>

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
          min-width: 100px;
          display:flex;
          align-items: center;
          justify-content: center;
          padding: 1em;
          margin: .5em;
          border-radius: 10em;
          border-style: solid;
        }
        .ready {
          fill: #16C79A;
          color: #16C79A;
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
</style>