<script>
  import { navigate } from "svelte-routing";

  async function createRoom () {
		const res = await fetch('http://localhost:3000/room', {
			method: 'POST',
		})

    const json = await res.json();
    navigate(`/room/${json.roomId}`);
	}

  let roomId = "";
  let error = "";

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

<div class='card'>
  <h1>
    The Revolution
  </h1>
  <div>
    <button on:click={createRoom} class='btn btn-default'>Create Room</button>
  </div>
  <div>
    <input bind:value={roomId}>
    <button on:click={joinRoom} class='btn btn-default'>Join Room</button>
  </div>
  {error}
</div>