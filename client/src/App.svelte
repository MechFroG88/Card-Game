<script>
  import { Router, Route } from "svelte-routing";
  
  import Home from "./pages/Home.svelte";
  import Room from "./pages/Room.svelte";

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