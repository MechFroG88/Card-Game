<script lang="ts">
  import { io } from 'socket.io-client';

  const socket = io("localhost:3000");
  let msgs:Array<string> = [];
  let message:string = "";

  socket.on("connect", () => {
    console.log(`Connected with id: ${socket.id}`);
  });

  socket.on("disconnect", () => { });

  socket.on("chat message", (messages:Array<string>) => {
    msgs = messages;
  });

  function sendMessage() {
    socket.emit("chat message", message);
    message = "";
  }

</script>

<div class="body">
  <ul>
    {#each msgs as msg}
      <li>{msg}</li>
    {:else}
      <h2>Start the chat by sending some messages!</h2>
    {/each}
  </ul>
  <div class="input-area">
    <input type="text" bind:value={message}>
    <input type="button" value="Send" on:click={sendMessage}>
  </div>
</div>

<style lang="scss">
.body {
  ul {
    padding: 2rem;
    li {
      list-style: none;
      margin: .2rem 0;
      padding: .5rem;
      border: solid 1px rgba(0,0,0, .2);
      border-radius: .3rem;
    }
    h2 {
      text-align: center;
    }
  }
  .input-area {
    display: flex;
    justify-content: center;
    input {
      margin: 0 .5rem;
    }
  }
}
</style>
