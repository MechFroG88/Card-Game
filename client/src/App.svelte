<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Messages from "./pages/messages.svelte";
  import Graphics from "./pages/graphics.svelte";
</script>

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
</Router>
