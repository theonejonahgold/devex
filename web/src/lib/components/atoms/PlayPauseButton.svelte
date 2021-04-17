<script lang="ts">
  import { paused } from '$lib/stores/stream'
  import Stop from '$lib/svg/stop.svelte'
  import Play from '$lib/svg/play.svelte'
  import { toggleBoolStore } from '$lib/utils/stores'
</script>

<style>
  button {
    width: var(--step-1);
    height: var(--step-0);
    margin-right: var(--half-space);
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  button:hover :global(*) {
    fill: var(--green);
  }
</style>

<button on:click={toggleBoolStore(paused)}>
  {#if $paused}
    <Play />
  {:else}
    <Stop />
  {/if}
</button>
