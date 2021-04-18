<script>
  import { cubicInOut } from 'svelte/easing'
  import { fade } from 'svelte/transition'
</script>

<style>
  div {
    grid-row: 1;
    grid-column: 1;
    background: rgba(0, 0, 0, 0.25);
    display: grid;
    place-items: center;
    place-content: center;
    z-index: 1;
  }
</style>

<div
  transition:fade|local={{
    duration: 200,
    easing: cubicInOut,
  }}
>
  <slot />
</div>
