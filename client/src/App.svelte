<script>
  import { Router, Route, Link } from "svelte-routing";
  import Cookies from 'js-cookie';
  
  import Home from "./pages/Home.svelte";
  import Room from "./pages/Room.svelte";
  import ChangeName from "./modal/ChangeName.svelte";
//   import Messages from "./pages/messages.svelte";
//   import Graphics from "./pages/graphics.svelte";

  export let url = "";

  let name = Cookies.get("name");

  const rename = () => {
    name = Cookies.get("name");
  }

</script>

{#if name === undefined}
  <ChangeName visible = {true} callback={rename}/>
{:else}
  <Router url="{url}">
    <div>
      <Route path="room/:id" let:params>
        <Room roomId = {params.id}/>
      </Route> 
      <Route path="/" >
        <Home/>
      </Route>
    </div>
  </Router>
{/if}


<!-- 
<Router>
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="msg">Messages</Link>
    </nav>
  </header>

  <main>
    <Route path="/">
      <Graphics />
    </Route>

    <Route path="msg">
      <Messages />
    </Route>
  </main>
</Router> -->

