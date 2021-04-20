<script>
  import FollowBulb from '../atoms/FollowBulb.svelte'

  export let streamer: Streamer
  export let collapsed: boolean
</script>

<style>
  article {
    margin: var(--base-space) 0;
    display: grid;
    grid-template-columns: min-content 1fr max-content;
    grid-template-rows: repeat(3, min-content);
    grid-column-gap: var(--half-space);
    grid-row-gap: calc(var(--quarter-space) / 2);
  }

  a {
    text-decoration: none;
  }

  a:hover,
  a:focus {
    color: var(--primary);
  }

  a:hover :global(p:first-child) {
    border: 2px solid var(--green);
  }

  h1,
  p {
    margin: 0;
    grid-column: 2;
  }

  h1 {
    font-size: var(--step-1);
  }

  p {
    font-size: var(--step--1);
  }
  p:last-of-type {
    grid-column: 3;
    grid-row: 1;
  }
</style>

<a href="/{streamer.username}">
  <article>
    <FollowBulb username={streamer.username} bind:live={streamer.live} />
    {#if !collapsed}
      <h1 class="h2">
        {streamer.username}
      </h1>
      {#if streamer.live}
        {#if streamer.language}
          <p>Coding in {streamer.language}</p>
        {:else}
          <p>Coding in ???</p>
        {/if}
        <p>
          {streamer.viewers === 1
            ? '1 viewer'
            : `${
                streamer.viewers > 1000
                  ? (streamer.viewers / 1000).toFixed(1) + 'k'
                  : streamer.viewers
              } viewers`}
        </p>
      {:else}
        <p>Offline</p>
      {/if}
    {/if}
  </article>
</a>
