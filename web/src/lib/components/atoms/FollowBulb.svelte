<script>
  export let live: boolean
  export let username: string
</script>

<style>
  p {
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
    background: radial-gradient(
        circle at center,
        var(--red) 0%,
        var(--red) 71%,
        transparent 71%
      )
      no-repeat center/100% 100%;
    background-color: var(--secondary);
    transition: background-size 0.2s ease;
  }

  .offline {
    background-size: 0 0;
  }
</style>

<p class:offline={!live} aria-label={username}>
  {username[0].toUpperCase()}
</p>
