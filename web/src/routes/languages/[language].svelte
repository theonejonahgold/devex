<script context="module">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ page, fetch }) {
    const url = `${getApiURL()}/languages/${page.params.language}`
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) return { status: res.status, error: data.error }
    return {
      props: {
        streamers: data.data.streamers,
        language: data.data.language,
      },
    }
  }
</script>

<script lang="ts">
  import DiscoverStream from '$lib/components/molecules/DiscoverStream.svelte'
  import { getApiURL } from '$lib/utils/fetch'
  import ZeroStateText from '$lib/components/atoms/ZeroStateText.svelte'

  export let streamers: Streamer[] = []
  export let language: Language
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
  <title>{language.name} - DevEx</title>
  <meta name="description" content="Discover popular live channels" />
</svelte:head>

<div>
  <h2>{language.name}</h2>
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
      The streamer you're looking for codes in a different programming language. <a
        href="/languages"
      >
        Return to the overview
      </a>
    </ZeroStateText>
  {/if}
</div>
