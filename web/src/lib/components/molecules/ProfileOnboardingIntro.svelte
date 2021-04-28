<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    close: undefined
    next: undefined
  }>()
</script>

<style>
  p {
    color: var(--tertiary);
  }

  div {
    display: flex;
  }

  button:first-child {
    margin-right: var(--half-space);
  }

  button:last-child {
    margin-left: var(--half-space);
  }
</style>

<p>This is your own personal space, which you can set up as you please.</p>

<div>
  <button class="large full-width" on:click={() => dispatch('close')}>
    Let me find out how to that myself.
  </button>
  <button class="large full-width" on:click={() => dispatch('next')}>
    Show me around.
  </button>
</div>
