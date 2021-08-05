<script>
  import Sleep from '../svg/sleep.svg';
  import Attack from '../svg/attack.svg';
  import Defence from '../svg/defence.svg';
  import Pray from '../svg/pray.svg';
  import Torture from '../svg/torture.svg';
  import BlackDeath from '../svg/blackdeath.svg';

  export let title;
  
</script>

{#if title == 'Sleep'}
  <Sleep width=100 height=100/>
{:else if title == 'Attack'}
  <Attack width=100 height=100/>
{:else if title == 'Defence'}
  <Defence width=100 height=100/>
{:else if title == 'Pray'}
  <Pray width=100 height=100/>
{:else if title == 'Torture'}
  <Torture width=100 height=100/>
{:else if title == 'Black Death'}
  <BlackDeath width=100 height=100/>
{/if}
