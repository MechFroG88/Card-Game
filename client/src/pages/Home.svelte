<script>
  import { navigate } from "svelte-routing";
  import Cookies from 'js-cookie';
  import Logo from '../svg/castle.svg';
  import ChangeName from '../modal/ChangeName.svelte';
  import JoinRoom from '../modal/JoinRoom.svelte';

  let changeNameModal;
  let joinRoomModal;

  let url = process.env.isProd ? 'http://ws.the-revolution.tk' : 'http://localhost:3000';

  async function createRoom () {
		const res = await fetch(url + '/room', {
			method: 'POST',
		})

    const json = await res.json();
    navigate(`/room/${json.roomId}`);
	}

  let name = Cookies.get("name");

  const rename = () => {
    name = Cookies.get("name");
  }

</script>

<div class='navbar'>
  <div class='title'>
    <Logo width=32/> The Revolution
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

<ChangeName visible={false} callback={rename} bind:this={changeNameModal}/>
<JoinRoom visible={false} bind:this={joinRoomModal}/>