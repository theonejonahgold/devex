<script>
  import Play from '$lib/svg/play.svelte'
</script>

<style>
  button {
    width: 4rem;
    height: 4rem;
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

<button on:click><Play /></button>
