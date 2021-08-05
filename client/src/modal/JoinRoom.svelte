<script>
  import { XIcon } from 'svelte-feather-icons'
  export let visible = false;

  let roomId = "";
  let error = "";

  export const close = () => {
    visible = false;
  }

  export const show = () => {
    visible = true;
  }

  if (roomId !== ""){
      joinRoom();
  }

  async function joinRoom() {
    const res = await fetch(`http://localhost:3000/room/${roomId || "none"}`, {
			method: 'GET',
		})
    if (res.status == 200) {
      navigate(`/room/${roomId}`);
    } else {
      error = await res.text();
    }
  }
</script>
  
<div class='modal' id='joinRoom' style='display:{visible === true ? "block" : "none"}'>
  <div class='container'>
    <div class='close' on:click={close}><XIcon size='24'/></div>
    <div class='content'>
      <div class='title'>
        Room code
      </div>
      <div class='row '>
        <input bind:value={roomId}>
        <button on:click={joinRoom}>Join</button>
      </div>
      <div class='error'>
        {error}
      </div>
    </div>
  </div>
</div>