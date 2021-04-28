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

<p>With an account you can of couse also follow your favourite channels!</p>
<p>
  When you follow someone. That channel is put into the "Following" tray. Which
  is accessible on every page! This way you can switch channels easily, and stay
  up to date as to if someone has just gone live.
</p>
<!-- svelte-ignore a11y-media-has-caption -->
<video src="/follow.mp4" autoplay muted loop />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('close')}>
    Now it's my turn!
  </button>
</div>
