<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    next: undefined
  }>()
</script>

<style>
  p {
    color: var(--tertiary);
  }
</style>

<p>
  Welcome to DevEx. <em>The</em> streaming platform for sharing your developer experience
  with others.
</p>
<p>
  Let's walk through some of the core features of the app to get your started.
</p>
<button class="large full-width" on:click={() => dispatch('next')}>
  Let's go!
</button>
