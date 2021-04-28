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

<p>Everyone has their own little page like this. Yes, even you!</p>
<p>There is tons to do on every channel.</p>

<div>
  <button class="large full-width" on:click={() => dispatch('close')}>
    I want to explore on my own.
  </button>
  <button class="large full-width" on:click={() => dispatch('next')}>
    Show me!
  </button>
</div>
