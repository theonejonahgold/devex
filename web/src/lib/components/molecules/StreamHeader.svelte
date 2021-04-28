<script>
  import { showOverlay } from '$lib/stores/stream'
  import { userProfile } from '$lib/stores/user'
  import FollowButton from '../atoms/FollowButton.svelte'
  import LiveIcon from '../atoms/LiveIcon.svelte'

  export let streamer: Streamer
</script>

<style>
  header {
    padding: var(--base-space) var(--base-space) var(--double-space);
    z-index: 2;
    grid-row: 1;
    grid-column: 1;
    align-self: start;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    transition: opacity 0.2s ease, transform 0.2s ease;
    display: grid;
    grid-template-columns: 75% 25%;
  }

  header.hidden {
    transform: translateY(-10%);
    opacity: 0;
  }

  header div div {
    display: flex;
    margin: var(--quarter-space) 0;
  }

  button {
    margin-left: var(--half-space);
  }

  header h2 {
    font-size: var(--step-3);
  }

  header h3 {
    font-size: var(--step-1);
    font-weight: bold;
  }

  header p {
    margin: var(--quarter-space) 0;
  }

  header div:nth-of-type(2) p {
    text-align: right;
  }
</style>

<header class:hidden={!$showOverlay}>
  <div>
    <h2>{streamer.streamTitle}</h2>
    <div>
      <p class="h3">{streamer.username}</p>
      {#if $userProfile && $userProfile.username !== streamer.username}
        <FollowButton username={streamer.username} />
      {/if}
    </div>
    {#if streamer.live}
      {#if streamer.language}
        <p>Coding in {streamer.language}</p>
      {:else}
        <p>Coding in some language</p>
      {/if}
    {/if}
  </div>
  <div>
    <LiveIcon bind:live={streamer.live} />
    {#if streamer.live}
      <p>
        {streamer.viewers === 1 ? '1 viewer' : `${streamer.viewers} viewers`}
      </p>
    {/if}
  </div>
</header>
