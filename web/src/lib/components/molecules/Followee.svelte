<script>
  import { cubicInOut } from 'svelte/easing'
  import { blur } from 'svelte/transition'
  import FollowBulb from '../atoms/FollowBulb.svelte'

  export let streamer: Streamer
  export let collapsed: boolean
</script>

<style>
  article {
    margin: var(--base-space) 0;
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: repeat(3, auto);
    grid-column-gap: var(--half-space);
  }

  a {
    text-decoration: none;
  }

  a:hover :global(p:first-child) {
    border: 5px solid var(--green);
  }

  h1,
  p {
    margin: 0;
    grid-column: 2;
  }

  h1 {
    font-size: var(--step-0);
  }
  p {
    font-size: var(--step--1);
  }
</style>

<a href="/{streamer.username}">
  <article>
    <FollowBulb username={streamer.username} bind:live={streamer.live} />
    {#if !collapsed}
      <h1 class="h3">
        {streamer.streamTitle}
      </h1>
      <p>
        {streamer.username}
      </p>
      <p>
        {streamer.viewers === 1 ? '1 viewer' : `${streamer.viewers} viewers`}
      </p>
    {/if}
  </article>
</a>
