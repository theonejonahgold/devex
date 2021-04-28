<script>
  import { blurTransitionConfig } from '$lib/constants/transition'
  import { blur } from 'svelte/transition'

  export let transition = false
</script>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    place-content: center;
    padding: var(--base-space);
    pointer-events: none;
  }

  p {
    pointer-events: auto;
    text-align: center;
  }
</style>

{#if transition}
  <div in:blur|local={blurTransitionConfig}><p><slot /></p></div>
{:else}
  <div><p><slot /></p></div>
{/if}
