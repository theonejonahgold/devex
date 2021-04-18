<script>
  import { scale } from 'svelte/transition'
  import { scaleTransitionConfig } from '$lib/constants/transition'
  import { page } from '$app/stores'

  export let live: boolean
  export let username: string

  $: active = $page.path.slice(1) === username
</script>

<style>
  p {
    position: relative;
    grid-row: 1 / span 3;
    grid-column: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: var(--step-1);
    border-radius: 50%;
    width: calc(var(--quadruple-space) - var(--base-space));
    height: calc(var(--quadruple-space) - var(--base-space));
    font-weight: bold;
    margin: 0;
    z-index: 1;
    background-color: var(--secondary);
  }

  p:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--secondary);
    transform: scale(0, 0);
    transform-origin: center center;
    z-index: -1;
    border-radius: 50%;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .live:after {
    transform: scale(1, 1);
    background-color: var(--red);
  }

  .active:after {
    transform: scale(1, 1);
    background-color: var(--green);
  }
</style>

<p
  transition:scale|local={scaleTransitionConfig}
  class:live
  class:active
  aria-label={username}
>
  {username[0].toUpperCase()}
</p>
