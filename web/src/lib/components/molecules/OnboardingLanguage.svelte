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
  Speaking of programming languages, you can watch people code in your langauge
  of choice! Just go to the "Languages" tab, select your favourite language, and
  off you go!
</p>
<!-- svelte-ignore a11y-media-has-caption -->
<video autoplay muted loop src="/language.mp4" />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('next')}>
    Next
  </button>
</div>
