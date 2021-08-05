<script>
  import Fa from 'svelte-fa';
  import { faChessKing, faChessBishop, faChessKnight, faChessPawn, faChessRook } from '@fortawesome/free-solid-svg-icons';

  export let role;
</script>

{#if role == 'King'}
  <div class='king'><Fa icon={faChessKing}/></div>
{:else if role == 'Minister'}
  <div class='minister'><Fa icon={faChessBishop}/></div>
{:else if role == 'Rebel'}
  <div class='rebel'><Fa icon={faChessKnight}/></div>
{:else if role == 'Traitor'}
  <div class='traitor'><Fa icon={faChessRook}/></div>
{:else}
  <div class='unknown'><Fa icon={faChessPawn}/></div>
{/if}

<style lang='scss'>
  .king {
    color: #DA0037;
  }

  .minister {
    color: #F08A5D;
  }

  .rebel {
    color: #3F72AF;
  }

  .traitor {
    color : #B980F0;
  }
</style>