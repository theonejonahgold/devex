<script context="module">
  import { getApiURL } from '$lib/utils/fetch'

  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ fetch }) {
    const res = await fetch(getApiURL() + '/discover')
    const json = await res.json()
    return {
      props: {
        streamers: json.data.users,
      },
    }
  }
</script>

<script lang="ts">
  import ZeroStateText from '$lib/components/atoms/ZeroStateText.svelte'
  import DiscoverStream from '$lib/components/molecules/DiscoverStream.svelte'
  import { userProfile } from '$lib/stores/user'

  export let streamers: Streamer[] = []
</script>

<style>
  div {
    display: grid;
    grid-template-rows: min-content 1fr;
    overflow: hidden;
    padding: var(--base-space);
    height: 100%;
    position: relative;
  }

  h2 {
    margin-bottom: var(--base-space);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden scroll;
    width: 100%;
    max-height: 100%;
  }

  li {
    flex: 0 1 30rem;
    margin-right: var(--base-space);
    margin-bottom: var(--base-space);
  }
</style>

<svelte:head>
  <title>Discover - DevEx</title>
  <meta name="description" content="Discover popular live channels" />
</svelte:head>

<div>
  <h2>Discover</h2>
  {#if streamers.length}
    <ul>
      {#each streamers as streamer}
        <li>
          <DiscoverStream {streamer} />
        </li>
      {/each}
    </ul>
  {:else}
    <ZeroStateText>
      Seems like nobody is live right now, how about you start your stream?
      (Hint: you start at the top right)
    </ZeroStateText>
  {/if}
</div>
