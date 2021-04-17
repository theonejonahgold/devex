<script lang="ts">
  export let live: boolean
</script>

<style>
  p {
    padding: 0.25em;
    line-height: 1em;
    display: block;
    width: max-content;
    margin: 0;
    border-radius: 5px;
    background: var(--red);
    margin-left: auto;
    margin-bottom: var(--quarter-space);
    font-weight: 500;
  }

  .offline {
    background: var(--secondary);
    font-weight: normal;
    color: var(--tertiary);
  }
</style>

<p class:offline={!live}>{live ? 'Live' : 'Offline'}</p>
