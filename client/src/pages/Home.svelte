<script>
  import { navigate } from "svelte-routing";
  import Cookies from 'js-cookie';
  import ChangeName from '../modal/ChangeName.svelte';
  import JoinRoom from '../modal/JoinRoom.svelte';

  let changeNameModal;
  let joinRoomModal;

  async function createRoom () {
		const res = await fetch('http://localhost:3000/room', {
			method: 'POST',
		})

    const json = await res.json();
    navigate(`/room/${json.roomId}`);
	}

  let name = Cookies.get("name");

</script>

<div class='navbar'>
  <div class='title'>
    The Revolution
  </div>
</div>

<div class='card'>
  <div class='title'>
    Welcome {name}!
  </div>
  <div class='row'>
    <button on:click={createRoom} class='btn btn-default'>New Game</button>
    <button on:click={() => joinRoomModal.show()} class='btn btn-default'>Join Game</button>
    <button on:click={() => changeNameModal.show()} class='btn btn-default'>Change name</button>      
  </div>
</div>

<ChangeName visible={false} bind:this={changeNameModal}/>
<JoinRoom visible={false} bind:this={joinRoomModal}/>