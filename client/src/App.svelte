<script>
  import { Router, Route, Link } from "svelte-routing";
  
  import Home from "./pages/Home.svelte";
  import Room from "./pages/Room.svelte";
  import Messages from "./pages/messages.svelte";
  import Graphics from "./pages/graphics.svelte";

  export let url = "";
  
</script>

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

