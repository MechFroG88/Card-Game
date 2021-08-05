<script>
  import { io } from 'socket.io-client';
  import { Event } from '../../../types/dist/Event';
  import { State } from '../../../types/dist/State';
  import Wait from './Wait.svelte';
  import Game from './Game.svelte';
  import Cookies from 'js-cookie';
  
  export let roomId;

  let room;
  let self;
  let timer;
  let interval;

  let name = Cookies.get("name");
  let userId = Cookies.get("userId");
  let error = '';

  const socket = io("ws://localhost:5252", {
    query: {
      "roomId" : roomId,
      "userId" : userId,
      "name" : name
    }
  });

  socket.on(Event.connection, data => {
    self = data;
    console.log(self);
    Cookies.set("name", data.name);
    Cookies.set("userId", data.id);
  });

  socket.on(Event.getRoom, data => {
    room = data.room;
    self = data.self;
    console.log(room);
  })

  socket.on(Event.countdownStart, () => {
    timer = 3;
    interval = setInterval(() => {
      timer -= 1;
    }, 1000);
  })

  socket.on(Event.countdownStop, () => {
    timer = -1;
    clearInterval(interval);
  })

  socket.on(Event.error, data => {
    error = data;
  })

</script>

{#if error === ''}
  {#if room !== undefined}
    {#if room.state == State.wait}
      <Wait self={self} timer={timer} room={room} socket={socket}/>
    {:else}
      <Game self={self} timer={timer} room={room} socket={socket}/>
    {/if}
  {/if}
{:else}
  <div class='error'>
    {error}
  </div>
{/if}

<style lang='scss'>
  .error {
    font-size: 32px;
    margin-top: 3em;
    text-align: center;
  }
</style>