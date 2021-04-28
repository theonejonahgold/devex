<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    previous: undefined
    register: undefined
  }>()
</script>

<style>
  p,
  ul {
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
</style>

<p>By creating an account, you can:</p>

<ul>
  <li>Start showing off your skills in your own live stream!</li>
  <li>Participate in chat, and let your voice be heard.</li>
  <li>Follow your favourite content creators on the platform.</li>
  <li>And much more, coming soon™️!</li>
</ul>
<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('register')}>
    Register my account
  </button>
</div>
