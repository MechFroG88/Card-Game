<script>
  export let self;
  export let timer;
</script>


<div class='timer'>
  {#if self.ready}
    {#if timer > 0}
      Starting in {timer}
    {:else}
      Waiting for players...
    {/if}
  {:else}
    Are you ready?
  {/if}
</div>

<style lang='scss'>
  .timer {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    column-gap: 8px;
    font-size: 32px;
    margin-top: 1em;
  }
</style>