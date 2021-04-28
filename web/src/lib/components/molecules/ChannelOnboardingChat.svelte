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
  This wouldn't be a streaming site without the possiblity to talk to the
  streamer.
</p>
<p>
  When you have an account, you can participate in the conversations going on
  inside the channel.
</p>
<!-- svelte-ignore a11y-media-has-caption -->
<video src="/chat.mp4" autoplay muted loop />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('next')}>
    Next
  </button>
</div>
