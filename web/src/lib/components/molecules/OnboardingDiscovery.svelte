<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    previous: undefined
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
    margin-right: 0.5rem;
  }

  button:last-child {
    margin-left: 0.5rem;
  }
  
  video {
    width: 100%;
    border-radius: 12px;
    margin-bottom: var(--base-space);
  }
</style>

<p>
  You can find the most popular channels on the discovery page, regardless of
  the programming language they write in. So you can hop in the best content we
  have to offer.
</p>
<!-- svelte-ignore a11y-media-has-caption -->
<video autoplay muted loop src="/discovery.mp4" />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('next')}>
    Next
  </button>
</div>
