<script lang="ts">
  import Arrow from '$lib/svg/arrow.svelte'

  export let collapsed: boolean
  export let invert: boolean
  $: rotateArrow = invert ? collapsed : !collapsed
</script>

<style>
  button {
    width: max-content;
    height: var(--step-1);
    padding: calc(var(--quarter-space) / 2);
    background: none;
    border: none;
  }

  button:hover :global(svg path),
  button:focus :global(svg path) {
    fill: var(--green);
  }
</style>

<button on:click={() => (collapsed = !collapsed)}>
  <Arrow bind:rotate={rotateArrow} />
</button>
