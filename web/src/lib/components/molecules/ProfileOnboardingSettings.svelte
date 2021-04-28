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

<p>With your stream settings you can personalise your stream to your heart's content; by setting the title, and the programming language you're coding in!</p>
<!-- svelte-ignore a11y-media-has-caption -->
<video src="/stream-settings.mp4" autoplay muted loop />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('next')}>
    Next
  </button>
</div>
