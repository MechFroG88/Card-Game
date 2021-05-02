<script lang="ts">
  import { io } from 'socket.io-client';

  const socket = io("localhost:3000");
  type Message = {
    text:string;
    id:string;
  };
  let msgs:Array<Message> = [];
  let message:string = "";

  socket.on("connect", () => {
    console.log(`Connected with id: ${socket.id}`);
  });

  socket.on("disconnect", () => { });

  socket.on("chat message", (messages:Array<Message>) => {
    msgs = messages;
  });

  function sendMessage() {
    socket.emit("chat message", message);
    msgs.push({ text: message, id: socket.id });
    msgs = [...msgs];
    message = "";
  }
</script>

<div class="body">
  <ul>
    {#each msgs as msg}
      <li class={msg.id === socket.id ? "sent" : "received"}>{msg.text}</li>
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
      &.sent {
        text-align: right;
        background-color: rgba(0,0,0, .7);
        color: white;
      }
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
