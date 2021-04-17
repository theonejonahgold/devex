<script lang="ts">
  import { fullscreen } from '$lib/stores/stream'
  import Fullscreen from '$lib/svg/fullscreen.svelte'
  import { toggleBoolStore } from '$lib/utils/stores'
</script>

<style>
  button {
    appearance: none;
    width: var(--step-0);
    padding: 0;
    background: none;
    border: none;
    margin-left: var(--half-space);
    border-radius: 0;
  }

  button:nth-child(3):last-child {
    margin-left: auto;
  }

  button:hover :global(svg *) {
    fill: var(--green);
  }
</style>

<button on:click={toggleBoolStore(fullscreen)}>
  <Fullscreen />
</button>
