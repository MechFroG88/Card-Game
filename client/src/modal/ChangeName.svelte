<script>
  import Cookies from 'js-cookie';
  import { XIcon } from 'svelte-feather-icons'
  
  export let visible;
  export let callback;

  let name = Cookies.get("name");

  export const close = () => {
    visible = false
    console.log('hi')
  }

  export const show = () => {
    visible = true
  }

  const changeName = () => {
    Cookies.set("name", name);
    close();
    if (callback !== undefined) {
        callback();
    }
  };
</script>

<div class='modal' id='changeName' style='display:{visible === true ? "block" : "none"}'>
  <div class='container'>
    <div class='close' on:click={close}><XIcon size='24'/></div>
    <div class='content'>
      <div class='title'>
        Input your name
      </div>
      <div class='row'>
        <input bind:value={name}>
        <button on:click={changeName}>Confirm</button>
      </div>
    </div>
  </div>
  
</div>