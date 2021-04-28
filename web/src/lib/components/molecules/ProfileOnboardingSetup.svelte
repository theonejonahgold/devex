<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    previous: undefined
    close: undefined
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
  This part is quite important, becuase this is not your run-of-the-mill
  streaming service. You're in the big leagues now, baby!
</p>
<p>
  You need software like <a href="https://obsproject.org">OBS</a> to power your stream.
  You customise how your stream looks in there, and use the stream URL and the stream
  key to authenticate with DevEx.
</p>
<p>
  Confused? No problem, we always provide you with a handy getting started guide
  next to your stream URL and stream key. You cannot show your key to anyone you
  don't trust, otherwise they can overtake your stream.
</p>
<p>Happy streaming!</p>
<!-- svelte-ignore a11y-media-has-caption -->
<video src="/stream-setup.mp4" autoplay muted loop />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('close')}>
    Live in 5...4...3...2...
  </button>
</div>
